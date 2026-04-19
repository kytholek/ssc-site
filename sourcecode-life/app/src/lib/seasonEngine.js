import { calcPersonalYear, calcPersonalMonth, calcFourMonthCycle, getCycleAnchor, reduceToSimple } from './numerology'
import { getCycleObjectives, getMonthlyObjectivesForTier } from './objectives'
import { QuestEngine_completeFreqQuest, QuestEngine_markLQPObjective, QuestEngine_markSkillProgress, getActiveTier, XP_AWARDS } from './questEngine'

// ─── Storage Keys ────────────────────────────────────────────
function getMonthStateKey(lpRoot, yearKey, monthNum) {
  return `scl_month_season_${lpRoot}_${yearKey}_${monthNum}`
}

function getYearStateKey(lpRoot, yearKey) {
  return `scl_year_season_${lpRoot}_${yearKey}`
}

function getFourMonthStateKey(lpRoot, yearKey, cycleNum) {
  return `scl_fourmonth_season_${lpRoot}_${yearKey}_${cycleNum}`
}

// ─── Month State ─────────────────────────────────────────────
export function getMonthSeasonState(lpRoot, m, d, freqLevel = 1) {
  const pm = calcPersonalMonth(m, d)
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear
  const monthNum = pm.monthNum

  const key = getMonthStateKey(lpRoot, yearKey, monthNum)
  let state = null
  try {
    state = JSON.parse(localStorage.getItem(key))
  } catch {}

  if (!state) {
    state = initMonthState(monthNum, yearKey)
  }

  // Always regenerate objectives from the live cycle data (same pattern as daily glyphs)
  const objs = getCycleObjectives('personalMonth', pm.root, freqLevel)
  state.objectives = objs.map(o => ({ id: o.id, text: o.text, duration: o.duration }))

  // Lock in one objective at month start if not already locked
  if (!state.lockedObj) {
    const lqpTier = getActiveTier(`tp_${reduceToSimple(pm.root)}`) || 1
    const pool = getMonthlyObjectivesForTier(pm.root, lqpTier)
    // Deterministic seed: same player gets same objective each month
    const seed = (lpRoot * 31 + monthNum * 17) % pool.length
    const picked = pool[seed]
    state.lockedObj = {
      id: picked.id,
      text: picked.text,
      duration: picked.duration,
      tierAtLock: lqpTier,
      poolIdx: seed,
    }
    localStorage.setItem(key, JSON.stringify(state))
  }

  return state
}

function initMonthState(monthNum, yearKey) {
  return {
    monthNum,
    yearKey,
    monthKey: `${yearKey}-${monthNum}`,
    objectives: [],
    checkins: [],  // [{ date, journal, objectiveIdx }]
    completed: false,
    completedAt: null,
    startDate: new Date().toISOString().split('T')[0],
  }
}

// ─── Checkin Logic ──────────────────────────────────────────
export function addMonthCheckin(lpRoot, m, d, journal, objectiveIdx) {
  const pm = calcPersonalMonth(m, d)
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear
  const monthNum = pm.monthNum

  const state = getMonthSeasonState(lpRoot, m, d)
  const today = new Date().toISOString().split('T')[0]

  // Check if already checked in today
  if (state.checkins.some(c => c.date === today)) {
    return { ok: false, error: 'Already checked in today', checkinCount: state.checkins.length, daysActive: null, canComplete: false }
  }

  // Max 4 checkins
  if (state.checkins.length >= 4) {
    return { ok: false, error: 'Max 4 check-ins reached', checkinCount: state.checkins.length, daysActive: null, canComplete: false }
  }

  // Add checkin
  state.checkins.push({ date: today, journal, objectiveIdx: objectiveIdx ?? null })

  // Save state
  const key = getMonthStateKey(lpRoot, yearKey, monthNum)
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}

  // Check if can complete
  const daysActive = getDaysActive(state.startDate, today)
  const canComplete = state.checkins.length >= 4 && daysActive >= 14

  return { ok: true, checkinCount: state.checkins.length, daysActive, canComplete }
}

function getDaysActive(startDateStr, endDateStr) {
  const start = new Date(startDateStr)
  const end = new Date(endDateStr)
  return Math.floor((end - start) / 86400000)
}

