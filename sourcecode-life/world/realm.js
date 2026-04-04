/* ================================================
   SOURCE CODE: LIFE — realm.js
   Simulation World Page Logic
   ================================================ */

'use strict';

/* ─── localStorage keys (shared with profile) ─── */
const LS_CHAR_LVL   = 'scl_char_level';
const LS_FREQ_LVL   = 'scl_freq_level';
const LS_STREAK     = 'scl_daily_streak';
const LS_FREQ_Q     = 'scl_freq_quests';
const LS_REALM_Q    = 'scl_realm_quests';
const LS_ACCEPTED   = 'scl_accepted_quests';
const LS_Q_CREATED  = 'scl_quests_created';
const LS_IRL_DONE   = 'scl_irl_completed';
const LS_PLAYER     = 'scl_player';
const LS_THEME      = 'scl_theme';
const LS_CHAR_XP    = 'scl_char_xp';

/* ─── Quest definitions ─── */
const REALM_ZONES = {
  digital: {
    name: 'THE DIGITAL',
    icon: '◈',
    color: '#00e5cc',
    quests: [
      // latlng = [500 - svgY, svgX] for L.CRS.Simple with [[0,0],[500,800]] bounds
      { id: 'dq1', label: 'Share SCL on Facebook',      url: 'https://www.facebook.com/kytholek',        platform: 'Facebook',
        loc: 'SECTOR GATE',  icon: '⚔', latlng: [290, 350], desc: 'Spread the signal. Share the Source Code.' },
      { id: 'dq2', label: 'Like the SCL Facebook Page', url: 'https://www.facebook.com/kytholek',        platform: 'Facebook',
        loc: 'NODE PRIME',   icon: '◈', latlng: [270, 430], desc: 'Anchor your energy. Like the page.' },
      { id: 'dq3', label: 'Subscribe on YouTube',       url: 'https://www.youtube.com/@kytholek',        platform: 'YouTube',
        loc: 'COSMO SPIRE',  icon: '▲', latlng: [325, 195], desc: 'Tune in to the frequency broadcasts.' },
      { id: 'dq4', label: 'Leave a YouTube Comment',    url: 'https://www.youtube.com/@kytholek',        platform: 'YouTube',
        loc: 'ECHO FALLS',   icon: '◇', latlng: [195, 220], desc: 'Speak your truth into the stream.' },
      { id: 'dq5', label: 'Share a Blog Post',          url: 'https://simulationsourcecode.com/blog/',   platform: 'Any',
        loc: 'CODEX ARCHIVE', icon: '✦', latlng: [330, 630], desc: 'Carry knowledge across the digital realm.' },
    ]
  },
  world: {
    name: 'THE WORLD',
    icon: '🗺',
    color: '#d4a843',
    quests: [
      { id: 'wq1', label: 'Create your first map quest',  autoKey: LS_Q_CREATED,  autoMin: 1  },
      { id: 'wq2', label: 'Explore the world map',        selfReport: true },
      { id: 'wq3', label: 'Accept a nearby quest',        autoKey: LS_ACCEPTED,   autoMin: 1, autoCount: true },
      { id: 'wq4', label: 'Complete 3 IRL quests',        autoKey: LS_IRL_DONE,   autoMin: 3  },
      { id: 'wq5', label: 'Create 5 map quests',          autoKey: LS_Q_CREATED,  autoMin: 5  },
      { id: 'dly1', label: 'Complete your first daily quest', autoKey: LS_STREAK, autoMin: 1  },
      { id: 'dly2', label: 'Hit a 7-day streak',          autoKey: LS_STREAK,     autoMin: 7  },
      { id: 'dly3', label: 'Hit a 30-day streak',         autoKey: LS_STREAK,     autoMin: 30 },
    ]
  }
};

/* ─── Mock leaderboard data ─── */
const MOCK_PLAYERS = [
  { name: 'AXIOM_7',    score: 187, lp: 7, soul: 3, expr: 1,  arch: 'THE SEEKER'    },
  { name: 'NOVA_III',   score: 142, lp: 3, soul: 9, expr: 6,  arch: 'THE CREATOR'   },
  { name: 'ZEPHYR',     score: 118, lp: 5, soul: 1, expr: 8,  arch: 'THE WANDERER'  },
  { name: 'CIPHER_9',   score: 97,  lp: 9, soul: 5, expr: 4,  arch: 'THE ARCHITECT' },
  { name: 'VELA_X',     score: 84,  lp: 4, soul: 7, expr: 2,  arch: 'THE BUILDER'   },
  { name: 'CHRONOS',    score: 71,  lp: 8, soul: 4, expr: 9,  arch: 'THE MASTER'    },
  { name: 'SOLARA',     score: 55,  lp: 2, soul: 6, expr: 5,  arch: 'THE HEALER'    },
  { name: 'ECHO_4',     score: 43,  lp: 6, soul: 2, expr: 7,  arch: 'THE GUIDE'     },
  { name: 'DRIFT',      score: 28,  lp: 1, soul: 8, expr: 3,  arch: 'THE PIONEER'   },
  { name: 'GLITCH_1',   score: 14,  lp: 5, soul: 5, expr: 5,  arch: 'THE CATALYST'  },
];

/* ═══════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════ */
function _ls(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? v : fallback; }
  catch(e) { return fallback; }
}
function _lsJson(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch(e) { return fallback; }
}
function _lsSet(key, val) {
  try { localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val); }
  catch(e) {}
}

/* ─── Score formula ─── */
function calcScore() {
  const charLvl  = parseInt(_ls(LS_CHAR_LVL, '1'), 10) || 1;
  const freqLvl  = parseInt(_ls(LS_FREQ_LVL, '1'), 10) || 1;
  const streak   = parseInt(_ls(LS_STREAK,   '0'), 10) || 0;
  const realmQ   = _lsJson(LS_REALM_Q, {});
  const realmDone= Object.values(realmQ).filter(Boolean).length;
  const freqQ    = _lsJson(LS_FREQ_Q, {});
  const freqDone = Object.values(freqQ).filter(Boolean).length;
  return charLvl + freqLvl + realmDone + streak + Math.floor(freqDone / 5);
}

function getTier(score) {
  if (score >= 100) return { label: 'SOURCE', cls: 'tier-source' };
  if (score >= 50)  return { label: 'ARCHON', cls: 'tier-archon' };
  return              { label: 'ADEPT',  cls: 'tier-adept'  };
}

function getPlayerName() {
  return _lsJson(LS_PLAYER, {}).name || 'PLAYER';
}
function isFounder() {
  try { return localStorage.getItem('scl_founder') === 'true'; } catch(e) { return false; }
}
function _founderTag(inline) {
  if (!isFounder()) return '';
  const sz = inline ? 18 : 26;
  const c  = '#e8c96b';
  const svg = `<svg width="${sz}" height="${sz}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M6,27 L6,17 L13,24 L20,9 L27,24 L34,17 L34,27 Z" fill="${c}" opacity="0.18" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><rect x="6" y="27" width="28" height="7" rx="1" fill="${c}" opacity="0.25" stroke="${c}" stroke-width="1.5"/><circle cx="20" cy="9" r="2.5" fill="${c}"/><circle cx="6" cy="17" r="1.8" fill="${c}" opacity="0.85"/><circle cx="34" cy="17" r="1.8" fill="${c}" opacity="0.85"/><circle cx="13" cy="30.5" r="1.5" fill="${c}"/><circle cx="20" cy="30.5" r="1.5" fill="${c}"/><circle cx="27" cy="30.5" r="1.5" fill="${c}"/></svg>`;
  return `<span class="founder-crown-medal" title="Founder" style="vertical-align:middle;margin-right:4px;">${svg}</span>`;
}

