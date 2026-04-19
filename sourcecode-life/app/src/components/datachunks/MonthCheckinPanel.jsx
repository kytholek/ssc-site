import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function MonthCheckinPanel({ open, monthTheme, objectives, onClose, onSubmit, lpRoot, m, d }) {
  const [text, setText] = useState('')
  const [objectiveIdx, setObjectiveIdx] = useState(0)
  const [error, setError] = useState('')
  const panelRef = useRef(null)

  useEffect(() => {
    if (open) setText('')
    setError('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (trimmed.length < 20) {
      setError(`Minimum 20 characters (${trimmed.length}/20)`)
      return
    }
    const result = onSubmit(trimmed, objectiveIdx)
    if (result && result.ok === false) {
      setError(result.error)
      return
    }
    onClose()
  }

  return createPortal(
    <>
      <div className="quest-panel-overlay" onClick={onClose} role="presentation" />
      <div
        ref={panelRef}
        className="quest-panel"
        style={{ '--qp-color': 'var(--rose)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Weekly Check-in"
      >
        <button
          className="quest-panel-close"
          onClick={onClose}
          aria-label="Close check-in panel"
        >
          ✕
        </button>

        <div className="quest-panel-header">
          <span className="quest-panel-label" style={{ color: 'var(--rose)' }}>
            ◇ WEEKLY CHECK-IN
          </span>
        </div>

        <div className="quest-panel-text">
          {monthTheme || 'This Month'}: How has this energy shown up for you this week?
        </div>

        <div className="quest-panel-journal">
          <div className="quest-panel-prompt">
            Link to one of the month's objectives (optional):
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {objectives.map((obj, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="objective"
                  value={idx}
                  checked={objectiveIdx === idx}
                  onChange={() => setObjectiveIdx(idx)}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-mid)' }}>① {idx + 1}</span>
              </label>
            ))}
          </div>

          <textarea
            className="quest-panel-input"
            placeholder="What's alive in this month's theme for you right now?"
            value={text}
            onChange={e => { setText(e.target.value); setError('') }}
            rows={4}
          />
          {error && <div className="quest-panel-error" role="alert">{error}</div>}

          <div className="quest-panel-foot">
            <button className="quest-panel-submit" onClick={handleSubmit}>
              ▶ SUBMIT CHECK-IN
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
