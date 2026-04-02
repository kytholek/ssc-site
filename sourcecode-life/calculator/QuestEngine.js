/* ============================================================
   QuestEngine.js  —  Source Code: Life
   ─────────────────────────────────────────────────────────────
   TWO LEVEL TRACKS

   ① CHARACTER LEVEL  (charLevel / charXP)  — gold bar
      Earned by completing map quests placed by other players.
      Stat XP (QU column) also accumulates per rewardNum.

   ② FREQUENCY LEVEL  (freqLevel / freqXP)  — teal bar
      Earned by completing numerology-derived quests:
        · Daily quest (+5 XP, resets every 24 h)
        · Personal day / month / year / pinnacle quests
        · Life Path, Expression, Calling, Theme etc.

   Max level: 100 for both tracks.
   Storage: localStorage (instant) + Firestore via NativeMap.savePlayerXP
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   XP TABLE — cumulative XP required to REACH each level
   ───────────────────────────────────────────────────────────── */
const LEVEL_XP_TABLE = (() => {
  const t = [0];
  const cost = l =>
    l <= 10 ? 50  : l <= 20 ? 100 : l <= 30 ? 150 :
    l <= 40 ? 200 : l <= 50 ? 300 : l <= 60 ? 400 :
    l <= 70 ? 500 : l <= 80 ? 650 : l <= 90 ? 800 : 1000;
  for (let i = 1; i <= 100; i++) t.push(t[i - 1] + cost(i));
  return t;
})();
const MAX_LEVEL = 100;

/* ─────────────────────────────────────────────────────────────
   XP AWARDS — add / adjust values as needed
   ───────────────────────────────────────────────────────────── */
const XP_AWARDS = {
  // TRACK A — Character (map quests keyed by rewardNum)
  map_1: 10, map_2: 20,  map_3: 30,  map_4: 40,  map_5: 50,
  map_6: 60, map_7: 70,  map_8: 80,  map_9: 90,
  map_11: 110, map_22: 220, map_33: 330,

  // TRACK B — Frequency (numerology quests)
  daily:          5,    // FIXED — shown in UI, don't change without updating copy
  personal_day:   10,
  personal_month: 25,
  personal_year:  50,
  pinnacle:       75,
  four_month:     30,
  life_path:      60,
  expression:     60,
  life_calling:   80,
  theme:          60,
  soul:           40,
  outer:          40,
  achievement:    40,
};

// Stat growth points per completed quest (1 point = one step toward unlocking innate score)
// Base score is how many times a stat appears in LE+IN — reaching it = fully embodied
const STAT_XP_PER_QUEST = { 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 11:2, 22:2, 33:2 };

/* ─────────────────────────────────────────────────────────────
   STORAGE KEYS
   ───────────────────────────────────────────────────────────── */
const LS_CHAR_XP  = 'scl_char_xp';
const LS_CHAR_LVL = 'scl_char_level';
const LS_FREQ_XP  = 'scl_freq_xp';
const LS_FREQ_LVL = 'scl_freq_level';
const LS_STAT_XP  = 'scl_stat_xp';
const LS_DAILY_Q  = 'scl_daily_quest';
const LS_FREQ_Q   = 'scl_freq_quests';
const LS_ACCEPTED = 'scl_accepted_quests';

/* ─────────────────────────────────────────────────────────────
   RUNTIME STATE
   ───────────────────────────────────────────────────────────── */
let _charXP = 0, _charLevel = 1;
let _freqXP = 0, _freqLevel = 1;
let _statXP = {};

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
function QuestEngine_init() {
  _loadFromStorage();
  _renderCharLevelBar();
  _renderFreqLevelBar();
  _renderStatXP();
  _initDailyQuest();
  _buildFreqQuestList();
  renderSideQuests();
  QuestEngine_buildDailyRead();
}

