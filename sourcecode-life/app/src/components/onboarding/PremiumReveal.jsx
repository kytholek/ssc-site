import { useAppState, useAppDispatch } from '../../context/AppContext'
import NumerologyRain from '../effects/NumerologyRain'

const FEATURES = [
  { glyph: '📜', title: 'Full Blueprint', desc: 'Complete shadow + integration reading for every number in your chart' },
  { glyph: '🌀', title: 'Time Spiral: Past & Future', desc: 'Navigate your previous and upcoming cycle themes, not just today' },
  { glyph: '⚔', title: 'Ally Badge', desc: 'A distinct emblem on your Character Card — visible to allies in the Realm' },
  { glyph: '🔮', title: 'Master Number Quests', desc: 'Rare 11, 22, 33+ archetype paths if your frequencies carry master energy' },
  { glyph: '📊', title: '90-Day Quest Archive', desc: 'Full XP trends, streak history, and pattern insights' },
  { glyph: '☁', title: 'Cloud Gear Sync', desc: 'Your character and medals synced — accessible across devices' },
]

export default function PremiumReveal({ onComplete }) {
  const dispatch = useAppDispatch()
  const { playerData } = useAppState()

  function handleUnlock() {
    dispatch({ type: 'OPEN_PREMIUM_MODAL' })
  }

  function handleNavigate() {
    if (onComplete) {
      onComplete()
    } else {
      dispatch({ type: 'SET_SCREEN', payload: 'avatarCreate' })
    }
  }

  const lpRoot = playerData?.lp?.root ?? '—'
  const clRoot = playerData?.cl?.root ?? '—'
  const exRoot = playerData?.ex?.root ?? '—'

  return (
    <div className="pr-overlay">
      <NumerologyRain />
      <div className="pr-content">
        <div className="pr-card">
          <div className="pr-header">
            <div className="pr-header-icon">✦</div>
            <h2 className="pr-header-title">YOUR BLUEPRINT IS READY</h2>
            <div className="pr-numbers-row">
              <div className="pr-number-pill">Life Path · {lpRoot}</div>
              <div className="pr-number-pill">Calling · {clRoot}</div>
              <div className="pr-number-pill">Expression · {exRoot}</div>
            </div>
          </div>

          <p className="pr-subtext">
            The free tier gives you your core quest engine.<br />
            Premium unlocks the full decode.
          </p>

          <div className="pr-feature-list">
            {FEATURES.map((f, i) => (
              <div key={i} className="pr-feature-card">
                <div className="pr-feature-glyph">{f.glyph}</div>
                <div className="pr-feature-text">
                  <div className="pr-feature-title">{f.title}</div>
                  <div className="pr-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pr-cta-row">
            <button className="ob-cta" onClick={handleUnlock}>
              ✦ UNLOCK PREMIUM
            </button>
            <button className="pr-link" onClick={handleNavigate}>
              CONTINUE FREE →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
