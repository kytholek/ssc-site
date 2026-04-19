/**
 * LifeQuestRoadmap — Visual roadmap of all 7 life quests and their 3 tiers
 */
import { useState } from 'react'
import { getLQP } from '../../lib/questEngine'
import { getTieredObjectiveTexts } from '../../lib/objectives'
import { useAppState } from '../../context/AppContext'
import { fmt } from '../../lib/numerology'

const LIFE_QUESTS = [
  { key: 'lp', label: 'Life Path' },
  { key: 'so', label: 'Soul Urge' },
  { key: 'ou', label: 'Outer' },
  { key: 'ac', label: 'Achievement' },
  { key: 'ex', label: 'Expression' },
  { key: 'cl', label: 'Life Calling' },
  { key: 'th', label: 'Theme' },
]

const TIER_NAMES = ['', 'Apprentice', 'Adept', 'Master']
const TIER_COLORS = ['', 'var(--sage)', 'var(--gold)', 'var(--rose)']
const TIER_DESC = [
  '',
  'Apprentice — Learn the basics. Complete all objectives to advance.',
  'Adept — Deepen your mastery. Each objective builds on the last.',
  'Master — The final tier. Full alignment with this life quest.',
]

function getActiveTier(lqp, key, root) {
  for (let t = 1; t <= 3; t++) {
    const tierData = lqp?.[key]?.[t]
    if (!tierData) return t
    const objs = getTieredObjectiveTexts(root, t)
    const allDone = objs.every((_, i) => tierData[i])
    if (!allDone) return t
  }
  return 4
}

export default function LifeQuestRoadmap() {
  const { playerData } = useAppState()
  const lqp = getLQP()
  const [infoNode, setInfoNode] = useState(null)

  if (!playerData) return null

  return (
    <div className="data-chart life-quest-roadmap">
      <div className="data-chart-title">◈ LIFE QUEST ROADMAP</div>
      <div className="data-chart-note">Tap a node to learn what it represents</div>

      <div className="lqr-grid">
        {LIFE_QUESTS.map(lq => {
          const node = playerData[lq.key]
          if (!node) return null

          const root = node.root
          const compound = node.compound
          const activeTier = getActiveTier(lqp, lq.key, root)
          const isComplete = activeTier > 3
          const currentTier = Math.min(activeTier, 3)

          return (
            <div
              key={lq.key}
              className={`lqr-node${isComplete ? ' lqr-node--complete' : ''}`}
              onClick={() => setInfoNode(infoNode === lq.key ? null : lq.key)}
              onKeyDown={e => { if (e.key === 'Enter') setInfoNode(infoNode === lq.key ? null : lq.key) }}
              role="button"
              tabIndex={0}
              aria-label={`${lq.label}, number ${root}, tier ${isComplete ? 'Mastered' : TIER_NAMES[currentTier]}`}
            >
              <div className="lqr-num" style={{ color: isComplete ? 'var(--rose)' : 'var(--teal)' }}>
                {isComplete ? '✦' : fmt(root, compound)}
              </div>
              <div className="lqr-label">{lq.label}</div>
              <div className="lqr-tiers">
                {[1, 2, 3].map(t => {
                  const tierData = lqp?.[lq.key]?.[t]
                  const objs = getTieredObjectiveTexts(root, t)
                  const doneCount = tierData ? tierData.filter(Boolean).length : 0
                  const total = objs.length || 3
                  const isActive = t === currentTier && !isComplete
                  const isDone = t < activeTier
                  return (
                    <div
                      key={t}
                      className={`lqr-tier-pip${isActive ? ' lqr-tier-pip--active' : ''}${isDone ? ' lqr-tier-pip--done' : ''}`}
                      style={{
                        borderColor: isDone ? TIER_COLORS[t] : isActive ? TIER_COLORS[t] : 'rgba(255,255,255,0.1)',
                        background: isDone ? `${TIER_COLORS[t]}22` : 'transparent',
                      }}
                      title={`${TIER_NAMES[t]}: ${doneCount}/${total}`}
                    >
                      {TIER_NAMES[t].charAt(0)}
                    </div>
                  )
                })}
              </div>
              {!isComplete && currentTier <= 3 && (
                <div className="lqr-progress-bar">
                  {(() => {
                    const tierData = lqp?.[lq.key]?.[currentTier]
                    const objs = getTieredObjectiveTexts(root, currentTier)
                    const total = objs.length || 3
                    const done = tierData ? tierData.filter(Boolean).length : 0
                    const pct = total > 0 ? (done / total) * 100 : 0
                    return <div className="lqr-progress-fill" style={{ width: `${pct}%`, background: TIER_COLORS[currentTier] }} />
                  })()}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info panel */}
      {infoNode && (
        <div className="lqr-info-panel">
          <button className="lqr-info-close" onClick={() => setInfoNode(null)} aria-label="Close info">✕</button>
          {(() => {
            const lq = LIFE_QUESTS.find(l => l.key === infoNode)
            const node = playerData[infoNode]
            if (!lq || !node) return null
            const root = node.root
            const compound = node.compound
            const activeTier = getActiveTier(lqp, infoNode, root)
            const isComplete = activeTier > 3
            const currentTier = Math.min(activeTier, 3)
            return (
              <>
                <div className="lqr-info-title">
                  <span style={{ color: 'var(--teal)' }}>{fmt(root, compound)}</span> {lq.label}
                </div>
                <div className="lqr-info-desc">{getLifeQuestDescription(infoNode)}</div>
                <div className="lqr-info-status">
                  Tier: <strong style={{ color: TIER_COLORS[currentTier] }}>{isComplete ? '✦ MASTERED' : TIER_NAMES[currentTier]}</strong>
                </div>
                {!isComplete && <div className="lqr-info-tier-desc">{TIER_DESC[currentTier]}</div>}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function getLifeQuestDescription(key) {
  const descriptions = {
    lp: 'Your Life Path — the primary journey you chose for this lifetime. Derived from your full birth date.',
    so: 'Your Soul Urge — your deepest inner desire, what truly motivates you at the core. Derived from the vowels in your name.',
    ou: 'Your Outer Number — how others perceive you, the mask you present to the world. Derived from the consonants in your name.',
    ac: 'Your Achievement Number — what you are driven to accomplish. Derived from your birth month and day.',
    ex: 'Your Expression — your natural talents and abilities, how you communicate yourself. Derived from all letters in your name.',
    cl: 'Your Life Calling — the synthesis of your Life Path and Expression. Your ultimate purpose.',
    th: 'Your Theme — the underlying pattern of your life, set by your birth year.',
  }
  return descriptions[key] || ''
}
