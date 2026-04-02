/**
 * bridge.js — Web polyfills for Android native bridge interfaces
 * Implements NativeAuth, NativeMap, NativeAllies, NativeNotif
 * using browser APIs and localStorage in place of Kotlin/Firebase.
 */

/* ─── Storage keys ─────────────────────────────────────── */
const _LS_USER    = 'scl_user';
const _LS_PLAYER  = 'scl_player';
const _LS_QUESTS  = 'scl_quests_web';
const _LS_GEO     = 'scl_geo_prompt';
const _LS_XP      = 'scl_xp';

function _save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }
function _load(key)      { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } }

/* ─── NativeAuth ────────────────────────────────────────── */
window.NativeAuth = {
  checkSession() {
    const u = _load(_LS_USER);
    if (u) {
      setTimeout(() => NativeAuth_onSessionResult(true, u.uid || 'WEB_USER'), 0);
    } else {
      setTimeout(() => NativeAuth_onSessionResult(false, ''), 0);
    }
  },

  login(email, password) {
    // Web: treat any login as valid (real auth not available in browser)
    const uid = 'WEB_' + btoa(email).replace(/=/g,'');
    _save(_LS_USER, { email, uid });
    setTimeout(() => NativeAuth_onLoginResult(true, uid, ''), 0);
  },

  register(email, password) {
    const uid = 'WEB_' + btoa(email).replace(/=/g,'');
    _save(_LS_USER, { email, uid });
    setTimeout(() => NativeAuth_onRegisterResult(true, uid, ''), 0);
  },

  sendPasswordReset(email) {
    setTimeout(() => NativeAuth_onPasswordResetResult(true, ''), 0);
  },

  changePassword(current, newPw) {
    setTimeout(() => NativeAuth_onChangePasswordResult(true, ''), 0);
  },

  savePlayer(name, dob, lp, cl, ex) {
    const existing = _load(_LS_PLAYER) || {};
    _save(_LS_PLAYER, { ...existing, name, dob, lp, cl, ex });
    setTimeout(() => NativeAuth_onSavePlayerResult(true, ''), 0);
  },

  loadPlayer() {
    const u = _load(_LS_USER);
    const p = _load(_LS_PLAYER);
    if (p && p.name) {
      const uid   = u ? (u.uid || 'WEB_USER') : 'WEB_USER';
      const email = u ? (u.email || '') : '';
      setTimeout(() => {
        NativeAuth_onLoadPlayerResult(true, uid, p.name, p.dob || '', email);
        const xp = _load(_LS_XP) || {};
        NativeQuest_onXPLoaded(
          xp.charXP    || 0,
          xp.charLevel || 1,
          xp.freqXP    || 0,
          xp.freqLevel || 1,
          JSON.stringify(xp.statXP  || {}),
          JSON.stringify(xp.freqLog || {})
        );
      }, 0);
    } else {
      setTimeout(() => NativeAuth_onLoadPlayerResult(false, '', '', '', ''), 0);
    }
  },

  signOut() {
    localStorage.removeItem(_LS_USER);
    localStorage.removeItem(_LS_PLAYER);
    localStorage.removeItem(_LS_XP);
  },

  deleteAccount(password) {
    localStorage.removeItem(_LS_USER);
    localStorage.removeItem(_LS_PLAYER);
    localStorage.removeItem(_LS_QUESTS);
    localStorage.removeItem(_LS_XP);
    setTimeout(() => NativeAuth_onDeleteResult(true, ''), 0);
  },

  reloadApp() {
    window.location.reload();
  }
};

