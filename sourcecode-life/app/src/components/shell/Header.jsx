/**
 * Header
 *
 * Sticky top bar showing character name, DOB, and a sign-out button.
 * The frequency-spike banner sits below it when active.
 */
import { useState, useMemo } from 'react'
import { useAppState, useAppDispatch } from '../../context/AppContext'
import { useGameDispatch } from '../../state/GameContext'
import { ACTIONS } from '../../state/actions'
import { clearLocalSession } from '../../lib/storage'

// Reduce to single digit or master number
function reduceUD(n) {
  const masters = new Set([11, 22, 33])
  while (n > 9 && !masters.has(n)) {
    n = String(n).split('').reduce((a, d) => a + +d, 0)
  }
  return n
}

function calcUniversalDay() {
  const now = new Date()
  const raw = now.getMonth() + 1 + now.getDate() + now.getFullYear()
  return reduceUD(String(raw).split('').map(Number).reduce((a, b) => a + b, 0))
}

const CORE_LABELS = { lp:'Life Path', ex:'Expression', cl:'Life Calling', so:'Soul', ou:'Outer', ac:'Achievement', th:'Theme' }

export default function Header({ onTabChange }) {
  const { playerData } = useAppState()
  const dispatch = useAppDispatch()
  const gameDispatch = useGameDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const [spikeDismissed, setSpikeDismissed] = useState(false)

  // Alias overrides character name if saved
  const savedAlias = (() => { try { return localStorage.getItem('scl_char_alias') || '' } catch { return '' } })()
  const displayName = (savedAlias || playerData?.name || '').toUpperCase()
  const m = playerData?.m, d = playerData?.d, y = playerData?.y
  const dobText = (m && d && y)
    ? String(m).padStart(2, '0') + ' / ' + String(d).padStart(2, '0') + ' / ' + y
    : ''

  // Frequency spike detection — derived directly, no side effect needed
  const spikeText = useMemo(() => {
    if (!playerData) return ''
    const ud = calcUniversalDay()
    const keys = ['lp','ex','cl','so','ou','ac','th']
    const matches = keys.filter(k => playerData[k]?.root === ud).map(k => CORE_LABELS[k])
    return matches.length ? 'Universal Day ' + ud + ' aligns with your ' + matches.join(' & ') : ''
  }, [playerData])

  function handleSignOut() {
    setMenuOpen(false)
    clearLocalSession()
    if (typeof window.NativeAuth !== 'undefined') window.NativeAuth.signOut()
    dispatch({ type: 'SIGN_OUT' })
  }

  function handleResetChar() {
    if (!confirm('Reset your character? All progress, XP, levels, and quest completions will be cleared.')) return
    setMenuOpen(false)
    if (typeof window.QuestEngine_reset === 'function') window.QuestEngine_reset()
    gameDispatch({ type: ACTIONS.RESET_CHAR })
    dispatch({ type: 'RESET_CHAR' })
  }

  return (
    <div className="app-header-wrap">
      <header className="app-header">
        {/* Name + DOB — display only; editing is on Char Card */}
        <div className="app-header-identity">
          <>
            <div className="app-header-name rpg-glow-gold">{displayName || 'SET NAME'}</div>
            {dobText && <div className="app-header-dob">{dobText}</div>}
          </>
        </div>

        {/* Menu button */}
        <button className="app-header-menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          ☰
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="app-header-menu">
            <button className="app-menu-item" onClick={handleResetChar}>↺ Reset Character</button>
            <button className="app-menu-item app-menu-item-danger" onClick={handleSignOut}>⏥ Sign Out</button>
            <button className="app-menu-item" onClick={() => { setMenuOpen(false); onTabChange && onTabChange('profile') }}>⚙ Profile</button>
            <a href="/" className="app-menu-item">← Back to Site</a>
          </div>
        )}
      </header>

      {/* Frequency spike banner */}
      {spikeText && !spikeDismissed && (
        <div className="freq-spike-banner">
          <span className="freq-spike-icon">⚡</span>
          <span className="freq-spike-text">{spikeText}</span>
          <button className="freq-spike-close" onClick={() => setSpikeDismissed(true)}>✕</button>
        </div>
      )}
    </div>
  )
}
