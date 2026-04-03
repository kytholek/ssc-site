/**
 * bridge.js — Web Firebase bridge for Source Code: Life
 * Mirrors the Kotlin FirebaseBridge / NativeAuth interface exactly.
 * Uses Firebase Auth + Firestore for real accounts, localStorage for
 * map quests, allies, and XP (features that require the mobile app).
 */

/* ================================================
   FIREBASE INIT
   ================================================ */
const _FB_CONFIG = {
  apiKey:            'AIzaSyBA82OFYJm47yRF59DuQSoo8_piOyP1hZs',
  authDomain:        'game-of-life-7b620.firebaseapp.com',
  databaseURL:       'https://game-of-life-7b620-default-rtdb.firebaseio.com',
  projectId:         'game-of-life-7b620',
  storageBucket:     'game-of-life-7b620.firebasestorage.app',
  messagingSenderId: '115903423480',
};

if (!firebase.apps.length) {
  firebase.initializeApp(_FB_CONFIG);
}
const _auth = firebase.auth();
const _db   = firebase.firestore();

/* ================================================
   LOCAL STORAGE (XP / map quests only)
   ================================================ */
const _LS_QUESTS = 'scl_quests_web';
const _LS_GEO    = 'scl_geo_prompt';
const _LS_XP     = 'scl_xp';

function _save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }
function _load(key)      { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } }

/* ================================================
   NativeAuth  (real Firebase Auth + Firestore)
   ================================================ */