/* ─── NativeMap ─────────────────────────────────────────── */
window.NativeMap = {
  getMapsApiKey() {
    setTimeout(() => NativeMap_onApiKey('LEAFLET_MODE'), 0);
  },

  checkPermissionState() {
    if (!navigator.geolocation) {
      setTimeout(() => NativeLocation_onPermissionState('denied'), 0);
      return;
    }
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        const state = result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'not_asked';
        NativeLocation_onPermissionState(state);
      }).catch(() => NativeLocation_onPermissionState('not_asked'));
    } else {
      setTimeout(() => NativeLocation_onPermissionState('not_asked'), 0);
    }
  },

  requestLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => NativeLocation_onPermissionState('granted'),
        err => NativeLocation_onPermissionState('denied')
      );
    }
  },

  requestLocation() {
    if (!navigator.geolocation) {
      setTimeout(() => NativeLocation_onLocationResult(false, 0, 0), 0);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => NativeLocation_onLocationResult(true, pos.coords.latitude, pos.coords.longitude),
      err => NativeLocation_onLocationResult(false, 0, 0),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  getPromptEnabled() {
    const enabled = localStorage.getItem(_LS_GEO) !== 'false';
    setTimeout(() => NativeLocation_onPromptSetting(enabled), 0);
  },

  setPromptEnabled(enabled) {
    localStorage.setItem(_LS_GEO, enabled ? 'true' : 'false');
    setTimeout(() => NativeLocation_onPromptSetting(enabled), 0);
  },

  searchLocations(query) {
    if (!query || query.trim().length < 3) return;
    const url = 'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(query.trim()) +
      '&format=json&limit=5&addressdetails=0&accept-language=en';
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => NativeMap_onLocationSearchResults(JSON.stringify(data)))
      .catch(() => NativeMap_onLocationSearchResults('[]'));
  },

  geocodeAddress(address) {
    if (!address) return;
    const url = 'https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(address.trim()) + '&format=json&limit=1';
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          const r = data[0];
          NativeMap_onGeocodeResult(true, parseFloat(r.lat), parseFloat(r.lon), r.display_name || '');
        } else {
          NativeMap_onGeocodeResult(false, 0, 0, '');
        }
      })
      .catch(() => NativeMap_onGeocodeResult(false, 0, 0, ''));
  },

  saveQuest(questJson) {
    try {
      const q = JSON.parse(questJson);
      const quests = _load(_LS_QUESTS) || [];
      const id = 'WQ_' + Date.now();
      q.id = id;
      q.uid = 'WEB_USER';
      q.ts = Date.now();
      quests.push(q);
      _save(_LS_QUESTS, quests);
      setTimeout(() => NativeMap_onQuestSaved(true, id), 0);
    } catch(e) {
      setTimeout(() => NativeMap_onQuestSaved(false, ''), 0);
    }
  },

  loadQuestMarkers() {
    const quests = _load(_LS_QUESTS) || [];
    setTimeout(() => NativeMap_onQuestsLoaded(JSON.stringify(quests)), 0);
  },

  loadMyQuests() {
    const quests = (_load(_LS_QUESTS) || []).filter(q => q.uid === 'WEB_USER');
    setTimeout(() => NativeMap_onMyQuestsLoaded(JSON.stringify(quests)), 0);
  },

  deleteQuest(questId) {
    let quests = _load(_LS_QUESTS) || [];
    quests = quests.filter(q => q.id !== questId);
    _save(_LS_QUESTS, quests);
    setTimeout(() => NativeMap_onQuestDeleted(true, questId), 0);
  },

  savePlayerXP(charXP, charLevel, freqXP, freqLevel, statXPJson) {
    try {
      const existing = _load(_LS_XP) || {};
      _save(_LS_XP, {
        ...existing,
        charXP, charLevel, freqXP, freqLevel,
        statXP: JSON.parse(statXPJson || '{}')
      });
    } catch(e) {}
  }
};

/* ─── NativeAllies ──────────────────────────────────────── */
window.NativeAllies = {
  searchByEmail(email) {
    // No backend available in web — return not found
    setTimeout(() => NativeAllies_onSearchResult(false, '', '', '', '', ''), 0);
  },
  sendRequest(targetUid) {
    setTimeout(() => NativeAllies_onRequestSent(false, 'Allies require the mobile app.'), 0);
  },
  respondRequest(senderUid, accept) {
    setTimeout(() => NativeAllies_onRequestResponded(senderUid, false), 0);
  },
  loadAllies() {
    setTimeout(() => NativeAllies_onAlliesLoaded('[]'), 0);
  },
  loadPendingRequests() {
    setTimeout(() => NativeAllies_onRequestsLoaded('[]'), 0);
  },
  removeAlly(uid) {
    setTimeout(() => NativeAllies_onAllyRemoved(uid), 0);
  },
  shareLink(link, message) {
    if (navigator.share) {
      navigator.share({ title: 'Source Code: Life', text: message, url: link }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message + '\n' + link).catch(() => {});
    }
  },
  getPlayerName(uid) {
    setTimeout(() => NativeAllies_onPlayerName('Web Player'), 0);
  },
  startQuestNotifListener(mode) {},
  stopQuestNotifListener() {},
  getQuestNotifMode() { return 'off'; }
};

/* ─── NativeNotif ───────────────────────────────────────── */
window.NativeNotif = {
  scheduleDaily(hour, minute, title, body) {
    // Request Web Notification permission and show a test notification
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          new Notification(title, { body, icon: '/favicon-32.png' });
        }
      });
    }
  },
  cancelDaily() {},
  sendNow(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon-32.png' });
    }
  }
};
