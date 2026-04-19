/**
 * QuestJournals — completed quest journal entries.
 * Extracted from the old LogTab.
 */
function readReflections() {
  try { return JSON.parse(localStorage.getItem('scl_reflections') || '{}') } catch { return {} }
}

const QUEST_TYPE_COLORS = {
  primary:   'var(--color-rpg-teal,   #2dd4bf)',
  growth:    'var(--color-rpg-gold,   #c9a84c)',
  cycle:     'var(--color-rpg-rose,   #f472b6)',
  wildcard:  'var(--color-rpg-sage,   #4ade80)',
  objective: 'var(--color-rpg-gold,   #c9a84c)',
}

const TIER_NAMES = { 1: 'APPRENTICE', 2: 'ADEPT', 3: 'MASTER' }

export default function QuestJournals() {
  const all  = readReflections()
  const entries = Object.entries(all)
    .filter(([k]) => k.startsWith('gen_'))
    .map(([, v]) => v)
    .filter(e => e && e.text)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))

  if (!entries.length) {
    return (
      <div className="qj-empty">
        <div className="qj-empty-label">◈ NO QUEST JOURNALS YET</div>
        <div className="qj-empty-sub">Complete a daily numerology quest to create your first entry.</div>
      </div>
    )
  }

  return (
    <div className="qj-list">
      {entries.map((e, i) => {
        const colorVar = QUEST_TYPE_COLORS[e.questType] || QUEST_TYPE_COLORS.primary
        const isComplete = e.questId?.endsWith('_complete')
        return (
          <div key={i} className="qj-entry" style={{ '--qj-color': colorVar }}>
            <div className="qj-entry-header">
              <div className="qj-entry-meta">
                {e.questType && (
                  <span className="qj-entry-type" style={{ color: colorVar }}>
                    {e.questType === 'objective' ? '★ ' : ''}{(e.questType || '').toUpperCase()}
                  </span>
                )}
                {e.number && (
                  <span className="qj-entry-num" style={{ color: colorVar }}>{e.number}</span>
                )}
                {e.archetype && (
                  <span className="qj-entry-archetype">{e.archetype}</span>
                )}
                {e.tier && (
                  <span className="qj-entry-tier">{TIER_NAMES[e.tier] || `TIER ${e.tier}`}</span>
                )}
                {isComplete && (
                  <span className="qj-entry-complete-badge">✦ COMPLETE</span>
                )}
              </div>
              {e.date && <div className="qj-entry-date">{e.date}</div>}
            </div>
            {e.questTitle && (
              <div className="qj-entry-quest-title">{e.questTitle}</div>
            )}
            <div className="qj-entry-text">{e.text}</div>
          </div>
        )
      })}
    </div>
  )
}
