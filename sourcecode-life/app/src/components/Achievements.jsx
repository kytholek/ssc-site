/**
 * Achievements components:
 *  - AchievementBanner  — toast popup for newly earned
 *  - MedalsRow          — compact icon strip for CharCard
 *  - AchievementsPage   — full grid with progress bars (used in StatsTab / LogTab)
 *  - FounderSection     — founder code redemption
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ACHIEVEMENTS, TIER_COLORS, medalSvg,
  loadAchievements, checkAndAwardAchievements,
  redeemFounderCode, isFounder,
  buildAchievementData,
} from '../lib/achievements'

// ── Medal SVG via dangerouslySetInnerHTML ─────────────────────────────────────
function MedalIcon({ shape, color, locked, size = 40 }) {
  const svg = medalSvg(shape || 'circle', color, locked)
  return (
    <span
      className="ach-medal-icon"
      dangerouslySetInnerHTML={{ __html: svg.replace('width="40" height="40"', `width="${size}" height="${size}"`) }}
    />
  )
}

// ── Toast banner when achievement is earned ───────────────────────────────────
export function AchievementBanner({ achievement, onDone }) {
  const color = TIER_COLORS[achievement.tier] || achievement.color
  useEffect(() => {
    const t = setTimeout(onDone, 4200)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="achievement-banner" style={{ '--ach-color': color }}>
      <div className="ach-banner-tier" style={{ color }}>{achievement.tier.toUpperCase()} ACHIEVEMENT</div>
      <MedalIcon shape={achievement.medal} color={color} size={40} />
      <div className="ach-banner-title" style={{ color }}>{achievement.title}</div>
      <div className="ach-banner-desc">{achievement.desc}</div>
    </div>
  )
}

// ── Banner queue — renders toasts at bottom of screen ─────────────────────────
export function AchievementBannerQueue({ queue, onDismiss }) {
  if (!queue.length) return null
  return (
    <div className="ach-banner-queue">
      {queue.slice(0, 1).map(a => (
        <AchievementBanner key={a.id} achievement={a} onDone={() => onDismiss(a.id)} />
      ))}
    </div>
  )
}

// ── Compact medals row for CharCard ───────────────────────────────────────────
export function MedalsRow() {
  const store  = loadAchievements()
  const founder = isFounder()
  const earned = ACHIEVEMENTS.filter(a => a.id !== 'founder' && !!store[a.id])

  return (
    <div className="char-medals-wrap">
      {founder && (
        <span className="ach-medal ach-medal--platinum founder-medal" title="FOUNDER — Early Investor">
          <MedalIcon shape="crown" color="#e8c96b" size={28} />
        </span>
      )}
      {earned.map(a => {
        const color = TIER_COLORS[a.tier] || a.color
        const earnedTs = store[a.id]?.earned
        const dateStr  = earnedTs ? new Date(earnedTs).toLocaleDateString() : ''
        return (
          <span
            key={a.id}
            className={`ach-medal ach-medal--${a.tier}`}
            style={{ '--medal-color': color }}
            title={`${a.title}\n${a.desc}${dateStr ? '\nEarned: ' + dateStr : ''}`}
          >
            <MedalIcon shape={a.medal} color={color} size={28} />
          </span>
        )
      })}
      {!founder && !earned.length && (
        <span className="ach-medals-empty">No medals yet</span>
      )}
    </div>
  )
}

// ── Progress bar component ────────────────────────────────────────────────────
function ProgBar({ val, max, color }) {
  const pct = max > 0 ? Math.round((val / max) * 100) : 0
  return (
    <div className="ach-card-prog-wrap">
      <div className="ach-card-prog-bar" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ── Single achievement card ───────────────────────────────────────────────────
function AchCard({ a, store, data }) {
  const isEarned = !!store[a.id]
  const color    = isEarned ? (TIER_COLORS[a.tier] || a.color) : 'rgba(255,255,255,0.18)'
  const earnedTs = isEarned ? store[a.id]?.earned : null
  const dateStr  = earnedTs ? new Date(earnedTs).toLocaleDateString() : null
  const prog     = (!isEarned && a.progress && data) ? a.progress(data) : null
  const tierLabel = { bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', platinum: 'PLATINUM' }

  return (
    <div className={`ach-card ach-card--${isEarned ? 'earned ' + a.tier : 'locked'}`}
         style={{ '--medal-color': color, borderColor: color + '33' }}>
      <div className="ach-card-medal">
        <MedalIcon shape={a.medal} color={isEarned ? (TIER_COLORS[a.tier] || a.color) : null} locked={!isEarned} size={40} />
      </div>
      <div className="ach-card-body">
        <div className="ach-card-tier" style={{ color }}>{tierLabel[a.tier]}</div>
        <div className="ach-card-title" style={{ color }}>{a.title}</div>
        <div className="ach-card-desc">{a.desc}</div>
        {dateStr && <div className="ach-card-date">Earned {dateStr}</div>}
        {prog && (
          <>
            <ProgBar val={prog.val} max={prog.max} color={a.color} />
            <div className="ach-card-prog-label">{prog.val} / {prog.max}</div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Founder code redemption ───────────────────────────────────────────────────
function FounderSection({ onRedeem }) {
  const [code, setCode]   = useState('')
  const [msg, setMsg]     = useState('')
  const [ok, setOk]       = useState(false)
  const founder           = isFounder()

  function handleRedeem() {
    const result = redeemFounderCode(code)
    setOk(result.ok)
    setMsg(result.message)
    if (result.ok) {
      window.NativeMap?.saveAchievements?.()
      onRedeem?.()
    }
  }

  if (founder) {
    return (
      <div className="ach-founder-section ach-founder-section--active">
        <MedalIcon shape="crown" color="#e8c96b" size={32} />
        <span className="ach-founder-active-label">FOUNDER STATUS ACTIVE</span>
      </div>
    )
  }

  return (
    <div className="ach-founder-section">
      <div className="ach-founder-label">FOUNDER CODE</div>
      <div className="ach-founder-row">
        <input
          className="ach-founder-input"
          type="text"
          placeholder="SCL-FOUNDER-..."
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRedeem()}
          autoCapitalize="characters"
        />
        <button className="ach-founder-btn" onClick={handleRedeem}>REDEEM</button>
      </div>
      {msg && <div className={`ach-founder-msg${ok ? ' ok' : ' err'}`}>{msg}</div>}
    </div>
  )
}

// ── Full achievements page ────────────────────────────────────────────────────
export function AchievementsPage({ playerData }) {
  const [store, setStore] = useState(() => loadAchievements())
  const data = buildAchievementData(playerData)

  const refreshed = useRef(false)
  const refresh = useCallback(() => {
    const newlyEarned = checkAndAwardAchievements(playerData)
    if (newlyEarned.length) window.NativeMap?.saveAchievements?.()
    setStore(loadAchievements())
  }, [playerData])

  useEffect(() => {
    // Run outside render cycle to avoid cascading setState
    const id = setTimeout(refresh, 0)
    refreshed.current = true
    return () => clearTimeout(id)
  }, [refresh])

  const earned = Object.keys(store).length
  const total  = ACHIEVEMENTS.length

  // Group
  const groupOrder = ['Founder','Daily Streak','Character Level','Frequency Level','Social','30-Day Challenges','Life Mastery','Focus Mastery','Multi-Day Mastery','Cycle Mastery','Augmentation','Daily Mastery','Grand Mastery']
  const groups     = {}
  ACHIEVEMENTS.forEach(a => {
    const g = a.group || 'Other'
    if (!groups[g]) groups[g] = []
    groups[g].push(a)
  })

  return (
    <div className="ach-page">
      {/* Header */}
      <div className="ach-page-header">
        <div className="ach-page-title">✦ ACHIEVEMENTS</div>
        <div className="ach-page-count" style={{ color: 'var(--color-rpg-teal, #2dd4bf)' }}>
          {earned} / {total} EARNED
        </div>
        <div className="ach-page-bar">
          <div className="ach-page-bar-fill" style={{ width: `${Math.round(earned / total * 100)}%` }} />
        </div>
      </div>

      <FounderSection onRedeem={refresh} />

      {/* Achievement groups */}
      {groupOrder.map(gName => {
        const items = groups[gName]
        if (!items) return null
        return (
          <div key={gName}>
            <div className="ach-group-label">{gName.toUpperCase()}</div>
            <div className="ach-card-grid">
              {items.map(a => (
                <AchCard key={a.id} a={a} store={store} data={data} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
