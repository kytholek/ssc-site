/**
 * SOURCE CODE: LIFE — app.js
 * All UI logic, auth, navigation, journal, charts, quests.
 * Depends on: numerology.js, data.js
 */

/* ================================================
   STATE
   ================================================ */
let currentUser = null;
let playerData  = null;

const LS_USER   = 'scl_user';
const LS_PLAYER = 'scl_player';

// Tester email — logs straight into character creation without NativeAuth.
const TESTER_EMAIL = 'tester@sourcecode.life';

/* ================================================
   LOCAL STORAGE PERSISTENCE (offline / dev fallback)
   ================================================ */
function saveLocalUser(email) {
  try { localStorage.setItem(LS_USER, JSON.stringify({ email })); } catch(e) {}
}
function saveLocalPlayer(data) {
  try { localStorage.setItem(LS_PLAYER, JSON.stringify({
    name: data.name, m: data.m, d: data.d, y: data.y,
    lifePath:   data.lp ? data.lp.root   : undefined,
    soulUrge:   data.so ? data.so.root   : undefined,
    expression: data.ex ? data.ex.root   : undefined
  })); } catch(e) {}
}
function loadLocalSaved() {
  try {
    const u = localStorage.getItem(LS_USER);
    const p = localStorage.getItem(LS_PLAYER);
    if (u && p) {
      const uo = JSON.parse(u);
      const po = JSON.parse(p);
      currentUser = uo;
      playerData  = computeAll(po.m, po.d, po.y, po.name);
      return true;
    }
  } catch(e) {}
  return false;
}

/* ================================================
   NATIVE BRIDGE CALLBACKS
   Called by Kotlin via webView.evaluateJavascript(...)
   ================================================ */

function NativeAuth_onLoginResult(success, uid, errorMsg) {
  setLoading('loginLoading', false);
  if (success) {
    currentUser = { uid: uid };
    NativeAuth.loadPlayer();
  } else {
    showAuthError('loginError', '⚠ ' + friendlyError(errorMsg));
  }
}

function NativeAuth_onRegisterResult(success, uid, errorMsg) {
  setLoading('regLoading', false);
  if (success) {
    currentUser = { uid: uid };
    document.getElementById('authOverlay').classList.add('hidden');
    document.getElementById('charCreateOverlay').classList.remove('hidden');
  } else {
    showAuthError('regError', '⚠ ' + friendlyError(errorMsg));
  }
}

function NativeAuth_onSavePlayerResult(success, errorMsg) {
  if (window._saveTimeout) { clearTimeout(window._saveTimeout); window._saveTimeout = null; }
  setLoading('charLoading', false);
  if (success) {
    saveLocalPlayer(playerData);
    // If user arrived via an invite link, auto-send ally request to the inviter
    if (window._pendingInviterUid) {
      const refUid = window._pendingInviterUid;
      window._pendingInviterUid = null; // Clear — fires once only
      if (typeof NativeAllies !== 'undefined') {
        NativeAllies.sendRequest(refUid);
      }
    }
    NativeAuth.loadPlayer();
  } else {
    showAuthError('charError', '⚠ ' + (errorMsg || 'Failed to save. Check your connection.'));
  }
}

/**
 * Called by Kotlin when a deep link or Play Install Referrer carries ref=UID.
 * Stores the inviter UID and shows a welcome banner on the auth/registration screen.
 */
function NativeAuth_onInviteDetected(inviterUid) {
  if (!inviterUid) return;
  window._pendingInviterUid = inviterUid;
  // Try to fetch inviter's name for personalised banner
  if (typeof NativeAllies !== 'undefined') {
    NativeAllies.getPlayerName(inviterUid);
  } else {
    _renderInviteBanner('An ally');
  }
}

/** Kotlin callback for getPlayerName — delivers the inviter's display name */
function NativeAllies_onPlayerName(name) {
  _renderInviteBanner(name || 'An ally');
}

function _renderInviteBanner(inviterName) {
  const existing = document.getElementById('inviteBanner');
  if (existing) existing.remove();
  const banner = document.createElement('div');
  banner.id = 'inviteBanner';
  banner.style.cssText = [
    'position:fixed;top:0;left:0;right:0;z-index:9999',
    'background:var(--bg-panel2)',
    'border-bottom:2px solid var(--teal)',
    'padding:10px 16px',
    'display:flex;align-items:center;gap:10px',
    'font-family:"Press Start 2P",monospace;font-size:7px',
    'color:var(--teal)',
    'line-height:1.7'
  ].join(';');
  banner.innerHTML = `
    <span style="font-size:18px;flex-shrink:0;">✦</span>
    <span style="flex:1;">${_esc(inviterName)} invited you.<br>Complete your character to connect as allies.</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-dim);font-size:18px;cursor:pointer;padding:0 4px;line-height:1;">✕</button>`;
  document.body.appendChild(banner);
  setTimeout(() => { document.getElementById('inviteBanner')?.remove(); }, 10000);
}

function NativeAuth_onLoadPlayerResult(found, uid, name, dob, email) {
  if (found && name && dob) {
    const parts = dob.split('/');
    const m = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    currentUser = { uid, email };
    window._currentUid = uid;
    try { localStorage.setItem('scl_uid', uid); } catch(e) {}
    playerData  = computeAll(m, d, y, name);
    saveLocalUser(email);
    saveLocalPlayer(playerData);
    // Fire pending ally request for existing users who arrived via invite link
    try {
      const pendingUid = localStorage.getItem('scl_pending_inviter');
      if (pendingUid && pendingUid !== uid && typeof NativeAllies !== 'undefined') {
        localStorage.removeItem('scl_pending_inviter');
        window._pendingInviterUid = null;
        NativeAllies.sendRequest(pendingUid);
      }
    } catch(e) {}
    document.getElementById('authOverlay').classList.add('hidden');
    document.getElementById('charCreateOverlay').classList.add('hidden');
    setLoading('charLoading', false);
    try {
      launchApp();
    } catch(e) {
      console.error('launchApp error:', e);
      // Still show the app even if a non-critical builder crashed
      document.getElementById('appShell').classList.remove('hidden');
    }
  } else {
    document.getElementById('authOverlay').classList.add('hidden');
    document.getElementById('charCreateOverlay').classList.remove('hidden');
  }
}

function NativeAuth_onSessionResult(loggedIn, uid) {
  if (loggedIn) {
    currentUser = { uid: uid };
    NativeAuth.loadPlayer();
  }
  // else: stay on auth overlay (default state)
}

/* ================================================
   AUTH HELPERS
   ================================================ */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.auth-form-panel').forEach(el => el.classList.remove('active'));
  if (tab === 'forgot') {
    document.getElementById('panelForgot').classList.add('active');
    return;
  }
  const key = tab === 'login' ? 'Login' : 'Register';
  document.getElementById('tab' + key).classList.add('active');
  document.getElementById('panel' + key).classList.add('active');
}

function showAuthSuccess(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
}

function clearAuthMessages() {
  document.querySelectorAll('.auth-error, .auth-success').forEach(el => el.classList.remove('show'));
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
}

function clearAuthErrors() {
  clearAuthMessages();
}

function setLoading(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function friendlyError(raw) {
  if (!raw) return 'Unknown error.';
  if (raw.includes('user-not-found'))          return 'No account found with that email.';
  if (raw.includes('wrong-password'))          return 'Incorrect password.';
  if (raw.includes('invalid-email'))           return 'Please enter a valid email address.';
  if (raw.includes('email-already-in-use'))    return 'An account already exists with that email.';
  if (raw.includes('weak-password'))           return 'Password must be at least 6 characters.';
  if (raw.includes('network-request-failed'))  return 'Network error. Check your connection.';
  if (raw.includes('too-many-requests'))       return 'Too many attempts. Please wait and try again.';
  if (raw.includes('INVALID_LOGIN_CREDENTIALS')) return 'Invalid email or password.';
  return raw;
}

/* ================================================
   AUTH HANDLERS
   ================================================ */
function handleLogin() {
  clearAuthErrors();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  if (!email || !pass)     { showAuthError('loginError', '⚠ Please fill in all fields.'); return; }
  if (!validateEmail(email)) { showAuthError('loginError', '⚠ Enter a valid email address.'); return; }

  // Tester shortcut — skip NativeAuth, go straight to character creation
  if (email === TESTER_EMAIL) {
    currentUser = { email: TESTER_EMAIL };
    document.getElementById('authOverlay').classList.add('hidden');
    document.getElementById('charCreateOverlay').classList.remove('hidden');
    return;
  }

  if (pass.length < 6)     { showAuthError('loginError', '⚠ Password must be at least 6 characters.'); return; }
  setLoading('loginLoading', true);
  NativeAuth.login(email, pass);
}

function handleRegister() {
  clearAuthErrors();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPassword').value;
  if (!email || !pass)     { showAuthError('regError', '⚠ Please fill in all fields.'); return; }
  if (!validateEmail(email)) { showAuthError('regError', '⚠ Enter a valid email address.'); return; }
  if (pass.length < 6)     { showAuthError('regError', '⚠ Password must be at least 6 characters.'); return; }
  setLoading('regLoading', true);
  NativeAuth.register(email, pass);
}

function selectCharTheme(theme) {
  ['scifi','fantasy','unicorn','diablo'].forEach(t => {
    const el = document.getElementById('charTheme' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle('active', t === theme);
  });
  setTheme(theme);
}

function handleCharCreate() {
  clearAuthErrors();
  const name  = document.getElementById('charName').value.trim();
  const month = parseInt(document.getElementById('charMonth').value, 10);
  const day   = parseInt(document.getElementById('charDay').value, 10);
  const year  = parseInt(document.getElementById('charYear').value, 10);
  if (!name)                       { showAuthError('charError', '⚠ Please enter your full birth name.'); return; }
  if (!month || month < 1 || month > 12) { showAuthError('charError', '⚠ Enter a valid month (1–12).'); return; }
  if (!day   || day   < 1 || day   > 31) { showAuthError('charError', '⚠ Enter a valid day (1–31).'); return; }
  if (!year  || year  < 1900 || year > 2099) { showAuthError('charError', '⚠ Enter a valid year (1900–2099).'); return; }
  setLoading('charLoading', true);

  try {
    playerData = computeAll(month, day, year, name);
  } catch(e) {
    setLoading('charLoading', false);
    showAuthError('charError', '⚠ Error calculating frequencies. Please check your inputs.');
    console.error('computeAll error:', e);
    return;
  }

  // Tester email or no NativeAuth (browser/web) — launch directly
  if ((currentUser && currentUser.email === TESTER_EMAIL) || typeof NativeAuth === 'undefined') {
    setLoading('charLoading', false);
    saveLocalPlayer(playerData);
    document.getElementById('charCreateOverlay').classList.add('hidden');
    try { launchApp(); } catch(e) {
      console.error('launchApp error:', e);
      document.getElementById('appShell').classList.remove('hidden');
    }
  } else {
    // Safety net: if native callback never fires, clear spinner after 15s
    const saveTimeout = setTimeout(() => {
      if (document.getElementById('charLoading').classList.contains('show')) {
        setLoading('charLoading', false);
        showAuthError('charError', '⚠ Save timed out. Check your connection and try again.');
      }
    }, 15000);
    window._saveTimeout = saveTimeout;
    const lpFmt = fmt(playerData.lp.root, playerData.lp.compound);
    const clFmt = fmt(playerData.cl.root, playerData.cl.compound);
    const exFmt = fmt(playerData.ex.root, playerData.ex.compound);
    NativeAuth.savePlayer(name, month + '/' + day + '/' + year, lpFmt, clFmt, exFmt);
  }
}

function handleSignOut() {
  NativeAuth.signOut();
  try { localStorage.removeItem(LS_USER); localStorage.removeItem(LS_PLAYER); } catch(e) {}
  currentUser = null;
  playerData  = null;
  document.getElementById('appShell').classList.add('hidden');
  document.getElementById('authOverlay').classList.remove('hidden');
}

function toggleDeletePanel() {
  const panel = document.getElementById('deletePwPanel');
  const opening = panel.style.display === 'none';
  panel.style.display = opening ? '' : 'none';
  if (opening) {
    document.getElementById('deleteConfirmPw').value = '';
    document.getElementById('deleteError').style.display = 'none';
    setTimeout(() => document.getElementById('deleteConfirmPw').focus(), 50);
  }
}

function handleDeleteAccount() {
  const pw      = document.getElementById('deleteConfirmPw').value;
  const errorEl = document.getElementById('deleteError');
  const loadEl  = document.getElementById('deleteLoading');
  errorEl.style.display = 'none';
  if (!pw) {
    errorEl.textContent = '⚠ Enter your password to confirm deletion.';
    errorEl.style.display = 'block';
    return;
  }
  if (!confirm('This will permanently delete your account and all data. There is no undo. Continue?')) return;
  loadEl.style.display = '';
  document.getElementById('deleteConfirmPw').disabled = true;
  if (typeof NativeAuth !== 'undefined') {
    NativeAuth.deleteAccount(pw);
  } else {
    setTimeout(() => NativeAuth_onDeleteResult(true, ''), 1000);
  }
}

function NativeAuth_onDeleteResult(success, errorMsg) {
  const loadEl  = document.getElementById('deleteLoading');
  const errorEl = document.getElementById('deleteError');
  const pwInput = document.getElementById('deleteConfirmPw');
  if (loadEl)  loadEl.style.display = 'none';
  if (pwInput) pwInput.disabled = false;
  if (success) {
    try {
      ['scl_user','scl_player','scl_avatar',
       'scl_notif_enabled','scl_notif_hour','scl_notif_minute',
       'scl_theme'].forEach(k => localStorage.removeItem(k));
    } catch(e) {}
    if (typeof NativeNotif !== 'undefined' && NativeNotif.cancelDaily) NativeNotif.cancelDaily();
    currentUser = null;
    playerData  = null;
    document.getElementById('appShell').classList.add('hidden');
    document.getElementById('authOverlay').classList.remove('hidden');
  } else {
    if (errorEl) {
      errorEl.textContent = '⚠ ' + (errorMsg || 'Deletion failed. Check your password and try again.');
      errorEl.style.display = 'block';
    }
  }
}

function handleForgotPassword() {
  clearAuthMessages();
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email)              { showAuthError('forgotError', '⚠ Please enter your email address.'); return; }
  if (!validateEmail(email)) { showAuthError('forgotError', '⚠ Enter a valid email address.'); return; }
  setLoading('forgotLoading', true);
  if (typeof NativeAuth !== 'undefined' && NativeAuth.sendPasswordReset) {
    NativeAuth.sendPasswordReset(email);
  } else {
    setLoading('forgotLoading', false);
    showAuthError('forgotError', '⚠ Password reset unavailable. Please try again later.');
  }
}

function NativeAuth_onPasswordResetResult(success, errorMsg) {
  setLoading('forgotLoading', false);
  if (success) {
    showAuthSuccess('forgotSuccess', '✓ Reset link sent — check your inbox (and spam folder).');
    document.getElementById('forgotEmail').value = '';
  } else {
    showAuthError('forgotError', '⚠ ' + friendlyError(errorMsg || ''));
  }
}

function toggleChangePassword() {
  const panel = document.getElementById('changePwPanel');
  const btn   = document.getElementById('changePwToggleBtn');
  const open  = panel.style.display === 'block';
  panel.style.display = open ? 'none' : 'block';
  btn.textContent     = open ? '▶ CHANGE' : '▼ CANCEL';
  if (open) {
    document.getElementById('cpCurrent').value = '';
    document.getElementById('cpNew').value     = '';
    document.getElementById('cpConfirm').value = '';
    clearAuthMessages();
  }
}

function handleChangePassword() {
  clearAuthMessages();
  const current = document.getElementById('cpCurrent').value;
  const newPw   = document.getElementById('cpNew').value;
  const confirm = document.getElementById('cpConfirm').value;
  if (!current || !newPw || !confirm) { showAuthError('cpError', '⚠ Please fill in all fields.'); return; }
  if (newPw.length < 6)               { showAuthError('cpError', '⚠ New password must be at least 6 characters.'); return; }
  if (newPw !== confirm)              { showAuthError('cpError', '⚠ New passwords do not match.'); return; }
  if (newPw === current)              { showAuthError('cpError', '⚠ New password must be different from current.'); return; }
  document.getElementById('cpLoading').style.display = 'block';
  if (typeof NativeAuth !== 'undefined' && NativeAuth.changePassword) {
    NativeAuth.changePassword(current, newPw);
  } else {
    setTimeout(() => {
      document.getElementById('cpLoading').style.display = 'none';
      showAuthSuccess('cpSuccess', '✓ Password updated successfully.');
    }, 800);
  }
}

function NativeAuth_onChangePasswordResult(success, errorMsg) {
  document.getElementById('cpLoading').style.display = 'none';
  if (success) {
    showAuthSuccess('cpSuccess', '✓ Password updated successfully.');
    document.getElementById('cpCurrent').value = '';
    document.getElementById('cpNew').value     = '';
    document.getElementById('cpConfirm').value = '';
  } else {
    showAuthError('cpError', '⚠ ' + friendlyError(errorMsg || ''));
  }
}

function handleResetChar() {
  if (!confirm('Reset your character? All progress, XP, levels, and quest completions will be cleared.')) return;

  // Wipe all QuestEngine state (localStorage + Firestore)
  if (typeof QuestEngine_reset === 'function') QuestEngine_reset();

  // Wipe player profile from localStorage
  try { localStorage.removeItem(LS_PLAYER); } catch(e) {}

  // Clear runtime player state
  playerData = null;

  // Hide the app shell and show character creation
  document.getElementById('appShell').classList.add('hidden');
  document.getElementById('authOverlay').classList.add('hidden');
  document.getElementById('charCreateOverlay').classList.remove('hidden');
}

/* ================================================
   APP LAUNCH
   ================================================ */
/* ================================================
   GEOLOCATION PERMISSION PROMPT
   Storage and permission state live in Kotlin (MapBridge).
   JS only owns the overlay visibility and UI labels.
   ================================================ */

function initGeoPromptUI() {
  // Ask Kotlin for the current prompt setting to sync the toggle in Config
  if (typeof NativeMap !== 'undefined') {
    NativeMap.getPromptEnabled();
  }
}

/** Called back by Kotlin: NativeLocation_onPromptSetting(enabled) */
function NativeLocation_onPromptSetting(enabled) {
  const statusEl = document.getElementById('geoPromptStatusText');
  const btnEl    = document.getElementById('geoPromptToggleBtn');
  if (statusEl) statusEl.textContent = enabled ? 'ON' : 'OFF';
  if (btnEl)    btnEl.textContent    = enabled ? '▶ DISABLE' : '▶ ENABLE';
}

function maybeShowGeoPrompt() {
  if (typeof NativeMap !== 'undefined') {
    // Kotlin checks SharedPreferences + ContextCompat permission state
    NativeMap.checkPermissionState();
  }
}

/** Called back by Kotlin after checkPermissionState() or requestLocationPermission() */
function NativeLocation_onPermissionState(state) {
  if (state === 'granted') {
    // Already have permission — make sure overlay is hidden
    document.getElementById('geoPermOverlay').classList.add('hidden');
  } else if (state === 'not_asked') {
    // Show our custom prompt so the user understands why we need it
    document.getElementById('geoPermOverlay').classList.remove('hidden');
  }
  // 'denied' — don't pester the user; overlay stays hidden
}

function geoPermAllow() {
  document.getElementById('geoPermOverlay').classList.add('hidden');
  // Trigger the real Android permission dialog via Kotlin
  if (typeof NativeMap !== 'undefined') NativeMap.requestLocationPermission();
}

function geoPermDeny() {
  document.getElementById('geoPermOverlay').classList.add('hidden');
}

function toggleGeoPromptSetting() {
  // Read current state from the button label and flip it via Kotlin
  const isOn = document.getElementById('geoPromptStatusText')?.textContent === 'ON';
  if (typeof NativeMap !== 'undefined') NativeMap.setPromptEnabled(!isOn);
}

function requestGeoPermNow() {
  document.getElementById('geoPermOverlay').classList.remove('hidden');
}

function launchApp() {
  const { lp, ex, cl, so, ou, ac, th, name, m, d, y } = playerData;
  const email = currentUser?.email || '';

  // Character card
  document.getElementById('charCardName').textContent = name.toUpperCase();
  buildCharCoreNumbers(lp, cl, ex);
  buildGifts(d, so, ou);
  loadSavedAvatar();

  // Apply saved character alias (overrides real name in display)
  const _savedAlias = localStorage.getItem(LS_CHAR_ALIAS);
  if (_savedAlias) {
    document.getElementById('charCardName').textContent = _savedAlias.toUpperCase();
  }

  // Header
  document.getElementById('headerName').textContent = (_savedAlias || name).toUpperCase();
  document.getElementById('headerDob').textContent  = String(m).padStart(2,'0') + ' / ' + String(d).padStart(2,'0') + ' / ' + y;

  // Settings panel
  document.getElementById('settingName').textContent  = name;
  document.getElementById('settingDob').textContent   = m + '/' + d + '/' + y;
  document.getElementById('settingEmail').textContent = email;
  document.getElementById('settingLp').textContent    = fmt(lp.root, lp.compound);
  document.getElementById('settingEx').textContent    = fmt(ex.root, ex.compound);
  document.getElementById('settingCl').textContent    = fmt(cl.root, cl.compound);
  document.getElementById('settingSo').textContent    = fmt(so.root, so.compound);
  document.getElementById('settingOu').textContent    = fmt(ou.root, ou.compound);
  document.getElementById('settingAc').textContent    = fmt(ac.root, ac.compound);
  document.getElementById('settingTh').textContent    = fmt(th.root, th.compound);

  buildJournal();
  try { buildCharts();       } catch(e) { console.error('buildCharts error:',       e); }
  try { buildPolarityCard(); } catch(e) { console.error('buildPolarityCard error:', e); }
  try { buildCycles();       } catch(e) { console.error('buildCycles error:',       e); }
  buildLifeQuests();
  try { buildCurrentQuests(); } catch(e) { console.error('buildCurrentQuests error:', e); }
  initNotifUI();
  initQuestNotifUI();
  initGeoPromptUI();
  QuestEngine_init(); // XP + leveling system

  // Frequency spike detection — show banner if today's universal day matches a core number
  _checkFrequencySpike();

  document.getElementById('appShell').classList.remove('hidden');
  switchTab('stats');
  setTimeout(maybeShowGeoPrompt, 800);
  setTimeout(restoreQuestNotifListener, 1500); // slight delay so auth is settled
  setTimeout(_renderBoostStatus, 400);
  setTimeout(_getReferCode, 500); // pre-generate and cache refer code
}

function _checkFrequencySpike() {
  if (!playerData) return;
  const now = new Date();
  const rawDay = now.getMonth() + 1 + now.getDate() + now.getFullYear();
  let ud = String(rawDay).split('').map(Number).reduce((a, b) => a + b, 0);
  while (ud > 9 && ud !== 11 && ud !== 22 && ud !== 33) {
    ud = String(ud).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  const { lp, ex, cl, so, ou, ac, th } = playerData;
  const coreNums = [lp.root, ex.root, cl.root, so.root, ou.root, ac.root, th.root];
  const LABELS = { lp:'Life Path', ex:'Expression', cl:'Life Calling', so:'Soul', ou:'Outer', ac:'Achievement', th:'Theme' };
  const keys = ['lp','ex','cl','so','ou','ac','th'];
  const matches = keys.filter(k => playerData[k].root === ud).map(k => LABELS[k]);
  const banner = document.getElementById('freqSpikeBanner');
  const sub    = document.getElementById('freqSpikeSub');
  if (banner && matches.length > 0) {
    sub.textContent = 'Universal Day ' + ud + ' aligns with your ' + matches.join(' & ');
    banner.classList.remove('hidden');
  }
}

/* ================================================
   NAVIGATION
   ================================================ */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
  const cap = tab.charAt(0).toUpperCase() + tab.slice(1);
  document.getElementById('btn' + cap).classList.add('active');
  document.getElementById('panel' + cap).classList.add('active');
  if (tab === 'map') {
    _renderSimTop3();
  }
}

/* ================================================
   MAP SECTION SWITCHER
   ================================================ */
function switchMapSection(s) {
  ['allies','map','makequest'].forEach(key => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const el  = document.getElementById('sectionMap' + label);
    const btn = document.getElementById('btnMap'     + label);
    if (!el || !btn) return;
    if (key === s) { el.classList.remove('hidden'); btn.classList.add('active'); }
    else           { el.classList.add('hidden');    btn.classList.remove('active'); }
  });
}