/* ─── Check quest auto-completion ─── */
function _questAutoComplete(q) {
  if (!q.autoKey) return false;
  if (q.autoCount) {
    // key holds an object — count truthy values
    const obj = _lsJson(q.autoKey, {});
    return Object.values(obj).filter(Boolean).length >= q.autoMin;
  }
  const val = parseInt(_ls(q.autoKey, '0'), 10) || 0;
  return val >= q.autoMin;
}

/* ═══════════════════════════════════════════════
   REALM INIT
   ═══════════════════════════════════════════════ */
function _autoCheckWorldQuests() {
  const realmQ = _lsJson(LS_REALM_Q, {});
  let updated = false;
  REALM_ZONES.world.quests.forEach(q => {
    if (realmQ[q.id]) return;
    if (!q.selfReport && _questAutoComplete(q)) {
      realmQ[q.id] = true;
      updated = true;
    }
  });
  if (updated) {
    _lsSet(LS_REALM_Q, realmQ);
    if (typeof NativeMap !== 'undefined' && typeof NativeMap.saveAchievements === 'function') {
      NativeMap.saveAchievements();
    }
  }
  return updated;
}

function Realm_init() {
  // Apply saved theme
  const theme = _ls(LS_THEME, 'scifi');
  document.documentElement.setAttribute('data-theme', theme);

  // Player name
  const nameEl = document.getElementById('worldPlayerName');
  if (nameEl) nameEl.textContent = getPlayerName();

  // Auto-complete world quests based on existing counters
  _autoCheckWorldQuests();

  // Handle hash navigation
  const hash = window.location.hash.replace('#', '');
  if (hash === 'social')        { World_switchTab('social'); }
  else if (hash === 'worldmap') { World_switchTab('hub'); setTimeout(() => Hub_switchMap('world'), 100); }
  else if (hash === 'digital')  { World_switchTab('hub'); setTimeout(() => Hub_switchMap('digital'), 100); }
  else { World_switchTab('hub'); }

  // Init digital map after layout settles
  setTimeout(() => {
    _initDigitalMap();
    _renderDigitalLegend();
  }, 80);
}

/* ═══════════════════════════════════════════════
   TAB NAVIGATION
   ═══════════════════════════════════════════════ */
function World_switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.getElementById('wTabBtn_' + tab);
  const panel = document.getElementById('wPanel_' + tab);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');

  if (tab === 'social') {
    const active = document.querySelector('.section-btn[data-sub].active');
    if (!active) Social_switchSub('leaderboard');
    else {
      const sub = active.dataset.sub;
      if (sub === 'leaderboard') Ranks_build();
      else if (sub === 'allies') Allies_render();
      else if (sub === 'chat')   Chat_init();
    }
  }
  if (tab === 'hub') {
    const activeMap = document.querySelector('.section-btn[data-map].active');
    if (!activeMap) Hub_switchMap('digital');
  }
}

/* ═══════════════════════════════════════════════
   HUB — MAP TOGGLE
   ═══════════════════════════════════════════════ */
function Hub_switchMap(type) {
  document.querySelectorAll('.section-btn[data-map]').forEach(b => {
    b.classList.toggle('active', b.dataset.map === type);
  });
  const digitalView   = document.getElementById('hubDigitalView');
  const worldView     = document.getElementById('hubWorldView');
  const makeQuestView = document.getElementById('hubMakeQuestView');
  if (digitalView)   digitalView.classList.add('hidden');
  if (worldView)     worldView.classList.add('hidden');
  if (makeQuestView) makeQuestView.classList.add('hidden');
  if (type === 'digital') {
    if (digitalView) digitalView.classList.remove('hidden');
    setTimeout(_initDigitalMap, 60);
  } else if (type === 'world') {
    if (worldView) worldView.classList.remove('hidden');
    _initWorldMap();
    _renderActiveQuests();
  } else if (type === 'makequest') {
    if (makeQuestView) makeQuestView.classList.remove('hidden');
    MakeQuest_init();
  }
}

/* ─── Digital World Map (Leaflet + custom SVG world) ─── */
function _getDigitalMapSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <pattern id="og" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0c2035" stroke-width="0.4"/>
    </pattern>
    <filter id="softglow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="oceanDepth" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#081828"/>
      <stop offset="100%" stop-color="#04121e"/>
    </radialGradient>
  </defs>

  <!-- Ocean -->
  <rect width="800" height="500" fill="url(#oceanDepth)"/>
  <rect width="800" height="500" fill="url(#og)" opacity="0.5"/>

  <!-- Main continent (center) -->
  <path d="M175,100 C210,72 280,62 350,68 C420,74 475,95 508,130 C541,165 548,205 534,250
           C520,295 488,325 448,342 C408,359 358,358 310,344 C262,330 225,302 200,265
           C175,228 162,195 164,158 C166,121 140,128 175,100Z"
        fill="#1d3a12" stroke="#142b0a" stroke-width="1.5"/>
  <!-- Inner highlands -->
  <path d="M240,140 C265,125 310,120 350,128 C390,136 420,155 425,185
           C430,215 408,240 375,250 C342,260 305,252 280,232 C255,212 240,185 238,163 Z"
        fill="#253e14" stroke="#1a2e0e" stroke-width="1"/>

  <!-- Mountain range -->
  <g fill="#3d2e18" filter="url(#softglow)">
    <polygon points="295,145 307,122 319,145"/>
    <polygon points="314,143 326,120 338,143"/>
    <polygon points="333,141 345,118 357,141"/>
    <polygon points="352,139 364,116 376,139"/>
  </g>
  <g fill="#dce8f0" opacity="0.85">
    <polygon points="300,136 307,122 314,136"/>
    <polygon points="319,134 326,120 333,134"/>
    <polygon points="338,132 345,118 352,132"/>
    <polygon points="357,130 364,116 371,130"/>
  </g>

  <!-- Dense forests -->
  <g fill="#1a4010" opacity="0.8">
    <circle cx="228" cy="205" r="13"/><circle cx="243" cy="198" r="11"/>
    <circle cx="236" cy="218" r="10"/><circle cx="218" cy="218" r="12"/>
    <circle cx="254" cy="212" r="9"/>
  </g>
  <g fill="#214d12" opacity="0.7">
    <circle cx="442" cy="278" r="11"/><circle cx="456" cy="272" r="10"/>
    <circle cx="448" cy="289" r="9"/><circle cx="432" cy="287" r="10"/>
  </g>

  <!-- River -->
  <path d="M318,148 C313,168 306,190 303,212 C300,234 305,254 312,268"
        fill="none" stroke="#1a5080" stroke-width="2.5" opacity="0.7"/>
  <path d="M312,268 C318,278 316,295 322,305" fill="none" stroke="#1a5080" stroke-width="1.8" opacity="0.6"/>

  <!-- Desert patch -->
  <ellipse cx="486" cy="192" rx="32" ry="20" fill="#5a4218" opacity="0.65"/>
  <ellipse cx="486" cy="192" rx="22" ry="14" fill="#6b4f22" opacity="0.45"/>

  <!-- Northern glacier -->
  <path d="M140,14 C195,4 275,8 345,24 C415,40 455,62 432,78
           C409,94 345,93 278,87 C211,81 158,64 133,48 C108,32 85,24 140,14Z"
        fill="#bccdd6" stroke="#9ab0bc" stroke-width="1"/>
  <path d="M160,18 C205,10 268,13 322,28 C376,43 408,60 388,72
           C368,84 310,82 258,76 C206,70 163,56 143,44 Z"
        fill="#d2e0e8" opacity="0.55"/>
  <!-- Glacier cracks -->
  <path d="M200,30 L215,45 L205,58" fill="none" stroke="#8aaabb" stroke-width="1" opacity="0.5"/>
  <path d="M270,20 L280,36 L268,50" fill="none" stroke="#8aaabb" stroke-width="1" opacity="0.5"/>

  <!-- Eastern continent -->
  <path d="M572,108 C606,86 652,92 672,122 C692,152 686,196 662,222
           C638,248 605,256 580,240 C555,224 540,198 545,170 C550,142 538,130 572,108Z"
        fill="#27451a" stroke="#1a3210" stroke-width="1.2"/>
  <g fill="#1e4012" opacity="0.75">
    <circle cx="605" cy="155" r="9"/><circle cx="618" cy="148" r="8"/>
    <circle cx="612" cy="166" r="8"/>
  </g>

  <!-- Western islands -->
  <path d="M55,194 C72,178 96,182 100,200 C104,218 88,232 68,228 C48,224 38,210 55,194Z"
        fill="#28401a"/>
  <path d="M42,258 C56,245 74,250 75,266 C76,282 62,291 48,284 C34,277 28,271 42,258Z"
        fill="#243818"/>
  <path d="M70,310 C80,302 94,306 93,318 C92,330 79,335 68,328 C57,321 60,318 70,310Z"
        fill="#203215"/>

  <!-- Southern islands -->
  <path d="M342,392 C360,378 386,384 390,404 C394,424 372,436 352,428 C332,420 324,406 342,392Z"
        fill="#2d4a1c"/>
  <path d="M428,412 C441,402 458,408 457,424 C456,440 440,446 428,438 C416,430 415,422 428,412Z"
        fill="#274018"/>
  <path d="M274,408 C285,400 298,404 296,418 C294,432 280,436 271,427 C262,418 263,416 274,408Z"
        fill="#233515"/>

  <!-- Location name labels -->
  <text x="318" y="375" text-anchor="middle" fill="#c8a830" font-family="monospace" font-size="8"
        letter-spacing="2" opacity="0.7">MIDGAR REGION</text>
  <text x="608" y="290" text-anchor="middle" fill="#90b8a0" font-family="monospace" font-size="7"
        letter-spacing="1" opacity="0.6">WUTAI ISLE</text>
  <text x="228" y="50" text-anchor="middle" fill="#b8ccd8" font-family="monospace" font-size="7"
        letter-spacing="2" opacity="0.55">ICICLE WASTES</text>

  <!-- Ocean label -->
  <text x="100" y="350" fill="#0f2d45" font-family="monospace" font-size="10"
        letter-spacing="3" opacity="0.4">THE LIFESTREAM SEA</text>
  <text x="490" y="470" fill="#0f2d45" font-family="monospace" font-size="8"
        letter-spacing="2" opacity="0.35">SOUTHERN EXPANSE</text>
