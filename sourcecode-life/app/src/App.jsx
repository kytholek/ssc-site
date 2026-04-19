import { useEffect } from 'react'
import './App.css'
import { AppProvider, useAppState, useAppDispatch } from './context/AppContext'
import { GameProvider } from './state/GameContext'
import { useAuthBridge } from './hooks/useAuthBridge'
import { loadSavedTheme } from './lib/theme'
import { loadLocalSaved } from './lib/storage'
import { computeAll } from './lib/numerology'
import BootSplash from './components/BootSplash'
import AuthOverlay from './components/auth/AuthOverlay'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import CharCreateOverlay from './components/charCreate/CharCreateOverlay'
import PremiumReveal from './components/onboarding/PremiumReveal'
import AvatarCreator     from './components/charCreate/AvatarCreator'
import AppShell from './components/shell/AppShell'

// ── Root component — registered bridges + screen router ──────────────────────
function AppRoot() {
  const { screen, playerData } = useAppState()
  const dispatch   = useAppDispatch()

  // Keep questEngine's window global in sync with playerData
  useEffect(() => {
    window.__scl_playerData__ = playerData || undefined
  }, [playerData])

  // Register all NativeAuth_* window callbacks → AppContext dispatch
  useAuthBridge()

  // Load theme on mount
  useEffect(() => { loadSavedTheme() }, [])

  // Handle Stripe purchase redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('scl_purchase') === 'true') {
      const productId = params.get('product_id')
      window.history.replaceState({}, '', window.location.pathname)
      window.NativePurchase_onPurchaseResult?.(true, productId, '')
    }
  }, [])

  // Boot splash complete: parse invite link, then check session
  function handleBootComplete() {
    // Parse ?ref=UID invite link — store for post-login ally auto-request
    try {
      const params = new URLSearchParams(window.location.search)
      const refUid = params.get('ref')
      if (refUid) {
        localStorage.setItem('scl_pending_inviter', refUid)
        window.NativeAuth_onInviteDetected?.(refUid)
        // Clean URL without reload
        const clean = window.location.pathname + window.location.hash
        window.history.replaceState(null, '', clean)
      }
    } catch { /* intentional */ }

    if (typeof window.NativeAuth !== 'undefined') {
      window.NativeAuth.checkSession()
      // NativeAuth_onSessionResult will dispatch SET_USER + loadPlayer, or leave at 'auth'
      dispatch({ type: 'SET_SCREEN', payload: 'auth' })
    } else {
      // No native bridge — try offline cached data
      const saved = loadLocalSaved()
      if (saved) {
        const { partialPlayer: p } = saved
        try {
          const playerData = computeAll(p.m, p.d, p.y, p.name)
          dispatch({ type: 'LAUNCH_APP', payload: { user: saved.user, playerData } })
        } catch {
          dispatch({ type: 'SET_SCREEN', payload: 'auth' })
        }
      } else {
        dispatch({ type: 'SET_SCREEN', payload: 'auth' })
      }
    }
  }

  return (
    <div className="relative min-h-svh">
      {screen === 'boot'       && <BootSplash onComplete={handleBootComplete} />}
      {screen === 'auth'       && <AuthOverlay />}
      {screen === 'onboarding' && <OnboardingFlow onComplete={() => dispatch({ type: 'SET_SCREEN', payload: 'charCreate' })} />}
      {screen === 'charCreate'   && <CharCreateOverlay />}
      {screen === 'premiumReveal' && <PremiumReveal onComplete={() => dispatch({ type: 'SET_SCREEN', payload: 'avatarCreate' })} />}
      {screen === 'avatarCreate' && <AvatarCreator />}
      {screen === 'app'        && <AppShell />}
    </div>
  )
}

// ── Entry: GameProvider wraps AppProvider so game state is available everywhere ─
export default function App() {
  return (
    <GameProvider>
      <AppProvider>
        <AppRoot />
      </AppProvider>
    </GameProvider>
  )
}