function QuestEngine_reset() {
  // Zero runtime state
  _charXP = 0; _charLevel = 1;
  _freqXP = 0; _freqLevel = 1;
  _statXP = {};
  for (let i = 0; i <= 9; i++) _statXP[i] = 0;

  // Clear all localStorage keys
  try {
    localStorage.removeItem(LS_CHAR_XP);
    localStorage.removeItem(LS_CHAR_LVL);
    localStorage.removeItem(LS_FREQ_XP);
    localStorage.removeItem(LS_FREQ_LVL);
    localStorage.removeItem(LS_STAT_XP);
    localStorage.removeItem(LS_DAILY_Q);
    localStorage.removeItem(LS_FREQ_Q);
    localStorage.removeItem(LS_ACCEPTED);
    localStorage.removeItem(LS_LQP);
  } catch(e) {}

  // Push zeroes to Firestore — XP levels AND freq quest log
  if (typeof NativeMap !== 'undefined') {
    if (NativeMap.savePlayerXP) {
      NativeMap.savePlayerXP(0, 1, 0, 1, JSON.stringify(_statXP));
    }
    if (NativeMap.saveFreqLog) {
      NativeMap.saveFreqLog('{}');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   STORAGE
   ───────────────────────────────────────────────────────────── */
function _loadFromStorage() {
  try {
    _charXP    = parseInt(localStorage.getItem(LS_CHAR_XP)   || 0);
    _charLevel = parseInt(localStorage.getItem(LS_CHAR_LVL)  || 1);
    _freqXP    = parseInt(localStorage.getItem(LS_FREQ_XP)   || 0);
    _freqLevel = parseInt(localStorage.getItem(LS_FREQ_LVL)  || 1);
    const raw  = localStorage.getItem(LS_STAT_XP);
    _statXP    = raw ? JSON.parse(raw) : {};
  } catch(e) {}
  for (let i = 0; i <= 9; i++) if (!_statXP[i]) _statXP[i] = 0;
}

function _saveToStorage() {
  try {
    localStorage.setItem(LS_CHAR_XP,  _charXP);
    localStorage.setItem(LS_CHAR_LVL, _charLevel);
    localStorage.setItem(LS_FREQ_XP,  _freqXP);
    localStorage.setItem(LS_FREQ_LVL, _freqLevel);
    localStorage.setItem(LS_STAT_XP,  JSON.stringify(_statXP));
  } catch(e) {}
}

function _syncToFirestore() {
  if (typeof NativeMap !== 'undefined' && NativeMap.savePlayerXP) {
    NativeMap.savePlayerXP(_charXP, _charLevel, _freqXP, _freqLevel, JSON.stringify(_statXP));
  }
}

/* ─────────────────────────────────────────────────────────────
   LEVEL MATH
   ───────────────────────────────────────────────────────────── */
function _xpToLevel(xp) {
  let l = 1;
  for (let i = 1; i <= MAX_LEVEL; i++) { if (xp >= LEVEL_XP_TABLE[i]) l = i; else break; }
  return Math.min(l, MAX_LEVEL);
}
function _xpInLevel(xp, lvl) { return xp - LEVEL_XP_TABLE[lvl]; }
function _xpForNext(lvl) { return lvl >= MAX_LEVEL ? 0 : LEVEL_XP_TABLE[lvl + 1] - LEVEL_XP_TABLE[lvl]; }

/* ─────────────────────────────────────────────────────────────
   EARN XP — public API
   ───────────────────────────────────────────────────────────── */
function earnCharXP(amount) {
  if (_charLevel >= MAX_LEVEL) return;
  const prev = _charLevel;
  _charXP    = Math.min(_charXP + amount, LEVEL_XP_TABLE[MAX_LEVEL]);
  _charLevel = _xpToLevel(_charXP);
  _saveToStorage(); _syncToFirestore();
  _renderCharLevelBar();
  _floatXP(amount, 'charLevelTrack', 'var(--gold)');
  if (_charLevel > prev) _levelUpBanner('CHARACTER', _charLevel);
}

function earnFreqXP(amount) {
  if (_freqLevel >= MAX_LEVEL) return;
  const prev = _freqLevel;
  _freqXP    = Math.min(_freqXP + amount, LEVEL_XP_TABLE[MAX_LEVEL]);
  _freqLevel = _xpToLevel(_freqXP);
  _saveToStorage(); _syncToFirestore();
  _renderFreqLevelBar();
  _floatXP(amount, 'freqLevelTrack', 'var(--teal)');
  if (_freqLevel > prev) _levelUpBanner('FREQUENCY', _freqLevel);
}

function earnStatXP(statNum, amount) {
  const n = parseInt(statNum);
  if (n < 0 || n > 9) return;
  const totEl = document.getElementById('statTOT_' + n);
  const base  = totEl ? parseInt(totEl.dataset.base || 0) : 0;
  const prev  = _statXP[n] || 0;
  _statXP[n]  = prev + amount;
  _saveToStorage(); _syncToFirestore();
  _renderStatXP();

  // Detect state transition → show banner on milestone
  const prevState = _statState(base, prev);
  const newState  = _statState(base, _statXP[n]);
  if (newState !== prevState) {
    const statName = (typeof STAT_NAMES !== 'undefined' ? STAT_NAMES[n] : null) || ('STAT ' + n);
    if (newState === 'awakening')   _statUnlockBanner(statName, '◈ AWAKENING',    'var(--rose)');
    if (newState === 'unlocked')    _statUnlockBanner(statName, '◈ UNLOCKED',     'var(--teal)');
    if (newState === 'ascending')   _statUnlockBanner(statName, '▲ ASCENDING',    'var(--gold)');
    if (newState === 'void-master') _statUnlockBanner(statName, '✦ VOID MASTERED','var(--gold)');
  }
}

function _statUnlockBanner(statName, label, color) {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div style="font-family:'Press Start 2P',monospace;font-size:7px;color:${color};letter-spacing:2px;margin-bottom:6px;">${label}</div>
    <div style="font-family:'Press Start 2P',monospace;font-size:10px;color:var(--white);letter-spacing:1px;">${statName}</div>
    <div style="font-size:10px;color:var(--text-dim);margin-top:4px;">stat growth milestone</div>`;
  Object.assign(banner.style, {
    position:'fixed', top:'20px', left:'50%',
    transform:'translateX(-50%) translateY(-90px)',
    background:'var(--bg-panel)', border:`1px solid ${color}`,
    borderRadius:'8px', padding:'14px 22px', textAlign:'center',
    zIndex:'9999', boxShadow:`0 0 28px ${color}55`,
    transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.35s ease',
    opacity:'0', minWidth:'180px',
  });
  document.body.appendChild(banner);
  requestAnimationFrame(() => {
    banner.style.transform = 'translateX(-50%) translateY(0)';
    banner.style.opacity   = '1';
    setTimeout(() => {
      banner.style.transform = 'translateX(-50%) translateY(-90px)';
      banner.style.opacity   = '0';
      setTimeout(() => banner.remove(), 400);
    }, 3000);
  });
}

/* ─────────────────────────────────────────────────────────────
   LEVEL-UP BANNER
   ───────────────────────────────────────────────────────────── */
function _levelUpBanner(track, lvl) {
  const el = document.getElementById('levelUpBanner');
  if (!el) return;
  el.innerHTML = `
    <div class="lvlup-inner">
      <div class="lvlup-track">${track}</div>
      <div class="lvlup-num">LEVEL ${lvl}</div>
      <div class="lvlup-sub">✦ UNLOCKED</div>
    </div>`;
  el.classList.remove('hidden', 'lvlup-out');
  el.classList.add('lvlup-in');
  setTimeout(() => { el.classList.remove('lvlup-in'); el.classList.add('lvlup-out'); }, 3200);
  setTimeout(() => el.classList.add('hidden'), 3800);
}

/* ─────────────────────────────────────────────────────────────
   FLOATING +XP
   ───────────────────────────────────────────────────────────── */
function _floatXP(amount, trackId, color) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const f = document.createElement('div');
  f.className   = 'xp-float';
  f.textContent = '+' + amount + ' XP';
  f.style.color = color;
  track.parentElement.style.position = 'relative';
  track.parentElement.appendChild(f);
  setTimeout(() => f.remove(), 1400);
}

/* ─────────────────────────────────────────────────────────────
   RENDER — Level Bars
   ───────────────────────────────────────────────────────────── */
function _renderCharLevelBar() {
  _renderBar('charLevelBar', 'charLevelTrack', 'CHARACTER LVL', _charLevel, _charXP, 'char-bar-fill', 'var(--gold)');
}
function _renderFreqLevelBar() {
  _renderBar('freqLevelBar', 'freqLevelTrack', 'FREQUENCY LVL', _freqLevel, _freqXP, 'freq-bar-fill', 'var(--teal)');
}

function _renderBar(wrapperId, trackId, label, lvl, xp, fillCls, color) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  const maxed  = lvl >= MAX_LEVEL;
  const xpIn   = _xpInLevel(xp, lvl);
  const xpNext = _xpForNext(lvl);
  const pct    = maxed ? 100 : Math.round((xpIn / xpNext) * 100);
  wrap.innerHTML = `
    <div class="lvl-bar-header">
      <span class="lvl-bar-label">${label}</span>
      <span class="lvl-bar-num" style="color:${color};">${lvl}${maxed ? ' ✦' : ''}</span>
      <span class="lvl-bar-xp">${maxed ? 'MAX' : xpIn + ' / ' + xpNext + ' XP'}</span>
    </div>
    <div class="lvl-bar-track" id="${trackId}">
      <div class="${fillCls}" style="width:0%;"></div>
    </div>`;
  // Animate fill after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fill = wrap.querySelector('.' + fillCls);
      if (fill) fill.style.width = pct + '%';
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   STAT GROWTH SYSTEM
   ─────────────────────────────────────────────────────────────
   Each stat has an innate score (base = LE + IN from the chart).
   Quest completions feed statXP which tracks growth toward and
   beyond that innate potential.

   States:
     LOCKED     statXP < base          — still growing into innate
     UNLOCKED   statXP >= base         — stat fully embodied
     ASCENDING  statXP >= base * 2     — exceeded innate (+ badge)
     VOID       base = 0, statXP > 0   — developing an absent stat
   ───────────────────────────────────────────────────────────── */

const STAT_UNLOCK_THRESHOLD = 1; // quests needed to unlock a base-0 stat

// Returns the unlock state for a stat
// level = how many full 'base' thresholds of XP have been crossed
function _statLevel(base, xp) {
  if (base === 0) return Math.floor(xp / 5);   // void stats: 1 level per 5 XP
  return Math.floor(xp / base);                // normal: 1 level per base XP
}
// XP progress within the current level (0.0–1.0)
function _statLevelProgress(base, xp) {
  const threshold = base > 0 ? base : 5;
  return (xp % threshold) / threshold;
}

function _statState(base, xp) {
  if (base === 0) {
    if (xp <= 0)                return 'absent';
    if (xp < 5)                 return 'awakening';
    return                             'void-master';
  }
  if (xp <= 0)                  return 'locked';
  if (xp < base)                return 'unlocking';
  if (xp < base * 2)            return 'unlocked';
  return                                'ascending';
}

function _statStateStyle(state, accent, dim) {
  switch (state) {
    case 'absent':      return { color: 'var(--text-dim)',    border: 'var(--border)',           badge: null };
    case 'awakening':   return { color: 'var(--rose)',        border: 'rgba(220,80,120,0.3)',    badge: '◈' };
    case 'void-master': return { color: 'var(--gold)',        border: 'rgba(200,160,40,0.5)',    badge: '✦' };
    case 'locked':      return { color: 'var(--text-dim)',    border: 'var(--border)',           badge: null };
    case 'unlocking':   return { color: dim,                  border: dim,                       badge: null };
    case 'unlocked':    return { color: accent,               border: dim,                       badge: '◈' };
    case 'ascending':   return { color: 'var(--gold)',        border: 'rgba(200,160,40,0.5)',    badge: '▲' };
    default:            return { color: 'var(--text-dim)',    border: 'var(--border)',           badge: null };
  }
}

function _renderStatXP() {
  for (let i = 0; i <= 9; i++) {
    const quEl   = document.getElementById('statQU_'  + i);
    const totEl  = document.getElementById('statTOT_' + i);
    const xp     = _statXP[i] || 0;
    const base   = totEl ? parseInt(totEl.dataset.base || 0) : 0;
    const accent = totEl ? (totEl.dataset.accent || 'var(--purple)') : 'var(--purple)';
    const dim    = totEl ? (totEl.dataset.dim    || 'var(--border)')  : 'var(--border)';

    const state   = _statState(base, xp);
    const style   = _statStateStyle(state, accent, dim);
    const level   = _statLevel(base, xp);
    const prog    = _statLevelProgress(base, xp);

    // QU cell — shows accumulated levels, no badge
    if (quEl) {
      if (xp <= 0) {
        quEl.textContent       = '—';
        quEl.style.color       = 'var(--text-dim)';
        quEl.style.borderColor = 'var(--border)';
        quEl.title             = '';
      } else {
        quEl.textContent       = level > 0 ? String(level) : '·';
        quEl.style.color       = style.color;
        quEl.style.borderColor = style.border;
        quEl.title             = _statTooltip(state, base, xp);
      }
    }

    // TOT cell — base + level; badge only when QU has pushed total above innate
    if (totEl) {
      const tot = base + level;
      // Badge appears only when quest levels have exceeded the innate base (LE+IN)
      const exceeds = level > base;
      let totDisplay = tot > 0 ? String(tot) : '—';
      if (exceeds && style.badge) totDisplay = style.badge + ' ' + (tot || '—');

      totEl.textContent       = totDisplay;
      totEl.style.color       = xp > 0 ? style.color : (base > 0 ? accent : 'var(--text-dim)');
      totEl.style.borderColor = xp > 0 ? style.border : (base > 0 ? dim : 'var(--border)');
      totEl.title             = _statTooltip(state, base, xp);
      totEl.dataset.statState = state;
    }
  }
}

function _statTooltip(state, base, xp) {
  const level = _statLevel(base, xp);
  const threshold = base > 0 ? base : 5;
  const nextIn = threshold - (xp % threshold);
  switch (state) {
    case 'absent':      return 'No innate presence. Complete quests to develop this stat.';
    case 'awakening':   return `Awakening — ${xp} XP earned. ${nextIn} more to reach Level 1.`;
    case 'void-master': return `Void Master — Level ${level}. Developed ${xp} XP with no innate score.`;
    case 'locked':      return `Innate: ${base}. Earn ${base} XP to unlock. ${xp > 0 ? xp + ' earned so far.' : ''}`;
    case 'unlocking':   return `Unlocking — ${xp}/${base} XP. ${nextIn} more to reach Level 1.`;
    case 'unlocked':    return `Level ${level} — Innate embodied. ${nextIn} XP to Level ${level + 1}.`;
    case 'ascending':   return `Ascending — Level ${level}. ${nextIn} XP to Level ${level + 1}.`;
    default:            return '';
  }
}

// Called by app.js buildCharts() so TOT cells know their base value
function QuestEngine_setStatBase(statNum, baseTotal, accent, dim) {
  const totEl = document.getElementById('statTOT_' + statNum);
  if (!totEl) return;
  totEl.dataset.base   = baseTotal;
  totEl.dataset.accent = accent;
  totEl.dataset.dim    = dim;
  // Full render via _renderStatXP so bar + QU + TOT all stay in sync
  _renderStatXP();
}

/* ─────────────────────────────────────────────────────────────
   DAILY QUEST  — 24-hour reset, +5 FREQ XP
   ───────────────────────────────────────────────────────────── */
function _todayStr() {
  const n = new Date();
  return n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate();
}
function _quarterKey() {
  const n = new Date();
  const q = Math.floor(n.getMonth() / 3) + 1;
  return n.getFullYear() + '-Q' + q;
}
function _msUntilMidnight() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1) - n;
}

function _buildDailyText() {
  let title = '✦ DAILY QUEST';
  let body  = 'Live in alignment with today\'s personal frequency.';
  try {
    const pd = typeof playerData !== 'undefined' ? playerData : null;
    if (pd && typeof calcPersonalDay === 'function') {
      const pday = calcPersonalDay(pd.m, pd.d);
      const cm   = typeof CYCLE_MEANINGS !== 'undefined' ? CYCLE_MEANINGS?.personalDay?.[pday.root] : null;
      if (cm) {
        title = 'DAY ' + pday.dayNum + ' · ' + (cm.theme || 'Daily Frequency').toUpperCase();
        body  = cm.summary || body;
      }
    }
  } catch(e) {}
  let dayObj     = '';
  let dayObjMeta = null; // { questKey, tier, objIdx } if this obj belongs to a life quest
  try {
    const pd2 = typeof playerData !== 'undefined' ? playerData : null;
    if (pd2 && typeof calcPersonalDay === 'function') {
      const pday2   = calcPersonalDay(pd2.m, pd2.d);
      // Check if today's personal day root matches any life quest root
      const matched = _matchedLifeQuest(pday2.root);
      if (matched && !matched.allDone) {
        dayObj     = matched.obj;
        dayObjMeta = { questKey: matched.questKey, tier: matched.tier, objIdx: matched.objIdx };
      } else {
        // Fallback to CURRENT_QUEST_OBJECTIVES for this day number
        const cqObjs = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.personalDay)
          ? (CURRENT_QUEST_OBJECTIVES.personalDay[pday2.root] || []) : [];
        if (cqObjs.length) dayObj = cqObjs[(new Date().getDate() - 1) % cqObjs.length];
      }
    }
  } catch(e2) {}
  return { title, body, dayObj, dayObjMeta };
}

function _initDailyQuest() {
  const today = _todayStr();
  let d = null;
  try { d = JSON.parse(localStorage.getItem(LS_DAILY_Q)); } catch(e) {}
  if (!d || d.date !== today) {
    const { title, body, dayObj, dayObjMeta } = _buildDailyText();
    d = { date: today, completed: false, title, body, dayObj, dayObjMeta };
    try { localStorage.setItem(LS_DAILY_Q, JSON.stringify(d)); } catch(e) {}
  }
  _renderDailyQuest(d);
}

function _renderDailyQuest(d) {
  const el = document.getElementById('dailyQuestCard');
  if (!el) return;
  const done = d.completed;
  const ms   = _msUntilMidnight();
  const hh   = Math.floor(ms / 3600000);
  const mm   = Math.floor((ms % 3600000) / 60000);
  el.innerHTML = `
    <div class="daily-q-inner${done ? ' daily-q-done' : ''}">
      <div class="daily-q-glyph">${done ? '✓' : '◈'}</div>
      <div class="daily-q-text">
        <div class="daily-q-title">${d.title}</div>
        <div class="daily-q-body">${d.body}</div>
        ${d.dayObj ? `<div class="daily-q-obj">
          ${d.dayObjMeta ? `<div class="daily-q-obj-tag" style="color:var(--gold);">★ LIFE QUEST OBJECTIVE</div>` : ''}
          <div class="daily-q-obj-row"><span class="daily-q-obj-bullet">◈</span><span>${d.dayObj}</span></div>
        </div>` : ''}
        <div class="daily-q-foot">
          <span class="daily-q-xp" style="color:var(--teal);">+${XP_AWARDS.daily} FREQ XP</span>
          <span class="daily-q-reset">${done ? '✓ COMPLETED' : 'Resets in ' + hh + 'h ' + mm + 'm'}</span>
        </div>
      </div>
    </div>
    ${done
      ? `<div class="daily-q-complete-label">✓ QUEST COMPLETE</div>`
      : `<button class="btn-primary daily-q-btn" onclick="QuestEngine_completeDailyQuest()">▶ COMPLETE QUEST</button>`}`;
}

function QuestEngine_completeDailyQuest() {
  const today = _todayStr();
  let d = null;
  try { d = JSON.parse(localStorage.getItem(LS_DAILY_Q)); } catch(e) {}
  if (!d || d.completed) return;
  d.completed = true;
  try { localStorage.setItem(LS_DAILY_Q, JSON.stringify(d)); } catch(e) {}

  // If today's objective belongs to a life quest, mark that objective done
  if (d.dayObjMeta) {
    const { questKey, tier, objIdx } = d.dayObjMeta;
    const result = _markLQPObjective(questKey, tier, objIdx);
    if (result.tierAdvanced) {
      _showLifeTierAdvance(questKey, result.newTier);
    }
    if (typeof buildLifeQuests === 'function') buildLifeQuests();
  }

  // Stat XP — based on personal day root number
  const pd = typeof playerData !== 'undefined' ? playerData : null;
  if (pd) {
    const pday = calcPersonalDay(pd.m, pd.d);
    const root = pday.root;
    const statNum = root > 9 ? (root === 11 ? 2 : root === 22 ? 4 : 6) : root;
    earnStatXP(statNum, STAT_XP_PER_QUEST[root] || 1);
  }

  earnFreqXP(XP_AWARDS.daily);
  _renderDailyQuest(d);
}

function _showLifeTierAdvance(questKey, newTier) {
  const labels  = { 1:'APPRENTICE', 2:'ADEPT', 3:'MASTER' };
  const colors  = { 1:'var(--sage)', 2:'var(--teal)', 3:'var(--gold)' };
  const qLabels = { cl:'LIFE CALLING', lp:'LIFE PATH', ex:'EXPRESSION', ac:'ACHIEVEMENT', so:'SOUL', ou:'OUTER', th:'THEME' };
  const banner  = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:9999;' +
    'background:var(--bg-panel);border:1px solid ' + colors[newTier] + ';padding:14px 22px;' +
    'font-family:"Press Start 2P",monospace;font-size:7px;color:' + colors[newTier] + ';' +
    'letter-spacing:1.5px;text-align:center;pointer-events:none;line-height:1.8;';
  banner.innerHTML = (qLabels[questKey] || questKey.toUpperCase()) + '<br>★ TIER ADVANCED — ' + labels[newTier];
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3500);
}

// Called by notification system to update today's quest text
function QuestEngine_setDailyFromNotif(title, body) {
  const today = _todayStr();
  let d = null;
  try { d = JSON.parse(localStorage.getItem(LS_DAILY_Q)); } catch(e) {}
  if (d?.date === today && d.completed) return; // never overwrite completed
  const next = { date: today, completed: false, title, body };
  try { localStorage.setItem(LS_DAILY_Q, JSON.stringify(next)); } catch(e) {}
  _renderDailyQuest(next);
}

/* ─────────────────────────────────────────────────────────────
   FREQUENCY QUEST LIST — personal day/month/year + life quests
   These are the numerology-derived quests shown in the Quest tab.
   Each has a complete button; completion awards Freq XP.
   ───────────────────────────────────────────────────────────── */
function _getFreqLog() { try { return JSON.parse(localStorage.getItem(LS_FREQ_Q) || '{}'); } catch(e) { return {}; } }

/* ─────────────────────────────────────────────────────────────
   LIFE QUEST OBJECTIVE PROGRESS
   Stored in localStorage as 'scl_lqp' — a nested object:
     { lp: { 1: [true,true,false], 2: [...], 3: [...] }, cl: {...}, ... }
   An objective index is marked true when the player completes a
   matched daily quest on a personal day whose root = that life quest root.
   When all 3 in a tier are true, the tier is complete and next unlocks.
   ───────────────────────────────────────────────────────────── */
const LS_LQP = 'scl_lqp';

function _getLQP() {
  try { return JSON.parse(localStorage.getItem(LS_LQP) || '{}'); } catch(e) { return {}; }
}

function _saveLQP(lqp) {
  try { localStorage.setItem(LS_LQP, JSON.stringify(lqp)); } catch(e) {}
  // Sync to Firestore
  if (typeof NativeMap !== 'undefined' && NativeMap.saveFreqLog) {
    // piggyback on freqLog channel with special key
    const fl = _getFreqLog();
    fl['__lqp__'] = JSON.stringify(lqp);
    if (NativeMap.saveFreqLog) NativeMap.saveFreqLog(JSON.stringify(fl));
  }
}

/* Return { questKey, tier, objIdx, root } for the life quest whose root
   matches todayRoot, or null if no match. Cycles through objectives in
   order so each one gets roughly equal exposure.                         */
function _matchedLifeQuest(todayRoot) {
  const pd = typeof playerData !== 'undefined' ? playerData : null;
  if (!pd) return null;
  // All life quest positions to check
  const positions = [
    { key:'cl', num: pd.cl }, { key:'lp', num: pd.lp },
    { key:'ex', num: pd.ex }, { key:'ac', num: pd.ac },
    { key:'so', num: pd.so }, { key:'ou', num: pd.ou },
    { key:'th', num: pd.th }
  ];
  const lqp = _getLQP();
  for (const pos of positions) {
    if (!pos.num || pos.num.root !== todayRoot) continue;
    // Found a match — determine which tier is active and which obj to show
    const tier = _getActiveTier(pos.key);
    const objs = (typeof TIERED_OBJECTIVES !== 'undefined' && TIERED_OBJECTIVES[todayRoot])
      ? (TIERED_OBJECTIVES[todayRoot][tier] || []) : [];
    if (!objs.length) return null;
    // Find first incomplete obj in this tier
    const progress = (lqp[pos.key] && lqp[pos.key][tier]) ? lqp[pos.key][tier] : [];
    const objIdx   = progress.findIndex((done, i) => i < objs.length && !done);
    const finalIdx = objIdx === -1 ? objs.length - 1 : objIdx; // all done: show last
    return { questKey: pos.key, tier, objIdx: finalIdx, root: todayRoot, obj: objs[finalIdx], allDone: objIdx === -1 };
  }
  return null;
}

/* Return which tier is currently active for a life quest key */
function _getActiveTier(questKey) {
  const lqp = _getLQP();
  if (!lqp[questKey]) return 1;
  // Tier 1 complete when all 3 objs done; advance to 2, then 3
  for (let t = 1; t <= 3; t++) {
    const prog = lqp[questKey][t] || [];
    const objs = _objsForQuestTier(questKey, t);
    if (!objs.length) return t;
    const allDone = objs.every((_, i) => !!prog[i]);
    if (!allDone) return t;
  }
  return 3; // all tiers mastered
}

function _objsForQuestTier(questKey, tier) {
  const pd = typeof playerData !== 'undefined' ? playerData : null;
  if (!pd || !pd[questKey]) return [];
  const root = pd[questKey].root;
  return (typeof TIERED_OBJECTIVES !== 'undefined' && TIERED_OBJECTIVES[root])
    ? (TIERED_OBJECTIVES[root][tier] || []) : [];
}

/* Mark one objective as complete. Returns { tierAdvanced, newTier } */
function _markLQPObjective(questKey, tier, objIdx) {
  const lqp = _getLQP();
  if (!lqp[questKey]) lqp[questKey] = {};
  if (!lqp[questKey][tier]) lqp[questKey][tier] = [];
  lqp[questKey][tier][objIdx] = true;
  _saveLQP(lqp);
  // Check if tier is now complete
  const objs    = _objsForQuestTier(questKey, tier);
  const allDone = objs.every((_, i) => !!lqp[questKey][tier][i]);
  if (allDone && tier < 3) {
    return { tierAdvanced: true, newTier: tier + 1 };
  }
  return { tierAdvanced: false, newTier: tier };
}
function _questTierQE(lvl) { return lvl >= 67 ? 3 : lvl >= 34 ? 2 : 1; }

function _isFreqDone(key) {
  const log = _getFreqLog();
  if (!log[key]) return false;
  const n = new Date();
  if (key.startsWith('dfreq_'))   return key.endsWith(_todayStr()) && !!log[key]; // daily freq positions
  if (key.startsWith('day_'))     return key === 'day_'   + _todayStr();
  if (key.startsWith('month_'))   return key === 'month_' + n.getFullYear() + '-' + (n.getMonth()+1) && !!log[key];
  if (key.startsWith('year_'))    return key === 'year_'  + calcPersonalYear(
    (typeof playerData !== 'undefined' ? playerData : {m:1,d:1}).m || 1,
    (typeof playerData !== 'undefined' ? playerData : {m:1,d:1}).d || 1
  ).cycleStartYear && !!log[key];
  if (key.startsWith('fourmonth_')) return !!log[key]; // cycle advances when new period starts
  return !!log[key] && log[key] === _quarterKey(); // life quests — quarterly reset
}

function QuestEngine_completeFreqQuest(key, xpAmount, rootNum) {
  if (_isFreqDone(key)) return;
  const log = _getFreqLog();
  // Life quest keys use quarter string for 3-month reset; everything else uses timestamp
  const lifeBaseKeys = ['lp','cl','ex','so','ou','ac','th'];
  log[key] = lifeBaseKeys.includes(key) ? _quarterKey() : Date.now();
  try { localStorage.setItem(LS_FREQ_Q, JSON.stringify(log)); } catch(e) {}
  // Persist to Firestore so reset can zero it reliably
  if (typeof NativeMap !== 'undefined' && NativeMap.saveFreqLog) {
    NativeMap.saveFreqLog(JSON.stringify(log));
  }
  earnFreqXP(parseInt(xpAmount));
  // Stat XP — based on the root number of the frequency being completed
  if (rootNum) {
    const rn = parseInt(rootNum);
    const statNum = rn > 9 ? (rn === 11 ? 2 : rn === 22 ? 4 : 6) : rn;
    earnStatXP(statNum, STAT_XP_PER_QUEST[rn] || 1);
  }
  _buildFreqQuestList();
  if (typeof buildLifeQuests === 'function') buildLifeQuests();
}


function _buildFreqQuestList() {
  _buildDailyFreqList();
  _buildCycleQuestList();
}

/* ── 7 Daily Frequency Quest Cards (LP, CL, EX, SO, OU, AC, TH) ── */
function _buildDailyFreqList() {
  const el = document.getElementById('dailyFreqList');
  if (!el) return;
  const pd = typeof playerData !== 'undefined' ? playerData : null;
  if (!pd) { el.innerHTML = ''; return; }

  const doy = _dayOfYear();

  const FREQ_POSITIONS = [
    { key:'lp', label:'LIFE PATH',    color:'var(--gold)',     badge:'LP', xp: XP_AWARDS.life_path    },
    { key:'cl', label:'LIFE CALLING', color:'var(--teal)',     badge:'CL', xp: XP_AWARDS.life_calling  },
    { key:'ex', label:'EXPRESSION',   color:'var(--purple)',   badge:'EX', xp: XP_AWARDS.expression   },
    { key:'so', label:'SOUL',         color:'var(--rose)',     badge:'SO', xp: XP_AWARDS.soul          },
    { key:'ou', label:'OUTER',        color:'var(--silver)',   badge:'OU', xp: XP_AWARDS.outer         },
    { key:'ac', label:'ACHIEVEMENT',  color:'var(--amber)',    badge:'AC', xp: XP_AWARDS.achievement   },
    { key:'th', label:'THEME',        color:'var(--text-mid)', badge:'TH', xp: XP_AWARDS.theme         },
  ];

  let html = '';
  try {
    FREQ_POSITIONS.forEach(function(pos) {
      const numObj = pd[pos.key];
      if (!numObj) return;
      const root       = numObj.root;
      const displayNum = numObj.compound && numObj.compound !== root ? numObj.compound + '/' + root : String(root);
      const tier       = (typeof _getActiveTier === 'function') ? _getActiveTier(pos.key) : 1;
      const pool       = (typeof TIERED_OBJECTIVES !== 'undefined' && TIERED_OBJECTIVES[root])
                         ? (TIERED_OBJECTIVES[root][tier] || TIERED_OBJECTIVES[root][1] || []) : [];
      const obj        = _pickObj(pool, doy + pos.key.charCodeAt(0));

      // Daily key per position — resets each day
      const dailyKey = 'dfreq_' + pos.key + '_' + _todayStr();
      const done     = _isFreqDone(dailyKey);

      const tierLabel = { 1:'APPRENTICE', 2:'ADEPT', 3:'MASTER' }[tier] || '';

      html += `
        <div class="freq-quest-card${done ? ' fq-done' : ''}">
          <div class="fq-header">
            <span class="fq-badge" style="color:${pos.color};border-color:${pos.color}44;">${pos.badge} <span style="opacity:0.7;font-size:8px;">${displayNum}</span></span>
            <span class="fq-xp" style="color:${done ? 'var(--sage)' : pos.color};">${done ? '✓ DONE' : '+' + pos.xp + ' XP'}</span>
          </div>
          <div class="fq-title" style="color:${pos.color};">${pos.label} · ${displayNum}</div>
          <div class="fq-period">Daily · ${tierLabel} tier · Resets at midnight</div>
          ${obj ? `<div class="fq-objs"><div class="fq-obj">◈ ${obj}</div></div>` : ''}
          ${done
            ? `<div class="fq-done-label">✓ COMPLETE</div>`
            : `<button class="side-quest-btn side-quest-btn-complete" style="margin-top:8px;"
                 onclick="QuestEngine_completeFreqQuest('${dailyKey}', ${pos.xp}, ${root})">▶ COMPLETE</button>`}
        </div>`;
    });
  } catch(e) { console.error('_buildDailyFreqList:', e); }

  el.innerHTML = html;
}

/* ── Cycle Quests: personal year, 4-month, month + life quests ── */
function _buildCycleQuestList() {
  const el = document.getElementById('freqQuestList');
  if (!el) return;
  const pd = typeof playerData !== 'undefined' ? playerData : null;
  if (!pd) { el.innerHTML = ''; return; }

  const n   = new Date();
  const woy = _weekOfYear();
  const mon = n.getMonth();
  let html  = '';

  try {
    html += `<div class="fq-section-label">◇ CYCLE QUESTS</div>`;

    // ── Personal Year (top — biggest scope) ───────────────────
    const py      = calcPersonalYear(pd.m, pd.d);
    const yrKey   = 'year_' + py.cycleStartYear;
    const yrMeta  = CYCLE_MEANINGS?.personalYear?.[py.root] || {};
    const yrPool  = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.personalYear)
                    ? (CURRENT_QUEST_OBJECTIVES.personalYear[py.root] || []) : [];
    const yrObj   = _pickObj(yrPool, mon);
    html += _fqCard({ key: yrKey, xp: XP_AWARDS.personal_year, done: _isFreqDone(yrKey),
      badge: 'YEARLY', color: 'var(--teal)', period: 'Resets on your birthday · Year ' + py.cycleStartYear,
      title: 'PERSONAL YEAR ' + py.cycleStartYear + (yrMeta.theme ? ' · ' + yrMeta.theme.toUpperCase() : ''),
      objs: yrObj ? [yrObj] : [], rootNum: py.root });

    // ── Pinnacle ──────────────────────────────────────────────
    if (typeof calcPinnacles === 'function') {
      try {
        const pins           = calcPinnacles(pd.m, pd.d, pd.y, pd.lp);
        const activePinnacle = pins.find(p => p.active) || pins[pins.length - 1];
        if (activePinnacle) {
          const pinKey  = 'pinnacle_' + activePinnacle.num + '_s' + activePinnacle.startAge;
          const pinMeta = CYCLE_MEANINGS?.pinnacle?.[activePinnacle.num] || {};
          const pinPool = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.pinnacle)
                          ? (CURRENT_QUEST_OBJECTIVES.pinnacle[activePinnacle.num] || []) : [];
          const pinObj  = _pickObj(pinPool, mon + 1);
          html += _fqCard({ key: pinKey, xp: XP_AWARDS.pinnacle, done: _isFreqDone(pinKey),
            badge: 'PINNACLE', color: 'var(--gold)', period: 'Long-cycle · Ages ' + activePinnacle.startAge + (activePinnacle.endAge ? '–' + activePinnacle.endAge : '+'),
            title: 'PINNACLE ' + activePinnacle.num + (pinMeta.theme ? ' · ' + pinMeta.theme.toUpperCase() : ''),
            objs: pinObj ? [pinObj] : [], rootNum: activePinnacle.num });
        }
      } catch(e2) {}
    }

    // ── 4-Month Cycle ─────────────────────────────────────────
    if (typeof calcFourMonthCycle === 'function') {
      const fc     = calcFourMonthCycle(pd.m, pd.d);
      const fcKey  = 'fourmonth_' + py.cycleStartYear + '_' + fc.cycleNum;
      const fcMeta = CYCLE_MEANINGS?.fourMonthCycle?.[fc.root] || {};
      const fcPool = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.fourMonthCycle)
                     ? (CURRENT_QUEST_OBJECTIVES.fourMonthCycle[fc.root] || []) : [];
      const fcObj  = _pickObj(fcPool, woy + 3);
      html += _fqCard({ key: fcKey, xp: XP_AWARDS.four_month, done: _isFreqDone(fcKey),
        badge: '4-MONTH', color: 'var(--purple)', period: 'Resets every 4 months',
        title: '4-MONTH CYCLE ' + fc.cycleNum + (fcMeta.theme ? ' · ' + fcMeta.theme.toUpperCase() : ''),
        objs: fcObj ? [fcObj] : [], rootNum: fc.root });
    }

    // ── Personal Month ────────────────────────────────────────
    const pm      = calcPersonalMonth(pd.m, pd.d);
    const monKey  = 'month_' + n.getFullYear() + '-' + (n.getMonth() + 1);
    const monMeta = CYCLE_MEANINGS?.personalMonth?.[pm.root] || {};
    const monPool = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.personalMonth)
                    ? (CURRENT_QUEST_OBJECTIVES.personalMonth[pm.root] || []) : [];
    const monObj  = _pickObj(monPool, woy);
    html += _fqCard({ key: monKey, xp: XP_AWARDS.personal_month, done: _isFreqDone(monKey),
      badge: 'MONTHLY', color: 'var(--rose)', period: 'Resets each month',
      title: 'PERSONAL MONTH ' + pm.monthNum + (monMeta.theme ? ' · ' + monMeta.theme.toUpperCase() : ''),
      objs: monObj ? [monObj] : [], rootNum: pm.root });

    // ── Life Frequency Quests — separate header ───────────────
    const lifeQ = [
      { key:'lp', xp:XP_AWARDS.life_path,    color:'var(--gold)',     badge:'LIFE PATH',    title:'LIFE PATH · '    + _fmtN(pd.lp) },
      { key:'cl', xp:XP_AWARDS.life_calling,  color:'var(--teal)',     badge:'LIFE CALLING', title:'LIFE CALLING · ' + _fmtN(pd.cl) },
      { key:'ex', xp:XP_AWARDS.expression,   color:'var(--purple)',   badge:'EXPRESSION',   title:'EXPRESSION · '   + _fmtN(pd.ex) },
      { key:'so', xp:XP_AWARDS.soul,          color:'var(--rose)',     badge:'SOUL',          title:'SOUL QUEST · '   + _fmtN(pd.so) },
      { key:'ou', xp:XP_AWARDS.outer,         color:'var(--purple)',   badge:'OUTER',         title:'OUTER QUEST · '  + _fmtN(pd.ou) },
      { key:'ac', xp:XP_AWARDS.achievement,   color:'var(--amber)',    badge:'ACHIEVEMENT',  title:'ACHIEVEMENT · '  + _fmtN(pd.ac) },
      { key:'th', xp:XP_AWARDS.theme,         color:'var(--silver)',   badge:'THEME',         title:'THEME QUEST · '  + _fmtN(pd.th) },
    ];
    html += `<div class="fq-section-label fq-section-label--life">◈ LIFE FREQUENCY QUESTS</div>`;
    lifeQ.forEach(q => {
      const qRoot    = pd[q.key] ? pd[q.key].root : 1;
      const qTier    = _getActiveTier(q.key);
      const qPool    = (typeof TIERED_OBJECTIVES !== 'undefined' && TIERED_OBJECTIVES[qRoot])
        ? (TIERED_OBJECTIVES[qRoot][qTier] || TIERED_OBJECTIVES[qRoot][1] || []) : [];
      const qLQP     = _getLQP();
      const qProg    = (qLQP[q.key] && qLQP[q.key][qTier]) ? qLQP[q.key][qTier] : [];
      // Pick objective by quarter index so it rotates every 3 months
      const n        = new Date();
      const qtrIdx   = (Math.floor(n.getMonth() / 3)) % Math.max(qPool.length, 1);
      // Prefer the first incomplete obj; fall back to quarter-based pick
      const firstIncomplete = qProg.findIndex((done, i) => i < qPool.length && !done);
      const qFinal   = firstIncomplete !== -1 ? firstIncomplete : qtrIdx;
      const qObjs    = qPool.length ? [qPool[qFinal]] : [];
      const tierLabel = { 1:'APPRENTICE', 2:'ADEPT', 3:'MASTER' }[qTier] || 'APPRENTICE';
      const tierColor = { 1:'var(--sage)', 2:'var(--teal)', 3:'var(--gold)' }[qTier] || 'var(--sage)';
      const periodStr = `Resets quarterly · <span style="color:${tierColor};">${tierLabel}</span>`;
      html += _fqCard({ ...q, done: _isFreqDone(q.key), period: periodStr, objs: qObjs, rootNum: qRoot });
    });

  } catch(e) { console.error('_buildCycleQuestList:', e); }

  el.innerHTML = html;
}

function _fmtN(numObj) {
  if (!numObj) return '';
  return (numObj.compound && numObj.compound !== numObj.root)
    ? numObj.compound + '/' + numObj.root : String(numObj.root);
}

function _fqCard({ key, xp, done, badge, color, period, title, objs, rootNum }) {
  const objsHtml = objs.length
    ? `<div class="fq-objs">${objs.slice(0, 3).map(o => `<div class="fq-obj">◈ ${o}</div>`).join('')}</div>` : '';
  const rootArg = rootNum ? `, ${rootNum}` : '';
  return `
    <div class="freq-quest-card${done ? ' fq-done' : ''}">
      <div class="fq-header">
        <span class="fq-badge" style="color:${color};border-color:${color}44;">${badge}</span>
        <span class="fq-xp" style="color:${done ? 'var(--sage)' : color};">${done ? '✓ DONE' : '+' + xp + ' XP'}</span>
      </div>
      <div class="fq-title" style="color:${color};">${title}</div>
      <div class="fq-period">${period}</div>
      ${objsHtml}
      ${done
        ? `<div class="fq-done-label">✓ COMPLETE</div>`
        : `<button class="side-quest-btn side-quest-btn-complete" style="margin-top:8px;"
             onclick="QuestEngine_completeFreqQuest('${key}', ${xp}${rootArg})">▶ COMPLETE</button>`}
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   MAP QUEST — ACCEPT / COMPLETE / CANCEL / RENDER
   These replace the same functions in app.js
   ───────────────────────────────────────────────────────────── */
function acceptQuest(questId) {
  if (!questId) return;
  try {
    const all = JSON.parse(localStorage.getItem(LS_ACCEPTED) || '{}');
    if (all[questId]?.status === 'active') { alert('Already in your side quest log!'); return; }
    let qd = null;
    if (window._lastQuestsJson) {
      qd = _parseJson(window._lastQuestsJson).find(q => (q.id || q.questId || q.docId) === questId);
    }
    if (!qd) qd = { id: questId, name: questId, type: 'exploration' };
    all[questId] = { ...qd, questId, acceptedAt: Date.now(), status: 'active' };
    localStorage.setItem(LS_ACCEPTED, JSON.stringify(all));
    if (window._mapInstance) window._mapInstance.closePopup();
    if (window._lastQuestsJson) NativeMap_onQuestsLoaded(window._lastQuestsJson);
    const sideEl = document.getElementById('sectionSideQ');
    if (sideEl && !sideEl.classList.contains('hidden')) renderSideQuests();
  } catch(e) { console.error('acceptQuest:', e); }
}

function cancelSideQuest(questId) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_ACCEPTED) || '{}');
    delete all[questId];
    localStorage.setItem(LS_ACCEPTED, JSON.stringify(all));
    renderSideQuests();
  } catch(e) {}
}