</svg>`;
}

let _digitalMapInstance = null;

function _initDigitalMap() {
  const el = document.getElementById('digitalLeafletMap');
  if (!el || typeof L === 'undefined') return;

  // Resize existing map if already initialised
  if (_digitalMapInstance) {
    _digitalMapInstance.invalidateSize();
    _refreshDigitalMarkers();
    return;
  }

  const bounds = [[0, 0], [500, 800]];
  const map = L.map('digitalLeafletMap', {
    crs:              L.CRS.Simple,
    minZoom:          -1,
    maxZoom:          3,
    zoomSnap:         0.25,
    zoomControl:      false,
    attributionControl: false,
  });

  // SVG world as image overlay
  const svgStr = _getDigitalMapSVG();
  const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  L.imageOverlay(svgUrl, bounds).addTo(map);
  map.fitBounds(bounds, { padding: [4, 4] });

  _digitalMapInstance = map;

  // Add quest markers
  _addDigitalMarkers(map);

  // Dismiss hint on first interaction
  map.once('popupopen', () => {
    const hint = document.getElementById('dmapHint');
    if (hint) hint.style.opacity = '0';
  });

  // Build legend below
  _renderDigitalLegend();
}

function _addDigitalMarkers(map) {
  const realmQ = _lsJson(LS_REALM_Q, {});
  REALM_ZONES.digital.quests.forEach(q => {
    const done = !!realmQ[q.id];
    _addDigitalMarker(map, q, done);
  });
}

function _addDigitalMarker(map, q, done) {
  const icon = L.divIcon({
    html: `<div class="dmap-marker${done ? ' dmap-marker--done' : ''}" id="dmk_${q.id}">
             <div class="dmap-pulse"></div>
             <span class="dmap-icon">${done ? '✓' : q.icon}</span>
           </div>`,
    className: '',
    iconSize:  [36, 36],
    iconAnchor:[18, 18],
  });

  const popupHtml = `
    <div class="dmap-popup">
      <div class="dmap-popup-loc">${q.loc}</div>
      <div class="dmap-popup-name">${q.label}</div>
      <div class="dmap-popup-desc">${q.desc}</div>
      <div class="dmap-popup-platform">${q.platform}</div>
      ${done
        ? '<div class="dmap-popup-done">✓ QUEST COMPLETE</div>'
        : `<button class="dmap-popup-btn" onclick="Realm_openLink('${q.id}','${q.url}')">▶ ACCEPT QUEST</button>`
      }
    </div>`;

  const m = L.marker(q.latlng, { icon })
    .addTo(map)
    .bindPopup(popupHtml, {
      maxWidth:     220,
      className:    'dmap-leaflet-popup',
      closeButton:  false,
    });

  // Store marker reference for refresh
  q._marker = m;
}

function _refreshDigitalMarkers() {
  if (!_digitalMapInstance) return;
  const realmQ = _lsJson(LS_REALM_Q, {});
  REALM_ZONES.digital.quests.forEach(q => {
    const done = !!realmQ[q.id];
    const el = document.getElementById('dmk_' + q.id);
    if (el) {
      el.classList.toggle('dmap-marker--done', done);
      const icon = el.querySelector('.dmap-icon');
      if (icon) icon.textContent = done ? '✓' : q.icon;
    }
    // Refresh popup content
    if (q._marker) {
      const popupHtml = `
        <div class="dmap-popup">
          <div class="dmap-popup-loc">${q.loc}</div>
          <div class="dmap-popup-name">${q.label}</div>
          <div class="dmap-popup-desc">${q.desc}</div>
          <div class="dmap-popup-platform">${q.platform}</div>
          ${done
            ? '<div class="dmap-popup-done">✓ QUEST COMPLETE</div>'
            : `<button class="dmap-popup-btn" onclick="Realm_openLink('${q.id}','${q.url}')">▶ ACCEPT QUEST</button>`
          }
        </div>`;
      q._marker.setPopupContent(popupHtml);
    }
  });
  _renderDigitalLegend();
}

function _renderDigitalLegend() {
  const el = document.getElementById('digitalQuestLegend');
  if (!el) return;
  const realmQ = _lsJson(LS_REALM_Q, {});
  el.innerHTML = REALM_ZONES.digital.quests.map(q => {
    const done = !!realmQ[q.id];
    return `<div class="dleg-row${done ? ' dleg-row--done' : ''}" onclick="_digitalMapFly('${q.id}')">
      <span class="dleg-icon">${done ? '✓' : q.icon}</span>
      <span class="dleg-loc">${q.loc}</span>
      <span class="dleg-name">${q.label}</span>
      <span class="dleg-platform">${q.platform}</span>
    </div>`;
  }).join('');
}

function _digitalMapFly(questId) {
  const q = REALM_ZONES.digital.quests.find(x => x.id === questId);
  if (!q || !_digitalMapInstance) return;
  _digitalMapInstance.setView(q.latlng, 0, { animate: true });
  setTimeout(() => q._marker && q._marker.openPopup(), 300);
}

function _renderWorldQuestList() {
  const el = document.getElementById('hubWorldQuestList');
  if (!el) return;
  const realmQ = _lsJson(LS_REALM_Q, {});
  el.innerHTML = REALM_ZONES.world.quests.map(q => {
    const done = !!realmQ[q.id];
    return `<div class="realm-quest-row${done ? ' quest-done' : ''}" id="rq_${q.id}">
      <div class="rqr-icon">${done ? '✓' : '◈'}</div>
      <div class="rqr-body">
        <div class="rqr-name">${q.label}</div>
        <div class="rqr-meta"><span class="rqr-freq">${q.autoKey ? 'Auto-tracked' : 'Self-report'}</span></div>
        ${!done && q.selfReport ? `<div class="rqr-actions">
          <button class="rqr-done-btn" onclick="Realm_tapComplete('${q.id}')">✓ DONE</button>
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}

/* ─── Active accepted quests display ─── */
function _renderActiveQuests() {
  const el = document.getElementById('activeQuestsList');
  if (!el) return;
  const accepted = _lsJson(LS_ACCEPTED, {});
  const entries = Object.values(accepted).filter(v => v && v.status === 'active');
  if (!entries.length) {
    el.innerHTML = '<div class="aq-empty">No active quests. Accept one from the map markers below.</div>';
    return;
  }
  const typeIcons = { exploration:'🗺', connection:'⚔', achievement:'▲', healing:'✦', creation:'◈', reflection:'◇' };
  el.innerHTML = entries.map(q => {
    const icon = typeIcons[q.type] || '◈';
    const name = q.name || q.questId || q.id || 'Quest';
    const desc = q.desc || q.description || '';
    const id   = q.questId || q.id;
    return `<div class="aq-row">
      <span class="aq-icon">${icon}</span>
      <div class="aq-info">
        <div class="aq-name">${name}</div>
        ${desc ? `<div class="aq-desc">${desc}</div>` : ''}
      </div>
      <button class="aq-cancel-btn" onclick="_cancelAcceptedQuest('${id}')" title="Remove from log">✕</button>
    </div>`;
  }).join('');
}

function _cancelAcceptedQuest(questId) {
  const accepted = _lsJson(LS_ACCEPTED, {});
  delete accepted[questId];
  _lsSet(LS_ACCEPTED, accepted);
  _renderActiveQuests();
}

/* ─── Leaflet world map ─── */
const MAP_THEMES = {
  scifi:   { tile: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',  attrib: '&copy; OpenStreetMap &copy; CARTO' },
  fantasy: { tile: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',                attrib: '&copy; OpenStreetMap contributors' },
  unicorn: { tile: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attrib: '&copy; OpenStreetMap &copy; CARTO' },
  diablo:  { tile: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',  attrib: '&copy; OpenStreetMap &copy; CARTO' },
};
function _initWorldMap() {
  if (window._realmMapInstance) {
    setTimeout(() => window._realmMapInstance.invalidateSize(), 50);
    _loadUserQuestMarkers(window._realmMapInstance);
    return;
  }
  const el = document.getElementById('realmLeafletMap');
  if (!el || typeof L === 'undefined') return;
  const theme = _ls(LS_THEME, 'scifi');
  const cfg = MAP_THEMES[theme] || MAP_THEMES.scifi;
  const map = L.map('realmLeafletMap', { center: [20, 0], zoom: 3 });
  L.tileLayer(cfg.tile, { attribution: cfg.attrib, maxZoom: 19 }).addTo(map);
  window._realmMapInstance = map;
  setTimeout(() => {
    map.invalidateSize();
    _loadUserQuestMarkers(map);
  }, 100);
}

const _userQuestMarkers = new Map(); // id → Leaflet marker

function _loadUserQuestMarkers(map) {
  const quests = _lsJson('scl_my_quests', []);
  quests.forEach(q => {
    if (q.coords && !_userQuestMarkers.has(q.id)) {
      _addUserQuestMarker(map, q);
    }
  });
}

function _addUserQuestMarker(map, q) {
  if (!q.coords || !map) return;
  const typeIcons = { exploration:'🗺', connection:'⚔', achievement:'▲', healing:'✦', creation:'◈', reflection:'◇' };
  const icon = L.divIcon({
    html: `<div class="dmap-marker dmap-marker--user" title="${q.name}">
             <div class="dmap-pulse"></div>
             <span class="dmap-icon">${typeIcons[q.type] || '◈'}</span>
           </div>`,
    className: '',
    iconSize:  [36, 36],
    iconAnchor:[18, 18],
  });
  const diffLabel = ['', 'APPRENTICE', 'ADEPT', 'MASTER'][q.diff] || '';
  const objsHtml  = q.objs && q.objs.length
    ? '<ul class="dmap-popup-objs">' + q.objs.map(o => `<li>${o}</li>`).join('') + '</ul>'
    : '';
  const safeId = q.id.replace(/'/g, '');
  const popupHtml = _buildUserQuestPopup(q, safeId, objsHtml, diffLabel);
  const m = L.marker([q.coords.lat, q.coords.lng], { icon })
    .addTo(map)
    .bindPopup(popupHtml, { maxWidth: 220, className: 'dmap-leaflet-popup', closeButton: false });
  _userQuestMarkers.set(q.id, m);
}

function _buildUserQuestPopup(q, safeId, objsHtml, diffLabel) {
  const accepted = _lsJson(LS_ACCEPTED, {});
  const alreadyAccepted = !!(accepted[safeId] && accepted[safeId].status === 'active');
  const acceptBtn = alreadyAccepted
    ? '<div class="dmap-popup-done">✓ IN YOUR QUEST LOG</div>'
    : `<button class="dmap-popup-btn" onclick="_worldAcceptUserQuest('${safeId}')">▶ ACCEPT QUEST</button>`;
  return `
    <div class="dmap-popup">
      <div class="dmap-popup-loc">${q.location || ''}</div>
      <div class="dmap-popup-name">${q.name}</div>
      ${q.desc ? `<div class="dmap-popup-desc">${q.desc}</div>` : ''}
      ${objsHtml || ''}
      <div class="dmap-popup-platform">${diffLabel ? diffLabel + ' · ' : ''}${q.seeker ? q.seeker.toUpperCase() : ''}</div>
      ${acceptBtn}
    </div>`;
}

function _worldAcceptUserQuest(questId) {
  const quests  = _lsJson('scl_my_quests', []);
  const quest   = quests.find(q => q.id === questId) || { id: questId, name: questId, type: 'exploration' };
  const accepted = _lsJson(LS_ACCEPTED, {});
  if (accepted[questId]?.status === 'active') return;
  accepted[questId] = { ...quest, questId, acceptedAt: Date.now(), status: 'active' };
  _lsSet(LS_ACCEPTED, accepted);
  // Refresh popup to show accepted state
  const m = _userQuestMarkers.get(questId);
  if (m) {
    const typeIcons = { exploration:'🗺', connection:'⚔', achievement:'▲', healing:'✦', creation:'◈', reflection:'◇' };
    const objsHtml = quest.objs && quest.objs.length
      ? '<ul class="dmap-popup-objs">' + quest.objs.map(o => `<li>${o}</li>`).join('') + '</ul>'
      : '';
    const diffLabel = ['', 'APPRENTICE', 'ADEPT', 'MASTER'][quest.diff] || '';
    m.setPopupContent(_buildUserQuestPopup(quest, questId, objsHtml, diffLabel));
  }
  _renderActiveQuests();
  // Auto-complete world quest wq3 and refresh the quest list
  _autoCheckWorldQuests();
  _renderWorldQuestList();
}

function _showUserQuestMarker(quest) {
  const map = window._realmMapInstance;
  if (!map || !quest.coords) return;
  if (!_userQuestMarkers.has(quest.id)) _addUserQuestMarker(map, quest);
  map.invalidateSize();
  map.setView([quest.coords.lat, quest.coords.lng], 13, { animate: true });
  setTimeout(() => {
    const m = _userQuestMarkers.get(quest.id);
    if (m) m.openPopup();
  }, 400);
}

/* ═══════════════════════════════════════════════
   QUEST COMPLETION
   ═══════════════════════════════════════════════ */
function Realm_openLink(questId, url) {
  window.open(url, '_blank', 'noopener');
  // Replace popup button with confirm after user visits the link
  const q = REALM_ZONES.digital.quests.find(x => x.id === questId);
  if (!q || !q._marker) return;
  const popupHtml = `
    <div class="dmap-popup">
      <div class="dmap-popup-loc">${q.loc}</div>
      <div class="dmap-popup-name">${q.label}</div>
      <div class="dmap-popup-desc">${q.desc}</div>
      <div class="dmap-popup-platform">${q.platform}</div>
      <button class="dmap-popup-btn dmap-popup-btn--confirm" onclick="Realm_tapComplete('${questId}')">✓ MARK COMPLETE</button>
    </div>`;
  q._marker.setPopupContent(popupHtml);
}

function Realm_tapComplete(questId) {
  const realmQ = _lsJson(LS_REALM_Q, {});
  if (realmQ[questId]) return; // already done
  realmQ[questId] = true;
  _lsSet(LS_REALM_Q, realmQ);

  // Award 20 XP
  const xp = parseInt(_ls(LS_CHAR_XP, '0'), 10) + 20;
  _lsSet(LS_CHAR_XP, xp);

  // Sync progress to Firestore
  if (typeof NativeMap !== 'undefined' && typeof NativeMap.saveAchievements === 'function') {
    NativeMap.saveAchievements();
  }

  _refreshQuestRow(questId);
}

function _refreshQuestRow(questId) {
  _refreshDigitalMarkers();
  _renderWorldQuestList();
}

/* ═══════════════════════════════════════════════
   SOCIAL — SUB-NAV
   ═══════════════════════════════════════════════ */
function Social_switchSub(sub) {
  document.querySelectorAll('.section-btn[data-sub]').forEach(b => {
    b.classList.toggle('active', b.dataset.sub === sub);
  });
  document.querySelectorAll('.social-sub-panel').forEach(p => {
    p.classList.toggle('hidden', p.dataset.sub !== sub);
  });
  if (sub === 'leaderboard') Ranks_build();
  if (sub === 'allies')      { Allies_render(); _renderWorldBoostStatus(); }
  if (sub === 'chat')        Chat_init();
}

/* ═══════════════════════════════════════════════
   LEADERBOARD
   ═══════════════════════════════════════════════ */
function Ranks_toggleCard(pos) {
  const card = document.getElementById('rank-card-' + pos);
  if (!card) return;
  const isOpen = card.style.display !== 'none';
  // Close all open cards first
  document.querySelectorAll('.rank-char-card').forEach(c => { c.style.display = 'none'; });
  document.querySelectorAll('.rank-row').forEach(r => r.classList.remove('rank-row--open'));
  if (!isOpen) {
    card.style.display = 'block';
    const row = document.querySelector(`.rank-row[data-pos="${pos}"]`);
    if (row) row.classList.add('rank-row--open');
  }
}

function _buildRankCharCard(p, pos, t) {
  const tierHtml = t ? `<span class="rank-tier ${t.cls}">${t.label}</span>` : '';
  if (p.isPlayer) {
    const lp     = parseInt(_ls(LS_CHAR_LVL, '1'), 10);
    const fl     = parseInt(_ls(LS_FREQ_LVL,  '1'), 10);
    const player = _lsJson(LS_PLAYER, {});
    // If frequencies weren't in localStorage yet, compute them now from stored m/d/y/name
    let lePath = player.lifePath   || null;
    let soul   = player.soulUrge   || null;
    let expr   = player.expression || null;
    if ((!lePath || !soul || !expr) && player.m && player.d && player.y && player.name && typeof computeAll === 'function') {
      const computed = computeAll(player.m, player.d, player.y, player.name);
      lePath = lePath || (computed.lp ? computed.lp.root : null);
      soul   = soul   || (computed.so ? computed.so.root : null);
      expr   = expr   || (computed.ex ? computed.ex.root : null);
    }
    lePath = lePath || '—';
    soul   = soul   || '—';
    expr   = expr   || '—';
    return `<div class="rcc-inner">
      <div class="rcc-header">
        <div class="rcc-name">${_founderTag(true)}${p.name}</div>
        <div class="rcc-badges">
          ${tierHtml}
          <span class="rcc-score">${p.score} XP</span>
        </div>
      </div>
      <div class="rcc-numbers">
        <div class="rcc-num"><span class="rcc-val">${lp}</span><span class="rcc-lbl">CHAR LVL</span></div>
        <div class="rcc-num"><span class="rcc-val">${fl}</span><span class="rcc-lbl">FREQ LVL</span></div>
        <div class="rcc-num"><span class="rcc-val">${lePath}</span><span class="rcc-lbl">LIFE PATH</span></div>
        <div class="rcc-num"><span class="rcc-val">${soul}</span><span class="rcc-lbl">SOUL</span></div>
        <div class="rcc-num"><span class="rcc-val">${expr}</span><span class="rcc-lbl">EXPR</span></div>
      </div>
      <div class="rcc-you-tag">◄ YOUR PROFILE</div>
    </div>`;
  } else {
    const maxScore = MOCK_PLAYERS[0].score || 187;
    const xpPct = Math.round((p.score / maxScore) * 100);
    return `<div class="rcc-inner">
      <div class="rcc-header">
        <div class="rcc-name">${p.name}</div>
        <div class="rcc-badges">
          ${tierHtml}
          <span class="rcc-score">${p.score} XP</span>
        </div>
      </div>
      ${p.arch ? `<div class="rcc-arch">${p.arch}</div>` : ''}
      <div class="rcc-numbers">
        <div class="rcc-num"><span class="rcc-val">${p.lp   || '—'}</span><span class="rcc-lbl">LIFE PATH</span></div>
        <div class="rcc-num"><span class="rcc-val">${p.soul || '—'}</span><span class="rcc-lbl">SOUL</span></div>
        <div class="rcc-num"><span class="rcc-val">${p.expr || '—'}</span><span class="rcc-lbl">EXPR</span></div>
      </div>
      <div class="rcc-xpbar-wrap">
        <div class="rcc-xpbar-track"><div class="rcc-xpbar-fill" style="width:${xpPct}%"></div></div>
        <span class="rcc-xpbar-lbl">${xpPct}% FREQ</span>
      </div>
    </div>`;
  }
}

function Ranks_build() {
  const el = document.getElementById('ranksList');
  if (!el) return;

  const playerName  = getPlayerName();
  const playerScore = calcScore();
  const playerTier  = getTier(playerScore);

  const all = [...MOCK_PLAYERS, { name: playerName, score: playerScore, isPlayer: true }]
    .sort((a, b) => b.score - a.score);

  const TIER_BY_POS = [
    { label: 'SOURCE', cls: 'tier-source' },
    { label: 'ARCHON', cls: 'tier-archon' },
    { label: 'ADEPT',  cls: 'tier-adept'  },
  ];

  el.innerHTML = all.map((p, i) => {
    const t   = i < 3 ? TIER_BY_POS[i] : null;
    const pos = (i + 1).toString().padStart(2, '0');
    return `<div class="rank-row${p.isPlayer ? ' rank-row-you' : ''}" data-pos="${pos}" onclick="Ranks_toggleCard('${pos}')">
      <span class="rank-pos">#${pos}</span>
      <span class="rank-name">${p.isPlayer ? _founderTag(true) : ''}${p.name}${p.isPlayer ? ' ◄' : ''}</span>
      ${t ? `<span class="rank-tier ${t.cls}">${t.label}</span>` : ''}
      <span class="rank-score">${p.score}</span>
      <span class="rank-expand-icon">▼</span>
    </div>
    <div class="rank-char-card" id="rank-card-${pos}" style="display:none;">${_buildRankCharCard(p, pos, t)}</div>`;
  }).join('');

  // Update player summary card
  const cardEl = document.getElementById('playerRankCard');
  if (cardEl) {
    cardEl.innerHTML = `
      <div class="prc-name">${_founderTag(false)}${playerName}</div>
      <div class="prc-score-row">
        <span class="prc-score">${playerScore}</span>
        <span class="prc-tier ${playerTier.cls}">${playerTier.label}</span>
      </div>
      <div class="prc-breakdown">LVL ${parseInt(_ls(LS_CHAR_LVL,'1'),10)} + FREQ ${parseInt(_ls(LS_FREQ_LVL,'1'),10)} + REALM + STREAK</div>
    `;
  }
}

/* ═══════════════════════════════════════════════
   ALLIES
   ═══════════════════════════════════════════════ */
function Allies_render() {
  const el = document.getElementById('alliesCardGrid');
  if (!el) return;
  // Allies stored in scl_allies (if exists from profile)
  const allies = _lsJson('scl_allies', []);
  if (!allies.length) {
    el.innerHTML = '<div class="allies-empty">No allies yet. Invite players using the link above.</div>';
    return;
  }
  el.innerHTML = allies.map(a => {
    const score = a.score || 0;
    const t = getTier(score);
    return `<div class="ally-card">
      <div class="ally-avatar">${a.avatar ? `<img src="${a.avatar}" alt="">` : '◈'}</div>
      <div class="ally-name">${a.name || a.email}</div>
      <div class="ally-tier ${t.cls}">${t.label}</div>
      <div class="ally-lvl">LVL ${a.charLevel || 1}</div>
    </div>`;
  }).join('');
}

function _renderWorldBoostStatus() {
  const el = document.getElementById('worldBoostStatus');
  if (!el) return;
  try {
    const until = parseInt(localStorage.getItem('scl_xp_boost_until') || '0', 10);
    if (until && Date.now() < until) {
      const ms = until - Date.now();
      const h  = Math.floor(ms / 3600000);
      const m  = Math.floor((ms % 3600000) / 60000);
      el.innerHTML = `<span class="boost-chip boost-chip--active">✦ 2× XP BOOST ACTIVE — ${h}h ${m}m remaining</span>`;
    } else {
      el.innerHTML = `<span class="boost-chip">Invite an ally to earn 2× XP for 48 hours</span>`;
    }
  } catch(e) {}
}

function World_shareInvite() {
  // Reuse profile's invite modal if profile app.js is available
  if (typeof shareInviteLink === 'function') {
    // Ensure modal container exists
    const modal = document.getElementById('worldInviteModal');
    if (modal) {
      // Temporarily redirect invite modal to world container
      const orig = document.getElementById('inviteModal');
      if (!orig) {
        modal.id = 'inviteModal';
        if (typeof shareInviteLink === 'function') shareInviteLink();
        modal.id = 'worldInviteModal';
        return;
      }
    }
    shareInviteLink();
    return;
  }
  // Standalone fallback — build minimal invite inline
  const player = _lsJson(LS_PLAYER, {});
  const code   = _worldGetReferCode(player);
  const myUid  = localStorage.getItem('scl_uid') || '';
  const link   = `${location.origin}/sourcecode-life/profile/?ref=${code}${myUid ? '&uid=' + myUid : ''}`;
  const modal  = document.getElementById('worldInviteModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.innerHTML = `
    <div class="invite-modal-overlay" onclick="if(event.target===this)this.parentElement.classList.add('hidden')">
      <div class="invite-modal-box">
        <div class="invite-modal-header">
          <div class="invite-modal-title">◈ INVITE AN ALLY</div>
          <button class="invite-modal-close" onclick="document.getElementById('worldInviteModal').classList.add('hidden')">✕</button>
        </div>
        <div class="invite-modal-divider"></div>
        <p class="invite-modal-sub">Share your link. They get 2× XP for 48 hours — and so do you once they join.</p>
        <div class="invite-char-card">
          <div class="invite-char-name">${player.name || 'PLAYER'}</div>
          <div class="invite-char-code">CODE — <strong>${code}</strong></div>
        </div>
        <div class="invite-link-label">YOUR INVITE LINK</div>
        <div class="invite-link-display">
          <div class="invite-link-domain">${location.hostname}/…?ref=</div>
          <div class="invite-link-ref">${code}</div>
          <button class="invite-copy-btn" onclick="_worldCopyInvite('${link}')">COPY</button>
        </div>
        <input type="text" class="invite-link-input-hidden" id="wInviteLinkInput" value="${link}" readonly aria-hidden="true">
        <div id="wInviteCopyStatus" class="invite-copy-status"></div>
        <div class="invite-share-row">
          <button class="invite-share-btn" onclick="_worldNativeShare('${link}', '${player.name || 'PLAYER'}')">▶ SHARE LINK</button>
        </div>
      </div>
    </div>`;
}

function _worldGetReferCode(player) {
  const stored = localStorage.getItem('scl_my_refer_code');
  if (stored) return stored;
  const seed = (player.name || 'PLAYER') + (player.lp || '') + (player.m || '') + (player.d || '') + (player.y || '');
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h) ^ seed.charCodeAt(i);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = ''; let n = Math.abs(h);
  for (let i = 0; i < 6; i++) { code += chars[n % chars.length]; n = Math.floor(n / chars.length) || (n + 7919); }
  localStorage.setItem('scl_my_refer_code', code);
  return code;
}

function _worldCopyInvite(link) {
  navigator.clipboard?.writeText(link).then(() => {
    const s = document.getElementById('wInviteCopyStatus');
    if (s) { s.textContent = '✓ Link copied!'; setTimeout(() => { s.textContent = ''; }, 3000); }
  }).catch(() => {});
}

function _worldNativeShare(link, name) {
  const text = `Join me on Simulation Source Code and decode your blueprint. You'll get 2× XP for 48 hours. — ${name}`;
  if (navigator.share) { navigator.share({ title: 'Simulation Source Code', text, url: link }).catch(() => {}); }
  else _worldCopyInvite(link);
}

