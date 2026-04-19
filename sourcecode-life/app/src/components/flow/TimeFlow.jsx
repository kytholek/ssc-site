/**
 * TimeFlow — Current Cycles (premium SVG nodes)
 */
import { useState, useEffect } from 'react'
import { reduceToSimple, getCycleAnchor, calcPersonalYear, calcPinnacles, calcPersonalMonth, calcPersonalDay, calcFourMonthCycle, todayStr } from '../../lib/numerology'
import { useQuestEngine } from '../../hooks/useQuestEngine'
import FlowDetailPanel from './FlowDetailPanel'
import MonthCheckinPanel from '../datachunks/MonthCheckinPanel'
import {
  CYCLE_MEANINGS, CYCLE_QUEST_COLORS, MONTH_NAMES,
  NUM_QUESTS, MASTER_QUESTS,
} from '../../lib/data'
import { getCycleObjectives, PINNACLE_MONTH_LENS } from '../../lib/objectives'
import { LS_DAILY_GLYPHS, getPinnacleProgress, getActiveTier } from '../../lib/questEngine'
import { completeFourMonthSeason, getMonthSeasonState, getYearSeasonState, addMonthCheckin } from '../../lib/seasonEngine'

const MASTERS = new Set([11, 22, 33, 44, 55, 66, 77, 88, 99])
const ORB_R = 52 // Node radius

function getQuestData(root) {
  if (MASTERS.has(root) && MASTER_QUESTS[root]) return MASTER_QUESTS[root]
  const simple = reduceToSimple(root)
  return NUM_QUESTS[simple] || NUM_QUESTS[9]
}

// ── Node positions (centered in each zone vertically + horizontally) ───────
const NODES = [
  { key: 'theme',         x: 66,  y: 38,  label: 'THEME',        icon: '🎯' },
  { key: 'pinnacle',      x: 230, y: 38,  label: 'PINNACLE',     icon: '🏔️' },
  { key: 'personalYear',  x: 66,  y: 228, label: 'YEAR',         icon: '📅' },
  { key: 'fourMonthCycle',x: 230, y: 228, label: '4-MONTH',      icon: '🔄' },
  { key: 'personalMonth', x: 66,  y: 428, label: 'MONTH',        icon: '🌙' },
  { key: 'personalDay',   x: 230, y: 428, label: 'DAY',          icon: '☀️' },
]

const LINE_PTS = NODES.map(n => `${n.x + ORB_R},${n.y + ORB_R}`).join(' ')

const ZONES = [
  { y: 0,   h: 180, label: 'LONG TERM',   bg: '#14100c' },
  { y: 180, h: 200, label: 'MEDIUM TERM', bg: '#16100e' },
  { y: 380, h: 200, label: 'SHORT TERM',  bg: '#181210' },
]