// ─── Month Completion ──────────────────────────────────────────
export function completeMonthSeason(lpRoot, m, d) {
  const pm = calcPersonalMonth(m, d)
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear
  const monthNum = pm.monthNum

  const state = getMonthSeasonState(lpRoot, m, d)
  const today = new Date().toISOString().split('T')[0]

  // Validate time lock
  if (state.checkins.length < 4) {
    return { ok: false, error: 'Need 4 check-ins first' }
  }

  const daysActive = getDaysActive(state.startDate, today)
  if (daysActive < 14) {
    return { ok: false, error: `Minimum 14 days required (${daysActive} active)` }
  }

  // Mark complete
  state.completed = true
  state.completedAt = new Date().toISOString()

  const key = getMonthStateKey(lpRoot, yearKey, monthNum)
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}

  // Increment year counter
  const yearState = getYearSeasonState(lpRoot, m, d)
  if (!yearState.monthsCompleted.includes(monthNum)) {
    yearState.monthsCompleted.push(monthNum)
    const ykey = getYearStateKey(lpRoot, yearKey)
    try {
      localStorage.setItem(ykey, JSON.stringify(yearState))
    } catch {}
  }

  // Award XP
  const root = reduceToSimple(pm.root)
  QuestEngine_completeFreqQuest(`month_${yearKey}_${monthNum}`, XP_AWARDS.personal_month, root)

  // Dual-feed: contribute to life quest tier AND skill tier
  if (state.lockedObj) {
    const { tierAtLock, poolIdx } = state.lockedObj
    const lqpKey = `tp_${root}`

    // Feed life quest tier progress
    QuestEngine_markLQPObjective(lqpKey, tierAtLock, poolIdx)

    // Feed skill tier progress
    QuestEngine_markSkillProgress(root, tierAtLock)
  }

  return { ok: true }
}

// ─── Four-Month Cycle State ────────────────────────────────
export function getFourMonthSeasonState(lpRoot, m, d, freqLevel = 1) {
  const fmc = calcFourMonthCycle(m, d)
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear
  const key = getFourMonthStateKey(lpRoot, yearKey, fmc.cycleNum)

  let state = null
  try {
    state = JSON.parse(localStorage.getItem(key))
  } catch {}

  if (!state) {
    state = {
      cycleNum: fmc.cycleNum,
      yearKey,
      objectives: [],
      completed: false,
      completedAt: null,
      startDate: new Date().toISOString().split('T')[0],
    }
  }

  const objs = getCycleObjectives('fourMonthCycle', fmc.root, freqLevel)
  state.objectives = objs.map(o => ({ id: o.id, text: o.text, duration: o.duration }))

  return state
}

// ─── Four-Month Cycle Completion ────────────────────────────
export function completeFourMonthSeason(lpRoot, m, d, pinnacleChapterIndex, pinnacleRoot) {
  const fmc = calcFourMonthCycle(m, d)
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear

  const state = getFourMonthSeasonState(lpRoot, m, d)
  if (state.completed) {
    return { ok: false, error: 'Already completed' }
  }

  state.completed = true
  state.completedAt = new Date().toISOString()

  const key = getFourMonthStateKey(lpRoot, yearKey, fmc.cycleNum)
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}

  const fmcKey = `fourmonth_${yearKey}_${fmc.cycleNum}`
  const root = reduceToSimple(fmc.root)

  QuestEngine_completeFreqQuest(fmcKey, XP_AWARDS.four_month, root, pinnacleChapterIndex, pinnacleRoot)

  return { ok: true }
}

// ─── Year State ─────────────────────────────────────────────
export function getYearSeasonState(lpRoot, m, d) {
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear

  const key = getYearStateKey(lpRoot, yearKey)
  let state = null
  try {
    state = JSON.parse(localStorage.getItem(key))
  } catch {}

  if (!state) {
    state = {
      yearKey,
      monthsCompleted: [],  // array of monthNum (1–12)
      journalDone: false,
      completedAt: null,
    }
  }

  return state
}

// ─── Year Journal Completion ────────────────────────────────
export function completeYearSeason(lpRoot, m, d, journal) {
  const py = calcPersonalYear(m, d)
  const yearKey = py.cycleStartYear

  const state = getYearSeasonState(lpRoot, m, d)

  // Validate
  if (state.monthsCompleted.length < 6) {
    return { ok: false, error: `Need 6 months (${state.monthsCompleted.length} complete)` }
  }

  if (state.journalDone) {
    return { ok: false, error: 'Year journal already completed' }
  }

  // Mark complete
  state.journalDone = true
  state.completedAt = new Date().toISOString()

  const key = getYearStateKey(lpRoot, yearKey)
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}

  // Award XP
  const root = reduceToSimple(py.root)
  QuestEngine_completeFreqQuest(`year_${yearKey}`, XP_AWARDS.personal_year, root)

  return { ok: true }
}