function completeSideQuest(questId) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_ACCEPTED) || '{}');
    if (!all[questId]) return;
    all[questId].status      = 'completed';
    all[questId].completedAt = Date.now();
    localStorage.setItem(LS_ACCEPTED, JSON.stringify(all));

    const rn       = parseInt(all[questId].rewardNum || 1);
    const xpAmount = XP_AWARDS['map_' + rn] || XP_AWARDS.map_1;
    earnCharXP(xpAmount);

    // Stat boost — master nums map to their reduced root stat
    const statNum = rn > 9 ? (rn === 11 ? 2 : rn === 22 ? 4 : 6) : rn;
    earnStatXP(statNum, STAT_XP_PER_QUEST[rn] || 5);

    renderSideQuests();
  } catch(e) { console.error('completeSideQuest:', e); }
}

function renderSideQuests() {
  const el = document.getElementById('sectionSideQ');
  if (!el) return;
  try {
    const all       = JSON.parse(localStorage.getItem(LS_ACCEPTED) || '{}');
    const active    = Object.values(all).filter(q => q.status === 'active');
    const completed = Object.values(all).filter(q => q.status === 'completed');

    if (!active.length && !completed.length) {
      el.innerHTML = '<div class="quest-intro-panel">No side quests yet.<br>Open the Map, tap a quest marker, and press ▶ ACCEPT QUEST.</div>';
      return;
    }

    const seekerLabel = { solo: '◈ SOLO', partner: '⚔ PARTNER', group: '✦ GROUP' };
    let html = '';

    active.forEach(q => {
      const rn       = q.rewardNum || '';
      const rewardXp = q.rewardXp  || q.rewardName || '';
      const typeMeta = (typeof QUEST_TYPES !== 'undefined' ? QUEST_TYPES[q.type] : null) || { label: '🗺 EXPLORE' };
      const locStr   = q.location || (q.lat && q.lng ? parseFloat(q.lat).toFixed(3)+', '+parseFloat(q.lng).toFixed(3) : '');
      const xpAmt    = XP_AWARDS['map_' + parseInt(rn || 1)] || XP_AWARDS.map_1;
      const qid      = _esc(q.questId || q.id || '');

      const seekerHtml = q.seekerType && q.seekerType !== ''
        ? `<span class="side-quest-seeker-badge">${seekerLabel[q.seekerType] || q.seekerType}</span>` : '';
      const objsHtml = q.objectives?.length
        ? `<div class="side-quest-objs">${q.objectives.map(o=>`<div class="side-quest-obj-row">◈ ${_esc(o)}</div>`).join('')}</div>` : '';
      const sigHtml = q.creatorSig
        ? `<div class="side-quest-sig"><span class="side-quest-sig-label">CREATOR</span>${
            [['CL',q.creatorSig.cl,'var(--teal)'],['LP',q.creatorSig.lp,'var(--gold)'],
             ['EX',q.creatorSig.ex,'var(--purple)'],['TH',q.creatorSig.th,'var(--silver)']]
            .filter(([,v])=>v).map(([k,v,c])=>
              `<span class="side-quest-sig-chip" style="color:${c};border-color:${c}44;">${v}<span class="side-quest-sig-key">${k}</span></span>`
            ).join('')}</div>` : '';

      html += `<div class="side-quest-card">
        <div class="side-quest-header">
          ${rn ? `<div class="side-quest-reward-num">${rn}</div>` : ''}
          <div class="side-quest-info">
            <div class="side-quest-type-row"><div class="side-quest-type">${typeMeta.label}</div>${seekerHtml}</div>
            <div class="side-quest-name">${_esc(q.name || 'Unnamed Quest')}</div>
            ${rewardXp ? `<div class="side-quest-xp">${_esc(rewardXp)}</div>` : ''}
            <div class="side-quest-xp" style="color:var(--gold);">+${xpAmt} CHAR XP on complete</div>
          </div>
        </div>
        ${q.description ? `<div class="side-quest-desc">${_esc(q.description)}</div>` : ''}
        ${objsHtml}${sigHtml}
        ${locStr ? `<div class="side-quest-loc">◎ ${_esc(locStr)}</div>` : ''}
        <div class="side-quest-actions">
          <button class="side-quest-btn side-quest-btn-complete" onclick="completeSideQuest('${qid}')">▶ COMPLETE</button>
          <button class="side-quest-btn side-quest-btn-cancel"   onclick="cancelSideQuest('${qid}')">✕ ABANDON</button>
        </div>
      </div>`;
    });

    if (completed.length) {
      html += `<div class="side-quest-section-label">◈ COMPLETED</div>`;
      completed.forEach(q => {
        const qid = _esc(q.questId || q.id || '');
        html += `<div class="side-quest-card" style="opacity:0.5;border-left-color:var(--sage-dim);">
          <div class="side-quest-header">
            ${q.rewardNum ? `<div class="side-quest-reward-num" style="color:var(--sage)">${q.rewardNum}</div>` : ''}
            <div class="side-quest-info">
              <div class="side-quest-name" style="text-decoration:line-through;">${_esc(q.name||'Quest')}</div>
              <div class="side-quest-xp" style="color:var(--sage)">✓ COMPLETE</div>
            </div>
          </div>
          <div class="side-quest-actions">
            <button class="side-quest-btn" onclick="cancelSideQuest('${qid}')">✕ CLEAR</button>
          </div>
        </div>`;
      });
    }
    el.innerHTML = html;
  } catch(e) {
    console.error('renderSideQuests:', e);
    el.innerHTML = '<div class="allies-empty">Error loading quests.</div>';
  }
}

