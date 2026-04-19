/**
 * AuthOverlay
 *
 * Renders the full-screen authentication wall.
 * Three panels: Login, Register, ForgotPassword.
 * Invite banner floats at the top when an invite was detected.
 *
 * Loading state lives in AppContext.authLoading so native bridge callbacks
 * can clear spinners from outside the component tree.
 */
import { useState } from 'react'
import { useAppState, useAppDispatch } from '../../context/AppContext'
import NumerologyRain from '../effects/NumerologyRain'

const TESTER_EMAIL = 'tester@sourcecode.life'

function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

function setLoadingField(dispatch, field, value) {
  dispatch({ type: 'SET_AUTH_LOADING', payload: { field, value } })
}

// ── Invite Banner ─────────────────────────────────────────────────────────────
function InviteBanner({ name, onDismiss }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-9999 flex items-center gap-3 px-4 py-3"
         style={{ background: 'var(--color-rpg-surface)', borderBottom: '2px solid var(--color-rpg-gold)', fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-rpg-gold)', lineHeight: '1.7' }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>✦</span>
      <span style={{ flex: 1 }}>
        <strong>{name}</strong> invited you.<br />
        Complete your character to connect as allies.
      </span>
      <button onClick={onDismiss} className="bg-transparent border-none text-lg cursor-pointer leading-none px-1" style={{ color: 'var(--color-rpg-muted)' }}>✕</button>
    </div>
  )
}

// ── Login Panel ───────────────────────────────────────────────────────────────
function LoginPanel({ onForgot }) {
  const dispatch = useAppDispatch()
  const { authErrors, authLoading } = useAppState()
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const loading = !!authLoading.loginLoading

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'CLEAR_AUTH_ERRORS' })
    const err = (msg) => dispatch({ type: 'AUTH_ERROR', payload: { field: 'loginError', message: msg } })

    if (!email || !pass)       return err('⚠ Please fill in all fields.')
    if (!validateEmail(email)) return err('⚠ Enter a valid email address.')
    if (pass.length < 6)       return err('⚠ Password must be at least 6 characters.')

    // Tester shortcut — bypass NativeAuth, go straight to character creation
    if (email === TESTER_EMAIL) {
      dispatch({ type: 'SET_USER', payload: { email: TESTER_EMAIL } })
      dispatch({ type: 'SET_SCREEN', payload: 'charCreate' })
      return
    }

    if (typeof window.NativeAuth === 'undefined') {
      return err('⚠ No Android bridge. Use ' + TESTER_EMAIL + ' to explore in browser.')
    }

    setLoadingField(dispatch, 'loginLoading', true)
    window.NativeAuth.login(email, pass)
  }

  return (
    <form className="auth-form-panel flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="auth-input"
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        className="auth-input"
        autoComplete="current-password"
        required
      />
      {authErrors.loginError && <p className="auth-error">{authErrors.loginError}</p>}
      {loading && <p className="auth-loading">Logging in…</p>}
      <button type="submit" className="auth-btn" disabled={loading}>ENTER THE REALM</button>
      <button type="button" className="auth-link" onClick={onForgot}>Forgot password?</button>
    </form>
  )
}

// ── Register Panel ────────────────────────────────────────────────────────────
function RegisterPanel() {
  const dispatch = useAppDispatch()
  const { authErrors, authLoading } = useAppState()
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const loading = !!authLoading.regLoading

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'CLEAR_AUTH_ERRORS' })
    const err = (msg) => dispatch({ type: 'AUTH_ERROR', payload: { field: 'regError', message: msg } })

    if (!email || !pass)       return err('⚠ Please fill in all fields.')
    if (!validateEmail(email)) return err('⚠ Enter a valid email address.')
    if (pass.length < 6)       return err('⚠ Password must be at least 6 characters.')

    if (typeof window.NativeAuth === 'undefined') {
      return err('⚠ No Android bridge. Use ' + TESTER_EMAIL + ' on the Login tab to explore in browser.')
    }

    setLoadingField(dispatch, 'regLoading', true)
    sessionStorage.setItem('scl_new_user', '1')
    window.NativeAuth.register(email, pass)
  }

  return (
    <form className="auth-form-panel flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="auth-input"
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={pass}
        onChange={e => setPass(e.target.value)}
        className="auth-input"
        autoComplete="new-password"
        required
      />
      {authErrors.regError && <p className="auth-error">{authErrors.regError}</p>}
      {loading && <p className="auth-loading">Creating account…</p>}
      <button type="submit" className="auth-btn" disabled={loading}>CREATE ACCOUNT</button>
    </form>
  )
}

