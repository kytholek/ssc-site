/**
 * SettingsTab
 *
 * Shows character frequencies, account controls (sign out, reset, delete,
 * change password), theme picker, and notification settings.
 */
import { useState } from 'react'
import { useAppState, useAppDispatch } from '../../context/AppContext'
import { useGameState } from '../../state/GameContext'
import { fmt } from '../../lib/numerology'
import { clearLocalSession } from '../../lib/storage'
import { setTheme } from '../../lib/theme'
import GiftCodeRedeemer from '../ui/GiftCodeRedeemer'
import { createEarnedGiftCode, generateCode } from '../../lib/giftCodes'

// ── Notification prefs ────────────────────────────────────────────────────────
const LS_NOTIF_PREFS = 'scl_notif_prefs'

const DEFAULT_NOTIF_PREFS = {
  dailyReminder:  true,  // morning reminder to check daily quests
  questOnMap:     true,  // when a new quest is placed on the map
  multiDayReminder: true, // daily nudge to check in on active multi-day quests
}

function loadNotifPrefs() {
  try {
    const raw = localStorage.getItem(LS_NOTIF_PREFS)
    return raw ? { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_NOTIF_PREFS }
  } catch { return { ...DEFAULT_NOTIF_PREFS } }
}

function saveNotifPrefs(prefs) {
  try { localStorage.setItem(LS_NOTIF_PREFS, JSON.stringify(prefs)) } catch { /* quota */ }
  // Broadcast so numerologyQuests.js can read up-to-date prefs
  window.dispatchEvent(new CustomEvent('scl:notif_prefs_updated', { detail: prefs }))
}

const NOTIF_ITEMS = [
  {
    key: 'dailyReminder',
    label: 'Daily Quest Reminder',
    desc: 'Morning notification when your daily quests are ready',
  },
  {
    key: 'questOnMap',
    label: 'Quest Placed on Map',
    desc: 'Alert when a new quest marker appears on your map',
  },
  {
    key: 'multiDayReminder',
    label: 'Multi-Day Check-In Reminder',
    desc: 'Daily nudge when you have an active commitment waiting for check-in',
  },
]

function NotificationsSection() {
  const [prefs, setPrefs] = useState(() => loadNotifPrefs())
  const [permState, setPermState] = useState(
    () => { try { return 'Notification' in window ? Notification.permission : 'unsupported' } catch { return 'unsupported' } }
  )

  async function handleToggle(key) {
    const next = { ...prefs, [key]: !prefs[key] }

    // If turning on any notif and permission not yet granted, request it
    if (next[key] && permState === 'default') {
      try {
        const result = await Notification.requestPermission()
        setPermState(result)
        if (result === 'denied') {
          // Can't grant — don't flip the toggle
          return
        }
      } catch { /* browser may not support promise form */ }
    }

    setPrefs(next)
    saveNotifPrefs(next)
  }

  const anyOn = Object.values(prefs).some(Boolean)

  return (
    <section className="settings-section">
      <h3 className="settings-section-title">NOTIFICATIONS</h3>

      {permState === 'denied' && (
        <p className="notif-perm-warning">
          ⚠ Notifications are blocked in your browser. Enable them in site settings to use these toggles.
        </p>
      )}
      {permState === 'unsupported' && (
        <p className="notif-perm-warning">Notifications are not supported in this browser.</p>
      )}

      {NOTIF_ITEMS.map(item => {
        const on = prefs[item.key]
        const disabled = permState === 'denied' || permState === 'unsupported'
        return (
          <div key={item.key} className="notif-toggle-row">
            <div className="notif-toggle-info">
              <div className="notif-toggle-label">{item.label}</div>
              <div className="notif-toggle-desc">{item.desc}</div>
            </div>
            <button
              className={`notif-toggle-btn${on ? ' on' : ''}${disabled ? ' disabled' : ''}`}
              onClick={() => !disabled && handleToggle(item.key)}
              aria-pressed={on}
              aria-label={item.label}
              disabled={disabled}
            >
              <span className="notif-toggle-track">
                <span className="notif-toggle-thumb" />
              </span>
            </button>
          </div>
        )
      })}

      {anyOn && permState === 'granted' && (
        <p className="notif-active-note">◈ Notifications active</p>
      )}
    </section>
  )
}