/* ─────────────────────────────────────────────────────────────
   FIRESTORE SYNC CALLBACK
   Called by Kotlin (MapBridge) after loadPlayer
   ───────────────────────────────────────────────────────────── */
function NativeQuest_onXPLoaded(charXP, charLevel, freqXP, freqLevel, statXPJson, freqLogJson) {
  try {
    const rCX = parseInt(charXP  || 0), rCL = parseInt(charLevel || 1);
    const rFX = parseInt(freqXP  || 0), rFL = parseInt(freqLevel || 1);
    const rSX = JSON.parse(statXPJson || '{}');
    if (rCX > _charXP) { _charXP = rCX; _charLevel = rCL; }
    if (rFX > _freqXP) { _freqXP = rFX; _freqLevel = rFL; }
    for (let i = 0; i <= 9; i++) if ((rSX[i]||0) > (_statXP[i]||0)) _statXP[i] = rSX[i];
    _saveToStorage();
    // Restore freq quest log from Firestore — this is the authoritative source after reset
    if (freqLogJson !== undefined && freqLogJson !== null) {
      try {
        const remote = JSON.parse(freqLogJson);
        localStorage.setItem(LS_FREQ_Q, JSON.stringify(remote));
        _buildFreqQuestList();
      } catch(e) {}
    }
    _renderCharLevelBar(); _renderFreqLevelBar(); _renderStatXP();
  } catch(e) { console.error('NativeQuest_onXPLoaded:', e); }
}