/* ================================================
   SIMULATION TEASER — top-3 preview & side quest world list
   ================================================ */
function _calcSimScore() {
  const charLvl  = parseInt(localStorage.getItem('scl_char_level')  || '1', 10);
  const freqLvl  = parseInt(localStorage.getItem('scl_freq_level')  || '1', 10);
  const streak   = parseInt(localStorage.getItem('scl_daily_streak')|| '0', 10);
  const realmRaw = localStorage.getItem('scl_realm_quests');
  const realmDone = realmRaw ? Object.values(JSON.parse(realmRaw)).filter(Boolean).length : 0;
  const freqRaw  = localStorage.getItem('scl_freq_quests');
  const freqDone = freqRaw  ? Object.values(JSON.parse(freqRaw )).filter(Boolean).length : 0;
  return charLvl + freqLvl + realmDone + streak + Math.floor(freqDone / 5);
}
function _getTier(score) {
  if (score >= 100) return { label: 'SOURCE',  cls: 'tier-source'  };
  if (score >= 50)  return { label: 'ARCHON',  cls: 'tier-archon'  };
  return              { label: 'ADEPT',   cls: 'tier-adept'   };
}
function _renderSimTop3() {
  const listEl = document.getElementById('simTop3List');
  if (!listEl) return;
  const playerName  = (() => { try { return JSON.parse(localStorage.getItem('scl_player') || '{}').name || 'YOU'; } catch(e) { return 'YOU'; } })();
  const playerScore = _calcSimScore();
  const playerTier  = _getTier(playerScore);
  const mock = [
    { name: 'AXIOM_7',   score: 187 },
    { name: 'NOVA_III',  score: 142 },
    { name: 'ZEPHYR',    score: 118 },
  ];
  // Insert player into rankings
  const all = [...mock, { name: playerName, score: playerScore, isPlayer: true }]
    .sort((a, b) => b.score - a.score);
  const top3 = all.slice(0, 3);
  listEl.innerHTML = top3.map((p, i) => {
    const t = _getTier(p.score);
    return `<div class="sim-top3-row${p.isPlayer ? ' sim-top3-you' : ''}">
      <span class="sim-top3-rank">#${i + 1}</span>
      <span class="sim-top3-name">${p.name}</span>
      <span class="sim-top3-tier ${t.cls}">${t.label}</span>
      <span class="sim-top3-score">${p.score}</span>
    </div>`;
  }).join('');
}

function _renderSideQWorldQuests() {
  const el = document.getElementById('sideQWorldList');
  if (!el) return;
  const accepted = (() => { try { return JSON.parse(localStorage.getItem('scl_accepted_quests') || '{}'); } catch(e) { return {}; } })();
  const ids = Object.keys(accepted).filter(k => accepted[k]);
  if (!ids.length) {
    el.innerHTML = '<div class="allies-empty">No active world quests. <a href="../world/" style="color:var(--teal);">Open the Simulation</a> to accept quests.</div>';
    return;
  }
  el.innerHTML = ids.map(id => `<div class="side-world-quest-row"><span class="side-world-quest-icon">🗺</span><span class="side-world-quest-id">${id}</span><a href="../world/#worldmap" class="settings-btn" style="padding:2px 8px;font-size:9px;">VIEW</a></div>`).join('');
}

/* ================================================
   LEAFLET MAP + QUEST MARKERS
   ================================================ */
/* ================================================
   MAP THEME CONFIGS
   Each theme defines: tile URL, pin colors, pin shape HTML, popup style
   ================================================ */

const QUEST_TYPES = {
  exploration: { label: '🗺 EXPLORE',  key: 'explore'  },
  connection:  { label: '⚔ CONNECT',  key: 'connect'  },
  achievement: { label: '▲ ACHIEVE',  key: 'achieve'  },
  healing:     { label: '✦ HEAL',     key: 'heal'     },
  creation:    { label: '◈ CREATE',   key: 'create'   },
  reflection:  { label: '◇ REFLECT', key: 'reflect'  },
};

const MAP_THEMES = {
  scifi: {
    tile: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    tileAttrib: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    // Mine = gold hologram, ally = teal hologram
    pinMine:  { color: '#d4a843', border: '#000', glow: '#d4a84388', shape: 'circle' },
    pinAlly:  { color: '#00e5cc', border: '#000', glow: '#00e5cc88', shape: 'circle' },
    pinPlace: { color: '#d4a843', border: '#000', glow: '#d4a84388', shape: 'circle' },
    popupBg:  '#0d0d14', popupText: '#e0e0ff', popupBorder: '1px solid',
    popupFont: "'Share Tech Mono', monospace",
    labelColor: (c) => c,
    subColor:   '#5555aa',
  },
  fantasy: {
    tile: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttrib: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    // Mine = golden scroll pin, ally = forest green pennant
    pinMine:  { color: '#8b5e1a', border: '#5a3800', glow: 'none', shape: 'shield' },
    pinAlly:  { color: '#3a6b4a', border: '#1e3d28', glow: 'none', shape: 'shield' },
    pinPlace: { color: '#8b5e1a', border: '#5a3800', glow: 'none', shape: 'shield' },
    popupBg:  '#fdf6e3', popupText: '#2c1e0a', popupBorder: '2px solid #c9aa72',
    popupFont: "'IM Fell English', Georgia, serif",
    labelColor: (c) => c,
    subColor:   '#7a6040',
  },
  unicorn: {
    tile: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    tileAttrib: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    // Mine = magenta star, ally = purple star
    pinMine:  { color: '#c060d0', border: '#fff', glow: '#e040fb66', shape: 'star' },
    pinAlly:  { color: '#7c4dff', border: '#fff', glow: '#7c4dff66', shape: 'star' },
    pinPlace: { color: '#c060d0', border: '#fff', glow: '#e040fb66', shape: 'star' },
    popupBg:  '#fef7ff', popupText: '#4a2060', popupBorder: '1.5px solid #e0b8f5',
    popupFont: "'VT323', monospace",
    labelColor: (c) => c,
    subColor:   '#9c70b8',
  },
  diablo: {
    tile: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    tileAttrib: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    // Mine = gold shield, ally = blood-red shield
    pinMine:  { color: '#c8860a', border: '#2a1a04', glow: '#c8860a88', shape: 'shield' },
    pinAlly:  { color: '#cc2200', border: '#2a0800', glow: '#cc220088', shape: 'shield' },
    pinPlace: { color: '#c8860a', border: '#2a1a04', glow: '#c8860a88', shape: 'shield' },
    popupBg:  '#12100c', popupText: '#d4c8a8', popupBorder: '1px solid #3a2810',
    popupFont: "'IM Fell English', Georgia, serif",
    labelColor: (c) => c,
    subColor:   '#706050',
  },
};

function getMapTheme() {
  const t = document.documentElement.getAttribute('data-theme') || 'scifi';
  return MAP_THEMES[t] || MAP_THEMES.scifi;
}

/* Build the pin HTML for each theme shape */
function _buildPinHtml(cfg, size) {
  const s = size;
  const half = s / 2;
  if (cfg.shape === 'shield') {
    // Pentagon / shield shape using clip-path
    const shadow = cfg.glow !== 'none' ? `filter:drop-shadow(0 2px 4px ${cfg.glow});` : '';
    return `<div style="
      width:${s}px;height:${s + 4}px;
      background:${cfg.color};
      border:2px solid ${cfg.border};
      border-radius:${half}px ${half}px 0 0;
      clip-path:polygon(0% 0%,100% 0%,100% 65%,50% 100%,0% 65%);
      ${shadow}
    "></div>`;
  }
  if (cfg.shape === 'star') {
    // 4-point sparkle star using overlapping rotated divs
    const glow = cfg.glow !== 'none' ? `box-shadow:0 0 8px ${cfg.glow};` : '';
    return `<div style="position:relative;width:${s}px;height:${s}px;">
      <div style="position:absolute;inset:0;background:${cfg.color};border-radius:2px;transform:rotate(0deg);${glow}"></div>
      <div style="position:absolute;inset:0;background:${cfg.color};border-radius:2px;transform:rotate(45deg);${glow}"></div>
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${Math.round(s*0.35)}px;height:${Math.round(s*0.35)}px;background:${cfg.border};border-radius:50%;"></div>
    </div>`;
  }
  // Default: circle (scifi)
  const glow = cfg.glow !== 'none' ? `box-shadow:0 0 8px ${cfg.glow};` : '';
  return `<div style="
    width:${s}px;height:${s}px;
    border-radius:50%;
    background:${cfg.color};
    border:2px solid ${cfg.border};
    ${glow}
  "></div>`;
}

