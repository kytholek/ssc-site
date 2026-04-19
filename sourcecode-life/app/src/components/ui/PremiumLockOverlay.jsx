import { useAppDispatch } from '../../context/AppContext'
import { useGameState } from '../../state/GameContext'

export default function PremiumLockOverlay({ feature }) {
  const dispatch = useAppDispatch()
  const { user } = useGameState()

  if (user.isPremium) return null

  function handleUnlock() {
    dispatch({ type: 'OPEN_PREMIUM_MODAL' })
  }

  return (
    <div className="premium-lock-overlay">
      <div className="premium-lock-content">
        <div className="premium-lock-icon">✦</div>
        <h3 className="premium-lock-title">PREMIUM FEATURE</h3>
        <p className="premium-lock-feature">{feature}</p>
        <button className="premium-lock-btn" onClick={handleUnlock}>
          UNLOCK PREMIUM
        </button>
      </div>
    </div>
  )
}