const ORB_COLORS = {
  theme:         { hex: '#c9a84c', glow: '#c9a84c66' },
  pinnacle:      { hex: '#c9a84c', glow: '#c9a84c66' },
  personalYear:  { hex: '#00e5cc', glow: '#00e5cc66' },
  fourMonthCycle:{ hex: '#7c3aed', glow: '#7c3aed66' },
  personalMonth: { hex: '#f472b6', glow: '#f472b666' },
  personalDay:   { hex: '#4ade80', glow: '#4ade8066' },
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function getMeaning(type, root) {
  const map = CYCLE_MEANINGS[type]
  return (map && map[root]) || {}
}

function getCycleObjs(type, root, freqLevel = 1) {
  const objs = getCycleObjectives(type, root, freqLevel)
  return objs.map(o => o.text)
}

function getCycleProgress(sq, cycleType) {
  if (!sq || typeof sq !== 'object') return 0
  return Object.values(sq).filter(
    q => q && q.status === 'completed' && q.cycleType === cycleType
  ).length
}

function getDailyGlyphsDone() {
  try {
    const raw = localStorage.getItem(LS_DAILY_GLYPHS)
    if (!raw) return 0
    const state = JSON.parse(raw)
    const today = todayStr()
    if (!state || state.date !== today) return 0
    return (state.completed || []).filter(Boolean).length
  } catch { return 0 }
}

// ── TimeFlow ────────────────────────────────────────────────────────────────
export default function TimeFlow({ playerData, sideQuests: sqProp }) {
  const [selected, setSelected] = useState(null)
  const [chartReady, setChartReady] = useState(false)
  const [dailyGlyphsDone, setDailyGlyphsDone] = useState(getDailyGlyphsDone)
  const [monthSeasonState, setMonthSeasonState] = useState(null)
  const [yearSeasonState, setYearSeasonState] = useState(null)
  const [checkinPanelOpen, setCheckinPanelOpen] = useState(false)
  const { xp } = useQuestEngine()
  const freqLevel = xp?.freqLevel || 1
  const sideQuests = sqProp && typeof sqProp === 'object' ? sqProp : {}

  if (!playerData) return null
  const { lp, th, ex, cl, so, ou, ac, m, d, y } = playerData
  if (!m || !d || !y || !lp?.root || !th?.root) return null

  useEffect(() => {
    const timer = setTimeout(() => setChartReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Listen for daily glyph completions
  useEffect(() => {
    const handler = () => setDailyGlyphsDone(getDailyGlyphsDone())
    window.addEventListener('scl:daily_glyphs_updated', handler)
    return () => window.removeEventListener('scl:daily_glyphs_updated', handler)
  }, [])

  // Load month and year season state
  useEffect(() => {
    if (lp?.root && m && d) {
      setMonthSeasonState(getMonthSeasonState(lp.root, m, d, freqLevel))
      setYearSeasonState(getYearSeasonState(lp.root, m, d))
    }
  }, [lp?.root, m, d, freqLevel])

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentAge = currentYear - y - (
    now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0
  )
  const { cycleStartYear } = getCycleAnchor(m, d)
  const cycleEndYear = cycleStartYear + 1
  const py = calcPersonalYear(m, d)
  const pinnacles = calcPinnacles(m, d, y, lp)
  const currentPinn = pinnacles.find((p, i) =>
    i < 3 ? currentAge >= p.startAge && currentAge <= p.endAge : currentAge >= p.startAge
  ) || pinnacles[3]
  const pinnIndex = pinnacles.indexOf(currentPinn) + 1
  const fmc = calcFourMonthCycle(m, d)
  const pm = calcPersonalMonth(m, d)
  const pd = calcPersonalDay(m, d)
  const thData = getQuestData(th.root)

  const handleCheckinSubmit = (journal, objectiveIdx) => {
    const result = addMonthCheckin(lp.root, m, d, journal, objectiveIdx)
    if (result.ok) {
      setCheckinPanelOpen(false)
      const newState = getMonthSeasonState(lp.root, m, d, freqLevel)
      setMonthSeasonState(newState)
      return { ok: true }
    }
    return result
  }

  const blueprintRoots = [
    lp?.root, ex?.root, cl?.root, so?.root, ou?.root, ac?.root, th?.root,
  ].filter(Boolean).map(r => reduceToSimple(r))

  const nodeData = [
    {
      ...NODES[0], root: th.root, isMaster: MASTERS.has(th.root),
      subtitle: 'Your Life Curriculum',
      meaning: {}, color: ORB_COLORS.theme,
      title: 'THEME QUEST', typeLabel: 'THEME',
      desc: thData.desc, objectives: thData.objectives || [],
      affirmation: thData.affirmation || '',
      progress: getCycleProgress(sideQuests, 'theme'),
      aligned: blueprintRoots.includes(reduceToSimple(th.root)),
    },
    {
      ...NODES[1], root: currentPinn.root, isMaster: MASTERS.has(currentPinn.root),
      subtitle: `Pinnacle ${pinnIndex} · ${currentPinn.endAge ? `Ages ${currentPinn.startAge}–${currentPinn.endAge}` : `Age ${currentPinn.startAge}+`}`,
      detail: `Major Life Chapter · Pinnacle ${pinnIndex} of 4`,
      meaning: getMeaning('pinnacle', currentPinn.root),
      color: ORB_COLORS.pinnacle,
      title: `PINNACLE ${pinnIndex} — ACTIVE`, typeLabel: 'PINNACLE',
      desc: '', objectives: [],
      pinnDesc: CYCLE_MEANINGS.pinnacle?.[currentPinn.root],
      affirmation: 'I meet this chapter with full presence.',
      pinnacleData: getPinnacleProgress(pinnIndex, currentPinn.root),
      progress: getPinnacleProgress(pinnIndex, currentPinn.root).milestones.length,
      progressMax: getPinnacleProgress(pinnIndex, currentPinn.root).required,
      aligned: blueprintRoots.includes(reduceToSimple(currentPinn.root)),
    },
    {
      ...NODES[2], root: py.root, isMaster: MASTERS.has(py.root),
      subtitle: `${cycleStartYear}–${cycleEndYear} · Birthday to Birthday`,
      detail: `Year ${cycleStartYear}–${cycleEndYear} · 9-Year Cycle`,
      meaning: getMeaning('personalYear', py.root),
      color: ORB_COLORS.personalYear,
      title: `PERSONAL YEAR ${cycleStartYear}–${cycleEndYear} QUEST`, typeLabel: 'YEAR QUEST',
      desc: '', objectives: getCycleObjs('personalYear', py.root, freqLevel),
      affirmation: "I am aligned with my personal year frequency.",
      progress: getCycleProgress(sideQuests, 'personalYear'),
      aligned: blueprintRoots.includes(reduceToSimple(py.root)),
    },
    {
      ...NODES[3], root: fmc.root, isMaster: MASTERS.has(fmc.root),
      subtitle: `Cycle ${fmc.cycleNum}`,
      detail: `Seasonal Chapter · Cycle ${fmc.cycleNum} of 3`,
      meaning: getMeaning('fourMonthCycle', fmc.root),
      color: ORB_COLORS.fourMonthCycle,
      title: `FOUR-MONTH CYCLE ${fmc.cycleNum} QUEST`, typeLabel: 'SEASON QUEST',
      desc: '', objectives: getCycleObjs('fourMonthCycle', fmc.root, freqLevel),
      affirmation: "I work with the energy of this season.",
      progress: getCycleProgress(sideQuests, 'fourMonthCycle'),
      aligned: blueprintRoots.includes(reduceToSimple(fmc.root)),
    },
    {
      ...NODES[4], root: pm.root, isMaster: MASTERS.has(pm.root),
      subtitle: `${MONTH_NAMES[now.getMonth()] || ''} · Personal Number ${pm.root}`,
      detail: `Monthly Frequency · Cycle ${pm.monthNum} of 12`,
      meaning: getMeaning('personalMonth', pm.root),
      color: ORB_COLORS.personalMonth,
      title: `PERSONAL MONTH ${pm.monthNum} QUEST`, typeLabel: 'MONTH QUEST',
      desc: '', objectives: getCycleObjs('personalMonth', pm.root, freqLevel),
      affirmation: 'This month I act in alignment.',
      progress: getCycleProgress(sideQuests, 'personalMonth'),
      aligned: blueprintRoots.includes(reduceToSimple(pm.root)),
    },
    {
      ...NODES[5], root: pd.root, isMaster: MASTERS.has(pd.root),
      subtitle: `${MONTH_NAMES[now.getMonth()] || ''} ${now.getDate()} · Today`,
      detail: `Daily Tone · Root ${reduceToSimple(pd.root)}`,
      meaning: getMeaning('personalDay', pd.root),
      color: ORB_COLORS.personalDay,
      title: `PERSONAL DAY ${pd.root}`, typeLabel: 'DAY QUEST',
      desc: '', objectives: getCycleObjs('personalDay', pd.root, freqLevel),
      affirmation: '',
      progress: dailyGlyphsDone + getCycleProgress(sideQuests, 'personalDay'),
      aligned: blueprintRoots.includes(reduceToSimple(pd.root)),
    },
  ]

  const selIdx = selected
  const selNode = selIdx !== null ? nodeData[selIdx] : null

  return (
    <div className="tf-wrap">
      {/* ── SVG Flow Chart ── */}
      <div className={`tf-chart-area${chartReady ? ' tf-chart-area--ready' : ''}`}>
        <svg className="tf-svg" viewBox="0 0 400 580" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Dot grid */}
            <pattern id="tfDotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="0.7" fill="rgba(255,255,255,0.05)" />
            </pattern>

            {/* Zone gradients */}
            <linearGradient id="tfZoneGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(201,168,76,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="tfZoneGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(139,92,246,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="tfZoneGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,229,180,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Orb gradients */}
            {nodeData.map((node) => (
              <radialGradient key={`grad-${node.key}`} id={`tfGrad-${node.key}`} cx="50%" cy="35%" r="58%">
                <stop offset="0%" stopColor={node.color.hex} stopOpacity="0.25" />
                <stop offset="45%" stopColor={node.color.hex} stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0a0a14" stopOpacity="1" />
              </radialGradient>
            ))}

            {/* Inner shadow clip */}
            <clipPath id="tfOrbClip">
              <circle r={ORB_R - 1} />
            </clipPath>
          </defs>

          {/* Background dot grid */}
          <rect x="0" y="0" width="400" height="580" fill="url(#tfDotGrid)" />

          {/* Colored zones */}
          {ZONES.map((z, i) => (
            <g key={i} style={{ opacity: chartReady ? 1 : 0, transition: `opacity 0.8s ease ${0.1 + i * 0.15}s` }}>
              <rect x="0" y={z.y} width="400" height={z.h} fill={z.bg} rx="6" />
              <rect x="0" y={z.y} width="400" height={z.h} fill={`url(#tfZoneGrad${i + 1})`} rx="6" />
              {i < ZONES.length - 1 && (
                <line x1="0" y1={z.y + z.h} x2="400" y2={z.y + z.h} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 3" />
              )}
              <text x="16" y={z.y + 18} fill="rgba(255,255,255,0.18)" fontSize="8" fontFamily="'Cinzel', serif" fontWeight="700" letterSpacing="0.25em">
                {z.label}
              </text>
            </g>
          ))}

          {/* Connecting lines */}
          <polyline points={LINE_PTS} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <polyline className="tf-connector" points={LINE_PTS} />
          <polyline className="tf-connector-glow" points={LINE_PTS} />

          {/* ═══════════════════════════════════════════
              NODES - Premium SVG orbs
              ═══════════════════════════════════════════ */}
          {nodeData.map((node, i) => {
            const isActive = selIdx === i
            const cx = node.x + ORB_R
            const cy = node.y + ORB_R
            const r = ORB_R
            const maxProgress = node.progressMax || 3
            const stagesDone = Math.min(maxProgress, node.progress)
            const isComplete = stagesDone >= maxProgress
            const progress = (stagesDone / maxProgress) * 100
            const delay = 0.2 + i * 0.1

            return (
              <g
                key={node.key}
                className={`tf-orb-group tf-orb-group--${node.key}${isActive ? ' tf-orb-group--active' : ''}${isComplete ? ' tf-orb-group--complete' : ''}`}
                onClick={() => setSelected(selIdx === i ? null : i)}
                style={{
                  '--tf-color': node.color.hex,
                  '--tf-glow': node.color.glow,
                  opacity: chartReady ? 1 : 0,
                  transform: chartReady ? 'scale(1)' : 'scale(0.35)',
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
                }}
              >
                {/* ═══ LAYER 1: Outer glow (outside-in) ═══ */}

                {/* Alignment ring */}
                {node.aligned && (
                  <circle cx={cx} cy={cy} r={r + 20} fill="none" stroke={node.color.hex} strokeWidth="1.5" strokeDasharray="4 3" opacity={isActive ? 0.4 : 0.18} style={{ animation: isActive ? 'tfSpin 12s linear infinite' : 'none', transformOrigin: `${cx}px ${cy}px` }} />
                )}

                {/* Completed aura */}
                {stagesDone >= maxProgress && (
                  <circle cx={cx} cy={cy} r={r + 18} fill="none" stroke={node.color.hex} strokeWidth="8" opacity={isActive ? 0.12 : 0.05} />
                )}

                {/* Partial glow */}
                {stagesDone > 0 && stagesDone < maxProgress && (
                  <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={node.color.hex} strokeWidth="5" opacity={isActive ? 0.1 : 0.03} />
                )}

                {/* Rotating ring */}
                {isActive && (
                  <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={node.color.hex} strokeWidth="1" strokeOpacity="0.3" style={{ animation: 'tfSpin 8s linear infinite', transformOrigin: `${cx}px ${cy}px` }} />
                )}

                {/* Outer dashed ring */}
                <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={node.color.hex} strokeWidth="0.5" strokeDasharray="3 5" strokeOpacity="0.15" />

                {/* ═══ LAYER 2: Progress arc (inside orb edge) ═══ */}
                {progress > 0 && (
                  <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke={node.color.hex} strokeWidth="2.5" strokeDasharray={`${(progress / 100) * 314} 314`} strokeLinecap="round" opacity="0.55" style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)' }} />
                )}

                {/* ═══ LAYER 3: Orb body ═══ */}
                <circle className="tf-orb-body" cx={cx} cy={cy} r={r} fill={`url(#tfGrad-${node.key})`} stroke={node.color.hex} strokeWidth={isActive ? 3 : node.aligned ? 2.5 : 1.5} strokeOpacity={isComplete ? 0.25 : 1} style={{ transition: 'all 0.3s cubic-bezier(.4,2,.6,1)' }} />

                {/* Completed dull overlay */}
                {isComplete && <circle cx={cx} cy={cy} r={r} fill="rgba(8,8,16,0.62)" pointerEvents="none" />}

                {/* Inner glow when active */}
                {isActive && <circle cx={cx} cy={cy} r={r - 1} fill={node.color.hex} opacity="0.04" pointerEvents="none" />}

                {/* ═══ LAYER 4: Content (all inside orb) ═══ */}
                <g transform={`translate(${cx}, ${cy})`} clipPath="url(#tfOrbClip)">

                  {/* Icon - upper center */}
                  <text x="0" y={-6} textAnchor="middle" dominantBaseline="central" fontSize="26" pointerEvents="none" opacity={isComplete ? 0.3 : 1} style={{ filter: isActive && !isComplete ? `drop-shadow(0 0 8px ${node.color.hex})` : 'none' }}>
                    {node.icon || '◎'}
                  </text>

                  {/* Number badge - bottom center inside orb */}
                  {!node.isMaster && (
                    <>
                      <circle cx="0" cy={r - 16} r="11" fill="rgba(10,10,18,0.85)" stroke={node.color.hex} strokeWidth="0.8" strokeOpacity="0.35" />
                      <text x="0" y={r - 16} textAnchor="middle" dominantBaseline="central" fill={node.color.hex} fontFamily="'Share Tech Mono', monospace" fontSize="10" fontWeight="700" opacity="0.9" pointerEvents="none">
                        {reduceToSimple(node.root)}
                      </text>
                    </>
                  )}

                  {/* Master badge */}
                  {node.isMaster && (
                    <>
                      <rect x="-28" y={r - 26} width="56" height="18" rx="4" fill="rgba(240,192,96,0.1)" stroke="rgba(240,192,96,0.3)" strokeWidth="0.8" />
                      <text x="0" y={r - 17} textAnchor="middle" fill="#f0c060" fontFamily="'Cinzel', serif" fontSize="7.5" fontWeight="700" letterSpacing="0.12em" pointerEvents="none">MASTER</text>
                    </>
                  )}

                  {/* ═══ Stage pips / complete check - bottom of orb ═══ */}
                  {isComplete ? (
                    <text x="0" y={r - 20} textAnchor="middle" dominantBaseline="central" fill={node.color.hex} fontSize="13" fontWeight="700" opacity="0.45" pointerEvents="none">✓</text>
                  ) : (
                    <g pointerEvents="none">
                      {(() => {
                        const pipCount = Math.min(maxProgress, 9)
                        const pipSpacing = Math.min(18, 140 / Math.max(pipCount, 1))
                        const totalWidth = (pipCount - 1) * pipSpacing
                        return (
                          <g transform={`translate(${-totalWidth / 2}, ${r - 32})`}>
                            {Array.from({ length: pipCount }).map((_, pip) => {
                              const px = pip * pipSpacing
                              const isDone = pip < stagesDone
                              const isEligible = pip === stagesDone
                              return (
                                <g key={pip} transform={`translate(${px}, 0)`}>
                                  {isDone && <circle cx="0" cy="0" r="8" fill={node.color.hex} opacity="0.18" />}
                                  <circle cx="0" cy="0" r="4.5" fill={isDone ? node.color.hex : 'transparent'} stroke={node.color.hex} strokeWidth={isDone ? 1.5 : isEligible ? 2 : 1} strokeOpacity={isDone ? 1 : isEligible ? 0.6 : 0.18} />
                                </g>
                              )
                            })}
                          </g>
                        )
                      })()}
                    </g>
                  )}
                </g>

                {/* Label - outside orb, below */}
                <text className="tf-label" x={cx} y={cy + r + 20} textAnchor="middle" fill={isActive ? 'rgba(255,255,255,0.7)' : isComplete ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.38)'} fontFamily="'Cinzel', serif" fontSize="8" fontWeight="700" letterSpacing="0.15em" pointerEvents="none" style={{ transition: 'fill 0.3s ease' }}>
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* ── Detail Panel ── */}
      <FlowDetailPanel
        open={!!selNode}
        onClose={() => setSelected(null)}
        color={selNode?.color?.hex || '#c9a84c'}
        title={selNode?.title || ''}
        subtitle={selNode?.subtitle || ''}
        icon={selNode?.icon || '◎'}
      >
        {selNode && (
          <div className="flow-panel-content">
            {selNode.meaning.theme && (
              <div className="journal-section">
                <div className="journal-section-label">◈ THEME</div>
                <div className="journal-section-text">{selNode.meaning.theme}</div>
              </div>
            )}
            {selNode.meaning.summary && (
              <div className="journal-section">
                <div className="journal-section-label">◈ SUMMARY</div>
                <div className="journal-section-text">{selNode.meaning.summary}</div>
              </div>
            )}
            {selNode.key === 'personalYear' && yearSeasonState && (
              <div className="journal-section">
                <div className="journal-section-label">◈ YEAR SEASONS</div>
                <div className="seasons-progress-bar" style={{ marginBottom: 6 }}>
                  <div className="seasons-progress-fill" style={{
                    width: `${(yearSeasonState.monthsCompleted.length / 12) * 100}%`,
                    '--season-color': selNode.color.hex,
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.45 }}>
                  {yearSeasonState.monthsCompleted.length} / 12 seasons · {yearSeasonState.journalDone ? 'Year Complete' : 'In Progress'}
                </div>
              </div>
            )}
            {selNode.desc && (
              <div className="journal-section">
                <div className="journal-section-label">◈ DESCRIPTION</div>
                <div className="journal-section-text">{selNode.desc}</div>
              </div>
            )}
            {selNode.pinnDesc && (
              <>
                <div className="journal-section">
                  <div className="journal-section-label">▲ {selNode.pinnDesc.theme}</div>
                  <p style={{ opacity: 0.7, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 0 }}>{selNode.pinnDesc.summary}</p>
                </div>
                {selNode.pinnacleData && (
                  <div className="journal-section">
                    <div className="journal-section-label">◈ MILESTONES</div>
                    <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                      {selNode.pinnacleData.milestones.length} / {selNode.pinnacleData.required} four-month cycles complete
                    </div>
                  </div>
                )}
              </>
            )}
            {selNode.key === 'personalMonth' && PINNACLE_MONTH_LENS[currentPinn?.root] && (
              <div style={{
                fontSize: '0.72rem', color: 'var(--gold)', opacity: 0.65,
                borderLeft: '2px solid var(--gold-dim)', paddingLeft: 8, marginBottom: 12,
                fontStyle: 'italic'
              }}>
                {PINNACLE_MONTH_LENS[currentPinn.root]}
              </div>
            )}
            {selNode.key === 'personalMonth' && (() => {
              const tier = getActiveTier(`tp_${reduceToSimple(pm.root)}`) || 1
              const tierName = ['APPRENTICE', 'ADEPT', 'MASTER'][tier - 1]
              return (
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: selNode.color.hex, opacity: 0.55, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>
                  ◈ LIFE QUEST TIER: {tierName}
                </div>
              )
            })()}
            {selNode.key === 'personalMonth' && monthSeasonState?.lockedObj && (
              <div className="journal-section">
                <div className="journal-section-label">◈ MONTHLY MISSION</div>
                <div className="seasons-locked-obj" style={{ '--season-color': selNode.color.hex }}>
                  <div className="seasons-locked-obj-tier">
                    {['APPRENTICE', 'ADEPT', 'MASTER'][monthSeasonState.lockedObj.tierAtLock - 1] || 'APPRENTICE'} MISSION
                  </div>
                  <div className="seasons-locked-obj-text">{monthSeasonState.lockedObj.text}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                  {[0,1,2,3].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => !monthSeasonState.completed && setCheckinPanelOpen(true)}
                      disabled={monthSeasonState.completed}
                      style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: monthSeasonState.checkins[i] ? selNode.color.hex : 'transparent',
                        border: `1.5px solid ${selNode.color.hex}`,
                        opacity: monthSeasonState.checkins[i] ? 1 : 0.3,
                        cursor: monthSeasonState.completed ? 'default' : 'pointer',
                        padding: 0,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!monthSeasonState.completed) {
                          e.target.style.transform = 'scale(1.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                      }}
                    />
                  ))}
                  <span style={{ fontSize: '0.72rem', opacity: 0.45, marginLeft: 4 }}>
                    {monthSeasonState.checkins.length}/4 check-ins
                    {monthSeasonState.completed ? ' · COMPLETE' : ''}
                  </span>
                </div>
              </div>
            )}
            {selNode.key === 'fourMonthCycle' && (
              <div className="journal-section" style={{ marginBottom: 12 }}>
                <button
                  onClick={() => {
                    const now = new Date()
                    const res = completeFourMonthSeason(lp.root, now.getMonth() + 1, now.getDate(), pinnIndex, currentPinn.root)
                    if (res.ok) setSelected(null)
                  }}
                  style={{
                    padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer',
                    background: 'var(--gold)', color: '#0a0a12', border: 'none', borderRadius: '2px',
                    fontWeight: 600, opacity: 0.9
                  }}
                >
                  Complete Season
                </button>
              </div>
            )}
            {selNode.objectives?.length > 0 && (
              <div className="journal-section">
                <div className="journal-section-label">◈ {selNode.key === 'pinnacle' ? 'CHAPTER THEMES' : 'QUEST OBJECTIVES'}</div>
                <div className="quest-tile-objs-styled">
                  {selNode.objectives.map((obj, i) => (
                    <div key={i} className="quest-objective-item" style={{
                      borderColor: (selNode.color?.hex || '#c9a84c') + '44',
                      background: selNode.key === 'pinnacle' ? 'rgba(201,168,76,0.04)' : 'transparent',
                      opacity: selNode.key === 'pinnacle' ? 0.8 : 1,
                    }}>
                      <div className="quest-obj-check" style={{
                        borderColor: selNode.color?.hex || '#c9a84c',
                        color: selNode.color?.hex || '#c9a84c',
                        fontStyle: selNode.key === 'pinnacle' ? 'italic' : 'normal',
                        fontSize: selNode.key === 'pinnacle' ? '0.65rem' : 'inherit',
                        opacity: selNode.key === 'pinnacle' ? 0.5 : 1,
                      }}>
                        {selNode.key === 'pinnacle' ? '◈' : i + 1}
                      </div>
                      <div className="quest-obj-text">{obj}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selNode.affirmation && <div className="journal-affirmation">{selNode.affirmation}</div>}
          </div>
        )}
      </FlowDetailPanel>

      {/* Month Checkin Panel */}
      <MonthCheckinPanel
        open={checkinPanelOpen}
        monthTheme={pm.root ? getMeaning('personalMonth', pm.root).theme : 'This Month'}
        objectives={monthSeasonState?.objectives || []}
        onClose={() => setCheckinPanelOpen(false)}
        onSubmit={handleCheckinSubmit}
        lpRoot={lp.root}
        m={m}
        d={d}
      />

      {/* Full Timecycle Button */}
      <button
        onClick={() => window.Native_onOpenTab?.('profile', 'spiral')}
        style={{
          width: '100%',
          padding: '10px 16px',
          margin: '16px 0 0 0',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-light)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)'
          e.target.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'
          e.target.style.transform = 'translateY(0)'
        }}
      >
        ▶ Full Timecycle
      </button>
    </div>
  )
}