/* ═══════════════════════════════════════════════
   MAKE A QUEST
   ═══════════════════════════════════════════════ */
function MakeQuest_init() {
  _buildMqSignature();
  _renderMyQuests();
}

function _buildMqSignature() {
  const player = _lsJson(LS_PLAYER, {});
  const sigEl  = document.getElementById('wMqSigBody');
  if (!sigEl) return;
  if (!player.name) {
    sigEl.innerHTML = '<div class="mq-sig-hint">Sign in via the app to attach your frequencies.</div>';
    return;
  }
  sigEl.innerHTML = `<div class="mq-sig-hint">Signed as <strong>${player.name}</strong></div>`;
}

let _mqSelectedType = 'exploration';
let _mqSelectedNum  = 1;
let _mqSelectedSeeker = 'solo';
let _mqSelectedDiff   = 1;
let _mqCoords = null;

function wSelectQuestType(btn) {
  document.querySelectorAll('.mq-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _mqSelectedType = btn.dataset.type;
}
function wSelectRewardNum(btn) {
  document.querySelectorAll('.mq-reward-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _mqSelectedNum = parseInt(btn.dataset.num, 10);
}
function wSelectSeekerType(btn) {
  document.querySelectorAll('.mq-seeker-btn[data-seeker]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _mqSelectedSeeker = btn.dataset.seeker;
}
function wSelectDifficulty(btn) {
  document.querySelectorAll('.mq-seeker-btn[data-diff]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _mqSelectedDiff = parseInt(btn.dataset.diff, 10);
}
function _wMqCharCount(inputId, countId, max) {
  const v = document.getElementById(inputId).value.length;
  document.getElementById(countId).textContent = v + '/' + max;
}
function _wMqToggleAdvanced() {
  const body  = document.getElementById('wMqAdvancedBody');
  const arrow = document.getElementById('wMqAdvArrow');
  body.classList.toggle('hidden');
  arrow.textContent = body.classList.contains('hidden') ? '▶' : '▼';
}
function _wMqObjReveal() {
  const v1 = document.getElementById('wMqObj1').value.trim();
  const v2 = document.getElementById('wMqObj2').value.trim();
  if (v1) document.getElementById('wMqObj2Row').classList.remove('mq-obj-hidden');
  if (v2) document.getElementById('wMqObj3Row').classList.remove('mq-obj-hidden');
}
function wUseMyLocation() {
  if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    _mqCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    document.getElementById('wMqLocation').value = `${_mqCoords.lat.toFixed(5)}, ${_mqCoords.lng.toFixed(5)}`;
    document.getElementById('wMqLocationStatus').textContent = '◎ Location set via GPS';
  }, () => {
    document.getElementById('wMqLocationStatus').textContent = '⚠ Could not get location.';
  });
}

function wSubmitQuest() {
  const name = document.getElementById('wMqName').value.trim();
  const desc = document.getElementById('wMqDesc').value.trim();
  const loc  = document.getElementById('wMqLocation').value.trim();
  const err  = document.getElementById('wMqError');
  const ok   = document.getElementById('wMqSuccess');
  err.textContent = ''; ok.textContent = '';

  if (!name) { err.textContent = '⚠ Quest name is required.'; return; }
  if (!loc && !_mqCoords) { err.textContent = '⚠ Location is required. Enter an address or use GPS.'; return; }

  // If we have GPS coords already, go straight to create
  if (_mqCoords) { _wDoCreateQuest(name, desc, loc, _mqCoords, ok, err); return; }

  // Try to parse as "lat, lng" string
  const parsed = _parseCoordsFromString(loc);
  if (parsed) { _wDoCreateQuest(name, desc, loc, parsed, ok, err); return; }

  // Geocode via Nominatim
  err.textContent = '⏳ Locating address...';
  fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(loc) + '&format=json&limit=1')
    .then(r => r.json())
    .then(results => {
      err.textContent = '';
      if (!results || !results.length) {
        err.textContent = '⚠ Could not find that location. Try a more specific address or use GPS.';
        return;
      }
      const coords = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
      _mqCoords = coords;
      _wDoCreateQuest(name, desc, loc, coords, ok, err);
    })
    .catch(() => { err.textContent = '⚠ Could not look up that location. Use GPS instead.'; });
}

function _parseCoordsFromString(str) {
  const m = str.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
  return m ? { lat: parseFloat(m[1]), lng: parseFloat(m[2]) } : null;
}

function _wDoCreateQuest(name, desc, loc, coords, ok, err) {
  const quest = {
    id:       'q_' + Date.now(),
    name,
    desc,
    type:     _mqSelectedType,
    reward:   _mqSelectedNum,
    seeker:   _mqSelectedSeeker,
    diff:     _mqSelectedDiff,
    location: loc,
    coords,
    objs:     [
      document.getElementById('wMqObj1').value.trim(),
      document.getElementById('wMqObj2').value.trim(),
      document.getElementById('wMqObj3').value.trim(),
    ].filter(Boolean),
    createdAt: Date.now(),
  };

  // Save
  const existing = _lsJson('scl_my_quests', []);
  existing.push(quest);
  _lsSet('scl_my_quests', existing);

  // Increment counter
  const cnt = parseInt(_ls(LS_Q_CREATED, '0'), 10) + 1;
  _lsSet(LS_Q_CREATED, cnt);

  // Auto-check world quests
  _autoCheckWorldQuests();
  _renderWorldQuestList();

  ok.textContent = '✓ Quest marker dropped on the world map!';

  // Reset form
  document.getElementById('wMqName').value = '';
  document.getElementById('wMqDesc').value = '';
  document.getElementById('wMqLocation').value = '';
  document.getElementById('wMqObj1').value = '';
  document.getElementById('wMqObj2').value = '';
  document.getElementById('wMqObj3').value = '';
  document.getElementById('wMqNameCount').textContent = '0/60';
  document.getElementById('wMqDescCount').textContent = '0/280';
  _mqCoords = null;

  // Refresh my quests list
  _renderMyQuests();

  // Switch to world map and show the marker
  World_switchTab('hub');
  Hub_switchMap('world');
  setTimeout(() => _showUserQuestMarker(quest), 450);
}

/* ─── My Created Quests ─── */
function _renderMyQuests() {
  const el = document.getElementById('wMyQuestsList');
  if (!el) return;
  const quests = _lsJson('scl_my_quests', []);
  if (!quests.length) {
    el.innerHTML = '<div class="aq-empty">No quests created yet.</div>';
    return;
  }
  const typeIcons = { exploration:'🗺', connection:'⚔', achievement:'▲', healing:'✦', creation:'◈', reflection:'◇' };
  el.innerHTML = quests.slice().reverse().map(q => {
    const icon = typeIcons[q.type] || '◈';
    const loc  = q.location ? `<div class="aq-desc">${q.location}</div>` : '';
    return `<div class="aq-row">
      <span class="aq-icon">${icon}</span>
      <div class="aq-info">
        <div class="aq-name">${q.name}</div>
        ${q.desc ? `<div class="aq-desc">${q.desc}</div>` : ''}
        ${loc}
      </div>
      <button class="aq-cancel-btn" onclick="_cancelMyQuest('${q.id.replace(/'/g,'')}')" title="Delete quest">✕</button>
    </div>`;
  }).join('');
}

function _cancelMyQuest(questId) {
  const quests = _lsJson('scl_my_quests', []).filter(q => q.id !== questId);
  _lsSet('scl_my_quests', quests);
  // Remove marker from map if visible
  const m = _userQuestMarkers.get(questId);
  if (m && window._realmMapInstance) { window._realmMapInstance.removeLayer(m); }
  _userQuestMarkers.delete(questId);
  _renderMyQuests();
}

/* ═══════════════════════════════════════════════
   CHAT
   ═══════════════════════════════════════════════ */
const LS_CHAT_PREFIX = 'scl_chat_';
let _chatActiveAllyId = null;

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function Chat_init() {
  const allies     = _lsJson('scl_allies', []);
  const bar        = document.getElementById('chatAllyBar');
  const thread     = document.getElementById('chatThread');
  const inputRow   = document.getElementById('chatInputRow');
  const emptyEl    = document.getElementById('chatEmpty');
  const allyNameEl = document.getElementById('chatAllyName');

  if (!allies.length) {
    if (bar)        bar.innerHTML = '';
    if (thread)     thread.innerHTML = '';
    if (allyNameEl) allyNameEl.textContent = '';
    if (inputRow)   inputRow.classList.add('hidden');
    if (emptyEl)    emptyEl.classList.remove('hidden');
    return;
  }
  if (emptyEl)  emptyEl.classList.add('hidden');
  if (inputRow) inputRow.classList.remove('hidden');

  // Auto-select first ally if none selected or previous ally no longer exists
  const ids = allies.map(a => a.uid || a.id || a.email);
  if (!_chatActiveAllyId || !ids.includes(_chatActiveAllyId)) {
    _chatActiveAllyId = ids[0];
  }

  if (bar) {
    bar.innerHTML = allies.map(a => {
      const id     = a.uid || a.id || a.email;
      const active = id === _chatActiveAllyId ? ' chat-ally-chip--active' : '';
      return `<button class="chat-ally-chip${active}"
                onclick="Chat_selectAlly('${_esc(id)}','${_esc(a.name || a.email || id)}')"
              >${_esc(a.name || a.email || id)}</button>`;
    }).join('');
  }

  const activeAlly = allies.find(a => (a.uid || a.id || a.email) === _chatActiveAllyId);
  if (allyNameEl && activeAlly) {
    allyNameEl.textContent = activeAlly.name || activeAlly.email || _chatActiveAllyId;
  }

  Chat_renderThread();
}

function Chat_selectAlly(id, name) {
  _chatActiveAllyId = id;
  document.querySelectorAll('.chat-ally-chip').forEach(c => c.classList.remove('chat-ally-chip--active'));
  // Re-find the chip by onclick attribute match
  document.querySelectorAll('.chat-ally-chip').forEach(c => {
    if (c.textContent.trim() === name) c.classList.add('chat-ally-chip--active');
  });
  const nameEl = document.getElementById('chatAllyName');
  if (nameEl) nameEl.textContent = name;
  Chat_renderThread();
}

function Chat_renderThread() {
  const el = document.getElementById('chatThread');
  if (!el || !_chatActiveAllyId) return;
  const msgs = _lsJson(LS_CHAT_PREFIX + _chatActiveAllyId, []);
  if (!msgs.length) {
    el.innerHTML = '<div class="chat-no-msgs">No messages yet. Say hello!</div>';
    return;
  }
  el.innerHTML = msgs.map(m => {
    const isMe = m.from === 'me';
    const time = new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<div class="chat-bubble${isMe ? ' chat-bubble--me' : ' chat-bubble--ally'}">
      <div class="chat-bubble-text">${_esc(m.text)}</div>
      <div class="chat-bubble-time">${time}</div>
    </div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function Chat_send() {
  if (!_chatActiveAllyId) return;
  const input = document.getElementById('chatInput');
  const text  = input ? input.value.trim() : '';
  if (!text) return;
  const msgs = _lsJson(LS_CHAT_PREFIX + _chatActiveAllyId, []);
  msgs.push({ from: 'me', text, ts: Date.now() });
  _lsSet(LS_CHAT_PREFIX + _chatActiveAllyId, msgs);
  if (input) input.value = '';
  Chat_renderThread();
  // Native bridge hook (wired when backend is ready):
  // if (typeof NativeAllies !== 'undefined') NativeAllies.sendMessage(_chatActiveAllyId, text);
}

/* ═══════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════
   MATRIX RAIN TRANSITION
   ═══════════════════════════════════════════════ */

// Characters used in the rain — numerology digits + katakana-style symbols
const MTX_CHARS = '012345678901234567890123456789◈◇▲✦⚔◎∞Φ∑ΩΛΨ∆∇⊕⊗☽★⬡⬢░▒▓█▄▀■□▪▫';

let _mtxRaf     = null;
let _mtxDrops   = [];
let _mtxCanvas  = null;
let _mtxCtx     = null;

function _mtxSetup() {
  _mtxCanvas = document.getElementById('matrixCanvas');
  if (!_mtxCanvas) return false;
  _mtxCtx = _mtxCanvas.getContext('2d');
  _mtxResize();
  return true;
}

function _mtxResize() {
  if (!_mtxCanvas) return;
  _mtxCanvas.width  = window.innerWidth;
  _mtxCanvas.height = window.innerHeight;
  const cols = Math.floor(_mtxCanvas.width / 14);
  _mtxDrops = Array.from({ length: cols }, () => Math.random() * -50);
}

function _mtxFrame(speed) {
  const canvas = _mtxCanvas;
  const ctx    = _mtxCtx;
  const W = canvas.width, H = canvas.height;
  const fontSize = 13;
  const cols = _mtxDrops.length;

  // Fade trail
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, W, H);

  ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

  for (let i = 0; i < cols; i++) {
    const y = _mtxDrops[i] * fontSize;
    if (y < 0) { _mtxDrops[i] += speed; continue; }

    // Head glyph — bright white/teal
    const isHead = Math.random() > 0.6;
    ctx.fillStyle = isHead ? '#ffffff' : '#00e5cc';
    const ch = MTX_CHARS[Math.floor(Math.random() * MTX_CHARS.length)];
    ctx.fillText(ch, i * 14, y);

    // Dim glyph one step back
    if (y > fontSize) {
      ctx.fillStyle = 'rgba(0,180,160,0.55)';
      ctx.fillText(MTX_CHARS[Math.floor(Math.random() * MTX_CHARS.length)], i * 14, y - fontSize);
    }

    // Reset drop when past bottom
    if (y > H && Math.random() > 0.975) {
      _mtxDrops[i] = 0;
    }
    _mtxDrops[i] += speed;
  }
}

function _mtxStart(speed) {
  if (!_mtxCtx) return;
  function tick() { _mtxFrame(speed); _mtxRaf = requestAnimationFrame(tick); }
  tick();
}

function _mtxStop() {
  if (_mtxRaf) { cancelAnimationFrame(_mtxRaf); _mtxRaf = null; }
}

// Entry: rain runs, then page fades in
function _matrixEnter(onDone) {
  if (!_mtxSetup()) { onDone(); return; }

  const overlay = document.getElementById('matrixOverlay');
  const label   = document.getElementById('matrixLabel');
  const sub     = document.getElementById('matrixSub');
  overlay.style.opacity = '1';
  overlay.style.display = 'flex';

  _mtxStart(0.7);

  // After 600ms show title
  setTimeout(() => {
    if (label) label.classList.add('visible');
  }, 600);

  // After 1400ms: update sub text, start slowing
  setTimeout(() => {
    if (sub) sub.textContent = 'SYSTEM ONLINE';
    _mtxStop();
    _mtxStart(0.2); // slow drip
  }, 1400);

  // After 2000ms: fade out overlay, reveal page
  setTimeout(() => {
    _mtxStop();
    overlay.style.transition = 'opacity 0.6s ease';
    overlay.style.opacity    = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      onDone();
    }, 620);
  }, 2000);
}

// Exit: rain fires, then navigate
function matrixExit(url) {
  if (!_mtxSetup()) { location.href = url; return; }

  const overlay = document.getElementById('matrixOverlay');
  const sub     = document.getElementById('matrixSub');
  const label   = document.getElementById('matrixLabel');

  if (sub) sub.textContent = 'LEAVING THE MATRIX...';
  overlay.style.transition = 'none';
  overlay.style.opacity = '1';
  overlay.style.display = 'flex';
  if (label) label.classList.add('visible');

  // Clear canvas before starting fresh
  if (_mtxCtx) _mtxCtx.clearRect(0, 0, _mtxCanvas.width, _mtxCanvas.height);
  _mtxResize();
  _mtxStart(0.8);

  setTimeout(() => {
    _mtxStop();
    location.href = url;
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById('appShell');
  if (shell) shell.style.opacity = '0';
  _matrixEnter(() => {
    Realm_init();
    _renderWorldQuestList();
    if (shell) {
      shell.style.transition = 'opacity 0.4s ease';
      shell.style.opacity = '1';
    }
  });
});

window.addEventListener('resize', _mtxResize);
