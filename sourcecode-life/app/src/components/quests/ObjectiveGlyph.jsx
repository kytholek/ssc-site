/**
 * ObjectiveGlyph — Small glyph square for a single quest objective in the Hub.
 * Shows icon, quest source, objective text, and status.
 */
export default function ObjectiveGlyph({ objective, onClick }) {
  const {
    icon = '✦',
    source = '',
    text = '',
    done = false,
    locked = false,
    type = 'life',  // life | current | multi | daily
  } = objective || {}

  return (
    <div
      className={`obj-glyph obj-glyph--${type}${done ? ' obj-glyph--done' : ''}${locked ? ' obj-glyph--locked' : ''}${onClick ? ' obj-glyph--clickable' : ''}`}
      title={text}
      onClick={onClick}
    >
      <span className="obj-glyph-icon">{icon}</span>
      <span className="obj-glyph-source">{source}</span>
      <span className="obj-glyph-text">{text}</span>
      {done && <span className="obj-glyph-check">✓</span>}
      {locked && <span className="obj-glyph-lock">🔒</span>}
    </div>
  )
}