function _buildMarkerIcon(cfg, isMine) {
  const size = isMine ? 18 : 14;
  const pinCfg = isMine ? cfg.pinMine : cfg.pinAlly;
  return L.divIcon({
    className: '',
    html: _buildPinHtml(pinCfg, size),
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function _buildPopupHtml(q, type, cfg) {
  const isOwn  = q.uid === (window._currentUid || '');
  const color  = isOwn ? cfg.pinMine.color : cfg.pinAlly.color;
  const qid    = q.id || q.questId || q.docId || '';
  // Reward line
  const rewardLine = q.rewardNum
    ? `<div style="margin-top:6px;color:${cfg.subColor};font-size:9px;">✦ ${q.rewardNum} · ${_esc(q.rewardXp || q.rewardName || '')}</div>`
    : '';
  // Seeker type badge
  const seekerIcons = { solo: '◈ SOLO', partner: '⚔ PARTNER', group: '✦ GROUP' };
  const seekerLine = q.seekerType
    ? `<div style="display:inline-block;margin-top:6px;padding:2px 6px;border:1px solid ${color}44;color:${color};font-size:8px;font-family:'Press Start 2P',monospace;letter-spacing:0.5px;">${seekerIcons[q.seekerType] || q.seekerType}</div>`
    : '';
  // Objectives list
  const objsHtml = (q.objectives && q.objectives.length)
    ? `<div style="margin-top:8px;border-top:1px solid ${color}22;padding-top:8px;">
        <div style="font-family:'Press Start 2P',monospace;font-size:6px;color:${color};letter-spacing:1px;margin-bottom:5px;">OBJECTIVES</div>
        ${q.objectives.map(o => `<div style="font-size:10px;color:${cfg.subColor};line-height:1.55;margin-bottom:3px;">◈ ${_esc(o)}</div>`).join('')}
       </div>`
    : '';
  // Creator frequency signature — CL, LP, EX, Theme
  const sigHtml = (q.creatorSig)
    ? `<div style="margin-top:8px;border-top:1px solid ${color}22;padding-top:7px;">
        <div style="font-family:'Press Start 2P',monospace;font-size:5px;color:${cfg.subColor};letter-spacing:1px;margin-bottom:5px;">CREATOR FREQUENCIES</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          ${[
            ['CL', q.creatorSig.cl, color],
            ['LP', q.creatorSig.lp, '#d4a843'],
            ['EX', q.creatorSig.ex, '#a070ff'],
            ['TH', q.creatorSig.th, '#90a8c8'],
          ].filter(([,v]) => v).map(([k,v,c]) =>
            `<span style="font-family:'VT323',monospace;font-size:18px;color:${c};line-height:1;padding:1px 5px 2px;border:1px solid ${c}44;display:inline-flex;align-items:baseline;gap:3px;">${v}<span style="font-size:8px;color:${cfg.subColor};font-family:monospace;">${k}</span></span>`
          ).join('')}
        </div>
       </div>`
    : '';
  // Accept button — check if already accepted
  const safeId = qid.replace(/'/g, '');
  const alreadyAccepted = (() => {
    try { return !!(JSON.parse(localStorage.getItem('scl_accepted_quests') || '{}')[safeId]); }
    catch(e) { return false; }
  })();
  const acceptLabel = alreadyAccepted ? '✓ ALREADY IN LOG' : '▶ ACCEPT QUEST';
  const acceptStyle = alreadyAccepted
    ? `background:rgba(212,168,67,0.06);border:1px solid #6b5220;color:#d4a843;cursor:default;`
    : `background:rgba(0,229,204,0.06);border:1px solid ${cfg.pinAlly.color}88;color:${cfg.pinAlly.color};cursor:pointer;`;
  const acceptBtn = `<button onclick="acceptQuest('${safeId}')" style="
      display:block;width:100%;margin-top:8px;
      font-family:'Press Start 2P',monospace;font-size:6px;letter-spacing:0.5px;
      padding:8px;text-align:center;box-sizing:border-box;
      ${acceptStyle}
    ">${acceptLabel}</button>`;
  return `<div style="
    font-family:${cfg.popupFont};
    background:${cfg.popupBg};
    color:${cfg.popupText};
    padding:10px 14px;
    min-width:190px;max-width:260px;
    border:${cfg.popupBorder} ${color}88;
  ">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px;">
      <div style="color:${cfg.labelColor(color)};font-size:8px;letter-spacing:2px;">${type.label}</div>
      ${seekerLine}
    </div>
    <div style="font-size:13px;font-weight:bold;margin-bottom:6px;">${_esc(q.name)}</div>
    <div style="color:${cfg.subColor};line-height:1.5;">${_esc(q.description || '')}</div>
    ${rewardLine}
    ${objsHtml}
    ${sigHtml}
    ${q.playerName ? `<div style="margin-top:8px;color:${cfg.subColor};font-size:9px;opacity:0.6;">— ${_esc(q.playerName)}</div>` : ''}
    ${acceptBtn}
  </div>`;
}

function initLeafletMap() {
  if (window._mapInstance) return;
  const el = document.getElementById('leafletMap');
  if (!el) return;

  const cfg = getMapTheme();
  const map = L.map('leafletMap', { center: [20, 0], zoom: 3, zoomControl: true });
  window._activeTileLayer = L.tileLayer(cfg.tile, { attribution: cfg.tileAttrib, maxZoom: 19 }).addTo(map);
  window._mapInstance = map;

  const loadEl = document.getElementById('mapLoading');
  if (loadEl) loadEl.style.display = 'none';

  if (typeof NativeMap !== 'undefined') NativeMap.loadQuestMarkers();

  // Try browser geolocation as web fallback for nearby quests
  if (typeof NativeMap === 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => { window._playerLat = pos.coords.latitude; window._playerLng = pos.coords.longitude; _buildNearbyQuestsList(); },
      () => {}
    );
  }
}

// Backwards compat — native bridge still calls this
function NativeMap_onApiKey(apiKey) { initLeafletMap(); }

function NativeMap_onQuestsLoaded(questsJson) {
  const map = window._mapInstance;
  if (!map) return;
  window._lastQuestsJson = questsJson; // cache for theme switches
  const quests = _parseJson(questsJson) || [];
  // Refresh nearby panel
  setTimeout(_buildNearbyQuestsList, 50);
  const myUid  = window._currentUid || '';
  const cfg    = getMapTheme();

  // Clear old markers
  if (window._questMarkerLayer) window._questMarkerLayer.clearLayers();
  else window._questMarkerLayer = L.layerGroup().addTo(map);

  quests.forEach(q => {
    if (!q.lat || !q.lng) return;
    const isMine = q.uid === myUid;
    const type   = QUEST_TYPES[q.type] || QUEST_TYPES.exploration;
    const icon   = _buildMarkerIcon(cfg, isMine);
    const marker = L.marker([parseFloat(q.lat), parseFloat(q.lng)], { icon });
    marker.bindPopup(_buildPopupHtml(q, type, cfg), { className: 'leaflet-theme-popup' });
    window._questMarkerLayer.addLayer(marker);
  });
}

/* ── Nearby Quests Panel ── */
function _haversineMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
            Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function _nearbyRequestLocation() {
  if (typeof NativeMap !== 'undefined') {
    NativeMap.requestLocation();
  } else if (navigator.geolocation) {
    const btn = document.querySelector('.nearby-loc-btn');
    if (btn) { btn.textContent = '◎ GETTING LOCATION…'; btn.disabled = true; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        window._playerLat = pos.coords.latitude;
        window._playerLng = pos.coords.longitude;
        _buildNearbyQuestsList();
      },
      err => {
        const msgs = { 1: 'Location permission denied.', 2: 'Position unavailable.', 3: 'Location request timed out.' };
        const hint = document.querySelector('.nearby-loc-hint');
        if (hint) hint.textContent = '⚠ ' + (msgs[err.code] || 'Location error: ' + err.message);
        const btn2 = document.querySelector('.nearby-loc-btn');
        if (btn2) { btn2.textContent = '◎ USE MY LOCATION'; btn2.disabled = false; }
        console.warn('Geolocation error', err.code, err.message);
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }
}

function _buildNearbyQuestsList() {
  const listEl = document.getElementById('nearbyQuestsList');
  if (!listEl) return;
  const lat = window._playerLat;
  const lng = window._playerLng;
  if (lat == null || lng == null) return; // keep the 'Enable location' prompt

  const RADIUS_MI = 30;
  const quests = _parseJson(window._lastQuestsJson) || [];
  const nearby = quests
    .filter(q => q.lat && q.lng)
    .map(q => ({ ...q, _dist: _haversineMi(lat, lng, parseFloat(q.lat), parseFloat(q.lng)) }))
    .filter(q => q._dist <= RADIUS_MI)
    .sort((a, b) => a._dist - b._dist);

  if (!nearby.length) {
    listEl.innerHTML = '<div class="nearby-quests-empty"><div class="nearby-loc-hint">No quests found within 30 miles of your location.</div></div>';
    return;
  }

  const REWARD_NAMES_LOCAL = { 1:'INITIATION',2:'UNION',3:'EXPRESSION',4:'FOUNDATION',5:'FREEDOM',6:'HARMONY',7:'TRUTH',8:'POWER',9:'MASTERY' };
  const TYPE_LABELS = { exploration:'🗺 EXPLORE',connection:'⚔ CONNECT',achievement:'▲ ACHIEVE',healing:'✦ HEAL',creation:'◈ CREATE',reflection:'◇ REFLECT' };
  const accepted = (() => { try { return JSON.parse(localStorage.getItem('scl_accepted_quests') || '{}'); } catch(e) { return {}; } })();

  listEl.innerHTML = nearby.map(q => {
    const qid = (q.id || q.questId || q.docId || '').replace(/'/g,'');
    const isAccepted = !!accepted[qid];
    const distStr = q._dist < 1 ? '<1 mi' : Math.round(q._dist) + ' mi';
    const typeLabel = TYPE_LABELS[q.type] || q.type || '';
    const rewardNum = q.rewardNum || '';
    const rewardName = REWARD_NAMES_LOCAL[rewardNum] || q.rewardName || '';
    const objsHtml = (q.objectives && q.objectives.length)
      ? '<div class="nearby-quest-objs">' + q.objectives.map(o => `<div class="nearby-obj-item">${_esc(o)}</div>`).join('') + '</div>'
      : '';
    const rewardHtml = rewardNum
      ? `<div class="nearby-quest-reward"><span class="nearby-reward-num">${rewardNum}</span><span class="nearby-reward-label">${_esc(rewardName)}<br>XP FREQ</span></div>`
      : '';
    return `<div class="nearby-quest-card">
      <div class="nearby-quest-header">
        <div class="nearby-quest-name">${_esc(q.name)}</div>
        <div class="nearby-quest-dist">${distStr}</div>
      </div>
      <div class="nearby-quest-type">${_esc(typeLabel)}</div>
      ${rewardHtml}
      ${objsHtml}
      <button class="nearby-accept-btn${isAccepted ? ' accepted' : ''}" onclick="_nearbyAcceptQuest('${qid}', this)">${isAccepted ? '✓ IN YOUR LOG' : '▶ ACCEPT QUEST'}</button>
    </div>`;
  }).join('');
}

function _nearbyAcceptQuest(questId, btn) {
  if (!questId) return;
  if (btn && btn.classList.contains('accepted')) return;
  acceptQuest(questId);
  if (btn) { btn.textContent = '✓ IN YOUR LOG'; btn.classList.add('accepted'); }
}

/* Called from setTheme() — swaps tile layer + redraws all markers */
function applyMapTheme() {
  const cfg = getMapTheme();

  // Swap tile layer on main map
  if (window._mapInstance && window._activeTileLayer) {
    window._mapInstance.removeLayer(window._activeTileLayer);
    window._activeTileLayer = L.tileLayer(cfg.tile, { attribution: cfg.tileAttrib, maxZoom: 19 }).addTo(window._mapInstance);
  }

  // Swap tile layer on mini map
  if (_mqMiniMap && window._activeMiniTileLayer) {
    _mqMiniMap.removeLayer(window._activeMiniTileLayer);
    window._activeMiniTileLayer = L.tileLayer(cfg.tile, { maxZoom: 19 }).addTo(_mqMiniMap);
  }

  // Redraw quest markers with new theme colors
  if (window._questMarkerLayer && window._lastQuestsJson) {
    NativeMap_onQuestsLoaded(window._lastQuestsJson);
  }

  // Redraw mini pin if it exists
  if (_mqMiniMarker && _mqMiniMap) {
    const pinCfg = cfg.pinPlace;
    _mqMiniMarker.setIcon(L.divIcon({
      className: '',
      html: _buildPinHtml(pinCfg, 18),
      iconSize: [18, 18], iconAnchor: [9, 9],
    }));
  }
}

/* ── Quest creation form ─────────────────────────── */
let _selectedQuestType = 'exploration';
let _questLat = null, _questLng = null;
let _mqMiniMap = null, _mqMiniMarker = null;
let _locationSearchTimer = null;

function selectQuestType(btn) {
  document.querySelectorAll('.mq-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _selectedQuestType = btn.dataset.type;
}

let _selectedRewardNum = 1;
const REWARD_LABELS = {
  1: 'Leadership · Willpower · New Beginnings',
  2: 'Partnership · Intuition · Balance',
  3: 'Creativity · Joy · Communication',
  4: 'Discipline · Stability · Mastery',
  5: 'Adventure · Change · Experience',
  6: 'Healing · Responsibility · Love',
  7: 'Wisdom · Inner Work · Analysis',
  8: 'Abundance · Authority · Legacy',
  9: 'Completion · Compassion · Transcendence'
};
const REWARD_NAMES = {
  1:'INITIATION', 2:'UNION', 3:'EXPRESSION', 4:'FOUNDATION', 5:'FREEDOM',
  6:'HARMONY', 7:'TRUTH', 8:'POWER', 9:'MASTERY'
};

const TIERED_OBJECTIVES = {
  1: { 1: ['Identify one thing you have been waiting for permission to start. Begin it today without asking anyone.','Take the lead in one conversation or decision this week. Notice what shifts when you go first.','Launch something imperfect before the week ends. The 1 frequency rewards beginning, not polishing.'], 2: ['Initiate something this week with no safety net - no approval guarantee, no fallback.','Step into a leadership role you have been circling: volunteer, propose, or own a direction publicly.','Eliminate one permission-seeking habit that has been slowing you. Move without it this week.'], 3: ['Launch something that has never existed before - not a plan, the thing itself.','Take full public ownership of a direction others are uncertain about. Lead from conviction alone.','Identify the final frontier of self-leadership you have been avoiding. Cross it permanently.'] },
  2: { 1: ['In your next disagreement, state the other person\'s position fully before stating your own.','Reach out to one person you have been distant from. One message. No agenda.','Notice one moment today where you abandoned your needs to keep the peace. Choose differently next time.'], 2: ['Facilitate a genuine resolution between two people in conflict this week. Stay fully neutral.','Build one real connection between two people in your world who should know each other.','State your truth clearly in one relationship where silence has been keeping a false peace.'], 3: ['Become the stable centre in a situation pulling others into chaos. Hold calm without losing yourself.','Repair a relationship you have written off. Do it fully - not as a gesture, as a completion.','Be fully yourself and fully connected at the same time, in the same space. Hold both.'] },
  3: { 1: ['Create something today - writing, art, cooking, music - without showing it to anyone.','Say something out loud you have been holding inside. One true thing, to one real person.','Finish one creative project you started and abandoned. Any size. Completion is the point.'], 2: ['Create something daily for 7 consecutive days without seeking feedback. Let the work exist alone.','Identify one area where you are performing for approval instead of expressing truth. Drop it.','Collaborate where your distinct voice is the contribution - not your effort or reliability.'], 3: ['Begin a body of work - not a single piece, but a complete vision expressed across multiple outputs.','Stand fully in your creative identity in a room where it makes others uncomfortable. Do not shrink.','Transmit something true through your chosen medium that could only have come from you.'] },
  4: { 1: ['Choose one area of your life in disorder. Create one simple rule for it and follow it today.','Show up to one commitment exactly when you said you would - no adjustment, no exception.','Build something with your hands this week: cook from scratch, repair, assemble, or craft anything.'], 2: ['Design a weekly structure for your most important work. Run it without deviation for 21 days.','Identify the system in your life that breaks most often. Rebuild it properly - do not just patch it.','Commit to one physical discipline - sleep, movement, fasting - non-negotiable for 30 days.'], 3: ['Architect a system that runs without your constant presence in it. Build it to outlast this chapter.','Review every major commitment you hold. Release what is misaligned. Deepen everything that remains.','Lay the foundation of something that will matter to people who are not yet born. Make it real.'] },
  5: { 1: ['Spend 10 minutes today in complete stillness - no phone, no input, no planning. Just this moment.','When the urge to escape arises, pause for 2 full minutes before acting on it.','Say yes to one sensory experience you have been avoiding or indefinitely postponing.'], 2: ['Spend one full day without any digital content. Be present only to what is physically here.','Make one commitment you have been avoiding. Stay present to the discomfort of keeping it.','Choose one constraint and inhabit it completely. Find the freedom that lives inside structure.'], 3: ['Go 7 consecutive days without your primary escape mechanism. Meet everything that surfaces.','Choose one fixed commitment in an area you have always kept deliberately fluid. Hold it a full cycle.','Bring complete presence to your most important relationship for one full week. No distraction.'] },
  6: { 1: ['List three ways you are currently over-giving. Pick one and renegotiate it today.','Let someone do something for you today without immediately returning the gesture.','Set one clear boundary with someone you have been over-accommodating. Say it clearly and kindly.'], 2: ['Design a self-care ritual that cannot be cancelled for other people. Hold it for 14 days.','Identify where you are giving from obligation rather than genuine love. Redirect that energy.','Have one honest conversation with someone you have been protecting through silence.'], 3: ['Heal one dynamic where care has quietly become control. Release the outcome completely.','Create an environment - a space, a gathering - that genuinely transforms someone who enters it.','Become the source of your own unconditional support. Stop waiting for it to arrive from outside.'] },
  7: { 1: ['Spend 30 uninterrupted minutes in solitude today - no input, no content. Let your mind surface.','Act on one intuitive signal today without consulting anyone else first. Trust the knowing.','Write one thing you know from direct personal experience - not from a book or someone else.'], 2: ['Commit to 14 consecutive days of daily undistracted solitude at the same time each day.','Identify one area where analysis is avoiding a commitment you already know to make. Decide.','Share one piece of inner knowing publicly - without qualification, apology, or softening.'], 3: ['Spend 30 days operating primarily from your own inner authority. Track every external deflection.','Write the thing you know - the complete version, the full map. Give it to the world without editing it safe.','Become so still inside that the depth of your knowing is the first thing people feel when near you.'] },
  8: { 1: ['Name the pattern that most consistently leaks your power. Watch it today without acting from it.','Make one decision today based purely on what is correct - not comfortable or likely to be approved.','Begin one discipline-based habit today - wake time, movement, practice. Non-negotiable from day one.'], 2: ['Identify your primary power leak and build one structural change that permanently closes it.','Make five consecutive decisions this week using only your own authority. Own every outcome.','Use your influence this week to genuinely empower someone else - give them power, not instruction.'], 3: ['Audit your entire life for where power and integrity are misaligned. Close every gap as a permanent standard.','Build something that generates sustained power without requiring your daily presence to maintain it.','Become someone whose word is absolute. Whatever you commit to, you complete. Every time. Starting now.'] },
  9: { 1: ['Identify one relationship, habit, or belief at its natural end. Take one step toward releasing it.','Practise forgiveness of one person - or one past version of yourself - today. Even just internally.','Give something away you have been hoarding: time, knowledge, money, attention, or a physical object.'], 2: ['Complete one cycle you have been dragging on. Close it formally, consciously, with full presence.','Write a letter of release to something you have never fully let go of. You need not send it.','Give time or energy this week to something larger than your personal interests - no return expected.'], 3: ['Identify the oldest unfinished cycle in your life. Complete it this month - fully, with gratitude.','Release something you treasure deeply that has already completed its purpose. Let it go without conditions.','Live this week as if completing a chapter: full presence, full love, full willingness to release what is finished.'] },
  11: { 1: ['Sit in 20 minutes of unstructured silence today. Do not interpret what surfaces - only observe it.','Act on one intuitive flash this week before logic can talk you out of it. Record what happens.','Share one vision or inner knowing with another person without softening it for their comfort.'], 2: ['Go 14 days receiving impressions without immediately broadcasting them. Develop the inner signal first.','Identify where you are performing sensitivity rather than living from it. Drop the performance.','Deliver one piece of illuminated truth into a space that has none - a conversation, a room, a relationship.'], 3: ['Become a clear channel for insight - not by seeking more, but by clearing every distortion between the signal and your expression of it.','Commit fully to both your human life and your higher sensitivity at once. Stop choosing between them.','Transmit one vision at its fullest frequency to the world. Not a hint of it - all of it.'] },
  22: { 1: ['Identify the largest-scale thing you have been thinking about but never written down. Write the full vision today.','Choose one practical action this week that serves something beyond your personal benefit. Do it without announcement.','Examine one structure in your immediate world - a system, process, or organisation - and identify its single greatest flaw and fix.'], 2: ['Begin building one thing this month that is designed to serve people beyond your current circle.','Identify where your vision has stayed theoretical. Convert one concept into a concrete, working component.','Bring a group of people together around a shared mission you believe in. Facilitate rather than control.'], 3: ['Build the thing you have been preparing to build - not a prototype, the actual structure. Commit the full resources.','Identify the legacy dimension of your current work. Rebuild anything that is not designed to outlast you.','Operate at the intersection of the visionary and the builder simultaneously. Hold the full scale without collapsing into detail or disappearing into the abstract.'] },
  33: { 1: ['Offer one act of unconditional service today - not for recognition, reciprocity, or relationship leverage.','Identify one person in your life whose potential you can see more clearly than they can. Reflect it to them honestly.','Choose love as a deliberate act in one situation where judgement or withdrawal would be easier.'], 2: ['Spend 21 days giving your best creative or healing energy to others without tracking what returns to you.','Identify where your compassion is actually control wearing a kind face. Release the outcome you are managing.','Bring your full presence - spiritual, emotional, and creative - into the service of someone who cannot yet access those qualities in themselves.'], 3: ['Embody unconditional love in a situation designed to exhaust it. Hold it completely, without martyrdom or resentment.','Create something - a space, a work, a body of teaching - whose sole purpose is the elevation of those who encounter it.','Live every interaction this week as sacred ministry. Let no exchange be ordinary. Let every moment be complete service.'] },
  44: { 1: ['Identify the one structure in your life most in need of redesign. Map it in full before touching it.','Show up to your highest-stakes commitment with military-level reliability for seven consecutive days.','Build one physical or systemic discipline into your daily life that you have been postponing indefinitely.'], 2: ['Architect a complete operating system for one domain of your life - health, work, finances, or relationships. Implement it fully.','Identify every place where you are sustaining effort but not building. Redirect that energy into construction.','Commit to one project of enduring structural value that will outlast the current season of your life. Begin the foundation this week.'], 3: ['Build the masterwork. Not the idea of it - the actual thing, at full scale, with full accountability for every component.','Become the load-bearing pillar in a structure larger than yourself. Hold it with precision, not pride.','Leave one domain of the world more ordered, more functional, and more enduring than you found it. Make it permanent.'] }
};

function _questTier(level) { return level >= 67 ? 3 : level >= 34 ? 2 : 1; }
const TIER_LABELS = { 1: 'APPRENTICE', 2: 'ADEPT', 3: 'MASTER' };
const TIER_COLORS = { 1: 'var(--sage)', 2: 'var(--teal)', 3: 'var(--gold)' };

/* Build stacked tier objectives for a life quest card.
   No checkboxes. Tiers unlock by earning Freq XP (level gating).
   Active tier shown in full. Past tiers shown dimmed + struck. Locked tiers show requirement. */
function makeLifeTieredObjsHtml(questKey, freqRoot, freqLevel) {
  // Tier driven by LQP progress (daily matched completions), not freqLevel
  const activeTier  = (typeof _getActiveTier === 'function') ? _getActiveTier(questKey) : _questTier(freqLevel || 1);
  const lqpData     = (typeof _getLQP === 'function') ? _getLQP() : {};
  let html = '<div class="life-tiers">';
  [1, 2, 3].forEach(function(tier) {
    const objs     = (TIERED_OBJECTIVES[freqRoot] || {})[tier] || [];
    const isActive = (tier === activeTier);
    const isPast   = (tier < activeTier);
    const tColor   = isPast ? 'var(--sage)' : isActive ? TIER_COLORS[tier] : 'var(--text-dim)';
    const cls      = 'life-tier ' + (isActive ? 'life-tier-active' : isPast ? 'life-tier-past' : 'life-tier-locked');
    const progress  = (lqpData[questKey] && lqpData[questKey][tier]) ? lqpData[questKey][tier] : [];
    const doneCount = progress.filter(Boolean).length;
    html += '<div class="' + cls + '">';
    html += '<div class="life-tier-label" style="color:' + tColor + ';">';
    html += (isPast ? '\u2713 ' : isActive ? '\u25b6 ' : '\u25c7 ') + TIER_LABELS[tier];
    if (isActive) html += '<span class="life-tier-tag" style="color:' + tColor + ';">CURRENT</span>';
    if (isPast)   html += '<span class="life-tier-tag" style="color:var(--sage);">COMPLETE</span>';
    if (isActive && objs.length) html += '<span class="life-tier-progress" style="color:' + tColor + ';">' + doneCount + '/' + objs.length + '</span>';
    html += '</div>';
    if (!isActive && !isPast) {
      const prevLabel = tier === 2 ? 'Apprentice' : 'Adept';
      html += '<div class="life-tier-locked-msg">Complete all ' + prevLabel + ' objectives to unlock.</div>';
    } else {
      html += '<div class="life-tier-objs">';
      const firstIncomplete = progress.findIndex((d, i) => i < objs.length && !d);
      objs.forEach(function(o, i) {
        const done    = !!progress[i];
        const isNext  = !isPast && (i === firstIncomplete);
        html += '<div class="life-tier-obj-row' + (done ? ' life-obj-done' : '') + '">'
          + '<span style="color:' + (done ? 'var(--sage)' : tColor) + ';">' + (done ? '\u2713' : '\u25c8') + '</span>'
          + '<span>' + o + '</span>'
          + (isNext ? '<span class="life-obj-next-tag">NEXT</span>' : '')
          + '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function selectRewardNum(btn) {
  document.querySelectorAll('.mq-reward-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _selectedRewardNum = parseInt(btn.dataset.num);
  const el = document.getElementById('mqRewardPreviewText');
  if (el) el.textContent = REWARD_LABELS[_selectedRewardNum];
}

let _selectedSeekerType = 'solo';

function selectSeekerType(btn) {
  document.querySelectorAll('.mq-seeker-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _selectedSeekerType = btn.dataset.seeker;
  _mqUpdateAdvHint();
}

let _selectedDifficulty = 1;

function selectDifficulty(btn) {
  const grid = btn.closest('.field-group');
  if (grid) grid.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _selectedDifficulty = parseInt(btn.dataset.diff) || 1;
  _mqUpdateAdvHint();
}

/* ── Quest Maker UX helpers ── */
function _mqCharCount(inputId, countId, max) {
  const el = document.getElementById(inputId);
  const cnt = document.getElementById(countId);
  if (!el || !cnt) return;
  const len = el.value.length;
  cnt.textContent = len + '/' + max;
  cnt.classList.toggle('mq-char-warn', len >= max * 0.8 && len < max);
  cnt.classList.toggle('mq-char-full', len >= max);
}

function _mqObjReveal() {
  const v1 = (document.getElementById('mqObj1')?.value || '').trim();
  const v2 = (document.getElementById('mqObj2')?.value || '').trim();
  const r2 = document.getElementById('mqObj2Row');
  const r3 = document.getElementById('mqObj3Row');
  if (r2) r2.classList.toggle('mq-obj-hidden', !v1);
  if (r3) r3.classList.toggle('mq-obj-hidden', !v2);
}

function _mqToggleAdvanced() {
  const body = document.getElementById('mqAdvancedBody');
  const arrow = document.getElementById('mqAdvArrow');
  if (!body) return;
  const open = !body.classList.contains('hidden');
  body.classList.toggle('hidden', open);
  if (arrow) arrow.classList.toggle('open', !open);
}

function _mqUpdateAdvHint() {
  const hint = document.getElementById('mqAdvHint');
  if (!hint) return;
  const seekerLabel = { solo: 'Solo', partner: 'Partner', group: 'Group' }[_selectedSeekerType] || 'Solo';
  const diffLabel = { 1: 'Apprentice', 2: 'Adept', 3: 'Master' }[_selectedDifficulty] || 'Apprentice';
  hint.textContent = seekerLabel + ' · ' + diffLabel;
}

function _mqClearFieldError(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.classList.remove('mq-field-error');
  const msg = el?.parentElement?.querySelector('.mq-field-err-msg');
  if (msg) msg.classList.remove('visible');
}

/* ── Frequency Signature — reads playerData and populates the sig panel ── */
function _buildMqSignature() {
  const panel = document.getElementById('mqSigBody');
  if (!panel) return;
  if (!playerData) {
    panel.innerHTML = '<div class="mq-sig-hint">Frequencies unavailable.</div>';
    return;
  }
  const { lp, ex, cl, th } = playerData;
  const fmt2 = (n) => typeof fmt === 'function' ? fmt(n.root, n.compound) : String(n.root);
  const rows = [
    { key: 'CALLING',    val: fmt2(cl), color: 'var(--teal)'   },
    { key: 'LIFE PATH',  val: fmt2(lp), color: 'var(--gold)'   },
    { key: 'EXPRESSION', val: fmt2(ex), color: 'var(--purple)' },
    { key: 'THEME',      val: fmt2(th), color: 'var(--silver)' },
  ];
  panel.innerHTML = `<div class="mq-sig-grid">${rows.map(r =>
    `<div class="mq-sig-chip">
      <span class="mq-sig-chip-num" style="color:${r.color}">${r.val}</span>
      <span class="mq-sig-chip-key">${r.key}</span>
    </div>`
  ).join('')}</div>`;
}

/* ── Location autocomplete via NativeMap.searchLocations() ── */
function onLocationInput(value) {
  _questLat = null;
  _questLng = null;
  document.getElementById('mqLocationStatus').textContent = '';

  if (_locationSearchTimer) clearTimeout(_locationSearchTimer);
  const suggestions = document.getElementById('mqLocationSuggestions');
  if (!value || value.length < 3) { suggestions.classList.add('hidden'); suggestions.innerHTML = ''; return; }

  _locationSearchTimer = setTimeout(() => {
    suggestions.innerHTML = '<div class="mq-suggestion-item mq-suggestion-loading">◎ Searching…</div>';
    suggestions.classList.remove('hidden');
    if (typeof NativeMap !== 'undefined') {
      NativeMap.searchLocations(value);
    } else {
      // Web fallback — query Nominatim directly
      const query = encodeURIComponent(value);
      fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      })
        .then(r => r.json())
        .then(data => NativeMap_onLocationSearchResults(JSON.stringify(data)))
        .catch(() => NativeMap_onLocationSearchResults('[]'));
    }
  }, 400);
}

/** Called back by Kotlin with Nominatim results */
function NativeMap_onLocationSearchResults(resultsJson) {
  const suggestions = document.getElementById('mqLocationSuggestions');
  let results;
  try { results = JSON.parse(resultsJson); } catch(e) { results = []; }
  if (!results.length) {
    suggestions.innerHTML = '<div class="mq-suggestion-item mq-suggestion-empty">No results found</div>';
    return;
  }
  suggestions.innerHTML = results.map(r =>
    `<div class="mq-suggestion-item" onclick="selectLocationSuggestion(${r.lat}, ${r.lon}, '${_esc(String(r.display_name).replace(/'/g,"&#39;"))}')">${_esc(r.display_name)}</div>`
  ).join('');
}

function selectLocationSuggestion(lat, lng, label) {
  _questLat = parseFloat(lat);
  _questLng = parseFloat(lng);
  document.getElementById('mqLocation').value = label;
  document.getElementById('mqLocationStatus').textContent = `✓ ${parseFloat(lat).toFixed(5)}, ${parseFloat(lng).toFixed(5)}`;
  document.getElementById('mqLocationSuggestions').classList.add('hidden');
  _showMiniMapPin(_questLat, _questLng);
}

function useMyLocation() {
  const statusEl = document.getElementById('mqLocationStatus');
  statusEl.textContent = '◎ Getting location…';
  if (typeof NativeMap !== 'undefined') {
    NativeMap.requestLocation();
  } else {
    statusEl.textContent = '⚠ Location not available in browser mode.';
  }
}

/** Called back by Kotlin after requestLocation() */
function NativeLocation_onLocationResult(success, lat, lng) {
  const statusEl = document.getElementById('mqLocationStatus');
  if (!success) {
    statusEl.textContent = '⚠ Could not get location. Search for an address above.';
    return;
  }
  _questLat = parseFloat(lat);
  _questLng = parseFloat(lng);
  // Also store as player location for nearby quests
  window._playerLat = _questLat;
  window._playerLng = _questLng;
  statusEl.textContent = `✓ ${_questLat.toFixed(5)}, ${_questLng.toFixed(5)}`;
  document.getElementById('mqLocation').value = `${_questLat.toFixed(5)}, ${_questLng.toFixed(5)}`;
  document.getElementById('mqLocationSuggestions').classList.add('hidden');
  _showMiniMapPin(_questLat, _questLng);
  _buildNearbyQuestsList();
}

function _showMiniMapPin(lat, lng) {
  const cfg = getMapTheme();
  document.getElementById('mqMapPreview').classList.remove('hidden');
  if (!_mqMiniMap) {
    _mqMiniMap = L.map('mqMiniMap', { center: [lat, lng], zoom: 13, zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false });
    window._activeMiniTileLayer = L.tileLayer(cfg.tile, { maxZoom: 19 }).addTo(_mqMiniMap);
  } else {
    _mqMiniMap.setView([lat, lng], 13);
  }
  if (_mqMiniMarker) _mqMiniMarker.remove();
  const icon = L.divIcon({
    className: '',
    html: _buildPinHtml(cfg.pinPlace, 18),
    iconSize: [18, 18], iconAnchor: [9, 9],
  });
  _mqMiniMarker = L.marker([lat, lng], { icon }).addTo(_mqMiniMap);
  setTimeout(() => _mqMiniMap.invalidateSize(), 50);
}

function submitQuest() {
  const name    = document.getElementById('mqName').value.trim();
  const desc    = document.getElementById('mqDesc').value.trim();
  const locStr  = document.getElementById('mqLocation').value.trim();
  const errorEl = document.getElementById('mqError');
  errorEl.style.display = 'none';
  document.getElementById('mqSuccess').style.display = 'none';
  // Inline field errors
  let hasErr = false;
  const nameEl = document.getElementById('mqName');
  const nameErrEl = document.getElementById('mqNameErr');
  const locEl = document.getElementById('mqLocation');
  const locErrEl = document.getElementById('mqLocErr');
  if (!name) {
    nameEl?.classList.add('mq-field-error');
    if (nameErrEl) nameErrEl.classList.add('visible');
    hasErr = true;
  } else {
    nameEl?.classList.remove('mq-field-error');
    if (nameErrEl) nameErrEl.classList.remove('visible');
  }
  if (!locStr) {
    locEl?.classList.add('mq-field-error');
    if (locErrEl) locErrEl.classList.add('visible');
    hasErr = true;
  } else {
    locEl?.classList.remove('mq-field-error');
    if (locErrEl) locErrEl.classList.remove('visible');
  }
  if (hasErr) return;

  if (_questLat !== null && _questLng !== null) {
    _doSubmitQuest(name, desc, locStr, _questLat, _questLng);
    return;
  }

  // Fallback: geocode via Kotlin (Nominatim via OkHttp) if user submitted without selecting
  document.getElementById('mqLoading').style.display = '';
  window._pendingQuestData = { name, desc, locStr };
  if (typeof NativeMap !== 'undefined') {
    NativeMap.geocodeAddress(locStr);
  } else {
    NativeMap_onGeocodeResult(false, 0, 0, '');
  }
}

function NativeMap_onGeocodeResult(success, lat, lng, formattedAddress) {
  document.getElementById('mqLoading').style.display = 'none';
  if (!success || !window._pendingQuestData) {
    document.getElementById('mqError').textContent = '⚠ Could not find that location. Try selecting from the search suggestions.';
    document.getElementById('mqError').style.display = 'block';
    window._pendingQuestData = null;
    return;
  }
  const { name, desc } = window._pendingQuestData;
  window._pendingQuestData = null;
  _questLat = lat; _questLng = lng;
  document.getElementById('mqLocationStatus').textContent = `✓ ${formattedAddress}`;
  _showMiniMapPin(lat, lng);
  _doSubmitQuest(name, desc, formattedAddress, lat, lng);
}

function _doSubmitQuest(name, desc, locationName, lat, lng) {
  document.getElementById('mqLoading').style.display = '';
  // Collect objectives (filter empty)
  const objectives = [
    document.getElementById('mqObj1')?.value.trim() || '',
    document.getElementById('mqObj2')?.value.trim() || '',
    document.getElementById('mqObj3')?.value.trim() || '',
  ].filter(Boolean);
  // Build creator frequency signature from playerData
  let creatorSig = null;
  if (playerData) {
    const { lp, ex, cl, th } = playerData;
    const fmt2 = (n) => typeof fmt === 'function' ? fmt(n.root, n.compound) : String(n.root);
    creatorSig = {
      cl: fmt2(cl), lp: fmt2(lp), ex: fmt2(ex), th: fmt2(th),
    };
  }
  if (typeof NativeMap !== 'undefined') {
    NativeMap.saveQuest(JSON.stringify({
      name, description: desc,
      location: locationName, type: _selectedQuestType, lat, lng,
      rewardNum:  _selectedRewardNum,
      rewardName: REWARD_NAMES[_selectedRewardNum],
      rewardXp:   REWARD_LABELS[_selectedRewardNum],
      objectives,
      seekerType: _selectedSeekerType,
      difficulty: _selectedDifficulty,
      creatorSig,
    }));
  } else { setTimeout(() => NativeMap_onQuestSaved(true, 'mock-1'), 800); }
}

function NativeMap_onQuestSaved(success, questId) {
  document.getElementById('mqLoading').style.display = 'none';
  if (success) {
    // Achievement hook — quest created
    try {
      const prev = parseInt(localStorage.getItem('scl_quests_created') || '0') || 0;
      localStorage.setItem('scl_quests_created', prev + 1);
      if (typeof Achievements_check === 'function') Achievements_check();
    } catch(e) {}
    document.getElementById('mqSuccess').textContent = '✓ Quest marker placed on the map.';
    document.getElementById('mqSuccess').style.display = 'block';
    document.getElementById('mqName').value = '';
    document.getElementById('mqDesc').value = '';
    document.getElementById('mqLocation').value = '';
    document.getElementById('mqLocationStatus').textContent = '';
    document.getElementById('mqLocationSuggestions').classList.add('hidden');
    document.getElementById('mqMapPreview').classList.add('hidden');
    _questLat = null; _questLng = null;
    // Reset reward selector
    _selectedRewardNum = 1;
    document.querySelectorAll('.mq-reward-btn').forEach(b => b.classList.remove('active'));
    const firstRewardBtn = document.querySelector('.mq-reward-btn[data-num="1"]');
    if (firstRewardBtn) firstRewardBtn.classList.add('active');
    const previewEl = document.getElementById('mqRewardPreviewText');
    if (previewEl) previewEl.textContent = REWARD_LABELS[1];
    // Reset objectives
    ['mqObj1','mqObj2','mqObj3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    // Reset objective reveal
    ['mqObj2Row','mqObj3Row'].forEach(id => {
      const r = document.getElementById(id);
      if (r) r.classList.add('mq-obj-hidden');
    });
    // Reset char counters
    _mqCharCount('mqName','mqNameCount',60);
    _mqCharCount('mqDesc','mqDescCount',280);
    // Reset seeker type
    _selectedSeekerType = 'solo';
    document.querySelectorAll('.mq-seeker-btn').forEach(b => b.classList.remove('active'));
    const firstSeekerBtn = document.querySelector('.mq-seeker-btn[data-seeker="solo"]');
    if (firstSeekerBtn) firstSeekerBtn.classList.add('active');
    // Reset difficulty
    _selectedDifficulty = 1;
    const firstDiffBtn = document.querySelector('[data-diff="1"]');
    if (firstDiffBtn) { firstDiffBtn.closest('.field-group').querySelectorAll('button').forEach(b => b.classList.remove('active')); firstDiffBtn.classList.add('active'); }
    loadMyQuests();
    if (window._mapInstance && typeof NativeMap !== 'undefined') NativeMap.loadQuestMarkers();
  } else {
    document.getElementById('mqError').textContent = '⚠ Failed to save quest. Try again.';
    document.getElementById('mqError').style.display = 'block';
  }
}

function loadMyQuests() {
  if (typeof NativeMap !== 'undefined') NativeMap.loadMyQuests();
}

function NativeMap_onMyQuestsLoaded(questsJson) {
  const quests = _parseJson(questsJson) || [];
  const listEl = document.getElementById('myQuestsList');
  if (!quests.length) { listEl.innerHTML = '<div class="allies-empty">No quests placed yet.</div>'; return; }
  const seekerLabels = { solo: '◈ SOLO', partner: '⚔ PARTNER', group: '✦ GROUP' };
  listEl.innerHTML = quests.map(q => {
    const type = QUEST_TYPES[q.type] || QUEST_TYPES.exploration;
    const objsHtml = (q.objectives && q.objectives.length)
      ? `<div class="my-quest-objs">${q.objectives.map(o => `<div class="my-quest-obj-row">◈ ${_esc(o)}</div>`).join('')}</div>`
      : '';
    const seekerHtml = (q.seekerType && q.seekerType !== '')
      ? `<span class="my-quest-seeker">${seekerLabels[q.seekerType] || q.seekerType}</span>`
      : '';
    return `<div class="my-quest-card" id="myquest_${_esc(q.id)}">
      <div class="my-quest-type-row">
        <div class="my-quest-type" style="color:${type.color}">${type.label}</div>
        ${seekerHtml}
      </div>
      <div class="my-quest-name">${_esc(q.name)}</div>
      ${q.description ? `<div class="my-quest-desc">${_esc(q.description)}</div>` : ''}
      ${objsHtml}
      <div class="my-quest-loc">📍 ${_esc(q.location || '')}</div>
      <button class="ally-remove-btn" onclick="deleteQuest('${_esc(q.id)}')">✕ REMOVE</button>
    </div>`;
  }).join('');
}

function deleteQuest(questId) {
  if (!confirm('Remove this quest marker?')) return;
  if (typeof NativeMap !== 'undefined') NativeMap.deleteQuest(questId);
  else NativeMap_onQuestDeleted(true, questId);
}

function NativeMap_onQuestDeleted(success, questId) {
  if (success) {
    document.getElementById('myquest_' + questId)?.remove();
    const list = document.getElementById('myQuestsList');
    if (list && !list.querySelector('.my-quest-card'))
      list.innerHTML = '<div class="allies-empty">No quests placed yet.</div>';
    if (window._mapInstance && typeof NativeMap !== 'undefined') NativeMap.loadQuestMarkers();
  }
}

/* ================================================
   ACCEPT / SIDE QUESTS
   ================================================ */

// acceptQuest / cancelSideQuest / completeSideQuest / renderSideQuests
// are defined in QuestEngine.js — do not redefine here.

function switchSection(section) {
  ['chart','journal','achievements'].forEach(s => {
    const cap = s.charAt(0).toUpperCase() + s.slice(1);
    const el  = document.getElementById('section' + cap);
    const btn = document.getElementById('btn'     + cap);
    if (!el || !btn) return;
    if (s === section) { el.classList.remove('hidden'); btn.classList.add('active'); }
    else               { el.classList.add('hidden');    btn.classList.remove('active'); }
  });
  if (section === 'achievements' && typeof Achievements_renderPage === 'function') Achievements_renderPage();
}

function switchQuestSection(s) {
  ['life','current','daily','side'].forEach(key => {
    const cap = key.charAt(0).toUpperCase() + key.slice(1);
    const el  = document.getElementById('section' + cap + 'Q');
    const btn = document.getElementById('btn'     + cap + 'Q');
    if (!el || !btn) return;
    if (key === s) { el.classList.remove('hidden'); btn.classList.add('active'); }
    else           { el.classList.add('hidden');    btn.classList.remove('active'); }
  });
  // Hide the shared detail panel whenever the tab changes
  const dp = document.getElementById('questDetailPanel');
  if (dp) { dp.classList.add('hidden'); dp.dataset.activeId = ''; }
  document.querySelectorAll('.quest-tile-inner.active-tile').forEach(el => el.classList.remove('active-tile'));
  if (s === 'side') { renderSideQuests(); _renderSideQWorldQuests(); }
  if (s === 'daily') {
    if (typeof QuestEngine_buildDailyRead === 'function') QuestEngine_buildDailyRead();
    if (typeof _buildFreqQuestList === 'function') try { _buildFreqQuestList(); } catch(e) {}
  }
}

/* ================================================
   JOURNAL BUILDER
   ================================================ */
function buildJournal() {
  const pd     = playerData;
  const numMap = { lp: pd.lp, ex: pd.ex, cl: pd.cl, so: pd.so, ou: pd.ou, ac: pd.ac, th: pd.th };
  const container = document.getElementById('journalStrips');
  container.innerHTML = '';

  STRIPS.forEach(strip => {
    const numObj   = numMap[strip.id];
    const root     = numObj.root;       // already master-preserving (e.g. 11 for 38/11)
    const compound = numObj.compound;
    const rData    = ROOT[root] || ROOT[reduceToSimple(root)] || ROOT[9];
    const isMaster = MASTERS.has(root);
    const colorVar = 'var(' + strip.cssVar + ')';
    const dimVar   = 'var(' + strip.cssVar + '-dim)';
    const displayNum = fmt(root, compound);

    // ── Position-specific core text ───────────────────────────────────────
    let coreText = '';
    if      (strip.id === 'lp') coreText = rData.lp   || '';
    else if (strip.id === 'ex') coreText = rData.ex   || '';
    else if (strip.id === 'so') coreText = rData.soul || '';
    else if (strip.id === 'ou') coreText = rData.outer|| '';
    else if (strip.id === 'ac') coreText = rData.ach  || '';
    else if (strip.id === 'th') coreText = rData.theme|| '';
    else if (strip.id === 'cl') {
      const cData = CALLING[root] || CALLING[reduceToSimple(root)] || CALLING[9];
      coreText = cData.summary + '\n\n' + cData.career + '\n\n✦ Gift: ' + cData.gift;
    }

    // ── Compound flavour (only when compound differs from root) ───────────
    const hasCompound = compound && compound !== root && COMPOUND_DESC[compound];
    const compoundHtml = hasCompound ? `
      <div class="journal-section">
        <div class="journal-section-label" style="color:${colorVar};">◈ COMPOUND — ${compound}/${root}</div>
        <div class="journal-section-text">${COMPOUND_DESC[compound]}</div>
      </div>` : '';

    // ── Compound digit influence (lp / ex / cl only) ──────────────────────
    const rawInfluence = ['lp','ex','cl'].includes(strip.id)
      ? buildCompoundInfluence(root, compound, strip.id) : '';
    const influenceHtml = rawInfluence
      ? `<div class="journal-section">${rawInfluence}</div>` : '';

    // ── Position description ───────────────────────────────────────────────
    const coreHtml = coreText ? `
      <div class="journal-section">
        <div class="journal-section-label" style="color:${colorVar};">◈ ${strip.label.toUpperCase()}</div>
        <div class="journal-section-text">${coreText.replace(/\n\n/g,'<br><br>')}</div>
      </div>` : '';

    // ── Shadow ────────────────────────────────────────────────────────────
    const shadowHtml = rData.shadow ? `
      <div class="journal-section journal-section-shadow">
        <div class="journal-section-label" style="color:var(--rose);">◈ SHADOW</div>
        <div class="journal-section-text">${rData.shadow}</div>
      </div>` : '';

    // ── Integration ───────────────────────────────────────────────────────
    const integrationHtml = rData.integration ? `
      <div class="journal-section journal-section-integration">
        <div class="journal-section-label" style="color:${colorVar};">◈ INTEGRATION</div>
        <div class="journal-section-text">${rData.integration}</div>
      </div>` : '';

    // ── Affirmation ───────────────────────────────────────────────────────
    const affHtml = rData.aff ? `
      <div class="journal-affirmation" style="color:${colorVar};border-color:${dimVar};">${rData.aff}</div>` : '';

    const el = document.createElement('div');
    el.className = 'journal-strip';
    el.innerHTML = `
      <div class="strip-trigger" onclick="toggleStrip(this.closest('.journal-strip'))">
        <div class="strip-accent-bar" style="background:${colorVar};"></div>
        <div class="strip-main">
          <div class="strip-number" style="color:${colorVar};">${displayNum}</div>
          <div class="strip-info">
            <div class="strip-label" style="color:${colorVar};">
              ${strip.label}
              ${isMaster ? `<span class="strip-master-badge" style="color:${colorVar};border-color:${dimVar};">MASTER</span>` : ''}
            </div>
            <div class="strip-role">${strip.role}</div>
            <div class="strip-name" style="color:${colorVar};opacity:0.7;">${rData.name || ''}</div>
          </div>
        </div>
        <div class="strip-chevron">▶</div>
      </div>
      <div class="strip-body">
        <div class="strip-content">
          ${compoundHtml}
          ${coreHtml}
          ${influenceHtml}
          ${shadowHtml}
          ${integrationHtml}
          ${affHtml}
        </div>
      </div>`;
    // Append stored daily reflections for this position
    try {
      const reflStore = JSON.parse(localStorage.getItem('scl_reflections') || '{}');
      const posRefs = Object.entries(reflStore)
        .filter(function(e) { return e[0].startsWith('dfreq_' + strip.id + '_'); })
        .sort(function(a, b) { return b[1].date - a[1].date; })
        .slice(0, 5);
      if (posRefs.length) {
        const content = el.querySelector('.strip-content');
        if (content) content.insertAdjacentHTML('beforeend',
          '<div class="strip-reflections"><div class="journal-section-label" style="color:' + colorVar + ';">◈ MY REFLECTIONS</div>' +
          posRefs.map(function(e) {
            const r = e[1];
            return '<div class="strip-reflection-entry"><div class="strip-reflection-date">' + new Date(r.date).toLocaleDateString() + '</div><div class="strip-reflection-text">' + (r.text||'').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div></div>';
          }).join('') + '</div>');
      }
    } catch(e) {}
    container.appendChild(el);
  });
}

function toggleStrip(strip) {
  const opening = !strip.classList.contains('open');
  strip.classList.toggle('open');
  if (opening) {
    // Manually scroll so the strip trigger sits 116px below the viewport top,
    // clearing both sticky bars (tab-bar ~49px + section-toggle ~46px + buffer)
    setTimeout(() => {
      const rect = strip.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 116;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 60);
  }
}

/* ================================================
   CHART BUILDER
   (STAT_NAMES, ELECTRIC/MAGNETIC/AETHER_NUMS, POLARITY_COLORS/CONFIGS, AETHER_TIERS → data.js)
   ================================================ */
function getPolarity(n) {
  if (AETHER_NUMS.has(n))   return 'aether';
  if (ELECTRIC_NUMS.has(n)) return 'electric';
  if (MAGNETIC_NUMS.has(n)) return 'magnetic';
  return null;
}

function countNums0to9(arr) {
  const c = {};
  arr.forEach(n => { if (n >= 0 && n <= 9) c[n] = (c[n] || 0) + 1; });
  return c;
}

function buildCharts() {
  const { lp, ex, cl, so, ou, ac, th, name, m, d, y } = playerData;

  // Keep zeros for aether counting — include 0s from birthdate
  const bdDigitsAll = [...String(m), ...String(d), ...String(y)].map(Number);
  const bdCounts    = countNums0to9(bdDigitsAll);

  const nameLetters = name.toUpperCase().replace(/[^A-Z]/g,'').split('');
  const nameVals    = nameLetters.map(l => reduceLetterVal(LV[l] || 0)).filter(n => n > 0);
  const nameCounts  = countNums1to9(nameVals);

  // Base = LE (birthdate) + IN (name) only. QU (quests) is added on top by QuestEngine.
  const combined = {};
  for (let i = 0; i <= 9; i++) {
    combined[i] = (bdCounts[i] || 0) + (nameCounts[i] || 0);
  }

  const maxTot = Math.max(...Object.values(combined), 1);

  // Primary frequency highlights — CL, LP, EX roots drive main quest/life path/expression
  const primaryStats = new Set([
    cl.root > 9 ? (cl.root === 11 ? 2 : cl.root === 22 ? 4 : 6) : cl.root,
    lp.root > 9 ? (lp.root === 11 ? 2 : lp.root === 22 ? 4 : 6) : lp.root,
    ex.root > 9 ? (ex.root === 11 ? 2 : ex.root === 22 ? 4 : 6) : ex.root,
  ]);
  const primaryLabels = {
    [cl.root > 9 ? (cl.root === 11 ? 2 : cl.root === 22 ? 4 : 6) : cl.root]: 'CL',
    [lp.root > 9 ? (lp.root === 11 ? 2 : lp.root === 22 ? 4 : 6) : lp.root]: 'LP',
    [ex.root > 9 ? (ex.root === 11 ? 2 : ex.root === 22 ? 4 : 6) : ex.root]: 'EX',
  };

  function makeStatRow(i) {
    const bq  = bdCounts[i]    || 0;
    const nq  = nameCounts[i]  || 0;
    const base = combined[i]   || 0;
    const pol = getPolarity(i);
    const { accent, dim } = POLARITY_COLORS[pol] || POLARITY_COLORS.aether;
    const fillPct  = Math.round((base / maxTot) * 100);
    const statName = i === 0 ? 'VOID' : STAT_NAMES[i];
    const isPrimary = primaryStats.has(i);
    const primLabel = primaryLabels[i] || '';

    const row = document.createElement('div');
    row.className = 'stat-chart-row' + (base === 0 ? ' stat-row-empty' : '') + (isPrimary ? ' stat-row-primary' : '');
    row.innerHTML = `
      <div class="stat-col-num" style="color:${accent};">${i}</div>
      <div class="stat-col-name">
        <div class="stat-name-text">
          ${statName}${isPrimary ? `<span class="stat-primary-pip" style="color:${accent};">${primLabel}</span>` : ''}
        </div>
        <div class="stat-fill-bar"><div class="stat-fill-inner" style="width:${fillPct}%;background:${accent};"></div></div>
      </div>
      <div class="stat-col-box" style="color:var(--amber);border-color:${bq > 0 ? 'rgba(180,120,40,0.35)' : 'var(--border)'};">${bq || '—'}</div>
      <div class="stat-col-box" style="color:var(--sage);border-color:${nq > 0 ? 'rgba(100,160,100,0.35)' : 'var(--border)'};">${nq || '—'}</div>
      <div class="stat-col-box" id="statQU_${i}" style="color:var(--text-dim);">—</div>
      <div class="stat-col-box stat-col-total" id="statTOT_${i}"
           data-base="${base}" data-accent="${accent}" data-dim="${dim}"
           style="color:${base > 0 ? accent : 'var(--text-dim)'};border-color:${base > 0 ? dim : 'var(--border)'};"
      >${base || '—'}</div>`;
    // Hook QuestEngine after DOM is ready
    setTimeout(() => { if (typeof QuestEngine_setStatBase === 'function') QuestEngine_setStatBase(i, base, accent, dim); }, 0);
    return row;
  }

  const elEl = document.getElementById('statRowsElectric');
  const mgEl = document.getElementById('statRowsMagnetic');
  const aeEl = document.getElementById('statRowsAether');
  if (elEl) { elEl.innerHTML = ''; [1,3,5,7].forEach(i => elEl.appendChild(makeStatRow(i))); }
  if (mgEl) { mgEl.innerHTML = ''; [2,4,6,8].forEach(i => mgEl.appendChild(makeStatRow(i))); }
  if (aeEl) { aeEl.innerHTML = ''; [0,9].forEach(i => aeEl.appendChild(makeStatRow(i))); }

  try { buildStatBenefits(); } catch(e) { console.error('buildStatBenefits:', e); }
}

function buildStatBenefits() {
  const el = document.getElementById('statBenefitsList');
  if (!el || !playerData) return;
  const pd = playerData;

  const FREQ_KEYWORDS = {
    1:'Leadership · Courage',    2:'Sensitivity · Partnership',
    3:'Creativity · Expression', 4:'Discipline · Structure',
    5:'Freedom · Adaptability',  6:'Service · Harmony',
    7:'Wisdom · Introspection',  8:'Authority · Abundance',
    9:'Compassion · Completion', 11:'Illumination · Intuition',
    22:'Master Builder',         33:'Healing · Devotion',
    44:'Foundation · Legacy',
  };

  const freqs = [
    { label:'LIFE PATH',    obj:pd.lp, color:'var(--gold)'    },
    { label:'EXPRESSION',   obj:pd.ex, color:'var(--purple)'  },
    { label:'LIFE CALLING', obj:pd.cl, color:'var(--teal)'    },
    { label:'SOUL',         obj:pd.so, color:'var(--rose)'    },
    { label:'OUTER',        obj:pd.ou, color:'var(--silver)'  },
    { label:'ACHIEVEMENT',  obj:pd.ac, color:'var(--amber)'   },
    { label:'THEME',        obj:pd.th, color:'var(--text-mid)'},
  ];

  let html = '<div class="sb-section-label">◈ FREQUENCIES</div>';
  freqs.forEach(f => {
    if (!f.obj) return;
    const num = (f.obj.compound && f.obj.compound !== f.obj.root)
      ? f.obj.compound + '<span class="sb-root">/' + f.obj.root + '</span>'
      : String(f.obj.root);
    const kw = FREQ_KEYWORDS[f.obj.root] || '';
    html += `<div class="sb-row">
      <span class="sb-label">${f.label}</span>
      <span class="sb-num" style="color:${f.color};">${num}</span>
      <span class="sb-kw">${kw}</span>
    </div>`;
  });

  // Unlocked / ascending stats
  const bonuses = [];
  for (let i = 0; i <= 9; i++) {
    const totEl = document.getElementById('statTOT_' + i);
    if (!totEl) continue;
    const state  = totEl.dataset.statState;
    if (state === 'ascending' || state === 'unlocked' || state === 'void-master') {
      const accent   = totEl.dataset.accent || 'var(--gold)';
      const sName    = i === 0 ? 'VOID' : (typeof STAT_NAMES !== 'undefined' ? STAT_NAMES[i] : String(i));
      const icon     = state === 'ascending' ? '▲' : state === 'void-master' ? '✦' : '◈';
      const stateStr = state === 'void-master' ? 'VOID MASTER' : state.toUpperCase();
      bonuses.push(`<div class="sb-row sb-bonus">
        <span class="sb-bonus-icon" style="color:${accent};">${icon}</span>
        <span class="sb-label">${sName}</span>
        <span class="sb-status" style="color:${accent};">${stateStr}</span>
      </div>`);
    }
  }
  if (bonuses.length) {
    html += '<div class="sb-section-label">◈ UNLOCKED</div>' + bonuses.join('');
  }

  // Polarity breakdown
  try {
    const bdAll   = [...String(pd.m), ...String(pd.d), ...String(pd.y)].map(Number);
    const bdC     = countNums0to9(bdAll);
    const nVals   = pd.name.toUpperCase().replace(/[^A-Z]/g,'').split('').map(l => reduceLetterVal(LV[l]||0)).filter(n=>n>0);
    const nC      = countNums1to9(nVals);
    let elec=0, mag=0, aeth=0;
    [1,3,5,7].forEach(i=>{ elec+=(bdC[i]||0)+(nC[i]||0); });
    [2,4,6,8].forEach(i=>{ mag +=(bdC[i]||0)+(nC[i]||0); });
    [0,9].forEach(i=>    { aeth+=(bdC[i]||0)+(nC[i]||0); });
    const tot = elec+mag+aeth || 1;
    html += '<div class="sb-section-label">◈ POLARITY</div>';
    html += `<div class="sb-row"><span class="sb-label" style="color:var(--teal);">⚡ ELECTRIC</span><span class="sb-num" style="color:var(--teal);">${elec}</span><span class="sb-kw">${Math.round(elec/tot*100)}%</span></div>`;
    html += `<div class="sb-row"><span class="sb-label" style="color:var(--purple);">◉ MAGNETIC</span><span class="sb-num" style="color:var(--purple);">${mag}</span><span class="sb-kw">${Math.round(mag/tot*100)}%</span></div>`;
    html += `<div class="sb-row"><span class="sb-label" style="color:var(--gold);">✦ AETHER</span><span class="sb-num" style="color:var(--gold);">${aeth}</span><span class="sb-kw">${Math.round(aeth/tot*100)}%</span></div>`;
  } catch(e) {}

  el.innerHTML = html;
}

function buildPolarityCard() {
  const { lp, ex, cl, so, ou, ac, th, name, m, d, y } = playerData;

  const bdDigitsAll = [...String(m), ...String(d), ...String(y)].map(Number);
  const bdCounts    = countNums0to9(bdDigitsAll);
  const nameLetters = name.toUpperCase().replace(/[^A-Z]/g,'').split('');
  const nameVals    = nameLetters.map(l => reduceLetterVal(LV[l] || 0)).filter(n => n > 0);
  const nameCounts  = countNums1to9(nameVals);

  let elec = 0, mag = 0, aeth = 0;
  for (let i = 0; i <= 9; i++) {
    const tot = (bdCounts[i]||0) + (nameCounts[i]||0);
    const pol = getPolarity(i);
    if (pol === 'electric') elec += tot;
    else if (pol === 'magnetic') mag += tot;
    else if (pol === 'aether')   aeth += tot;
  }

  const total = elec + mag + aeth || 1;
  const elecPct = Math.round((elec / total) * 100);
  const magPct  = Math.round((mag  / total) * 100);
  const aethPct = 100 - elecPct - magPct;

  // Dominant polarity
  const dominant = elec >= mag && elec >= aeth ? 'electric'
                 : mag  >= elec && mag  >= aeth ? 'magnetic'
                 : 'aether';

  // Find highest matching tier (AETHER_TIERS from data.js)
  const aetherTier = aeth >= 6 ? AETHER_TIERS[2]
                   : aeth >= 3 ? AETHER_TIERS[1]
                   : null;

  const cfg = POLARITY_CONFIGS[dominant];
  const card = document.getElementById('polarityCard');
  if (!card) return;

  card.innerHTML = `
    <div class="polarity-inner">
      <div class="polarity-badge-row">
        ${aetherTier ? `
        <div class="polarity-badge" style="color:var(--gold);border-color:var(--gold-dim);">
          <span class="polarity-icon">✦</span>
          <span class="polarity-type" style="color:var(--gold);">AETHERIC</span>
        </div>` : ''}
        <div class="polarity-badge" style="color:${cfg.color};border-color:${cfg.dim};">
          <span class="polarity-icon">${cfg.icon}</span>
          <span class="polarity-type" style="color:${cfg.color};">${cfg.label}</span>
        </div>
      </div>
      <div class="polarity-desc">${cfg.desc}</div>
      <div class="polarity-bar-wrap">
        <div class="polarity-bar">
          <div class="polarity-bar-elec"  style="width:${elecPct}%;" title="Electric ${elecPct}%"></div>
          <div class="polarity-bar-mag"   style="width:${magPct}%;"  title="Magnetic ${magPct}%"></div>
          <div class="polarity-bar-aeth"  style="width:${aethPct}%;" title="Aether ${aethPct}%"></div>
        </div>
      </div>
      <div class="polarity-counts">
        <span style="color:var(--teal);">⚡ ${elec}</span>
        <span style="color:var(--border-glow);">·</span>
        <span style="color:var(--purple);">◉ ${mag}</span>
        <span style="color:var(--border-glow);">·</span>
        <span style="color:var(--gold);">✦ ${aeth}</span>
      </div>
      <div class="polarity-legend">
        <span style="color:var(--teal);">⚡ ELECTRIC</span>
        <span style="color:var(--purple);">◉ MAGNETIC</span>
        <span style="color:var(--gold);">✦ AETHER</span>
      </div>
      ${aetherTier ? `
      <div class="aether-tier-banner">
        <div class="aether-tier-header">
          <span class="aether-tier-icons" style="color:var(--gold);">${aetherTier.icon}</span>
          <span class="aether-tier-label" style="color:var(--gold);">${aetherTier.label}</span>
          <span class="aether-tier-count" style="color:var(--gold-dim);">${aeth} AETHERIC</span>
        </div>
        <div class="aether-tier-desc">${aetherTier.desc}</div>
      </div>` : ''}
    </div>`;
}

function renderStackedBarChart() {} // stub — kept so any old calls don't throw

/* ================================================
   CHARACTER CARD — CORE NUMBERS
   ================================================ */
function buildCharCoreNumbers(lp, cl, ex) {
  const container = document.getElementById('charCoreNumbers');
  if (!container) return;
  const ARCHETYPES = { 1:'The Pioneer', 2:'The Mediator', 3:'The Creator', 4:'The Builder', 5:'The Explorer', 6:'The Nurturer', 7:'The Seeker', 8:'The Achiever', 9:'The Humanitarian', 11:'The Intuitive', 22:'The Master Builder', 33:'The Master Teacher', 44:'The Architect' };
  const nums = [
    { label: 'Soul',  num: fmt(cl.root, cl.compound), root: cl.root, color: 'var(--gold)'   },
    { label: 'LP',    num: fmt(lp.root, lp.compound), root: lp.root, color: 'var(--purple)' },
    { label: 'DE',    num: fmt(ex.root, ex.compound), root: ex.root, color: 'var(--teal)'   }
  ];
  container.innerHTML = nums.map(n => {
    const tip = ARCHETYPES[n.root] || '';
    return `<div class="core-num-block" data-tip="${tip}">
      <div class="core-num-value scan-in" style="color:${n.color};" data-target="${n.num}">0</div>
      <div class="core-num-label">${n.label}</div>
      ${tip ? `<div class="core-num-tip">${tip}</div>` : ''}
    </div>`;
  }).join('<div class="core-num-sep">◈</div>');

  // Count-up animation
  container.querySelectorAll('.scan-in').forEach(el => {
    const target = el.dataset.target;
    const isCompound = target.includes('/');
    if (isCompound) {
      setTimeout(() => { el.textContent = target; el.classList.add('scan-done'); }, 600 + Math.random() * 400);
      return;
    }
    const end = parseInt(target, 10);
    let cur = 0;
    const step = Math.max(1, Math.floor(end / 8));
    const iv = setInterval(() => {
      cur = Math.min(cur + step, end);
      el.textContent = String(cur);
      if (cur >= end) { clearInterval(iv); el.classList.add('scan-done'); }
    }, 60);
  });
}

/* ================================================
   CHARACTER CARD — AVATAR + NAME
   ================================================ */
const LS_AVATAR     = 'scl_avatar';
const LS_CHAR_ALIAS = 'scl_char_alias';

// ── Preset pools
const AVATAR_PIXEL = [
  { id:'p1', label:'WARRIOR',  art:'⚔️' },
  { id:'p2', label:'MAGE',     art:'🔮' },
  { id:'p3', label:'ROGUE',    art:'🗡️' },
  { id:'p4', label:'RANGER',   art:'🏹' },
  { id:'p5', label:'CLERIC',   art:'✨' },
  { id:'p6', label:'BARD',     art:'🎵' },
  { id:'p7', label:'DRUID',    art:'🌿' },
  { id:'p8', label:'NECRO',    art:'💀' },
  { id:'p9', label:'PALADIN',  art:'🛡️' },
];
const AVATAR_RPG = [
  { id:'r1', label:'THE SEER',      art:'🧿' },
  { id:'r2', label:'SHADOW WALK',   art:'🌑' },
  { id:'r3', label:'FLAME KEEPER',  art:'🔥' },
  { id:'r4', label:'STORM CALLER',  art:'⚡' },
  { id:'r5', label:'VOID TOUCHED',  art:'🌀' },
  { id:'r6', label:'LIGHT BEARER',  art:'☀️' },
  { id:'r7', label:'IRON WILL',     art:'⚙️' },
  { id:'r8', label:'BLOOD OATH',    art:'🩸' },
  { id:'r9', label:'STAR CHILD',    art:'⭐' },
];

// ── Avatar picker modal
function openAvatarPicker() {
  _buildAvatarGrid('apGridPixel', AVATAR_PIXEL);
  _buildAvatarGrid('apGridRpg',   AVATAR_RPG);
  document.getElementById('avatarPickerOverlay').classList.remove('hidden');
}
function closeAvatarPicker(e) {
  if (e && e.target !== document.getElementById('avatarPickerOverlay')) return;
  document.getElementById('avatarPickerOverlay').classList.add('hidden');
}
function switchAvatarTab(tab) {
  const tabs = { pixel: 'Pixel', rpg: 'Rpg', upload: 'Upload' };
  Object.keys(tabs).forEach(t => {
    document.getElementById('apGrid'  + tabs[t])?.classList.toggle('hidden', t !== tab);
    document.getElementById('apTab'   + tabs[t])?.classList.toggle('active',  t === tab);
  });
}
function _buildAvatarGrid(elId, items) {
  const el = document.getElementById(elId);
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
  const saved = localStorage.getItem(LS_AVATAR) || '';
  el.innerHTML = items.map(a =>
    `<div class="ap-preset${saved === a.id ? ' ap-preset--active' : ''}"
          onclick="selectPresetAvatar('${a.id}','${a.art.replace(/'/g,"\\'")}')">
       <div class="ap-preset-art">${a.art}</div>
       <div class="ap-preset-label">${a.label}</div>
     </div>`
  ).join('');
}
function selectPresetAvatar(id, art) {
  localStorage.setItem(LS_AVATAR, id);
  _setAvatarEmoji(art);
  // highlight active
  document.querySelectorAll('.ap-preset').forEach(el => {
    el.classList.toggle('ap-preset--active',
      el.getAttribute('onclick').includes("'" + id + "'"));
  });
  document.getElementById('avatarPickerOverlay').classList.add('hidden');
}

// ── Upload
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    setAvatarImage(dataUrl);
    try { localStorage.setItem(LS_AVATAR, dataUrl); } catch(err) {}
    document.getElementById('avatarPickerOverlay').classList.add('hidden');
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}
function setAvatarImage(dataUrl) {
  const img = document.getElementById('charAvatarImg');
  const ph  = document.getElementById('charAvatarPlaceholder');
  if (!img || !ph) return;
  document.getElementById('charAvatarEmoji')?.remove();
  img.src = dataUrl;
  img.classList.remove('hidden');
  ph.classList.add('hidden');
}
function _setAvatarEmoji(art) {
  const frame = document.querySelector('.char-avatar-frame');
  const img   = document.getElementById('charAvatarImg');
  const ph    = document.getElementById('charAvatarPlaceholder');
  if (!frame) return;
  img?.classList.add('hidden');
  ph?.classList.add('hidden');
  let emoji = document.getElementById('charAvatarEmoji');
  if (!emoji) {
    emoji = document.createElement('div');
    emoji.id = 'charAvatarEmoji';
    emoji.className = 'char-avatar-emoji';
    frame.appendChild(emoji);
  }
  emoji.textContent = art;
}
function removeAvatar() {
  localStorage.removeItem(LS_AVATAR);
  document.getElementById('charAvatarEmoji')?.remove();
  const img = document.getElementById('charAvatarImg');
  const ph  = document.getElementById('charAvatarPlaceholder');
  if (img) { img.src = ''; img.classList.add('hidden'); }
  if (ph)  ph.classList.remove('hidden');
  document.getElementById('avatarPickerOverlay').classList.add('hidden');
}
function loadSavedAvatar() {
  try {
    const saved = localStorage.getItem(LS_AVATAR);
    if (!saved) return;
    if (saved.startsWith('data:')) {
      setAvatarImage(saved);
    } else {
      const found = [...AVATAR_PIXEL, ...AVATAR_RPG].find(a => a.id === saved);
      if (found) _setAvatarEmoji(found.art);
    }
  } catch(e) {}
}

// ── Character name alias
function openNameEdit() {
  const alias = localStorage.getItem(LS_CHAR_ALIAS) || '';
  const input = document.getElementById('charAliasInput');
  if (input) input.value = alias;
  document.getElementById('nameEditOverlay').classList.remove('hidden');
  setTimeout(() => input?.focus(), 80);
}
function closeNameEdit(e) {
  if (e && e.target !== document.getElementById('nameEditOverlay')) return;
  document.getElementById('nameEditOverlay').classList.add('hidden');
}
function saveCharAlias() {
  const val = document.getElementById('charAliasInput').value.trim();
  if (val) {
    localStorage.setItem(LS_CHAR_ALIAS, val);
    document.getElementById('charCardName').textContent = val.toUpperCase();
    document.getElementById('headerName').textContent   = val.toUpperCase();
  }
  document.getElementById('nameEditOverlay').classList.add('hidden');
}
function resetCharAlias() {
  localStorage.removeItem(LS_CHAR_ALIAS);
  const realName = (typeof playerData !== 'undefined' ? playerData.name : '') || '';
  document.getElementById('charCardName').textContent = realName.toUpperCase();
  document.getElementById('headerName').textContent   = realName.toUpperCase();
  document.getElementById('nameEditOverlay').classList.add('hidden');
}

/* ================================================
   CHARACTER CARD — GIFTS / SKILLS
   Sources: day of birth (d), soul (so), outer (ou)
   ================================================ */
function buildGifts(d, so, ou) {
  const container = document.getElementById('charGifts');
  if (!container) return;

  const dayRoot = reduce(d);
  const sources = [
    { root: dayRoot,  key: 'day',   label: 'DAY',   color: 'var(--amber)'  },
    { root: so.root,  key: 'soul',  label: 'SOUL',  color: 'var(--rose)'   },
    { root: ou.root,  key: 'outer', label: 'OUTER', color: 'var(--sage)'   }
  ];

  const gifts = [];
  sources.forEach(src => {
    const entry = GIFTS[src.root] || GIFTS[reduceToSimple(src.root)] || GIFTS[9];
    const gift  = entry[src.key] || entry.day;
    gifts.push({ ...gift, sourceLabel: src.label, color: src.color, root: src.root });
  });

  // Store gift data globally so toggleGiftInfo can read it
  window._giftsData = gifts;

  container.innerHTML = gifts.map((g, i) => `
    <div class="gift-glyph" id="gift_${i}" onclick="toggleGiftInfo(${i}, event)">
      <div class="gift-glyph-icon" style="color:${g.color};">${g.glyph}</div>
      <div class="gift-glyph-word" style="color:${g.color};">${g.word}</div>
      <div class="gift-glyph-source">${g.sourceLabel}</div>
    </div>`
  ).join('');

  // Create a single shared popup at body level if not already present
  if (!document.getElementById('giftPopup')) {
    const popup = document.createElement('div');
    popup.id = 'giftPopup';
    popup.className = 'gift-info-box';
    popup.style.display = 'none';
    popup.innerHTML = `
      <div class="gift-info-title"  id="giftPopupTitle"></div>
      <div class="gift-info-source" id="giftPopupSource"></div>
      <div class="gift-info-desc"   id="giftPopupDesc"></div>`;
    document.body.appendChild(popup);

    // Tap anywhere else to close
    document.addEventListener('click', e => {
      if (!e.target.closest('.gift-glyph') && !e.target.closest('#giftPopup')) {
        closeGiftPopup();
      }
    });
  }
}

function closeGiftPopup() {
  const popup = document.getElementById('giftPopup');
  if (popup) popup.style.display = 'none';
  document.querySelectorAll('.gift-glyph.gift-open').forEach(g => g.classList.remove('gift-open'));
}

function toggleGiftInfo(index, event) {
  event.stopPropagation();
  const el     = document.getElementById('gift_' + index);
  const popup  = document.getElementById('giftPopup');
  const gifts  = window._giftsData;
  if (!el || !popup || !gifts) return;

  // If already open for this glyph, close it
  if (el.classList.contains('gift-open')) {
    closeGiftPopup();
    return;
  }

  // Close any other open glyph
  closeGiftPopup();
  el.classList.add('gift-open');

  // Fill content
  const g = gifts[index];
  document.getElementById('giftPopupTitle').innerHTML  = `<span style="color:${g.color}">${g.glyph} ${g.word}</span>`;
  document.getElementById('giftPopupSource').innerHTML = `<span style="color:${g.color}">SOURCE: ${g.sourceLabel} · ${g.root}</span>`;
  document.getElementById('giftPopupDesc').textContent = g.desc;

  // Show offscreen first to measure height
  popup.style.display = 'block';
  popup.style.top  = '-9999px';
  popup.style.left = '-9999px';

  const triggerRect = el.getBoundingClientRect();
  const popW = popup.offsetWidth  || 260;
  const popH = popup.offsetHeight || 160;
  const vw   = window.innerWidth;
  const vh   = window.innerHeight;
  const gap  = 8;

  // Prefer below, flip above if not enough room
  let top = triggerRect.bottom + gap;
  if (top + popH > vh - 8) top = triggerRect.top - popH - gap;
  top = Math.max(8, top);

  // Centre on glyph, clamp to viewport edges
  let left = triggerRect.left + triggerRect.width / 2 - popW / 2;
  left = Math.max(8, Math.min(left, vw - popW - 8));

  popup.style.top  = top  + 'px';
  popup.style.left = left + 'px';
}

/* ================================================
   COMPOUND INFLUENCE ENGINE
   For Life Path, Expression, Life Calling quests only.
   Weaves compound digit influences and root quality
   into the quest description.
   ================================================ */

// (FIELD_LABELS, ROOT_INFLUENCE, DIGIT_INFLUENCE → data.js)

/**
 * Resolve a compound number into its 2-digit form and constituent digits.
 * Returns { twoDigit, digitA, digitB } where twoDigit is the displayable
 * 2-digit compound and digitA/digitB are its constituent digits (0–9).
 */
function resolveCompoundDigits(root, compound) {
  // If compound is already 2 digits, use directly
  // If compound > 99, reduce one step at a time until 2 digits
  let c = compound || root;
  while (String(c).length > 2) {
    c = String(c).split('').reduce((a, d) => a + +d, 0);
  }
  const s = String(c).padStart(2, '0');
  return {
    twoDigit: c,
    digitA: parseInt(s[0], 10),
    digitB: parseInt(s[1], 10),
  };
}

/**
 * Build the compound influence paragraph for Life Path, Expression, or Calling.
 * Returns HTML string to be injected after the main quest description.
 */
function buildCompoundInfluence(root, compound, field) {
  // Only apply to the three major fields
  if (!FIELD_LABELS[field]) return '';

  const isMaster = MASTERS.has(root);
  const { twoDigit, digitA, digitB } = resolveCompoundDigits(root, compound);

  // For non-master numbers with no compound (single digit), nothing to add
  if (!isMaster && (!compound || compound === root)) return '';

  const rootInfluence = ROOT_INFLUENCE[field][reduceToSimple(root)] || '';
  const infA = DIGIT_INFLUENCE[field][digitA] || '';
  const infB = DIGIT_INFLUENCE[field][digitB] || '';

  // Whether the root is a "hidden" number different from both digits
  const rootIsHidden = isMaster
    ? (reduceToSimple(root) !== digitA && reduceToSimple(root) !== digitB)
    : false;

  let html = `<div class="compound-influence">`;
  html += `<div class="ci-header">◈ COMPOUND INFLUENCE — ${twoDigit !== root ? twoDigit + '/' + root : root}</div>`;

  // Digit A influence
  if (infA) html += `<div class="ci-digit"><span class="ci-digit-num">${digitA}</span><span class="ci-digit-text">${infA}</span></div>`;
  // Digit B influence (skip if same digit as A — e.g. 77 — merge into one statement)
  if (infB && digitB !== digitA) {
    html += `<div class="ci-digit"><span class="ci-digit-num">${digitB}</span><span class="ci-digit-text">${infB}</span></div>`;
  } else if (digitB === digitA && infA) {
    // doubled digit — already covered, add emphasis note
    html += `<div class="ci-doubled">Both digits are ${digitA} — this frequency is doubled in intensity, not split between two qualities.</div>`;
  }

  // Root influence — only show when root is different from the digits
  if (rootIsHidden && rootInfluence) {
    html += `<div class="ci-root"><span class="ci-root-label">ROOT ${reduceToSimple(root)}</span><span class="ci-root-text">${rootInfluence}</span></div>`;
  }

  html += `</div>`;
  return html;
}

/* ================================================
   QUEST DATA RESOLVER
   Merges compound flavour text with root quest content.
   ================================================ */
function getQuestData(root, compound, field) {
  const isMaster = MASTERS.has(root);
  const base = isMaster
    ? (MASTER_QUESTS[root] || MASTER_QUESTS[11])
    : (NUM_QUESTS[root] || NUM_QUESTS[9]);

  // Look up compound flavour — use compound if it exists, otherwise fall back to root
  const compoundKey = (compound && compound !== root) ? compound : root;
  const flavour = COMPOUND_DESC[compoundKey] || COMPOUND_DESC[root] || '';

  // Compound influence section (only for lp/ex/cl)
  const influence = field ? buildCompoundInfluence(root, compound, field) : '';

  // Merge: compound flavour leads, then root mission, then compound influence
  const mergedDesc = (flavour ? flavour + '\n\n' : '') + base.desc + (influence ? '\n\n' + influence : '');

  return { ...base, desc: mergedDesc };
}

/* ================================================
   CYCLE CALCULATIONS (birthday-anchored)
   ================================================ */
function getCycleAnchor(m, d) {
  const now        = new Date();
  const thisYear   = now.getFullYear();
  const bdThisYear = new Date(thisYear, m - 1, d);
  const cycleStartYear = now >= bdThisYear ? thisYear : thisYear - 1;
  const lastBirthday   = new Date(cycleStartYear, m - 1, d);
  const daysSinceBd    = Math.floor((now - lastBirthday) / 86400000);
  return { cycleStartYear, lastBirthday, daysSinceBd };
}

function calcPersonalYear(m, d) {
  const { cycleStartYear } = getCycleAnchor(m, d);
  return { root: reduce(m + d + cycleStartYear), cycleStartYear };
}

function calcPinnacles(m, d, y, lp) {
  const lpSimple = reduceToSimple(lp.root);
  const p1 = { root: reduce(m + d),            startAge: 0,             endAge: 36 - lpSimple };
  const p2 = { root: reduce(d + y),             startAge: p1.endAge + 1, endAge: p1.endAge + 9 };
  const p3 = { root: reduce(p1.root + p2.root), startAge: p2.endAge + 1, endAge: p2.endAge + 9 };
  const p4 = { root: reduce(m + y),             startAge: p3.endAge + 1, endAge: null };
  return [p1, p2, p3, p4];
}

function calcPersonalMonth(m, d) {
  const { lastBirthday } = getCycleAnchor(m, d);
  const now = new Date();
  let monthsElapsed = (now.getFullYear() - lastBirthday.getFullYear()) * 12
                    + (now.getMonth() - lastBirthday.getMonth());
  if (now.getDate() < lastBirthday.getDate()) monthsElapsed--;
  monthsElapsed = Math.max(0, monthsElapsed);
  const monthNum = (monthsElapsed % 12) + 1;
  const py = calcPersonalYear(m, d).root;
  return { root: reduce(py + monthNum), monthNum };
}

function calcPersonalDay(m, d) {
  const { lastBirthday } = getCycleAnchor(m, d);
  const now = new Date();
  let monthsElapsed = (now.getFullYear() - lastBirthday.getFullYear()) * 12
                    + (now.getMonth() - lastBirthday.getMonth());
  if (now.getDate() < lastBirthday.getDate()) monthsElapsed--;
  monthsElapsed = Math.max(0, monthsElapsed);
  const pmStartYear  = lastBirthday.getFullYear() + Math.floor((lastBirthday.getMonth() + monthsElapsed) / 12);
  const pmStartMonth = (lastBirthday.getMonth() + monthsElapsed) % 12;
  const pmStart      = new Date(pmStartYear, pmStartMonth, lastBirthday.getDate());
  const dayNum       = Math.floor((now - pmStart) / 86400000) + 1;
  const pm           = calcPersonalMonth(m, d).root;
  return { root: reduce(pm + dayNum), dayNum };
}

function calcFourMonthCycle(m, d) {
  const { monthNum } = calcPersonalMonth(m, d);
  const { lastBirthday } = getCycleAnchor(m, d);
  const cycleNum      = Math.ceil(monthNum / 4);
  const py            = calcPersonalYear(m, d).root;
  const root          = reduce(py + cycleNum - 1);
  const startMonthIdx = (lastBirthday.getMonth() + (cycleNum - 1) * 4) % 12;
  const endMonthIdx   = (lastBirthday.getMonth() + cycleNum * 4 - 1) % 12;
  return { root, cycleNum, startMonthIdx, endMonthIdx };
}

/* ================================================
   CYCLES BUILDER
   (MONTH_NAMES, CYCLE_MEANINGS → data.js)
   ================================================ */
function makeCycleStrip({ colorVar, number, label, role, theme, summary, detail, reflectionKey }) {
  const el = document.createElement('div');
  el.className = 'journal-strip';
  let reflHtml = '';
  if (reflectionKey) {
    try {
      const s = JSON.parse(localStorage.getItem('scl_reflections') || '{}');
      const r = s[reflectionKey];
      if (r) reflHtml = `<div class="strip-reflections"><div class="journal-section-label" style="color:${colorVar};">◈ MY REFLECTION</div><div class="strip-reflection-entry"><div class="strip-reflection-date">${new Date(r.date).toLocaleDateString()}</div><div class="strip-reflection-text">${(r.text||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div></div></div>`;
    } catch(e) {}
  }
  el.innerHTML = `
    <div class="strip-trigger" onclick="toggleStrip(this.closest('.journal-strip'))">
      <div class="strip-accent-bar" style="background:${colorVar};"></div>
      <div class="strip-main">
        <div class="strip-number" style="color:${colorVar};">${number}</div>
        <div class="strip-info">
          <div class="strip-label" style="color:${colorVar};">${label}</div>
          <div class="strip-role">${role}</div>
          <div class="strip-name" style="color:${colorVar};opacity:0.7;">${theme}</div>
        </div>
      </div>
      <div class="strip-chevron">▶</div>
    </div>
    <div class="strip-body">
      <div class="strip-content">
        <div class="strip-text">${summary}</div>
        ${detail ? `<div class="strip-affirmation" style="color:${colorVar};border-color:${colorVar};">${detail}</div>` : ''}
        ${reflHtml}
      </div>
    </div>`;
  return el;
}

function toggleStrip(strip) { strip.classList.toggle('open'); }

function buildCycles() {
  const { lp, m, d, y } = playerData;
  const container = document.getElementById('cycleStrips');
  if (!container) return;
  container.innerHTML = '';

  const now            = new Date();
  const currentYear    = now.getFullYear();
  const currentAge     = currentYear - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0);
  const { cycleStartYear } = getCycleAnchor(m, d);
  const cycleEndYear   = cycleStartYear + 1;

  const py      = calcPersonalYear(m, d);
  const pyData  = CYCLE_MEANINGS.personalYear[py.root]  || CYCLE_MEANINGS.personalYear[9];

  const pinnacles   = calcPinnacles(m, d, y, lp);
  const currentPinn = pinnacles.find((p, i) => i < 3 ? currentAge >= p.startAge && currentAge <= p.endAge : currentAge >= p.startAge) || pinnacles[3];
  const pinnIndex   = pinnacles.indexOf(currentPinn) + 1;
  const pinnData    = CYCLE_MEANINGS.pinnacle[currentPinn.root] || CYCLE_MEANINGS.pinnacle[9];

  const fmc     = calcFourMonthCycle(m, d);
  const fmcData = CYCLE_MEANINGS.fourMonthCycle[fmc.root] || CYCLE_MEANINGS.fourMonthCycle[9];
  const fmcRange = MONTH_NAMES[fmc.startMonthIdx] + '–' + MONTH_NAMES[fmc.endMonthIdx];

  const pm     = calcPersonalMonth(m, d);
  const pmData = CYCLE_MEANINGS.personalMonth[pm.root] || CYCLE_MEANINGS.personalMonth[9];

  const pd     = calcPersonalDay(m, d);
  const pdData = CYCLE_MEANINGS.personalDay[pd.root] || CYCLE_MEANINGS.personalDay[9];

  container.appendChild(makeCycleStrip({ colorVar:'var(--teal)',   number:String(py.root),          label:'PERSONAL YEAR '+cycleStartYear+'–'+cycleEndYear, role:'Your 9-year cycle frequency', theme:pyData.theme, summary:pyData.summary, detail:`Your personal year runs ${m}/${d}/${cycleStartYear} → ${m}/${d}/${cycleEndYear}.`, reflectionKey:'year_'+cycleStartYear }));
  container.appendChild(makeCycleStrip({ colorVar:'var(--gold)',   number:String(currentPinn.root), label:'PINNACLE '+pinnIndex+' — ACTIVE', role:(currentPinn.endAge?`Ages ${currentPinn.startAge}–${currentPinn.endAge}`:`Age ${currentPinn.startAge}+`)+' · Your major life chapter', theme:pinnData.theme, summary:pinnData.summary, detail:`All four pinnacles: ${pinnacles.map((p,i)=>`P${i+1}=${p.root}`).join('  ·  ')}`, reflectionKey:'pinnacle_'+currentPinn.root+'_s'+currentPinn.startAge }));

  // All four pinnacles breakdown
  const allPinnEl = document.createElement('div');
  allPinnEl.className = 'journal-strip';
  const pinnColors = ['var(--gold)','var(--amber)','var(--rose)','var(--purple)'];
  allPinnEl.innerHTML = `
    <div class="strip-trigger" onclick="toggleStrip(this.closest('.journal-strip'))">
      <div class="strip-accent-bar" style="background:var(--gold-dim);"></div>
      <div class="strip-main">
        <div class="strip-number" style="color:var(--gold-dim);font-size:14px;line-height:1.3;">P1·P2<br>P3·P4</div>
        <div class="strip-info">
          <div class="strip-label" style="color:var(--gold);">ALL FOUR PINNACLES</div>
          <div class="strip-role">Your full major chapter map</div>
          <div class="strip-name" style="color:var(--gold-dim);opacity:0.8;">${pinnacles.map((p,i)=>`P${i+1}: ${p.root}`).join('  ·  ')}</div>
        </div>
      </div>
      <div class="strip-chevron">▶</div>
    </div>
    <div class="strip-body"><div class="strip-content">
      ${pinnacles.map((p,i) => {
        const pd2  = CYCLE_MEANINGS.pinnacle[p.root] || CYCLE_MEANINGS.pinnacle[9];
        const ages = p.endAge ? `Ages ${p.startAge}–${p.endAge}` : `Age ${p.startAge}+`;
        return `<div style="margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <span style="font-family:'VT323',monospace;font-size:28px;color:${pinnColors[i]};">${p.root}</span>
            <div>
              <div style="font-family:'Press Start 2P',monospace;font-size:6px;color:${pinnColors[i]};letter-spacing:1px;">PINNACLE ${i+1}${p===currentPinn?' ◈ ACTIVE':''}</div>
              <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${ages} · ${pd2.theme}</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text);line-height:1.8;">${pd2.summary}</div>
        </div>`;
      }).join('')}
    </div></div>`;
  container.appendChild(allPinnEl);

  container.appendChild(makeCycleStrip({ colorVar:'var(--purple)', number:String(fmc.root), label:'FOUR-MONTH CYCLE '+fmc.cycleNum, role:'Personal months '+((fmc.cycleNum-1)*4+1)+'–'+(fmc.cycleNum*4)+' · '+fmcRange+' (approx)', theme:fmcData.theme, summary:fmcData.summary, detail:`Cycle ${fmc.cycleNum} of 3 · Personal months ${(fmc.cycleNum-1)*4+1}–${fmc.cycleNum*4} of your year`, reflectionKey:'fourmonth_'+cycleStartYear+'_'+fmc.cycleNum }));
  container.appendChild(makeCycleStrip({ colorVar:'var(--rose)',   number:String(pm.root),  label:'PERSONAL MONTH '+pm.monthNum+' — '+MONTH_NAMES[now.getMonth()], role:'Month '+pm.monthNum+' of your personal year', theme:pmData.theme, summary:pmData.summary, detail:`Personal months count from your birthday. Month ${pm.monthNum} runs until next month's birthday date.`, reflectionKey:'month_'+now.getFullYear()+'-'+(now.getMonth()+1) }));
  container.appendChild(makeCycleStrip({ colorVar:'var(--sage)',   number:String(pd.root),  label:'PERSONAL DAY '+pd.dayNum+' — '+MONTH_NAMES[now.getMonth()]+' '+now.getDate(), role:'Day '+pd.dayNum+' of personal month '+pm.monthNum, theme:pdData.theme, summary:pdData.summary, detail:'The personal day resets each calendar day at midnight.' }));
}

/* ================================================
   CURRENT QUESTS BUILDER
   ================================================ */
// (CURRENT_QUEST_OBJECTIVES → data.js)

function buildCurrentQuests() {
  const { lp, th, m, d, y } = playerData;
  const container = document.getElementById('sectionCurrentQ');
  if (!container) return;
  container.innerHTML = '';

  const now            = new Date();
  const currentYear    = now.getFullYear();
  const currentAge     = currentYear - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0);
  const { cycleStartYear } = getCycleAnchor(m, d);
  const cycleEndYear   = cycleStartYear + 1;

  const py          = calcPersonalYear(m, d);
  const pinnacles   = calcPinnacles(m, d, y, lp);
  const currentPinn = pinnacles.find((p, i) => i < 3 ? currentAge >= p.startAge && currentAge <= p.endAge : currentAge >= p.startAge) || pinnacles[3];
  const pinnIndex   = pinnacles.indexOf(currentPinn) + 1;
  const fmc         = calcFourMonthCycle(m, d);
  const pm          = calcPersonalMonth(m, d);
  const pd          = calcPersonalDay(m, d);
  const fmcRange    = MONTH_NAMES[fmc.startMonthIdx] + '–' + MONTH_NAMES[fmc.endMonthIdx];

  function getCycleObjs(type, root) {
    const map = CURRENT_QUEST_OBJECTIVES[type];
    return (map && map[root]) ? map[root] : ['Stay present to the energy of this cycle.','Act in alignment with the theme of this period.','Reflect on what this cycle is asking you to release or begin.'];
  }

  // Theme Quest — always first in current (your fixed life curriculum colour)
  {
    const root = th.root, compound = th.compound;
    const qData = getQuestData(root, compound);
    container.appendChild(makeQuestCard({ num: fmt(root, compound), color: qData.color, colorDim: qData.colorDim, title: 'THEME QUEST', sub: 'Your Life Curriculum', freqTag: 'LIFE THEME', typeLabel: 'THEME', archetype: qData.archetype, desc: qData.desc, objectives: qData.objectives, affirmation: qData.affirmation, abundance: 0, abundancePct: 0, isMaster: MASTERS.has(root) }));
  }

  const cycles = [
    { type:'personalYear',   num:py.root,         title:'PERSONAL YEAR '+cycleStartYear+'–'+cycleEndYear+' QUEST', sub:(CYCLE_MEANINGS.personalYear[py.root]||CYCLE_MEANINGS.personalYear[9]).theme+' · Birthday to Birthday', archetype:'Year '+cycleStartYear+'–'+cycleEndYear+' · 9-Year Cycle', desc:(CYCLE_MEANINGS.personalYear[py.root]||CYCLE_MEANINGS.personalYear[9]).summary, objs:getCycleObjs('personalYear',py.root), aff:'I am aligned with my personal year frequency. I move with my cycle\'s design.', typeLabel:'YEAR QUEST' },
    { type:'pinnacle',       num:currentPinn.root, title:'PINNACLE '+pinnIndex+' QUEST — ACTIVE', sub:(CYCLE_MEANINGS.pinnacle[currentPinn.root]||CYCLE_MEANINGS.pinnacle[9]).theme+' · '+(currentPinn.endAge?`Ages ${currentPinn.startAge}–${currentPinn.endAge}`:`Age ${currentPinn.startAge}+`), archetype:'Major Life Chapter · Pinnacle '+pinnIndex+' of 4', desc:(CYCLE_MEANINGS.pinnacle[currentPinn.root]||CYCLE_MEANINGS.pinnacle[9]).summary, objs:getCycleObjs('pinnacle',currentPinn.root), aff:'I meet this chapter with full presence. I learn what it is here to teach.', typeLabel:'PINNACLE QUEST' },
    { type:'fourMonthCycle', num:fmc.root,         title:'FOUR-MONTH CYCLE '+fmc.cycleNum+' QUEST', sub:(CYCLE_MEANINGS.fourMonthCycle[fmc.root]||CYCLE_MEANINGS.fourMonthCycle[9]).theme+' · Personal months '+((fmc.cycleNum-1)*4+1)+'–'+(fmc.cycleNum*4), archetype:'Seasonal Chapter · Cycle '+fmc.cycleNum+' of 3', desc:(CYCLE_MEANINGS.fourMonthCycle[fmc.root]||CYCLE_MEANINGS.fourMonthCycle[9]).summary, objs:getCycleObjs('fourMonthCycle',fmc.root), aff:'I work with the energy of this season. I do not resist what it is asking.', typeLabel:'SEASON QUEST' },
    { type:'personalMonth',  num:pm.root,          title:'PERSONAL MONTH '+pm.monthNum+' QUEST', sub:(CYCLE_MEANINGS.personalMonth[pm.root]||CYCLE_MEANINGS.personalMonth[9]).theme+' · Month '+pm.monthNum+' of your personal year', archetype:'Monthly Frequency · Month '+pm.monthNum+' of 12', desc:(CYCLE_MEANINGS.personalMonth[pm.root]||CYCLE_MEANINGS.personalMonth[9]).summary, objs:getCycleObjs('personalMonth',pm.root), aff:'This month I act in alignment with what is most alive in me right now.', typeLabel:'MONTH QUEST' },
    { type:'personalDay',    num:pd.root,          title:'PERSONAL DAY '+pd.dayNum+' QUEST — '+MONTH_NAMES[now.getMonth()]+' '+now.getDate(), sub:(CYCLE_MEANINGS.personalDay[pd.root]||CYCLE_MEANINGS.personalDay[9]).theme+' · Day '+pd.dayNum+' of month '+pm.monthNum, archetype:'Daily Frequency · Resets at Midnight', desc:(CYCLE_MEANINGS.personalDay[pd.root]||CYCLE_MEANINGS.personalDay[9]).summary, objs:getCycleObjs('personalDay',pd.root), aff:'Today I act with full intention. Each day is a complete cycle.', typeLabel:'DAY QUEST' },
  ];

  cycles.forEach(c => {
    const { color, colorDim, icon } = CYCLE_QUEST_COLORS[c.type];
    container.appendChild(makeQuestCard({
      num: String(c.num), color, colorDim,
      title: c.title, sub: c.sub,
      freqTag: c.archetype, typeLabel: c.typeLabel,
      archetype: icon + '  ' + c.archetype,
      desc: c.desc, objectives: c.objs,
      affirmation: '"' + c.aff + '"',
      abundance: 0, abundancePct: 0,
      isMaster: MASTERS.has(c.num),
    }));
  });
}

/* ================================================
   QUEST BUILDER
   ================================================ */
function buildLifeQuests() {
  const { lp, ex, cl, so, ou, ac, th, name, m, d, y } = playerData;

  // Build combined number frequency for abundance quests
  const freqRoots   = [lp.root, ex.root, cl.root, so.root, ou.root, ac.root, th.root];
  const bdDigits    = [...String(m), ...String(d), ...String(y)].map(Number).filter(n => n > 0);
  const nameLetters = name.toUpperCase().replace(/[^A-Z]/g,'').split('');
  const nameVals    = nameLetters.map(l => reduceLetterVal(LV[l] || 0)).filter(n => n > 0);

  const combined = {};
  for (let i = 1; i <= 9; i++) combined[i] = 0;
  [...freqRoots, ...bdDigits, ...nameVals].forEach(n => {
    let r = n;
    while (r > 9) r = String(r).split('').reduce((a, d) => a + +d, 0);
    if (r >= 1 && r <= 9) combined[r]++;
  });
  const maxCount = Math.max(...Object.values(combined), 1);

  // --- LIFE QUESTS ---
  const lifeEl = document.getElementById('sectionLifeQ');
  lifeEl.innerHTML = '';

  // Main Quest (Life Calling)
  const clData     = CALLING[cl.root]    || CALLING[9];
  const mqData     = MAIN_QUEST_DATA[cl.root] || MAIN_QUEST_DATA[9];
  const isMasterCl = MASTERS.has(cl.root);
  const mqTemplate = getQuestData(cl.root, cl.compound, 'cl');
  const clFlavour  = (cl.compound && cl.compound !== cl.root && COMPOUND_DESC[cl.compound])
    ? COMPOUND_DESC[cl.compound] + '\n\n'
    : '';

  const mqCard = document.createElement('div');
  mqCard.className = 'main-quest-card';
  mqCard.innerHTML = `
    <div class="mq-banner" style="position:relative;overflow:hidden;">
      <div class="sparkle-field">
        <span class="sparkle">✦</span>
        <span class="sparkle">✧</span>
        <span class="sparkle">✦</span>
        <span class="sparkle">✧</span>
        <span class="sparkle">✦</span>
      </div>
      <div class="mq-banner-label">★ MAIN QUEST — LIFE CALLING</div>
      <div class="mq-banner-badge">${isMasterCl ? 'MASTER NUMBER' : 'PRIMARY MISSION'}</div>
    </div>
    <div class="mq-body">
      <div class="mq-top">
        <div class="mq-number">${fmt(cl.root, cl.compound)}</div>
        <div class="mq-info">
          <div class="mq-title">${clData.name.toUpperCase()}</div>
        </div>
      </div>
      <div class="mq-objectives">
        <div class="mq-obj-title">▶ MISSION OBJECTIVES</div>
        ${makeLifeTieredObjsHtml('cl', cl.root, typeof _freqLevel !== 'undefined' ? _freqLevel : 1)}
      </div>
    </div>`;
  lifeEl.appendChild(mqCard);

  // Shared grid for Life Path, Expression, Achievement tiles
  const lifeGrid = document.createElement('div');
  lifeGrid.className = 'quest-grid';
  lifeEl.appendChild(lifeGrid);

  // Life Path quest
  {
    const root = lp.root, compound = lp.compound;
    const qData = getQuestData(root, compound, 'lp');
    const abundance = combined[reduceToSimple(root)] || 0;
    const abundancePct = Math.round((abundance / maxCount) * 100);
    lifeGrid.appendChild(makeQuestCard({ num: fmt(root, compound), color: qData.color, colorDim: qData.colorDim, title: 'LIFE PATH QUEST', sub: 'What You Learn', freqTag: 'LIFE PATH', typeLabel: 'LIFE QUEST', archetype: qData.archetype, desc: qData.desc, objectives: [], affirmation: qData.affirmation, abundance, abundancePct, isMaster: MASTERS.has(root), tieredObjsHtml: makeLifeTieredObjsHtml('lp', root, typeof _freqLevel !== 'undefined' ? _freqLevel : 1) }));
  }

  // Expression quest — Soul + Outer roots shown as subsection before objectives
  {
    const root = ex.root, compound = ex.compound;
    const qData  = getQuestData(root, compound, 'ex');
    const soRoot = ROOT[so.root] || ROOT[9];
    const ouRoot = ROOT[ou.root] || ROOT[9];
    const soNum  = fmt(so.root, so.compound);
    const ouNum  = fmt(ou.root, ou.compound);
    const soCol  = 'var(--rose)';
    const ouCol  = 'var(--purple)';
    const soExtraHtml = `
      <div class="quest-subsection">
        <div class="quest-subsection-row">
          <span class="quest-subsection-num" style="color:${soCol};">${soNum}</span>
          <span class="quest-subsection-label" style="color:${soCol};">SOUL · ${soRoot.name}</span>
        </div>
        <div class="quest-subsection-text">${soRoot.soul}</div>
        <div class="quest-subsection-row" style="margin-top:10px;">
          <span class="quest-subsection-num" style="color:${ouCol};">${ouNum}</span>
          <span class="quest-subsection-label" style="color:${ouCol};">OUTER · ${ouRoot.name}</span>
        </div>
        <div class="quest-subsection-text">${ouRoot.outer}</div>
      </div>`;
    const abundance = combined[reduceToSimple(root)] || 0;
    const abundancePct = Math.round((abundance / maxCount) * 100);
    lifeGrid.appendChild(makeQuestCard({ num: fmt(root, compound), color: qData.color, colorDim: qData.colorDim, title: 'EXPRESSION QUEST', sub: 'What You Carry', freqTag: 'EXPRESSION', typeLabel: 'LIFE QUEST', archetype: qData.archetype, desc: qData.desc, objectives: [], affirmation: qData.affirmation, abundance, abundancePct, isMaster: MASTERS.has(root), extraHtml: soExtraHtml, tieredObjsHtml: makeLifeTieredObjsHtml('ex', root, typeof _freqLevel !== 'undefined' ? _freqLevel : 1) }));
  }

  // Achievement quest
  {
    const root = ac.root, compound = ac.compound;
    const qData = getQuestData(root, compound);
    const abundance = combined[reduceToSimple(root)] || 0;
    const abundancePct = Math.round((abundance / maxCount) * 100);
    lifeGrid.appendChild(makeQuestCard({ num: fmt(root, compound), color: qData.color, colorDim: qData.colorDim, title: 'ACHIEVEMENT QUEST', sub: 'How You Accomplish', freqTag: 'ACHIEVEMENT', typeLabel: 'LIFE QUEST', archetype: qData.archetype, desc: qData.desc, objectives: [], affirmation: qData.affirmation, abundance, abundancePct, isMaster: MASTERS.has(root), tieredObjsHtml: makeLifeTieredObjsHtml('ac', root, typeof _freqLevel !== 'undefined' ? _freqLevel : 1) }));
  }

  // --- SIDE QUESTS (Soul + Outer as standalone cards) ---
  const sideEl = document.getElementById('sectionSideQ');
  sideEl.innerHTML = '';
  const sideGrid = document.createElement('div');
  sideGrid.className = 'quest-grid';
  sideEl.appendChild(sideGrid);

  [
    { num: so, label: 'SOUL QUEST',  sub: 'Your Inner Desire'  },
    { num: ou, label: 'OUTER QUEST', sub: 'Your Public Persona' },
  ].forEach(({ num, label, sub }) => {
    const root = num.root, compound = num.compound;
    const qData = getQuestData(root, compound);
    const abundance = combined[reduceToSimple(root)] || 0;
    const abundancePct = Math.round((abundance / maxCount) * 100);
    sideGrid.appendChild(makeQuestCard({ num: fmt(root, compound), color: qData.color, colorDim: qData.colorDim, title: label, sub, freqTag: label, typeLabel: 'SIDE QUEST', archetype: qData.archetype, desc: qData.desc, objectives: qData.objectives, affirmation: qData.affirmation, abundance, abundancePct, isMaster: MASTERS.has(root) }));
  });

  // Bonus abundance quests
  const coveredNums = new Set([lp, ex, cl, so, ou, ac, th].map(n => reduceToSimple(n.root)));
  const avgCount    = Object.values(combined).reduce((a, b) => a + b, 0) / 9;
  const bonusNums   = Object.entries(combined)
    .filter(([n, count]) => count > avgCount && !coveredNums.has(Number(n)) && count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (bonusNums.length > 0) {
    const bonusHeader = document.createElement('div');
    bonusHeader.style.cssText = 'font-family:"Press Start 2P",monospace;font-size:6px;color:var(--text-dim);letter-spacing:2px;padding:6px 0 10px;margin-top:4px;border-top:1px solid var(--border);';
    bonusHeader.textContent = '◈ ABUNDANCE QUESTS — UNLOCKED BY YOUR NUMBER FREQUENCY';
    sideEl.appendChild(bonusHeader);
    const bonusGrid = document.createElement('div');
    bonusGrid.className = 'quest-grid';
    sideEl.appendChild(bonusGrid);

    bonusNums.forEach(([numStr, count]) => {
      const n            = Number(numStr);
      const qData        = NUM_QUESTS[n] || NUM_QUESTS[9];
      const abundancePct = Math.round((count / maxCount) * 100);
      bonusGrid.appendChild(makeQuestCard({
        num: String(n), color: qData.color, colorDim: qData.colorDim,
        title: numStr + ' ABUNDANCE QUEST',
        sub: `High frequency — appears ${count}× in your code`,
        freqTag: qData.archetype, typeLabel: 'BONUS QUEST',
        archetype: qData.archetype,
        desc: `The number ${n} appears ${count} times across your birthdate, name, and frequencies.\n\n${qData.desc}`,
        objectives: qData.objectives, affirmation: qData.affirmation,
        abundance: count, abundancePct, isMaster: false
      }));
    });
  }
}

/* Quest detail data store — keyed by tile id */
const _questDetailData = {};

function makeQuestCard({ num, color, colorDim, title, sub, freqTag, typeLabel, archetype, desc, objectives, affirmation, abundance, abundancePct, isMaster, extraHtml = '', tieredObjsHtml = '' }) {
  const el       = document.createElement('div');
  el.className   = 'quest-tile';
  const colorVar = 'var(' + color + ')';
  const dimVar   = 'var(' + colorDim + ')';
  const uid      = 'qc_' + Math.random().toString(36).substr(2, 8);
  el.id = uid;
  _questDetailData[uid] = { num, colorVar, dimVar, title, sub, typeLabel, isMaster, extraHtml, tieredObjsHtml, objectives };
  el.innerHTML = `
    <div class="quest-tile-inner" onclick="selectQuestCard('${uid}')">
      <div class="quest-tile-accent" style="background:${colorVar};"></div>
      <div class="quest-tile-num" style="color:${colorVar};">${num}</div>
      <div class="quest-tile-title" style="color:${colorVar};">${title}${isMaster ? ' <span class="quest-tile-master">M</span>' : ''}</div>
      <div class="quest-tile-type">${typeLabel}</div>
    </div>`;
  return el;
}

function selectQuestCard(id) {
  const panel = document.getElementById('questDetailPanel');
  const d = _questDetailData[id];
  if (!panel || !d) return;
  // toggle off if same card already open
  if (panel.dataset.activeId === id && !panel.classList.contains('hidden')) {
    panel.classList.add('hidden');
    panel.dataset.activeId = '';
    document.querySelectorAll('.quest-tile-inner.active-tile').forEach(el => el.classList.remove('active-tile'));
    return;
  }
  // mark active tile
  document.querySelectorAll('.quest-tile-inner.active-tile').forEach(el => el.classList.remove('active-tile'));
  const tileInner = document.querySelector('#' + id + ' .quest-tile-inner');
  if (tileInner) tileInner.classList.add('active-tile');
  const objsHtml = d.tieredObjsHtml ||
    `<div class="quest-objectives-list">${d.objectives.map(o =>
      `<div class="quest-obj-row"><span class="quest-obj-dot" style="color:${d.colorVar};">◈</span><span>${o}</span></div>`
    ).join('')}</div>`;
  panel.innerHTML = `
    <div class="quest-detail-header">
      <div class="quest-detail-num" style="color:${d.colorVar};">${d.num}</div>
      <div class="quest-detail-titles">
        <div class="quest-detail-title" style="color:${d.colorVar};">${d.title}${d.isMaster ? ' <span class="quest-tile-master">MASTER</span>' : ''}</div>
        <div class="quest-detail-sub">${d.sub}</div>
      </div>
      <div class="quest-detail-badge" style="color:${d.colorVar};">${d.typeLabel}</div>
      <button class="quest-detail-close" onclick="selectQuestCard('${id}')">✕</button>
    </div>
    <div class="quest-detail-body">
      <div class="quest-section-title">▶ OBJECTIVES</div>
      ${d.extraHtml}
      ${objsHtml}
    </div>`;
  panel.dataset.activeId = id;
  panel.classList.remove('hidden');
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function toggleQuestCard(id) { selectQuestCard(id); }

/* ================================================
   ALLIES SYSTEM
   ================================================ */

/* ── Kotlin bridge callbacks (called by Kotlin → JS) ──────────────────── */

/** Called by Kotlin after NativeAllies.searchByEmail() */
function NativeAllies_onSearchResult(found, uid, name, lp, cl, ex) {
  const resultEl  = document.getElementById('allySearchResult');
  const errorEl   = document.getElementById('allyError');
  const successEl = document.getElementById('allySuccess');

  if (!found) {
    resultEl.style.display = 'none';
    _allyMsg(errorEl, 'No player found with that email.');
    return;
  }

  // Check not already an ally or self
  const myUid = currentUser?.uid || '';
  if (uid === myUid) {
    resultEl.style.display = 'none';
    _allyMsg(errorEl, 'That\'s your own account.');
    return;
  }

  _allyMsg(errorEl, '');
  resultEl.style.display = '';
  resultEl.innerHTML = `
    <div class="ally-card ally-card-preview">
      <div class="ally-card-nums">
        <span class="ally-num ally-lp">${lp}</span>
        <span class="ally-num ally-cl">${cl}</span>
        <span class="ally-num ally-ex">${ex}</span>
      </div>
      <div class="ally-card-info">
        <div class="ally-card-name">${_esc(name)}</div>
        <div class="ally-card-role">LP · ${lp}  ·  Calling · ${cl}  ·  Ex · ${ex}</div>
      </div>
      <button class="settings-btn" onclick="sendAllyRequest('${_esc(uid)}', '${_esc(name)}')">▶ REQUEST</button>
    </div>`;
}

/** Called by Kotlin after NativeAllies.sendRequest() */
function NativeAllies_onRequestSent(success, errorMsg) {
  const successEl = document.getElementById('allySuccess');
  const errorEl   = document.getElementById('allyError');
  document.getElementById('allySearchResult').style.display = 'none';
  document.getElementById('allySearchInput').value = '';
  if (success) {
    _allyMsg(successEl, '✓ Ally request sent.');
  } else {
    _allyMsg(errorEl, errorMsg || 'Could not send request.');
  }
}

/** Called by Kotlin when incoming pending requests are loaded */
function NativeAllies_onRequestsLoaded(requestsJson) {
  const requests = _parseJson(requestsJson);
  const section  = document.getElementById('allyRequestsSection');
  const list     = document.getElementById('allyRequestsList');

  if (!requests || requests.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  list.innerHTML = requests.map(r => `
    <div class="ally-card" id="req_${_esc(r.uid)}">
      <div class="ally-card-nums">
        <span class="ally-num ally-lp">${r.lp || '?'}</span>
        <span class="ally-num ally-cl">${r.cl || '?'}</span>
        <span class="ally-num ally-ex">${r.ex || '?'}</span>
      </div>
      <div class="ally-card-info">
        <div class="ally-card-name">${_esc(r.name)}</div>
        <div class="ally-card-role">Wants to ally with you</div>
      </div>
      <div class="ally-request-btns">
        <button class="settings-btn" onclick="respondAllyRequest('${_esc(r.uid)}', true)">▶ ACCEPT</button>
        <button class="settings-btn ally-btn-decline" onclick="respondAllyRequest('${_esc(r.uid)}', false)">▶ DECLINE</button>
      </div>
    </div>`).join('');
}

/** Called by Kotlin when the full allies list is loaded */
function NativeAllies_onAlliesLoaded(alliesJson) {
  const allies  = _parseJson(alliesJson);
  const listEl  = document.getElementById('alliesList');

  if (!allies || allies.length === 0) {
    listEl.innerHTML = '<div class="allies-empty">No allies yet. Find a friend by email or share your invite link.</div>';
    return;
  }
  listEl.innerHTML = allies.map(a => `
    <div class="ally-card" id="ally_${_esc(a.uid)}">
      <div class="ally-card-nums">
        <span class="ally-num ally-lp">${a.lp || '?'}</span>
        <span class="ally-num ally-cl">${a.cl || '?'}</span>
        <span class="ally-num ally-ex">${a.ex || '?'}</span>
      </div>
      <div class="ally-card-info">
        <div class="ally-card-name">${_esc(a.name)}</div>
        <div class="ally-card-role">LP · ${a.lp}  ·  Calling · ${a.cl}  ·  Ex · ${a.ex}</div>
      </div>
      <button class="ally-remove-btn" onclick="removeAlly('${_esc(a.uid)}')">✕</button>
    </div>`).join('');
}

/** Called by Kotlin after accepting/declining a request */
function NativeAllies_onRequestResponded(uid, accepted) {
  document.getElementById('req_' + uid)?.remove();
  const section = document.getElementById('allyRequestsSection');
  if (section.querySelector('.ally-card') === null) section.style.display = 'none';
  if (accepted) {
    loadAllies(); // Refresh the full list
    // Achievement hook — track ally acceptances for invite achievement
    try {
      const prev = parseInt(localStorage.getItem('scl_invite_allies') || '0') || 0;
      localStorage.setItem('scl_invite_allies', prev + 1);
      if (typeof Achievements_check === 'function') Achievements_check();
    } catch(e) {}
  }
}

/** Called by Kotlin after removing an ally */
function NativeAllies_onAllyRemoved(uid) {
  document.getElementById('ally_' + uid)?.remove();
  if (!document.getElementById('alliesList').querySelector('.ally-card')) {
    document.getElementById('alliesList').innerHTML =
      '<div class="allies-empty">No allies yet.</div>';
  }
}

/* ── JS → Kotlin bridge calls ─────────────────────────────────────────── */

function searchAlly() {
  const input   = document.getElementById('allySearchInput');
  const email   = input.value.trim().toLowerCase();
  const errorEl = document.getElementById('allyError');
  _allyMsg(document.getElementById('allySuccess'), '');

  if (!email || !email.includes('@')) {
    _allyMsg(errorEl, 'Enter a valid email address.');
    return;
  }
  _allyMsg(errorEl, '');
  document.getElementById('allySearchResult').style.display = 'none';

  if (typeof NativeAllies !== 'undefined') {
    NativeAllies.searchByEmail(email);
  } else {
    // Dev/browser fallback — simulate a result
    NativeAllies_onSearchResult(true, 'mock-uid-123', 'Test Player', '7', '11', '3');
  }
}

function sendAllyRequest(uid, name) {
  if (typeof NativeAllies !== 'undefined') {
    NativeAllies.sendRequest(uid);
  } else {
    NativeAllies_onRequestSent(true, '');
  }
}

function respondAllyRequest(uid, accept) {
  if (typeof NativeAllies !== 'undefined') {
    NativeAllies.respondRequest(uid, accept);
  } else {
    NativeAllies_onRequestResponded(uid, accept);
  }
}

function removeAlly(uid) {
  if (!confirm('Remove this ally?')) return;
  if (typeof NativeAllies !== 'undefined') {
    NativeAllies.removeAlly(uid);
  } else {
    NativeAllies_onAllyRemoved(uid);
  }
}

function loadAllies() {
  if (typeof NativeAllies !== 'undefined') {
    NativeAllies.loadAllies();
    NativeAllies.loadPendingRequests();
  }
}

/* ─────────────────────────────────────────────────────
   REFERRAL SYSTEM
   ───────────────────────────────────────────────────── */
const LS_REFER_CODE = 'scl_my_refer_code';
const LS_REFER_USED = 'scl_refer_used'; // code we joined with (don't self-apply)
// LS_XP_BOOST is declared in QuestEngine.js — reuse it here
const _APP_XP_BOOST_KEY = 'scl_xp_boost_until';

/** Deterministic 6-char alphanumeric code from player data */
function _getReferCode() {
  const stored = localStorage.getItem(LS_REFER_CODE);
  if (stored) return stored;
  const p = playerData;
  const seed = (p?.name || 'PLAYER') + (p?.lp?.compound ?? '') + (p?.ex?.compound ?? '') + (p?.birthDate || '');
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h) ^ seed.charCodeAt(i);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let n = Math.abs(h);
  for (let i = 0; i < 6; i++) { code += chars[n % chars.length]; n = Math.floor(n / chars.length) || (n + 7919); }
  localStorage.setItem(LS_REFER_CODE, code);
  return code;
}

/** Called on page load — activate 2× XP boost if ?ref= param present, store inviter UID */
function _checkReferralParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const inviterUid = params.get('uid');
    if (!ref && !inviterUid) return;

    // Store inviter UID so the ally request fires on login (new or existing user)
    if (inviterUid) {
      const myUid = localStorage.getItem('scl_uid');
      if (!myUid || myUid !== inviterUid) {
        localStorage.setItem('scl_pending_inviter', inviterUid);
        window._pendingInviterUid = inviterUid;
      }
    }

    if (ref) {
      // Don't let someone apply their own code
      const myCode = localStorage.getItem(LS_REFER_CODE);
      if (myCode && ref.toUpperCase() === myCode.toUpperCase()) {
        // Still clean URL
      } else if (localStorage.getItem(LS_REFER_USED) === ref.toUpperCase()) {
        // Already applied
      } else {
        // Activate 48h boost
        localStorage.setItem(_APP_XP_BOOST_KEY, String(Date.now() + 48 * 60 * 60 * 1000));
        localStorage.setItem(LS_REFER_USED, ref.toUpperCase());
        setTimeout(() => _showBoostActivatedBanner(), 1800);
      }
    }

    // Clean URL without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('ref');
    url.searchParams.delete('uid');
    window.history.replaceState({}, '', url.toString());
  } catch(e) {}
}

function _showBoostActivatedBanner() {
  const b = document.createElement('div');
  b.className = 'boost-banner';
  b.innerHTML = `<span class="boost-banner-icon">✦</span>
    <div class="boost-banner-text">
      <div class="boost-banner-title">2× XP BOOST ACTIVATED</div>
      <div class="boost-banner-sub">All XP gains doubled for 48 hours</div>
    </div>
    <button class="boost-banner-close" onclick="this.parentElement.remove()">✕</button>`;
  document.body.appendChild(b);
  setTimeout(() => b.classList.add('boost-banner--visible'), 50);
  setTimeout(() => { b.classList.remove('boost-banner--visible'); setTimeout(() => b.remove(), 600); }, 6000);
}

/** Returns remaining boost time as a display string, or '' if no boost */
function _getBoostTimeRemaining() {
  try {
    const until = parseInt(localStorage.getItem(_APP_XP_BOOST_KEY) || '0', 10);
    if (!until || Date.now() >= until) return '';
    const ms = until - Date.now();
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  } catch(e) { return ''; }
}

/** Render the boost status chip in the allies panel */
function _renderBoostStatus() {
  const el = document.getElementById('allyBoostStatus');
  if (!el) return;
  const remaining = _getBoostTimeRemaining();
  if (remaining) {
    el.innerHTML = `<span class="boost-chip boost-chip--active">✦ 2× XP BOOST — ${remaining} remaining</span>`;
  } else {
    el.innerHTML = `<span class="boost-chip">Invite an ally to earn 2× XP for 48 hours</span>`;
  }
}

/** Open the invite modal with character card preview */
function shareInviteLink() {
  _renderInviteModal();
  document.getElementById('inviteModal').classList.remove('hidden');
}

function _renderInviteModal() {
  const modal = document.getElementById('inviteModal');
  if (!modal) return;
  const code    = _getReferCode();
  const uid     = window._currentUid || localStorage.getItem('scl_uid') || '';
  const link    = `${window.location.origin}/sourcecode-life/profile/?ref=${code}${uid ? '&uid=' + uid : ''}`;
  const p       = playerData;
  const name    = p?.name || localStorage.getItem('scl_player') && JSON.parse(localStorage.getItem('scl_player')).name || 'UNKNOWN';
  const lp      = p?.lp?.compound  ?? '?';
  const ex      = p?.ex?.compound  ?? '?';
  const so      = p?.so?.compound  ?? '?';
  const ARCHS   = { 1:'The Pioneer',2:'The Mediator',3:'The Creator',4:'The Builder',5:'The Explorer',6:'The Nurturer',7:'The Seeker',8:'The Achiever',9:'The Humanitarian',11:'The Intuitive',22:'The Master Builder',33:'The Master Teacher',44:'The Architect' };
  const arch    = ARCHS[p?.lp?.root] || '';

  modal.innerHTML = `
    <div class="invite-modal-overlay" onclick="if(event.target===this)this.parentElement.classList.add('hidden')">
      <div class="invite-modal-box">
        <div class="invite-modal-header">
          <div class="invite-modal-title">◈ INVITE AN ALLY</div>
          <button class="invite-modal-close" onclick="document.getElementById('inviteModal').classList.add('hidden')">✕</button>
        </div>
        <div class="invite-modal-divider"></div>
        <p class="invite-modal-sub">Share your link. They get 2× XP for 48 hours — and so do you once they join.</p>

        <!-- Mini character card -->
        <div class="invite-char-card">
          <div class="invite-char-name">${_esc(name)}</div>
          ${arch ? `<div class="invite-char-arch">${_esc(arch)}</div>` : ''}
          <div class="invite-char-nums">
            <div class="invite-num-cell"><div class="invite-num-val">${lp}</div><div class="invite-num-lbl">LIFE PATH</div></div>
            <div class="invite-num-cell"><div class="invite-num-val">${so}</div><div class="invite-num-lbl">SOUL</div></div>
            <div class="invite-num-cell"><div class="invite-num-val">${ex}</div><div class="invite-num-lbl">EXPRESSION</div></div>
          </div>
          <div class="invite-char-code">CODE — <strong>${code}</strong></div>
        </div>

        <!-- Link display -->
        <div class="invite-link-label">YOUR INVITE LINK</div>
        <div class="invite-link-display">
          <div class="invite-link-domain">${_esc(window.location.hostname)}/…?ref=</div>
          <div class="invite-link-ref">${code}</div>
          <button class="invite-copy-btn" onclick="_copyInviteLink('${_esc(link)}')">COPY</button>
        </div>
        <input type="text" class="invite-link-input-hidden" id="inviteLinkInput" value="${_esc(link)}" readonly aria-hidden="true">
        <div id="inviteCopyStatus" class="invite-copy-status"></div>

        <div class="invite-share-row">
          <button class="invite-share-btn" onclick="_nativeShareInvite('${_esc(link)}', '${_esc(name)}')">▶ SHARE LINK</button>
        </div>
      </div>
    </div>`;
}

function _copyInviteLink(link) {
  navigator.clipboard?.writeText(link).then(() => {
    const s = document.getElementById('inviteCopyStatus');
    if (s) { s.textContent = '✓ Link copied to clipboard!'; setTimeout(() => { s.textContent = ''; }, 3000); }
  }).catch(() => {
    const s = document.getElementById('inviteCopyStatus');
    if (s) s.textContent = '⚠ Could not copy. Select and copy manually.';
  });
}

function _nativeShareInvite(link, name) {
  const text = `Join me on Simulation Source Code and decode your blueprint. You'll get 2× XP for 48 hours. — ${name}`;
  if (typeof NativeAllies !== 'undefined' && NativeAllies.shareLink) {
    NativeAllies.shareLink(link, text);
  } else if (navigator.share) {
    navigator.share({ title: 'Simulation Source Code', text, url: link }).catch(() => {});
  } else {
    _copyInviteLink(link);
  }
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function _parseJson(json) {
  try { return JSON.parse(json); } catch(e) { return []; }
}

function _allyMsg(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

/* ================================================
   DAILY NOTIFICATION
   ================================================ */

/** Build the title + body for today's personal day notification */
function getDailyNotifPayload() {
  const { m, d } = playerData;
  const pd       = calcPersonalDay(m, d);
  const root     = pd.root;
  const meanings = CYCLE_MEANINGS.personalDay;
  const objs     = CURRENT_QUEST_OBJECTIVES.personalDay;

  const dayData  = meanings[root] || meanings[9];
  const objList  = objs[root]     || objs[9] || [];

  // Rotate objective by day-of-year so it changes daily without being random
  const now      = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const objective = objList[dayOfYear % objList.length] || objList[0];

  const title = `✦ Personal Day ${root} · ${dayData.theme}`;
  const body  = `${dayData.summary}\n\n◈ ${objective}`;

  return { title, body, root };
}

/** Ask Kotlin to schedule (or reschedule) the daily alarm */
function scheduleDailyNotification(hour, minute) {
  const { title, body } = getDailyNotifPayload();
  if (typeof NativeNotif !== 'undefined' && NativeNotif.scheduleDaily) {
    NativeNotif.scheduleDaily(hour, minute, title, body);
  }
}

/** Cancel the alarm via Kotlin */
function cancelDailyNotification() {
  if (typeof NativeNotif !== 'undefined' && NativeNotif.cancelDaily) {
    NativeNotif.cancelDaily();
  }
}

/** Send a test notification immediately via Kotlin */
function sendTestNotification() {
  const { title, body } = getDailyNotifPayload();
  if (typeof NativeNotif !== 'undefined' && NativeNotif.sendNow) {
    NativeNotif.sendNow(title, body);
  } else {
    // Browser fallback — show as alert in dev mode
    alert(title + '\n\n' + body);
  }
}

/* ── Settings UI ────────────────────────────────── */

const LS_NOTIF_ENABLED = 'scl_notif_enabled';
const LS_NOTIF_HOUR    = 'scl_notif_hour';
const LS_NOTIF_MINUTE  = 'scl_notif_minute';

function initNotifUI() {
  // Populate hour select (1–12 AM/PM display, stored as 0–23)
  const hourSel = document.getElementById('notifHour');
  const minSel  = document.getElementById('notifMinute');
  if (!hourSel || !minSel) return;

  hourSel.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const label = (h === 0 ? 12 : h > 12 ? h - 12 : h) + (h < 12 ? ' AM' : ' PM');
    const opt   = document.createElement('option');
    opt.value   = h;
    opt.textContent = label;
    hourSel.appendChild(opt);
  }

  minSel.innerHTML = '';
  for (let m = 0; m < 60; m += 5) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = String(m).padStart(2, '0');
    minSel.appendChild(opt);
  }

  // Restore saved values
  try {
    const savedHour   = localStorage.getItem(LS_NOTIF_HOUR);
    const savedMinute = localStorage.getItem(LS_NOTIF_MINUTE);
    const enabled     = localStorage.getItem(LS_NOTIF_ENABLED) === 'true';
    hourSel.value = savedHour   !== null ? savedHour   : 8;
    minSel.value  = savedMinute !== null ? savedMinute : 0;
    if (enabled) _setNotifEnabled(true);
  } catch(e) {}
}

function toggleNotifications() {
  const enabled = localStorage.getItem(LS_NOTIF_ENABLED) === 'true';
  _setNotifEnabled(!enabled);
}

function _setNotifEnabled(on) {
  try { localStorage.setItem(LS_NOTIF_ENABLED, on ? 'true' : 'false'); } catch(e) {}

  document.getElementById('notifStatusText').textContent = on ? 'ON' : 'OFF';
  document.getElementById('notifStatusText').style.color = on ? 'var(--sage)' : 'var(--text-dim)';
  document.getElementById('notifToggleBtn').textContent  = on ? '▶ DISABLE' : '▶ ENABLE';
  document.getElementById('notifTimeRow').style.display  = on ? '' : 'none';

  if (on) {
    // Schedule with saved or default time
    let h = 8, m = 0;
    try {
      h = parseInt(localStorage.getItem(LS_NOTIF_HOUR)   || 8);
      m = parseInt(localStorage.getItem(LS_NOTIF_MINUTE) || 0);
    } catch(e) {}
    scheduleDailyNotification(h, m);
  } else {
    cancelDailyNotification();
  }
}

function saveNotifTime() {
  const h = parseInt(document.getElementById('notifHour').value);
  const m = parseInt(document.getElementById('notifMinute').value);
  try {
    localStorage.setItem(LS_NOTIF_HOUR,   h);
    localStorage.setItem(LS_NOTIF_MINUTE, m);
  } catch(e) {}
  scheduleDailyNotification(h, m);
  // Brief visual confirmation
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = '✓ SAVED';
  setTimeout(() => { btn.textContent = orig; }, 1500);
}

/* ================================================
   DEEP LINK — called by Kotlin when notification is tapped
   ================================================ */
function Native_onOpenTab(tab) {
  // Wait until the app shell is visible before switching
  const trySwitch = () => {
    const shell = document.getElementById('appShell');
    if (shell && !shell.classList.contains('hidden')) {
      switchTab(tab);
      if (tab === 'map') _renderSimTop3();
      if (tab === 'quests') switchQuestSection('daily');
    } else {
      setTimeout(trySwitch, 300);
    }
  };
  trySwitch();
}

/* ================================================
   QUEST MAP NOTIFICATIONS
   ================================================ */
const LS_QUEST_NOTIF = 'scl_quest_notif_mode'; // 'off' | 'allies' | 'all'

function initQuestNotifUI() {
  try {
    const mode = localStorage.getItem(LS_QUEST_NOTIF) || 'off';
    _setQuestNotifMode(mode, false); // false = don't re-save or restart listener
  } catch(e) {}
}

function selectQuestNotifMode(mode) {
  _setQuestNotifMode(mode, true);
}

function _setQuestNotifMode(mode, save) {
  // Update button states
  ['off','allies','all'].forEach(m => {
    const btn = document.getElementById('questNotifBtn_' + m);
    if (btn) btn.classList.toggle('active', m === mode);
  });
  if (save) {
    try { localStorage.setItem(LS_QUEST_NOTIF, mode); } catch(e) {}
    if (typeof NativeAllies !== 'undefined') {
      if (mode === 'off') {
        NativeAllies.stopQuestNotifListener();
      } else {
        NativeAllies.startQuestNotifListener(mode);
      }
    }
  }
}

/* ── Restore quest notif listener on app launch ── */
function restoreQuestNotifListener() {
  try {
    const mode = localStorage.getItem(LS_QUEST_NOTIF) || 'off';
    if (mode !== 'off' && typeof NativeAllies !== 'undefined') {
      NativeAllies.startQuestNotifListener(mode);
    }
  } catch(e) {}
}


const LS_THEME = 'scl_theme';

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(LS_THEME, theme); } catch(e) {}

  // Update chip active state
  ['scifi','fantasy','unicorn','diablo'].forEach(t => {
    const el = document.getElementById('themeOpt' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle('active', t === theme);
  });

  // Restyle maps live
  applyMapTheme();
}

function loadSavedTheme() {
  try {
    const saved = localStorage.getItem(LS_THEME);
    if (saved === 'fantasy' || saved === 'scifi' || saved === 'unicorn' || saved === 'diablo') setTheme(saved);
  } catch(e) {}
}

/* ================================================
   INIT
   ================================================ */
window.addEventListener('DOMContentLoaded', () => {
  _checkReferralParam();
  loadSavedTheme();
  initGeoPromptUI();
  _runBootSplash(() => {
    if (typeof NativeAuth !== 'undefined') {
      NativeAuth.checkSession();
    } else {
      if (loadLocalSaved()) {
        document.getElementById('authOverlay').classList.add('hidden');
        launchApp();
      }
    }
  });
});

function _runBootSplash(callback) {
  const splash = document.getElementById('bootSplash');
  const lines  = document.getElementById('bootLines');
  if (!splash || !lines) { callback(); return; }

  const BOOT_LINES = [
    'INITIALIZING SIMULATION ENGINE...',
    'LOADING NUMEROLOGY MATRIX...',
    'DECODING FREQUENCY SIGNATURE...',
    'CALIBRATING QUEST ENGINE...',
    'READY.',
  ];
  let i = 0;
  function nextLine() {
    if (i >= BOOT_LINES.length) {
      splash.classList.add('boot-fade-out');
      setTimeout(() => {
        splash.classList.add('hidden');
        callback();
      }, 500);
      return;
    }
    const row = document.createElement('div');
    row.className = 'boot-line';
    row.textContent = '> ' + BOOT_LINES[i];
    lines.appendChild(row);
    i++;
    setTimeout(nextLine, i === BOOT_LINES.length ? 300 : 220);
  }
  setTimeout(nextLine, 300);
}