// ── Forgot Password Panel ─────────────────────────────────────────────────────
function ForgotPanel({ onBack }) {
  const dispatch = useAppDispatch()
  const { authErrors, authLoading } = useAppState()
  const [email, setEmail] = useState('')
  const loading = !!authLoading.forgotLoading

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'CLEAR_AUTH_ERRORS' })
    const err = (msg) => dispatch({ type: 'AUTH_ERROR', payload: { field: 'forgotError', message: msg } })

    if (!email)                return err('⚠ Please enter your email address.')
    if (!validateEmail(email)) return err('⚠ Enter a valid email address.')

    if (typeof window.NativeAuth === 'undefined' || !window.NativeAuth.sendPasswordReset) {
      return err('⚠ Password reset unavailable outside the Android app.')
    }

    setLoadingField(dispatch, 'forgotLoading', true)
    window.NativeAuth.sendPasswordReset(email)
  }

  return (
    <form className="auth-form-panel flex flex-col gap-4" onSubmit={handleSubmit}>
      <p className="auth-label">Enter your email to receive a reset link.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="auth-input"
        autoComplete="email"
        required
      />
      {authErrors.forgotError   && <p className="auth-error">{authErrors.forgotError}</p>}
      {authErrors.forgotSuccess && <p className="auth-success">{authErrors.forgotSuccess}</p>}
      {loading && <p className="auth-loading">Sending…</p>}
      <button type="submit" className="auth-btn" disabled={loading}>SEND RESET LINK</button>
      <button type="button" className="auth-link" onClick={onBack}>← Back to login</button>
    </form>
  )
}

// ── AuthOverlay (root) ────────────────────────────────────────────────────────
export default function AuthOverlay() {
  const { inviteBannerName } = useAppState()
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState('login') // 'login' | 'register' | 'forgot'
  function switchTab(newTab) {
    dispatch({ type: 'CLEAR_AUTH_ERRORS' })
    setTab(newTab)
  }
  return (
    <>
      {inviteBannerName && (
        <InviteBanner
          name={inviteBannerName}
          onDismiss={() => dispatch({ type: 'DISMISS_INVITE_BANNER' })}
        />
      )}

      <div className="auth-overlay">
        <NumerologyRain />
        <div className="auth-content">
          {/* Logo / title */}
          <h1 className="auth-hero-title">SOURCE CODE: LIFE</h1>
          <p className="auth-hero-subtitle">Decode Your Simulation and Find Direction in Life</p>

          {/* Glass card */}
          <div className="auth-glass-card">
            {/* Tab bar — hidden when on forgot panel */}
            {tab !== 'forgot' && (
              <div className="auth-tabs" role="tablist">
                <button
                  role="tab"
                  aria-selected={tab === 'login'}
                  className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => { dispatch({ type: 'CLEAR_AUTH_ERRORS' }); setTab('login') }}
                >LOGIN</button>
                <button
                  role="tab"
                  aria-selected={tab === 'register'}
                  className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                  onClick={() => { dispatch({ type: 'CLEAR_AUTH_ERRORS' }); setTab('register') }}
                >REGISTER</button>
              </div>
            )}

            {/* Active panel */}
            <div className="auth-body">
              {tab === 'login'    && <LoginPanel    onForgot={() => { dispatch({ type: 'CLEAR_AUTH_ERRORS' }); setTab('forgot') }} />}
              {tab === 'register' && <RegisterPanel />}
              {tab === 'forgot'   && <ForgotPanel   onBack={() => { dispatch({ type: 'CLEAR_AUTH_ERRORS' }); setTab('login') }} />}
            </div>
          </div>
        </div>

        <a className="auth-footer-link" href="https://simulationsourcecode.com" target="_blank" rel="noopener noreferrer">
          simulationsourcecode.com
        </a>
      </div>
    </>
  )
}
