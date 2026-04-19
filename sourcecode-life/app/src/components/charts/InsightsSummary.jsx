/**
 * InsightsSummary — Four metric cards showing key milestones
 */
import { useState, useEffect } from 'react'
import { useQuestEngine } from '../../hooks/useQuestEngine'
import { getQuestCompletionTrend, getDailyHistory } from '../../lib/dataHistory'

const STAT_NAMES = {
  0: 'Spirit', 1: 'Initiation', 2: 'Cooperation', 3: 'Expression',
  4: 'Foundation', 5: 'Freedom', 6: 'Responsibility',
  7: 'Introspection', 8: 'Power', 9: 'Completion',
}

export default function InsightsSummary() {
  const { xp } = useQuestEngine()
  const [questTrend] = useState(() => getQuestCompletionTrend(90))
  const [history] = useState(() => getDailyHistory(90))
  const [bestDay, setBestDay] = useState(null)

  useEffect(() => {
    if (history.length) {
      const best = history.reduce((max, h) =>
        (h.questsCompleted || 0) > (max.questsCompleted || 0) ? h : max
      , { questsCompleted: 0 })
      setBestDay(best.questsCompleted > 0 ? best : null)
    }
  }, [history])

  const statEntries = Object.entries(xp?.statXP || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  const topStat = statEntries[0]
  const totalQuests = questTrend.reduce((s, d) => s + (d.completed || 0), 0)
  const daysTracked = history.length

  const cards = [
    { icon: '◈', value: totalQuests || '—', label: 'QUESTS DONE', color: 'var(--teal)' },
    { icon: '⚔', value: xp?.charLevel ? `LV ${xp.charLevel}` : '—', label: 'CHARACTER LEVEL', color: 'var(--gold)' },
    { icon: topStat ? `${topStat[0]}` : '—', value: topStat ? topStat[1] : '—', label: topStat ? `TOP: ${STAT_NAMES[topStat[0]] || ''}` : 'TOP STAT', color: 'var(--rose)' },
  ]

  if (!daysTracked) {
    return (
      <div className="insights-summary">
        <div className="insights-summary-empty">
          Complete quests to start tracking your progress. Your journey begins with the first step.
        </div>
      </div>
    )
  }

  return (
    <div className="insights-summary">
      {cards.map((card, i) => (
        <div key={i} className="insights-summary-card">
          <div className="insights-summary-icon" style={{ color: card.color }}>{card.icon}</div>
          <div className="insights-summary-value" style={{ color: card.color }}>{card.value}</div>
          <div className="insights-summary-label">{card.label}</div>
        </div>
      ))}
      {bestDay && (
        <div className="insights-summary-best">
          <span style={{ color: 'var(--teal)' }}>Best day:</span> {bestDay.date} — {bestDay.questsCompleted} quests, {bestDay.dailyXP || 0} XP
        </div>
      )}
    </div>
  )
}