const THEMES = [
  { id: 'scifi',   label: '◈ SCI-FI'  },
  { id: 'fantasy', label: '⚔ FANTASY' },
  { id: 'unicorn', label: '✦ UNICORN' },
  { id: 'diablo',  label: '⛧ DIABLO'  },
]

function FrequencyRow({ label, obj, color }) {
  if (!obj) return null
  return (
    <div className="setting-freq-row">
      <span className="setting-freq-label">{label}</span>
      <span className="setting-freq-val" style={{ color }}>{fmt(obj.root, obj.compound)}</span>
    </div>
  )
}

// ── Change Password panel ─────────────────────────────────────────────────────
function ChangePasswordPanel({ onClose }) {
  const { authErrors } = useAppState()
  const dispatch = useAppDispatch()
  const [cur,    setCur]    = useState('')
  const [newPw,  setNewPw]  = useState('')
  const [conf,   setConf]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'CLEAR_AUTH_ERRORS' })
    const err = (msg) => dispatch({ type: 'AUTH_ERROR', payload: { field: 'cpError', message: msg } })
    if (!cur || !newPw || !conf)  return err('⚠ Please fill in all fields.')
    if (newPw.length < 6)         return err('⚠ New password must be at least 6 characters.')
    if (newPw !== conf)            return err('⚠ New passwords do not match.')
    if (newPw === cur)             return err('⚠ New password must be different from current.')
    setLoading(true)
    if (typeof window.NativeAuth !== 'undefined' && window.NativeAuth.changePassword) {
      window.NativeAuth.changePassword(cur, newPw)
    } else {
      setTimeout(() => {
        setLoading(false)
        dispatch({ type: 'AUTH_SUCCESS', payload: { field: 'cpSuccess', message: '✓ Password updated.' } })
      }, 600)
    }
  }

  return (
    <form className="settings-panel flex flex-col gap-3" onSubmit={handleSubmit}>
      <input type="password" placeholder="Current password" value={cur} onChange={e => setCur(e.target.value)} className="auth-input" required />
      <input type="password" placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} className="auth-input" required />
      <input type="password" placeholder="Confirm new password" value={conf} onChange={e => setConf(e.target.value)} className="auth-input" required />
      {authErrors.cpError   && <p className="auth-error">{authErrors.cpError}</p>}
      {authErrors.cpSuccess && <p className="auth-success">{authErrors.cpSuccess}</p>}
      {loading && <p className="auth-loading">Updating…</p>}
      <div className="flex gap-2">
        <button type="submit" className="auth-btn" disabled={loading}>UPDATE</button>
        <button type="button" className="auth-btn" style={{ background: 'transparent', border: '1px solid #2a2d3e', color: '#6b6882' }} onClick={onClose}>CANCEL</button>
      </div>
    </form>
  )
}

// ── Delete Account panel ──────────────────────────────────────────────────────
function DeleteAccountPanel({ onClose }) {
  const dispatch = useAppDispatch()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleDelete() {
    setError('')
    if (!pw) { setError('⚠ Enter your password to confirm deletion.'); return }
    if (!confirm('This will permanently delete your account and all data. There is no undo. Continue?')) return
    setLoading(true)
    if (typeof window.NativeAuth !== 'undefined') {
      window.NativeAuth.deleteAccount(pw)
    } else {
      setTimeout(() => {
        setLoading(false)
        clearLocalSession()
        dispatch({ type: 'SIGN_OUT' })
      }, 1000)
    }
  }

  return (
    <div className="settings-panel flex flex-col gap-3">
      <p className="auth-error" style={{ marginBottom: 4 }}>⚠ This action cannot be undone.</p>
      <input type="password" placeholder="Confirm your password" value={pw} onChange={e => setPw(e.target.value)} className="auth-input" />
      {error && <p className="auth-error">{error}</p>}
      {loading && <p className="auth-loading">Deleting account…</p>}
      <div className="flex gap-2">
        <button className="auth-btn" style={{ background: '#7f1d1d', color: '#fca5a5' }} onClick={handleDelete} disabled={loading}>DELETE ACCOUNT</button>
        <button className="auth-btn" style={{ background: 'transparent', border: '1px solid #2a2d3e', color: '#6b6882' }} onClick={onClose}>CANCEL</button>
      </div>
    </div>
  )
}

