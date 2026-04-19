/**
 * Seasons — Personal Month and Year cycles with time-locked engagement
 *
 * - Month: 4 weekly check-ins (min 14 days spread) → 40 XP
 * - Year: 6 months completed → year journal → 120 XP
 */
import { useState, useEffect, useRef } from 'react'
// Note: createPortal was removed since YearJournalPanel is now extracted
import { calcPersonalYear, calcPersonalMonth, calcPinnacles, reduceToSimple } from '../../lib/numerology'
import { getCycleObjectives } from '../../lib/objectives'
import { CYCLE_MEANINGS, CYCLE_QUEST_COLORS } from '../../lib/data'
import { useQuestEngine } from '../../hooks/useQuestEngine'
import {
  getMonthSeasonState, addMonthCheckin, completeMonthSeason,
  getYearSeasonState, completeYearSeason,
} from '../../lib/seasonEngine'
import { showFloatingXP, showParticleBurst } from '../effects/FloatingXP'
import MonthCheckinPanel from './MonthCheckinPanel'
import YearJournalPanel from './YearJournalPanel'

// ═══════════════════════════════════════════════════════════════
//  MONTH SEASON CARD
// ═══════════════════════════════════════════════════════════════

function MonthSeasonCard({ playerData, lpRoot, m, d }) {
  const [monthState, setMonthState] = useState(null)
  const [checkinPanelOpen, setCheckinPanelOpen] = useState(false)
  const nodeRef = useRef(null)
  const { xp } = useQuestEngine()
  const freqLevel = xp?.freqLevel ?? 1

  const pm = calcPersonalMonth(m, d)
  const meaning = CYCLE_MEANINGS.personalMonth?.[pm.root] || {}
  const cfg = CYCLE_QUEST_COLORS.personalMonth || {}
  const colorVar = `var(${cfg.color})`

  // Load month state
  useEffect(() => {
    const state = getMonthSeasonState(lpRoot, m, d, freqLevel)
    setMonthState(state)
  }, [lpRoot, m, d, freqLevel])

  if (!monthState) return null

  const daysActive = monthState.startDate
    ? Math.floor((new Date() - new Date(monthState.startDate)) / 86400000)
    : 0
  const canComplete = monthState.checkins.length >= 4 && daysActive >= 14

  const handleCheckinSubmit = (journal, objectiveIdx) => {
    const result = addMonthCheckin(lpRoot, m, d, journal, objectiveIdx)
    if (result.ok) {
      setCheckinPanelOpen(false)
      const newState = getMonthSeasonState(lpRoot, m, d)
      setMonthState(newState)
      return { ok: true }
    }
    return result
  }

  const handleMonthComplete = () => {
    const rect = nodeRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

    const result = completeMonthSeason(lpRoot, m, d)
    if (result.ok) {
      try {
        showFloatingXP({ xp: 40, color: colorVar, x, y })
        showParticleBurst({ color: colorVar, x, y, count: 20 })
      } catch (e) {
        console.warn('Visual feedback error:', e)
      }
      const newState = getMonthSeasonState(lpRoot, m, d)
      setMonthState(newState)
    }
  }

  return (
    <>
      <div className="seasons-card seasons-card--month" ref={nodeRef} style={{ '--season-color': colorVar }}>
        <div className="seasons-card-header">
          <div className="seasons-card-icon" style={{ color: colorVar }}>◇</div>
          <div className="seasons-card-title">
            <div className="seasons-card-num">{pm.root}</div>
            <div className="seasons-card-type-label">MONTH</div>
            <span className="seasons-card-theme">{meaning.theme || 'Personal Month'}</span>
          </div>
        </div>

        <div className="seasons-card-body">
          {monthState.lockedObj && (
            <div className="seasons-locked-obj">
              <div className="seasons-locked-obj-tier">
                {['APPRENTICE', 'ADEPT', 'MASTER'][monthState.lockedObj.tierAtLock - 1] || 'APPRENTICE'} MISSION
              </div>
              <div className="seasons-locked-obj-text">{monthState.lockedObj.text}</div>
            </div>
          )}

          <div className="seasons-checkins">
            <div className="seasons-checkins-label">Check-ins</div>
            <div className="seasons-checkins-pips">
              {[0, 1, 2, 3].map(i => (
                <button
                  key={i}
                  type="button"
                  className={`seasons-pip${monthState.checkins[i] ? ' seasons-pip--done' : ''}`}
                  onClick={() => setCheckinPanelOpen(true)}
                  disabled={monthState.completed}
                  aria-label={`Check-in ${i + 1}${monthState.checkins[i] ? ' complete' : ''}`}
                />
              ))}
            </div>
            <div className="seasons-checkins-count">
              {monthState.checkins.length}/4 · {daysActive} days active
            </div>
          </div>

          {!canComplete && monthState.checkins.length >= 4 && daysActive < 14 && (
            <div className="seasons-unlock-banner">
              ⏱ Minimum 14 days required · {14 - daysActive} more days
            </div>
          )}

          {canComplete && !monthState.completed && (
            <button
              className="seasons-complete-btn"
              onClick={handleMonthComplete}
              style={{ '--season-color': colorVar }}
            >
              ▶ COMPLETE MONTH
            </button>
          )}

          {monthState.completed && (
            <div className="seasons-completed-badge">✦ MONTH COMPLETE</div>
          )}
        </div>
      </div>

      <MonthCheckinPanel
        open={checkinPanelOpen}
        monthTheme={meaning.theme}
        objectives={monthState.objectives}
        onClose={() => setCheckinPanelOpen(false)}
        onSubmit={handleCheckinSubmit}
        lpRoot={lpRoot}
        m={m}
        d={d}
      />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
//  YEAR SEASON CARD
// ═══════════════════════════════════════════════════════════════

function YearSeasonCard({ playerData, lpRoot, m, d }) {
  const [yearState, setYearState] = useState(null)
  const [yearJournalOpen, setYearJournalOpen] = useState(false)
  const nodeRef = useRef(null)

  const py = calcPersonalYear(m, d)
  const meaning = CYCLE_MEANINGS.personalYear?.[py.root] || {}
  const cfg = CYCLE_QUEST_COLORS.personalYear || {}
  const colorVar = `var(${cfg.color})`

  // Load year state
  useEffect(() => {
    const state = getYearSeasonState(lpRoot, m, d)
    setYearState(state)
  }, [lpRoot, m, d])

  if (!yearState) return null

  const canUnlockJournal = yearState.monthsCompleted.length >= 6
  const isComplete = yearState.journalDone

  const handleYearComplete = (journal) => {
    const result = completeYearSeason(lpRoot, m, d, journal)
    if (result.ok) {
      const rect = nodeRef.current?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

      try {
        showFloatingXP({ xp: 120, color: colorVar, x, y })
        showParticleBurst({ color: colorVar, x, y, count: 32 })
      } catch (e) {
        console.warn('Visual feedback error:', e)
      }

      setYearJournalOpen(false)
      const newState = getYearSeasonState(lpRoot, m, d)
      setYearState(newState)
    }
    return result
  }

  return (
    <>
      <div className="seasons-card seasons-card--year" ref={nodeRef} style={{ '--season-color': colorVar }}>
        <div className="seasons-card-header">
          <div className="seasons-card-icon" style={{ color: colorVar }}>◎</div>
          <div className="seasons-card-title">
            <div className="seasons-card-num">{py.root}</div>
            <div className="seasons-card-type-label">YEAR</div>
            <span className="seasons-card-theme">{meaning.theme || 'Personal Year'}</span>
          </div>
        </div>

        <div className="seasons-card-body">
          <div className="seasons-progress-label">
            {yearState.monthsCompleted.length} / 12 seasons completed
          </div>

          <div className="seasons-progress-bar">
            <div
              className="seasons-progress-fill"
              style={{ width: `${(yearState.monthsCompleted.length / 12) * 100}%` }}
            />
          </div>

          {!canUnlockJournal && (
            <div className="seasons-unlock-banner">
              ◉ Complete 6 seasons to unlock year journal · {6 - yearState.monthsCompleted.length} remaining
            </div>
          )}

          {canUnlockJournal && !isComplete && (
            <button
              className="seasons-year-journal-btn"
              onClick={() => setYearJournalOpen(true)}
              style={{ '--season-color': colorVar }}
            >
              ▶ WRITE YEAR JOURNAL
            </button>
          )}

          {isComplete && (
            <div className="seasons-completed-badge seasons-completed-badge--year">
              ✦ YEAR COMPLETE
            </div>
          )}
        </div>
      </div>

      <YearJournalPanel
        open={yearJournalOpen}
        yearTheme={meaning.theme}
        monthsCompleted={yearState.monthsCompleted}
        onClose={() => setYearJournalOpen(false)}
        onSubmit={handleYearComplete}
      />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
//  SEASONS SECTION — Main export
// ═══════════════════════════════════════════════════════════════

export default function SeasonsSection({ playerData, lpRoot }) {
  if (!playerData) return null
  const { m, d, y, lp } = playerData

  const pinnacles = calcPinnacles(m, d, y, lp)
  const now = new Date()
  let age = now.getFullYear() - y
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) {
    age--
  }
  const currentPinn = pinnacles.find((p) => {
    return age >= p.startAge && (!p.endAge || age <= p.endAge)
  })
  const pinnacleColor = currentPinn ? CYCLE_QUEST_COLORS.pinnacle?.hex || '#c9a84c' : '#666'
  const pinnacleData = currentPinn ? CYCLE_MEANINGS.pinnacle?.[currentPinn.root] : null

  return (
    <section className="seasons-section" aria-labelledby="seasons-heading">
      <div className="seasons-header">
        <h2 id="seasons-heading" className="seasons-heading">
          <span className="seasons-heading-line" aria-hidden="true" />
          <span className="seasons-heading-glyph" aria-hidden="true">◇</span>
          SEASONS
          <span className="seasons-heading-glyph" aria-hidden="true">◇</span>
          <span className="seasons-heading-line" aria-hidden="true" />
        </h2>
      </div>

      {pinnacleData && currentPinn && (
        <div className="seasons-pinnacle-banner" style={{ '--pinnacle-color': pinnacleColor }}>
          <div className="seasons-pinnacle-content">
            <div className="seasons-pinnacle-header">
              <div className="seasons-pinnacle-theme">▲ {pinnacleData.theme}</div>
              <div className="seasons-pinnacle-ages">
                Ages {currentPinn.startAge}–{currentPinn.endAge || '∞'}
              </div>
            </div>
            <div className="seasons-pinnacle-summary">{pinnacleData.summary}</div>
          </div>
        </div>
      )}

      <div className="seasons-cards-container" style={{ '--pinnacle-color': pinnacleColor }}>
        <YearSeasonCard playerData={playerData} lpRoot={lpRoot} m={m} d={d} />
        <MonthSeasonCard playerData={playerData} lpRoot={lpRoot} m={m} d={d} />
      </div>
    </section>
  )
}
