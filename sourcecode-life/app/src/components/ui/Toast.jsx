import { useGameState } from '../../state/GameContext'

export default function Toast() {
  const { ui } = useGameState()
  if (!ui?.toast) return null

  const { msg, color } = ui.toast
  return (
    <div className="toast-display" style={{ color: color || 'var(--teal)' }}>
      {msg}
    </div>
  )
}