// ── SettingsTab root ──────────────────────────────────────────────────────────
export default function SettingsTab() {
  const { playerData, currentUser } = useAppState()
  const { user } = useGameState()
  const dispatch = useAppDispatch()
  const [showCpPanel, setShowCpPanel] = useState(false)
  const [showDeletePanel, setShowDeletePanel] = useState(false)
  const [activeTheme, setActiveTheme] = useState(
    (() => { try { return localStorage.getItem('scl_theme') || 'fantasy' } catch { return 'fantasy' } })()
  )
  const savedAlias = (() => { try { return localStorage.getItem('scl_char_alias') || '' } catch { return '' } })()
  const [giftTokens, setGiftTokens] = useState(parseInt(localStorage.getItem('scl_gift_tokens') || '0'))
  const [selectedGiftDuration, setSelectedGiftDuration] = useState(null)
  const [generatedCode, setGeneratedCode] = useState(null)
  const [giftLoading, setGiftLoading] = useState(false)

  function handleSignOut() {
    clearLocalSession()
    if (typeof window.NativeAuth !== 'undefined') window.NativeAuth.signOut()
    dispatch({ type: 'SIGN_OUT' })
  }

  function handleTheme(id) {
    setActiveTheme(id)
    setTheme(id)
  }

  async function handleCreateGiftCode(duration) {
    setGiftLoading(true)
    const typeMap = { 3: 'premium_3d', 7: 'premium_7d' }
    const result = await createEarnedGiftCode(currentUser.uid, typeMap[duration])
    if (result.ok) {
      setGeneratedCode(result.code)
      setGiftTokens(giftTokens - 1)
      localStorage.setItem('scl_gift_tokens', String(giftTokens - 1))
      setSelectedGiftDuration(null)
    }
    setGiftLoading(false)
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(generatedCode)
  }

  return (
    <div className="tab-panel-content settings-tab">

      {/* ── Theme Picker — moved to top with premium glass box ── */}
      <div className="theme-picker-header">
        <div className="theme-picker-box">
          <span className="theme-picker-label">SELECT THEME</span>
          <div className="theme-picker-buttons">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`theme-picker-btn${activeTheme === t.id ? ' active' : ''}`}
                data-theme-btn={t.id}
                onClick={() => handleTheme(t.id)}
              >
                <span className="theme-picker-btn-icon">{t.label.split(' ')[0]}</span>
                <span className="theme-picker-btn-label">{t.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Identity ── */}
      {playerData && (
        <section className="settings-section">
          <h3 className="settings-section-title">CHARACTER</h3>
          <div className="setting-row">
            <span className="setting-label">Name</span>
            <span className="setting-val">{playerData.name}</span>
          </div>
          <div className="setting-row">
            <span className="setting-label">Date of Birth</span>
            <span className="setting-val">{playerData.m}/{playerData.d}/{playerData.y}</span>
          </div>
<div className="setting-row">
            <span className="setting-label">Email</span>
            <span className="setting-val setting-val-dim">{currentUser?.email || '—'}</span>
          </div>
          <div className="setting-row">
            <span className="setting-label">Display Alias</span>
            <span className="setting-val">{savedAlias || playerData?.name || '—'}</span>
          </div>
        </section>
      )}

      {/* ── Frequencies ── */}
      {playerData && (
        <section className="settings-section">
          <h3 className="settings-section-title">FREQUENCIES</h3>
          <FrequencyRow label="Life Path"    obj={playerData.lp} color="var(--color-rpg-purple-glow)" />
          <FrequencyRow label="Expression"   obj={playerData.ex} color="#4ade80" />
          <FrequencyRow label="Life Calling" obj={playerData.cl} color="var(--color-rpg-gold)" />
          <FrequencyRow label="Soul Urge"    obj={playerData.so} color="#f472b6" />
          <FrequencyRow label="Outer"        obj={playerData.ou} color="#94a3b8" />
          <FrequencyRow label="Achievement"  obj={playerData.ac} color="#fb923c" />
          <FrequencyRow label="Theme"        obj={playerData.th} color="#7dd3fc" />
        </section>
      )}

      {/* ── Notifications ── */}
      <NotificationsSection />

      {/* ── Redeem Premium Code ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">REDEEM PREMIUM CODE</h3>
        {currentUser && <GiftCodeRedeemer uid={currentUser.uid} onSuccess={() => setGiftTokens(parseInt(localStorage.getItem('scl_gift_tokens') || '0'))} />}
      </section>

      {/* ── Premium ── */}
      {!user.isPremium && (
        <section className="settings-section">
          <h3 className="settings-section-title">PREMIUM</h3>
          <button className="settings-btn" onClick={() => dispatch({ type: 'OPEN_PREMIUM_MODAL' })}>
            ✦ UPGRADE TO PREMIUM
          </button>
        </section>
      )}

      {/* ── Account ── */}
      <section className="settings-section">
        <h3 className="settings-section-title">ACCOUNT</h3>

        {!showCpPanel && !showDeletePanel && (
          <div className="flex flex-col gap-2 mt-2">
            <button className="settings-btn" onClick={() => { setShowCpPanel(true); setShowDeletePanel(false) }}>▶ CHANGE PASSWORD</button>
            <button className="settings-btn" onClick={handleSignOut}>⏏ SIGN OUT</button>
            <button className="settings-btn settings-btn-danger" onClick={() => { setShowDeletePanel(true); setShowCpPanel(false) }}>✕ DELETE ACCOUNT</button>
          </div>
        )}

        {showCpPanel     && <ChangePasswordPanel onClose={() => setShowCpPanel(false)} />}
        {showDeletePanel && <DeleteAccountPanel  onClose={() => setShowDeletePanel(false)} />}
      </section>

      {/* ── Gift Premium ── */}
      {giftTokens > 0 && (
        <section className="settings-section">
          <h3 className="settings-section-title">🎁 GIFT PREMIUM</h3>
          <div className="gift-sender">
            <div className="gift-sender-token-count">
              You have <strong>{giftTokens}</strong> gift token{giftTokens !== 1 ? 's' : ''}
            </div>

            {!generatedCode && (
              <div className="gift-sender-btn-row">
                <button
                  className="gift-sender-btn"
                  onClick={() => handleCreateGiftCode(3)}
                  disabled={giftLoading}
                >
                  {giftLoading ? 'GENERATING…' : '3 DAYS'}
                </button>
                <button
                  className="gift-sender-btn"
                  onClick={() => handleCreateGiftCode(7)}
                  disabled={giftLoading}
                >
                  {giftLoading ? 'GENERATING…' : '7 DAYS'}
                </button>
              </div>
            )}

            {generatedCode && (
              <div className="gift-sender-code-display">
                <div className="gift-sender-code">{generatedCode}</div>
                <button className="gift-sender-copy-btn" onClick={handleCopyCode}>
                  📋 COPY TO CLIPBOARD
                </button>
              </div>
            )}

            {giftLoading && <p className="auth-loading">Creating gift code…</p>}
          </div>
        </section>
      )}

    </div>
  )
}