window.NativeAuth = {

  checkSession() {
    const unsub = _auth.onAuthStateChanged(user => {
      unsub();
      if (user) {
        setTimeout(() => NativeAuth_onSessionResult(true, user.uid), 0);
      } else {
        setTimeout(() => NativeAuth_onSessionResult(false, ''), 0);
      }
    });
  },

  login(email, password) {
    _auth.signInWithEmailAndPassword(email.trim(), password)
      .then(result => NativeAuth_onLoginResult(true, result.user.uid, ''))
      .catch(e => NativeAuth_onLoginResult(false, '', _friendlyError(e.code)));
  },

  register(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    _auth.createUserWithEmailAndPassword(normalizedEmail, password)
      .then(result => {
        const uid = result.user.uid;
        console.log('[bridge] register success uid=' + uid + ', writing player doc...');
        _db.collection('players').doc(uid).set(
          { email: normalizedEmail, created: Date.now() },
          { merge: true }
        )
          .then(() => { console.log('[bridge] player doc written OK'); NativeAuth_onRegisterResult(true, uid, ''); })
          .catch(e => { console.error('[bridge] player doc write FAILED:', e.code, e.message); NativeAuth_onRegisterResult(true, uid, ''); });
      })
      .catch(e => { console.error('[bridge] register FAILED:', e.code, e.message); NativeAuth_onRegisterResult(false, '', _friendlyError(e.code)); });
  },

  sendPasswordReset(email) {
    _auth.sendPasswordResetEmail(email.trim())
      .then(() => NativeAuth_onPasswordResetResult(true, ''))
      .catch(e => NativeAuth_onPasswordResetResult(false, _friendlyError(e.code)));
  },

  changePassword(current, newPw) {
    const user = _auth.currentUser;
    if (!user || !user.email) { NativeAuth_onChangePasswordResult(false, 'Not signed in.'); return; }
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, current);
    user.reauthenticateWithCredential(credential)
      .then(() => user.updatePassword(newPw))
      .then(() => NativeAuth_onChangePasswordResult(true, ''))
      .catch(e => NativeAuth_onChangePasswordResult(false, _friendlyError(e.code)));
  },

  savePlayer(name, dob, lp, cl, ex) {
    const user = _auth.currentUser;
    if (!user) { console.error('[bridge] savePlayer: no currentUser'); NativeAuth_onSavePlayerResult(false, 'Not signed in.'); return; }
    const email = (user.email || '').trim().toLowerCase();
    console.log('[bridge] savePlayer uid=' + user.uid);
    _db.collection('players').doc(user.uid).set(
      { name, dob, lp, cl, ex, email, updated: Date.now() },
      { merge: true }
    )
      .then(() => { console.log('[bridge] savePlayer OK'); NativeAuth_onSavePlayerResult(true, ''); })
      .catch(e => { console.error('[bridge] savePlayer FAILED:', e.code, e.message); NativeAuth_onSavePlayerResult(false, e.message || 'Save failed.'); });
  },

  loadPlayer() {
    const user = _auth.currentUser;
    if (!user) { console.warn('[bridge] loadPlayer: no currentUser'); NativeAuth_onLoadPlayerResult(false, '', '', '', ''); return; }
    const uid       = user.uid;
    const authEmail = (user.email || '').trim().toLowerCase();
    console.log('[bridge] loadPlayer uid=' + uid);
    _db.collection('players').doc(uid).get()
      .then(snap => {
        if (snap.exists) {
          console.log('[bridge] loadPlayer doc found');
          const d = snap.data();
          NativeAuth_onLoadPlayerResult(true, uid, d.name || '', d.dob || '', authEmail);
          const charXP    = d.charXP    || 0;
          const charLevel = d.charLevel || 1;
          const freqXP    = d.freqXP    || 0;
          const freqLevel = d.freqLevel || 1;
          const statXP    = d.statXP    || '{}';
          // d.freqLog is an object from Firestore or undefined — avoid double-stringify
          const freqLog   = (typeof d.freqLog === 'object' && d.freqLog !== null) ? d.freqLog : {};
          NativeQuest_onXPLoaded(charXP, charLevel, freqXP, freqLevel,
            JSON.stringify(statXP), JSON.stringify(freqLog));
          // Restore achievements + all progress keys from cloud to localStorage
          try {
            if (d.achievements)  localStorage.setItem('scl_achievements',  typeof d.achievements === 'string' ? d.achievements : JSON.stringify(d.achievements));
            if (d.founder === true) localStorage.setItem('scl_founder', 'true');
            if (d.dailyStreak)   localStorage.setItem('scl_daily_streak', typeof d.dailyStreak === 'string' ? d.dailyStreak : JSON.stringify(d.dailyStreak));
            if (d.lqp)           localStorage.setItem('scl_lqp',           typeof d.lqp === 'string' ? d.lqp : JSON.stringify(d.lqp));
            if (d.irlCompleted)  localStorage.setItem('scl_irl_completed',  String(d.irlCompleted));
            if (d.questsCreated) localStorage.setItem('scl_quests_created', String(d.questsCreated));
            if (d.inviteAllies)  localStorage.setItem('scl_invite_allies',  String(d.inviteAllies));
            if (d.thirtyDayDone) localStorage.setItem('scl_30day_done',     String(d.thirtyDayDone));
            if (Array.isArray(d.quests) && d.quests.length) {
              const local = _load(_LS_QUESTS) || [];
              const localIds = new Set(local.map(q => q.id));
              const merged  = [...local, ...d.quests.filter(q => !localIds.has(q.id))];
              _save(_LS_QUESTS, merged);
            }
          } catch(e) {}
        } else {
          console.log('[bridge] loadPlayer: no doc, sending to char create');
          NativeAuth_onLoadPlayerResult(false, uid, '', '', authEmail);
        }
      })
      .catch(e => { console.error('[bridge] loadPlayer FAILED:', e.code, e.message); NativeAuth_onLoadPlayerResult(false, '', '', '', ''); });
  },

  signOut() {
    _auth.signOut();
  },

  deleteAccount(password) {
    const user = _auth.currentUser;
    if (!user || !user.email) { NativeAuth_onDeleteResult(false, 'Not signed in.'); return; }
    const uid        = user.uid;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
    user.reauthenticateWithCredential(credential)
      .then(() => {
        const subs = ['confirmed', 'received', 'sent'];
        return Promise.all(subs.map(sub =>
          _db.collection('allies/' + uid + '/' + sub).get()
            .then(snap => {
              const batch = _db.batch();
              snap.docs.forEach(d => batch.delete(d.ref));
              return snap.docs.length ? batch.commit() : Promise.resolve();
            })
        ));
      })
      .then(() => _db.collection('players').doc(uid).delete())
      .then(() => _auth.currentUser.delete())
      .then(() => NativeAuth_onDeleteResult(true, ''))
      .catch(e => NativeAuth_onDeleteResult(false, _friendlyError(e.code)));
  },

  reloadApp() {
    window.location.reload();
  }
};