/* ─────────────────────────────────────────────────────────────
   DAILY READ — rich briefing panel shown at the top of Daily tab
   Shows: notification read, 7 frequency daily objectives,
   weekly objectives for medium cycles, monthly for long cycles.
   ───────────────────────────────────────────────────────────── */

function _dayOfYear() {
  const n = new Date();
  return Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 86400000);
}
function _weekOfYear() {
  const n = new Date();
  const jan1 = new Date(n.getFullYear(), 0, 1);
  return Math.floor((n - jan1) / (7 * 86400000));
}
function _monthKey() {
  const n = new Date();
  return n.getFullYear() + '-' + (n.getMonth() + 1);
}

/* Pick one objective from a pool using a stable seed (rotates on cycle) */
function _pickObj(pool, seed) {
  if (!pool || !pool.length) return null;
  return pool[seed % pool.length];
}

function QuestEngine_buildDailyRead() {
  const el = document.getElementById('dailyReadPanel');
  if (!el) return;
  const pd = typeof playerData !== 'undefined' ? playerData : null;
  if (!pd) { el.innerHTML = ''; return; }

  try {
    const doy = _dayOfYear();
    const woy = _weekOfYear();
    const mon = new Date().getMonth();

    // ── Personal Day ─────────────────────────────────────────
    const pday    = calcPersonalDay(pd.m, pd.d);
    const pdMeta  = CYCLE_MEANINGS?.personalDay?.[pday.root] || {};
    const notifTitle = 'PERSONAL DAY ' + pday.dayNum + (pdMeta.theme ? ' · ' + pdMeta.theme.toUpperCase() : '');
    const notifBody  = pdMeta.summary || 'Live in alignment with today\'s personal frequency.';
    const pdObjs  = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.personalDay)
                    ? (CURRENT_QUEST_OBJECTIVES.personalDay[pday.root] || []) : [];
    const pdObj   = _pickObj(pdObjs, doy);

    // ── Year / Pinnacle (main quest) ─────────────────────────
    const py      = calcPersonalYear(pd.m, pd.d);
    const cycleYear = py.cycleStartYear;
    const pyMeta  = CYCLE_MEANINGS?.personalYear?.[py.root] || {};
    const pyObjs  = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.personalYear)
                    ? (CURRENT_QUEST_OBJECTIVES.personalYear[py.root] || []) : [];
    const pyObj   = _pickObj(pyObjs, mon);

    let pinnacleRow = '';
    if (typeof calcPinnacles === 'function') {
      try {
        const pins = calcPinnacles(pd.m, pd.d, pd.y, pd.lp);
        const ap   = pins.find(p => p.active) || pins[pins.length - 1];
        if (ap) {
          const pinMeta = CYCLE_MEANINGS?.pinnacle?.[ap.num] || {};
          const pinPool = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.pinnacle)
                          ? (CURRENT_QUEST_OBJECTIVES.pinnacle[ap.num] || []) : [];
          const pinObj  = _pickObj(pinPool, mon + 1);
          if (pinObj) pinnacleRow = `
            <div class="freq-quest-card" style="border-left-color:var(--gold);">
              <div class="fq-badge" style="color:var(--gold);border-color:var(--gold);display:inline-block;margin-bottom:6px;">PINNACLE ${ap.num}${pinMeta.theme ? ' · ' + pinMeta.theme.toUpperCase() : ''}</div>
              <div class="fq-obj">${pinObj}</div>
            </div>`;
        }
      } catch(e2) {}
    }

    const mainQuestHtml = [
      pyObj ? `<div class="freq-quest-card" style="border-left-color:var(--teal);">
        <div class="fq-badge" style="color:var(--teal);border-color:var(--teal);display:inline-block;margin-bottom:6px;">YEAR ${cycleYear} · ${py.root}${pyMeta.theme ? ' · ' + pyMeta.theme.toUpperCase() : ''}</div>
        <div class="fq-obj">${pyObj}</div>
      </div>` : '',
      pinnacleRow
    ].filter(Boolean).join('\n');

    // ── 4-Month + Personal Month (cycle focus) ────────────────
    let fcRow = '';
    if (typeof calcFourMonthCycle === 'function') {
      try {
        const fc     = calcFourMonthCycle(pd.m, pd.d);
        const fcMeta = CYCLE_MEANINGS?.fourMonthCycle?.[fc.root] || {};
        const fcPool = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.fourMonthCycle)
                       ? (CURRENT_QUEST_OBJECTIVES.fourMonthCycle[fc.root] || []) : [];
        const fcObj  = _pickObj(fcPool, woy + 3);
        if (fcObj) fcRow = `
          <div class="freq-quest-card" style="border-left-color:var(--purple);">
            <div class="fq-badge" style="color:var(--purple);border-color:var(--purple);display:inline-block;margin-bottom:6px;">4-MONTH CYCLE${fcMeta.theme ? ' · ' + fcMeta.theme.toUpperCase() : ''}</div>
            <div class="fq-obj">${fcObj}</div>
          </div>`;
      } catch(e2) {}
    }

    const pm      = calcPersonalMonth(pd.m, pd.d);
    const pmMeta  = CYCLE_MEANINGS?.personalMonth?.[pm.root] || {};
    const pmObjs  = (typeof CURRENT_QUEST_OBJECTIVES !== 'undefined' && CURRENT_QUEST_OBJECTIVES.personalMonth)
                    ? (CURRENT_QUEST_OBJECTIVES.personalMonth[pm.root] || []) : [];
    const pmObj   = _pickObj(pmObjs, woy);
    const monRow  = pmObj ? `
      <div class="freq-quest-card" style="border-left-color:var(--rose);">
        <div class="fq-badge" style="color:var(--rose);border-color:var(--rose);display:inline-block;margin-bottom:6px;">MONTH ${pm.monthNum}${pmMeta.theme ? ' · ' + pmMeta.theme.toUpperCase() : ''}</div>
        <div class="fq-obj">${pmObj}</div>
      </div>` : '';

    const weekCycleHtml = [fcRow, monRow].filter(Boolean).join('\n');

    // ── Countdown ─────────────────────────────────────────────
    const ms = _msUntilMidnight();
    const hh = Math.floor(ms / 3600000);
    const mm = Math.floor((ms % 3600000) / 60000);

    el.innerHTML = `
      <div class="rpg-panel" style="margin-bottom:14px;">

        <div class="panel-label c-teal">◈ TODAY'S READ</div>

        <div style="padding:0 16px 16px;">

          <!-- Personal Day -->
          <div class="freq-quest-card" style="border-left-color:var(--teal);">
            <div class="fq-header">
              <span class="fq-badge" style="color:var(--teal);border-color:var(--teal);">DAY ${pday.dayNum}</span>
              <span class="fq-period">↻ ${hh}h ${mm}m</span>
            </div>
            <div class="fq-title" style="color:var(--teal);">${notifTitle}</div>
            <div class="fq-objs">
              <div class="fq-obj">${notifBody}</div>
            </div>
            ${pdObj ? `<div class="daily-q-obj"><div class="daily-q-obj-row"><span class="daily-q-obj-bullet">◈</span><span>${pdObj}</span></div></div>` : ''}
          </div>

          ${mainQuestHtml ? `
          <div class="fq-section-label">▲ MAIN QUEST FOCUS · THIS YEAR</div>
          ${mainQuestHtml}` : ''}

          ${weekCycleHtml ? `
          <div class="fq-section-label">◇ CYCLE FOCUS · THIS WEEK</div>
          ${weekCycleHtml}` : ''}

        </div>
      </div>`;

    _buildDailyFreqList();

  } catch(e) { console.error('QuestEngine_buildDailyRead:', e); el.innerHTML = ''; }
}


/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */
function _parseJson(json) { try { return JSON.parse(json); } catch(e) { return []; } }
