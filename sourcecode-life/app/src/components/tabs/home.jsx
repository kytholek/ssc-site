/**
 * HomeTab
 *
 * Shown when the STATS nav button is pressed.
 * Contains the CharCard (identity, polarity, XP bars, character card panel).
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useAppState, useAppDispatch } from '../../context/AppContext'
import { useGameState } from '../../state/GameContext'
import { useQuestEngine } from '../../hooks/useQuestEngine'
import { fmt } from '../../lib/numerology'
import { CALLING } from '../../lib/data'
import { loadAvatar, AURA_COLORS } from '../../lib/avatarParts'
import { fetchUserAvatar, fetchUserEquipment, fetchCreatorReputation, fetchTakerReputation } from '../auth/firestoreprofile'
import { getDisplayName, setDisplayName } from '../../lib/storage'
import { formatDisplayName } from '../../lib/formatters'
import { CharacterCardPanel } from '../equipment/equipment.jsx'
import { RPGCharacterCanvas } from '../charCreate/AvatarCreator.jsx'
import SeasonsSection from '../datachunks/Seasons'
import DailySection from '../datachunks/dailyquests'
import { useFloatingXP, useParticleBurst } from '../effects/FloatingXP'
import { useQuestRewardToast } from '../effects/QuestRewardToast'
import CharCardButton from '../ui/CharCardButton.jsx'
import PremiumBadge from '../ui/PremiumBadge'

const HEADGEAR_MAP = {
  'Crown':   1,
  'Hood':    2,
  'Hat':     3,
  'Halo':    4,
  'Horns':   5,
  'Mask':    6,
  'Glasses': 7,
  'Antenna': 8,
}

const XP_HINTS = {
  freq: 'Personal rhythm and resonance — grows as you complete daily-aligned quests.',
  social: 'Character presence and social progression — grows with ally-facing play.',
}

// ── Smooth vector avatar (matches AvatarCreator preview) ─────────────────────
function AvatarPreview({ config }) {
  const auraColor = AURA_COLORS[config.aura]?.color || 'transparent'
  const bg = auraColor !== 'transparent' ? auraColor : '#0a1520'
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px' }}>
      <RPGCharacterCanvas config={config} size={64} auraColor={auraColor} />
    </div>
  )
}

function DisplayNameModal({ open, draft, onDraftChange, onClose, onSave }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select?.()
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSave = () => {
    const t = draft.trim()
    if (!t) return
    onSave(t)
    onClose()
  }

  return createPortal(
    <div
      className="home-name-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="home-name-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-name-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="home-name-modal-title" className="home-name-modal-title">
          Display name
        </h2>
        <p className="home-name-modal-sub">
          Shown on your public character card. You can change it anytime.
        </p>
        <label htmlFor="home-name-input" className="home-name-modal-label">
          Name
        </label>
        <input
          id="home-name-input"
          ref={inputRef}
          type="text"
          className="home-name-modal-input"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          maxLength={48}
          autoComplete="nickname"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
          }}
        />
        <div className="home-name-modal-actions">
          <button type="button" className="home-name-modal-btn home-name-modal-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="home-name-modal-btn home-name-modal-btn--primary"
            onClick={handleSave}
            disabled={!draft.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── CharCard ──────────────────────────────────────────────────────────────────
function CharCard() {
  const { playerData, currentUser } = useAppState()
  const { user } = useGameState()
  const { xp, charBarPct, freqBarPct } = useQuestEngine()
  const [avatarConfig, setAvatarConfig] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(true)
  const [cardOpen, setCardOpen] = useState(false)
  const [nameEditOpen, setNameEditOpen] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [freqPulsing, setFreqPulsing] = useState(false)
  const [charPulsing, setCharPulsing] = useState(false)
  const [ownRep, setOwnRep] = useState(null)
  const [takerRep, setTakerRep] = useState(null)
  const prevFreqLevel = useRef(xp.freqLevel)
  const prevCharLevel = useRef(xp.charLevel)

  const openCharacterCard = useCallback(() => setCardOpen(true), [])

  /* Level-up pulse: visual feedback when XP tier increases */
  useEffect(() => {
    if (xp.freqLevel > prevFreqLevel.current) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot animation flag */
      setFreqPulsing(true)
      setTimeout(() => setFreqPulsing(false), 700)
      prevFreqLevel.current = xp.freqLevel
    }
  }, [xp.freqLevel])

  useEffect(() => {
    if (xp.charLevel > prevCharLevel.current) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot animation flag */
      setCharPulsing(true)
      setTimeout(() => setCharPulsing(false), 700)
      prevCharLevel.current = xp.charLevel
    }
  }, [xp.charLevel])

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- reset skeleton when user/profile changes */
    setAvatarLoading(true)

    const loadWithGear = (baseConfig) => {
      if (!currentUser?.uid) { setAvatarConfig(baseConfig || null); setAvatarLoading(false); return }
      fetchUserEquipment(currentUser.uid)
        .then((eq) => {
          const cfg = baseConfig || loadAvatar() || {}
          if (eq?.head && HEADGEAR_MAP[eq.head]) {
            cfg.headgear = HEADGEAR_MAP[eq.head]
          }
          setAvatarConfig(cfg)
        })
        .catch(() => setAvatarConfig(baseConfig || null))
        .finally(() => setAvatarLoading(false))
    }

    if (currentUser?.uid) {
      fetchUserAvatar(currentUser.uid)
        .then((firestoreAvatar) => loadWithGear(firestoreAvatar || loadAvatar()))
        .catch(() => loadWithGear(loadAvatar()))
    } else {
      loadWithGear(loadAvatar())
    }
  }, [currentUser, playerData])

  useEffect(() => {
    if (currentUser?.uid) {
      fetchCreatorReputation(currentUser.uid).then(setOwnRep)
      fetchTakerReputation(currentUser.uid).then(setTakerRep)
    }
  }, [currentUser?.uid])

  if (!playerData) {
    return (
      <div className="char-card char-card--loading">
        <div className="char-card-skeleton">
          <div className="char-card-skeleton-avatar" />
          <div className="char-card-skeleton-lines">
            <div className="char-card-skeleton-line char-card-skeleton-line--wide" />
            <div className="char-card-skeleton-line char-card-skeleton-line--narrow" />
          </div>
        </div>
        <div className="char-card-skeleton-bars">
          <div className="char-card-skeleton-bar" />
          <div className="char-card-skeleton-bar" />
        </div>
      </div>
    )
  }
  const { cl, name, m, d, y } = playerData

  const displayName = getDisplayName() || name || ''
  const displayNameUpper = formatDisplayName(displayName).toUpperCase()

  return (
    <div className="char-card char-card--entrance">
      <span className="char-card-corners" aria-hidden="true" />
      <div className="char-card-identity">
        <button
          type="button"
          className="char-card-portrait char-card-portrait--opens-card"
          onClick={openCharacterCard}
          aria-label="Open character card"
        >
          {avatarLoading ? (
            <span className="char-card-portrait-skeleton" aria-hidden="true" />
          ) : avatarConfig ? (
            <AvatarPreview config={avatarConfig} />
          ) : (
            <span className="char-card-portrait-placeholder" role="img" aria-label="No avatar set">
              +
            </span>
          )}
          {/* Shimmer overlay on hover */}
          <span className="char-card-portrait-shimmer" />
        </button>

        <div className="char-card-id-text">
          <div className="char-card-name-row">
            <div className="char-card-name-group">
              <button
                type="button"
                className="char-card-name char-card-name--editable"
                id="char-display-name"
                onClick={() => {
                  setNameDraft(displayName)
                  setNameEditOpen(true)
                }}
                aria-label="Edit display name"
                title="Tap to edit name"
              >
                {displayNameUpper || 'SET NAME'}
              </button>
              {user.isPremium && <PremiumBadge size="sm" />}
            </div>
            <span
              className="char-card-calling"
              title={CALLING[cl.root]?.essence || CALLING[cl.root]?.summary || 'Life calling'}
              aria-label={CALLING[cl.root]?.essence || CALLING[cl.root]?.summary || 'Life calling'}
            >
              <span className="char-card-calling-num">{fmt(cl.root, cl.compound)}</span>
            </span>
          </div>

          <div className="char-card-calling-archetype">
            <div className="char-card-calling-archetype-name">
              {(CALLING[cl.root]?.name || 'Unknown').toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="char-card-xp-bars">
        {/* FREQ bar - top */}
        <div className="quest-xp-row quest-xp-row--hover-glow">
          <div className="quest-xp-label-row-compact">
            <span className="quest-xp-track-name quest-xp-track-name--teal">SOCIAL</span>
            <span className="quest-xp-level quest-xp-level--teal">LV {xp.charLevel}</span>
          </div>
          <div className="quest-xp-track">
            <div
              className={`quest-xp-fill quest-xp-fill--freq quest-xp-fill--shimmer${freqPulsing ? ' quest-xp-fill--pulsing-freq' : ''}`}
              style={{ width: `${freqBarPct}%` }}
            />
          </div>
        </div>

        {/* SOCIAL bar - bottom */}
        <div className="quest-xp-row quest-xp-row--hover-glow">
          <div className="quest-xp-label-row-compact">
            <span className="quest-xp-track-name quest-xp-track-name--gold">FREQ</span>
            <span className="quest-xp-level quest-xp-level--gold">LV {xp.freqLevel}</span>
          </div>
          <div className="quest-xp-track">
            <div
              className={`quest-xp-fill quest-xp-fill--char quest-xp-fill--shimmer${charPulsing ? ' quest-xp-fill--pulsing-char' : ''}`}
              style={{ width: `${charBarPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="char-card-rep-section">
        {/* Creator side */}
        <div className={`char-card-rep${!ownRep || ownRep.ratingCount === 0 ? ' char-card-rep--empty' : ''}`}>
          <span className="char-card-rep-label">MAKER</span>
          {ownRep && ownRep.ratingCount > 0 ? (
            <>
              <span>⭐ {(ownRep.totalRating / ownRep.ratingCount).toFixed(1)}</span>
              <span className="char-card-rep-sep">·</span>
              <span>{Math.round(ownRep.completions / (ownRep.completions + ownRep.noShows) * 100)}%</span>
              <span className="char-card-rep-sep">·</span>
              <span>{ownRep.ratingCount} quests</span>
            </>
          ) : (
            <span className="char-card-rep-none">◈ No ratings yet</span>
          )}
        </div>
        {/* Taker side */}
        <div className={`char-card-rep${!takerRep || takerRep.ratingCount === 0 ? ' char-card-rep--empty' : ''}`}>
          <span className="char-card-rep-label">SEEKER</span>
          {takerRep && takerRep.ratingCount > 0 ? (
            <>
              <span>⭐ {(takerRep.totalRating / takerRep.ratingCount).toFixed(1)}</span>
              <span className="char-card-rep-sep">·</span>
              <span>{takerRep.ratingCount} rated</span>
            </>
          ) : (
            <span className="char-card-rep-none">◈ No ratings yet</span>
          )}
        </div>
      </div>

      <CharCardButton>VIEW LIFE BLUEPRINT</CharCardButton>

      <DisplayNameModal
        open={nameEditOpen}
        draft={nameDraft}
        onDraftChange={setNameDraft}
        onClose={() => setNameEditOpen(false)}
        onSave={(next) => setDisplayName(next)}
      />

      <CharacterCardPanel open={cardOpen} onClose={() => setCardOpen(false)} />
    </div>
  )
}

// ── HomeTab root ──────────────────────────────────────────────────────────────
export default function HomeTab() {
  const { playerData } = useAppState()
  const { daily, completeDailyQuest, xp } = useQuestEngine()

  return (
    <>
      {/* Visual feedback overlays */}
      <FloatingXPDisplay />
      <ParticleBurstDisplay />
      <QuestRewardToastDisplay />

      <div className="tab-panel-content">
        <CharCard />

        {playerData && daily && (
          <section className="home-today-section" aria-labelledby="home-today-heading">
            <div className="home-today-header">
              <h2 id="home-today-heading" className="home-today-heading">
                <span className="home-today-line" aria-hidden="true" />
                <span className="home-today-glyph" aria-hidden="true">✦</span>
                TODAY
                <span className="home-today-glyph" aria-hidden="true">✦</span>
                <span className="home-today-line" aria-hidden="true" />
              </h2>
              <div className="home-today-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>

<DailySection
              playerData={playerData}
              daily={daily}
              completeDailyQuest={completeDailyQuest}
              lpRoot={playerData.lp.root}
            />
          </section>
        )}

        {/* Seasons — Personal Month and Year cycles */}
        {playerData && (
          <SeasonsSection playerData={playerData} lpRoot={playerData.lp.root} />
        )}
      </div>
    </>
  )
}

function FloatingXPDisplay() {
  const el = useFloatingXP()
  return el
}

function ParticleBurstDisplay() {
  const el = useParticleBurst()
  return el
}

function QuestRewardToastDisplay() {
  const el = useQuestRewardToast()
  return el
}