/* ================================================
   FRIENDLY ERROR MESSAGES  (mirrors Kotlin)
   ================================================ */
function _friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':  return 'Incorrect email or password.';
    case 'auth/email-already-in-use': return 'An account with that email already exists.';
    case 'auth/weak-password':        return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':        return 'Please enter a valid email address.';
    case 'auth/too-many-requests':    return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    case 'auth/requires-recent-login':  return 'Please sign in again before doing this.';
    default: return code || 'Something went wrong. Please try again.';
  }
}

/* ================================================
   NativeMap  (localStorage — map quests are
   local-only on web; full sync needs mobile app)
   ================================================ */
window.NativeMap = {
  getMapsApiKey() {
    setTimeout(() => NativeMap_onApiKey('LEAFLET_MODE'), 0);
  },

  checkPermissionState() {
    if (!navigator.geolocation) { setTimeout(() => NativeLocation_onPermissionState('denied'), 0); return; }
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(r => {
        NativeLocation_onPermissionState(r.state === 'granted' ? 'granted' : r.state === 'denied' ? 'denied' : 'not_asked');
      }).catch(() => NativeLocation_onPermissionState('not_asked'));
    } else {
      setTimeout(() => NativeLocation_onPermissionState('not_asked'), 0);
    }
  },

  requestLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => NativeLocation_onPermissionState('granted'),
        () => NativeLocation_onPermissionState('denied')
      );
    }
  },

  requestLocation() {
    if (!navigator.geolocation) { setTimeout(() => NativeLocation_onLocationResult(false, 0, 0), 0); return; }
    navigator.geolocation.getCurrentPosition(
      pos => NativeLocation_onLocationResult(true, pos.coords.latitude, pos.coords.longitude),
      ()  => NativeLocation_onLocationResult(false, 0, 0),
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
    fetch('https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(query.trim()) + '&format=json&limit=5&addressdetails=0&accept-language=en',
      { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => NativeMap_onLocationSearchResults(JSON.stringify(data)))
      .catch(() => NativeMap_onLocationSearchResults('[]'));
  },

  geocodeAddress(address) {
    if (!address) return;
    fetch('https://nominatim.openstreetmap.org/search?q=' +
      encodeURIComponent(address.trim()) + '&format=json&limit=1',
      { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data && data.length) {
          NativeMap_onGeocodeResult(true, parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name || '');
        } else {
          NativeMap_onGeocodeResult(false, 0, 0, '');
        }
      })
      .catch(() => NativeMap_onGeocodeResult(false, 0, 0, ''));
  },

  saveQuest(questJson) {
    try {
      const q  = JSON.parse(questJson);
      const qs = _load(_LS_QUESTS) || [];
      q.id  = 'WQ_' + Date.now();
      q.uid = _auth.currentUser ? _auth.currentUser.uid : 'WEB_USER';
      q.ts  = Date.now();
      qs.push(q);
      _save(_LS_QUESTS, qs);
      const user = _auth.currentUser;
      if (user) {
        _db.collection('players').doc(user.uid).set(
          { quests: qs, questsUpdated: Date.now() }, { merge: true }
        ).catch(() => {});
      }
      setTimeout(() => NativeMap_onQuestSaved(true, q.id), 0);
    } catch(e) {
      setTimeout(() => NativeMap_onQuestSaved(false, ''), 0);
    }
  },

  loadQuestMarkers() {
    const qs = _load(_LS_QUESTS) || [];
    setTimeout(() => NativeMap_onQuestsLoaded(JSON.stringify(qs)), 0);
  },

  loadMyQuests() {
    const uid = _auth.currentUser ? _auth.currentUser.uid : 'WEB_USER';
    const qs  = (_load(_LS_QUESTS) || []).filter(q => q.uid === uid);
    setTimeout(() => NativeMap_onMyQuestsLoaded(JSON.stringify(qs)), 0);
  },

  deleteQuest(questId) {
    let qs = (_load(_LS_QUESTS) || []).filter(q => q.id !== questId);
    _save(_LS_QUESTS, qs);
    const user = _auth.currentUser;
    if (user) {
      _db.collection('players').doc(user.uid).set(
        { quests: qs, questsUpdated: Date.now() }, { merge: true }
      ).catch(() => {});
    }
    setTimeout(() => NativeMap_onQuestDeleted(true, questId), 0);
  },

  savePlayerXP(charXP, charLevel, freqXP, freqLevel, statXPJson) {
    try {
      const existing = _load(_LS_XP) || {};
      _save(_LS_XP, { ...existing, charXP, charLevel, freqXP, freqLevel,
        statXP: JSON.parse(statXPJson || '{}') });
    } catch(e) {}
    const user = _auth.currentUser;
    if (user) {
      _db.collection('players').doc(user.uid).set(
        { charXP, charLevel, freqXP, freqLevel, statXP: statXPJson, updated: Date.now() },
        { merge: true }
      ).catch(() => {});
    }
  },

  saveFreqLog(freqLogJson) {
    const user = _auth.currentUser;
    if (!user) return;
    try {
      _db.collection('players').doc(user.uid).set(
        { freqLog: JSON.parse(freqLogJson || '{}'), freqLogUpdated: Date.now() },
        { merge: true }
      ).catch(() => {});
    } catch(e) {}
  },

  /** Sync achievements + all progress keys to Firestore. Called from achievements.js. */
  saveAchievements() {
    const user = _auth.currentUser;
    if (!user) return;
    try {
      const achievements  = localStorage.getItem('scl_achievements')  || '{}';
      const founder       = localStorage.getItem('scl_founder') === 'true';
      const dailyStreak   = localStorage.getItem('scl_daily_streak')  || '{}';
      const lqp           = localStorage.getItem('scl_lqp')           || '{}';
      const irlCompleted  = parseInt(localStorage.getItem('scl_irl_completed')  || '0') || 0;
      const questsCreated = parseInt(localStorage.getItem('scl_quests_created') || '0') || 0;
      const inviteAllies  = parseInt(localStorage.getItem('scl_invite_allies')  || '0') || 0;
      const thirtyDayDone = parseInt(localStorage.getItem('scl_30day_done')     || '0') || 0;
      _db.collection('players').doc(user.uid).set(
        { achievements, founder, dailyStreak, lqp,
          irlCompleted, questsCreated, inviteAllies, thirtyDayDone,
          achievementsUpdated: Date.now() },
        { merge: true }
      ).catch(() => {});
    } catch(e) {}
  }
};

/* ================================================
   NativeAllies  (localStorage stub)
   ================================================ */
window.NativeAllies = {
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
    _db.collection('players').doc(uid).get()
      .then(snap => NativeAllies_onPlayerName(snap.exists ? (snap.data().name || 'An ally') : 'An ally'))
      .catch(() => NativeAllies_onPlayerName('An ally'));
  },
  startQuestNotifListener(mode) {},
  stopQuestNotifListener() {},
  getQuestNotifMode() { return 'off'; }
};

/* ================================================
   NativeNotif  (Web Notifications API)
   ================================================ */
window.NativeNotif = {
  scheduleDaily(hour, minute, title, body) {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') new Notification(title, { body });
      });
    }
  },
  cancelDaily() {},
  sendNow(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
};
