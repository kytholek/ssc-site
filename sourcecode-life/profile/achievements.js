/* ═══════════════════════════════════════════════════════════════
   ACHIEVEMENTS SYSTEM
   Separate file — loaded after QuestEngine.js.
   All state lives in localStorage under 'scl_achievements'.
   Streak data lives in 'scl_daily_streak'.
   ═══════════════════════════════════════════════════════════════ */

const LS_ACHIEVEMENTS  = 'scl_achievements';
const LS_DAILY_STREAK  = 'scl_daily_streak';
const LS_FOUNDER       = 'scl_founder';

/* Valid founder redemption codes (one-time use, honour-system) */
const FOUNDER_CODES = [
  'SCL-FOUNDER-ALPHA',
  'SCL-FOUNDER-BETA',
  'SCL-FOUNDER-001',
  'SCL-FOUNDER-002',
  'SCL-FOUNDER-003',
  'SCL-FOUNDER-004',
  'SCL-FOUNDER-005',
];

function isFounder() {
  try { return localStorage.getItem(LS_FOUNDER) === 'true'; } catch(e) { return false; }
}

function redeemFounderCode(code) {
  const clean = (code || '').trim().toUpperCase();
  const errEl = document.getElementById('founderCodeError');
  const okEl  = document.getElementById('founderCodeSuccess');
  if (errEl) errEl.textContent = '';
  if (okEl)  okEl.textContent  = '';

  if (isFounder()) {
    if (okEl) okEl.textContent = '✦ FOUNDER STATUS ALREADY ACTIVE';
    return;
  }
  if (!FOUNDER_CODES.includes(clean)) {
    if (errEl) errEl.textContent = '⚠ INVALID CODE';
    return;
  }
  try { localStorage.setItem(LS_FOUNDER, 'true'); } catch(e) {}
  // Sync founder status to cloud
  try { if (typeof NativeMap !== 'undefined' && NativeMap.saveAchievements) NativeMap.saveAchievements(); } catch(e) {}
  if (okEl) okEl.textContent = '✦ FOUNDER STATUS UNLOCKED!';
  // Refresh badge display
  Achievements_render();
  _renderFounderBadge();
}

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT DEFINITIONS
   Each entry: { id, tier, medal, icon, color, group, title, desc, check(data) }
   tier: 'bronze' | 'silver' | 'gold' | 'platinum'
   medal: SVG-style string rendered inside the card
   check(data) returns true when the achievement is earned.
   data = { maxDailyStreak, charLevel, freqLevel, tiersDone[] }
   ───────────────────────────────────────────────────────────── */

/* Medal SVG templates — inline, single-color, ~40px */
function _medalSvg(shape, color, locked) {
  const c = locked ? 'var(--border)' : color;
  const shapes = {
    circle:   '<circle cx="20" cy="20" r="16" fill="none" stroke="' + c + '" stroke-width="2"/><circle cx="20" cy="20" r="10" fill="' + c + '" opacity="0.25"/>',
    shield:   '<path d="M20 4 L33 10 L33 22 Q33 30 20 36 Q7 30 7 22 L7 10 Z" fill="none" stroke="' + c + '" stroke-width="2"/><path d="M20 10 L27 14 L27 22 Q27 27 20 30 Q13 27 13 22 L13 14 Z" fill="' + c + '" opacity="0.2"/>',
    star5:    '<polygon points="20,4 23.5,14.5 34,14.5 25.5,21 28.5,32 20,25.5 11.5,32 14.5,21 6,14.5 16.5,14.5" fill="none" stroke="' + c + '" stroke-width="2"/><polygon points="20,8 22.7,16.5 31.5,16.5 24.5,21.5 27,30 20,25 13,30 15.5,21.5 8.5,16.5 17.3,16.5" fill="' + c + '" opacity="0.25"/>',
    diamond:  '<polygon points="20,3 35,20 20,37 5,20" fill="none" stroke="' + c + '" stroke-width="2"/><polygon points="20,9 29,20 20,31 11,20" fill="' + c + '" opacity="0.2"/>',
    sun:      '<circle cx="20" cy="20" r="8" fill="' + c + '" opacity="0.3"/><circle cx="20" cy="20" r="8" fill="none" stroke="' + c + '" stroke-width="2"/>' +
              [0,45,90,135,180,225,270,315].map(function(a){
                var r=a*Math.PI/180, x1=20+11*Math.cos(r), y1=20+11*Math.sin(r), x2=20+16*Math.cos(r), y2=20+16*Math.sin(r);
                return '<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="'+c+'" stroke-width="2"/>';
              }).join(''),
    crown:    '<path d="M6,27 L6,17 L13,24 L20,9 L27,24 L34,17 L34,27 Z" fill="' + c + '" opacity="0.18" stroke="' + c + '" stroke-width="1.5" stroke-linejoin="round"/>' +
              '<rect x="6" y="27" width="28" height="7" rx="1" fill="' + c + '" opacity="0.25" stroke="' + c + '" stroke-width="1.5"/>' +
              '<circle cx="20" cy="9" r="2.5" fill="' + c + '"/>' +
              '<circle cx="6" cy="17" r="1.8" fill="' + c + '" opacity="0.85"/>' +
              '<circle cx="34" cy="17" r="1.8" fill="' + c + '" opacity="0.85"/>' +
              '<circle cx="13" cy="30.5" r="1.5" fill="' + c + '"/>' +
              '<circle cx="20" cy="30.5" r="1.5" fill="' + c + '"/>' +
              '<circle cx="27" cy="30.5" r="1.5" fill="' + c + '"/>',
  };
  return '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
         (shapes[shape] || shapes.circle) + '</svg>';
}

const ACHIEVEMENTS = [
  // ── Founder ──────────────────────────────────────────────────────────
  { id: 'founder',   group: 'Founder',
    tier: 'platinum', medal: 'crown', color: '#e8c96b',
    title: 'FOUNDER',  desc: 'Early investor — helped bring the Simulation to life.',
    check: function() { return isFounder(); } },
  // ── Daily Streak ─────────────────────────────────────────
  { id: 'streak_7',  group: 'Daily Streak',
    tier: 'bronze', medal: 'circle',  color: 'var(--amber)',
    title: '7-DAY STREAK',  desc: 'Complete the daily quest 7 days in a row',
    check: function(d) { return d.maxDailyStreak >= 7; },
    progress: function(d) { return { val: Math.min(d.maxDailyStreak, 7), max: 7 }; } },
  { id: 'streak_14', group: 'Daily Streak',
    tier: 'silver', medal: 'circle',  color: 'var(--teal)',
    title: '14-DAY STREAK', desc: 'Complete the daily quest 14 days in a row',
    check: function(d) { return d.maxDailyStreak >= 14; },
    progress: function(d) { return { val: Math.min(d.maxDailyStreak, 14), max: 14 }; } },
  { id: 'streak_30', group: 'Daily Streak',
    tier: 'gold',   medal: 'sun',     color: 'var(--gold)',
    title: '30-DAY STREAK', desc: 'Complete the daily quest 30 days in a row',
    check: function(d) { return d.maxDailyStreak >= 30; },
    progress: function(d) { return { val: Math.min(d.maxDailyStreak, 30), max: 30 }; } },

  // ── Character Level ───────────────────────────────────────
  { id: 'char_8',  group: 'Character Level',
    tier: 'bronze', medal: 'shield', color: 'var(--amber)',
    title: 'CHAR LVL 8',  desc: 'Reach Character Level 8',
    check: function(d) { return d.charLevel >= 8; },
    progress: function(d) { return { val: Math.min(d.charLevel, 8), max: 8 }; } },
  { id: 'char_17', group: 'Character Level',
    tier: 'silver', medal: 'shield', color: 'var(--teal)',
    title: 'CHAR LVL 17', desc: 'Reach Character Level 17',
    check: function(d) { return d.charLevel >= 17; },
    progress: function(d) { return { val: Math.min(d.charLevel, 17), max: 17 }; } },
  { id: 'char_26', group: 'Character Level',
    tier: 'gold',   medal: 'shield', color: 'var(--gold)',
    title: 'CHAR LVL 26', desc: 'Reach Character Level 26',
    check: function(d) { return d.charLevel >= 26; },
    progress: function(d) { return { val: Math.min(d.charLevel, 26), max: 26 }; } },

  // ── Frequency Level ───────────────────────────────────────
  { id: 'freq_8',  group: 'Frequency Level',
    tier: 'bronze', medal: 'circle', color: 'var(--amber)',
    title: 'FREQ LVL 8',  desc: 'Reach Frequency Level 8',
    check: function(d) { return d.freqLevel >= 8; },
    progress: function(d) { return { val: Math.min(d.freqLevel, 8), max: 8 }; } },
  { id: 'freq_17', group: 'Frequency Level',
    tier: 'silver', medal: 'circle', color: 'var(--teal)',
    title: 'FREQ LVL 17', desc: 'Reach Frequency Level 17',
    check: function(d) { return d.freqLevel >= 17; },
    progress: function(d) { return { val: Math.min(d.freqLevel, 17), max: 17 }; } },
  { id: 'freq_26', group: 'Frequency Level',
    tier: 'gold',   medal: 'circle', color: 'var(--gold)',
    title: 'FREQ LVL 26', desc: 'Reach Frequency Level 26',
    check: function(d) { return d.freqLevel >= 26; },
    progress: function(d) { return { val: Math.min(d.freqLevel, 26), max: 26 }; } },

  // ── Social ───────────────────────────────────────────────
  { id: 'irl_first', group: 'Social',
    tier: 'bronze', medal: 'circle', color: 'var(--teal)',
    title: 'I LIVE!',  desc: 'Complete your first IRL quest',
    check: function(d) { return d.irlCompleted >= 1; },
    progress: function(d) { return { val: Math.min(d.irlCompleted, 1), max: 1 }; } },
  { id: 'quest_create_1', group: 'Social',
    tier: 'bronze', medal: 'star5', color: 'var(--purple)',
    title: 'NOT YOUR NORMAL NPC', desc: 'Create your first quest marker',
    check: function(d) { return d.questsCreated >= 1; },
    progress: function(d) { return { val: Math.min(d.questsCreated, 1), max: 1 }; } },
  { id: 'social_10', group: 'Social',
    tier: 'silver', medal: 'shield', color: 'var(--teal)',
    title: 'SOCIALITE', desc: 'Reach Social Level 10 by completing IRL quests',
    check: function(d) { return d.socialLevel >= 10; },
    progress: function(d) { return { val: Math.min(d.socialLevel, 10), max: 10 }; } },
  { id: 'ally_invite_1', group: 'Social',
    tier: 'gold', medal: 'sun', color: 'var(--gold)',
    title: 'SIGNAL BOOST', desc: 'Have your first friend join via your shared invite link',
    check: function(d) { return d.inviteAllies >= 1; },
    progress: function(d) { return { val: Math.min(d.inviteAllies, 1), max: 1 }; } },

  // ── 30-Day Challenges ────────────────────────────────────
  { id: 'thirty_first', group: '30-Day Challenges',
    tier: 'silver', medal: 'shield', color: 'var(--purple)',
    title: 'COMMITTED AF', desc: 'Complete your first 30-day challenge',
    check: function(d) { return d.thirtyDayDone >= 1; },
    progress: function(d) { return { val: Math.min(d.thirtyDayDone, 1), max: 1 }; } },
  { id: 'thirty_five', group: '30-Day Challenges',
    tier: 'gold', medal: 'diamond', color: 'var(--gold)',
    title: 'I LIVE FOR THIS', desc: 'Complete 5 thirty-day challenges',
    check: function(d) { return d.thirtyDayDone >= 5; },
    progress: function(d) { return { val: Math.min(d.thirtyDayDone, 5), max: 5 }; } },

  // ── Individual Life Quest Mastery ────────────────────────
  { id: 'tier_lp', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--gold)',
    title: 'LP MASTERED',  desc: 'Complete all 3 tiers of the Life Path quest',
    check: function(d) { return d.tiersDone.includes('lp'); },
    progress: function(d) { return { val: d.tierProgress['lp'] || 0, max: 3 }; } },
  { id: 'tier_cl', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--teal)',
    title: 'CL MASTERED',  desc: 'Complete all 3 tiers of the Life Calling quest',
    check: function(d) { return d.tiersDone.includes('cl'); },
    progress: function(d) { return { val: d.tierProgress['cl'] || 0, max: 3 }; } },
  { id: 'tier_ex', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--purple)',
    title: 'EX MASTERED',  desc: 'Complete all 3 tiers of the Expression quest',
    check: function(d) { return d.tiersDone.includes('ex'); },
    progress: function(d) { return { val: d.tierProgress['ex'] || 0, max: 3 }; } },
  { id: 'tier_so', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--rose)',
    title: 'SO MASTERED',  desc: 'Complete all 3 tiers of the Soul quest',
    check: function(d) { return d.tiersDone.includes('so'); },
    progress: function(d) { return { val: d.tierProgress['so'] || 0, max: 3 }; } },
  { id: 'tier_ou', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--purple)',
    title: 'OU MASTERED',  desc: 'Complete all 3 tiers of the Outer quest',
    check: function(d) { return d.tiersDone.includes('ou'); },
    progress: function(d) { return { val: d.tierProgress['ou'] || 0, max: 3 }; } },
  { id: 'tier_ac', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--amber)',
    title: 'AC MASTERED',  desc: 'Complete all 3 tiers of the Achievement quest',
    check: function(d) { return d.tiersDone.includes('ac'); },
    progress: function(d) { return { val: d.tierProgress['ac'] || 0, max: 3 }; } },
  { id: 'tier_th', group: 'Life Mastery',
    tier: 'silver', medal: 'star5', color: 'var(--silver)',
    title: 'TH MASTERED',  desc: 'Complete all 3 tiers of the Theme quest',
    check: function(d) { return d.tiersDone.includes('th'); },
    progress: function(d) { return { val: d.tierProgress['th'] || 0, max: 3 }; } },

  // ── Grand Mastery ─────────────────────────────────────────
  { id: 'all_tiers', group: 'Grand Mastery',
    tier: 'platinum', medal: 'diamond', color: 'var(--gold)',
    title: 'FULLY REALIZED', desc: 'Complete all tiers for all 7 life frequency quests',
    check: function(d) { return ['lp','cl','ex','so','ou','ac','th'].every(function(k){ return d.tiersDone.includes(k); }); },
    progress: function(d) { return { val: ['lp','cl','ex','so','ou','ac','th'].filter(function(k){ return d.tiersDone.includes(k); }).length, max: 7 }; } },
];

/* ─────────────────────────────────────────────────────────────
   STORAGE HELPERS
   ───────────────────────────────────────────────────────────── */
function _loadAchievements() {
  try { return JSON.parse(localStorage.getItem(LS_ACHIEVEMENTS) || '{}'); } catch(e) { return {}; }
}
function _saveAchievements(store) {
  try { localStorage.setItem(LS_ACHIEVEMENTS, JSON.stringify(store)); } catch(e) {}
  // Sync to cloud so medals persist across devices
  try { if (typeof NativeMap !== 'undefined' && NativeMap.saveAchievements) NativeMap.saveAchievements(); } catch(e) {}
}

/* ─────────────────────────────────────────────────────────────
   DATA SNAPSHOT — gather live values for check()
   ───────────────────────────────────────────────────────────── */
function _buildAchievementData() {
  // Daily streak max
  let maxDailyStreak = 0;
  try {
    const s = JSON.parse(localStorage.getItem(LS_DAILY_STREAK) || '{}');
    maxDailyStreak = s.max || 0;
  } catch(e) {}

  // Levels from QuestEngine runtime (global vars in same scope)
  const charLevel = typeof _charLevel !== 'undefined' ? _charLevel : 1;
  const freqLevel = typeof _freqLevel !== 'undefined' ? _freqLevel : 1;

  // Life quest tiers — key is "done" when all 3 tiers are completed
  const tiersDone = [];
  const tierProgress = {};
  try {
    const lqp = JSON.parse(localStorage.getItem('scl_lqp') || '{}');
    const pd  = typeof playerData !== 'undefined' ? playerData : null;
    if (pd && typeof TIERED_OBJECTIVES !== 'undefined') {
      ['lp','cl','ex','so','ou','ac','th'].forEach(function(qKey) {
        if (!pd[qKey]) return;
        const root = pd[qKey].root;
        var tiersComplete = 0;
        for (var t = 1; t <= 3; t++) {
          const objs = (TIERED_OBJECTIVES[root] && TIERED_OBJECTIVES[root][t]) ? TIERED_OBJECTIVES[root][t] : [];
          const prog = (lqp[qKey] && lqp[qKey][t]) ? lqp[qKey][t] : [];
          if (!objs.length) break;
          const tierDone = objs.every(function(_, i) { return !!prog[i]; });
          if (tierDone) tiersComplete++; else break;
        }
        tierProgress[qKey] = tiersComplete;
        if (tiersComplete === 3) tiersDone.push(qKey);
      });
    }
  } catch(e) {}

  // Social stats
  const irlCompleted  = parseInt(localStorage.getItem('scl_irl_completed')  || '0') || 0;
  const questsCreated = parseInt(localStorage.getItem('scl_quests_created') || '0') || 0;
  const socialLevel   = irlCompleted; // 1 IRL quest = 1 social level
  const inviteAllies  = parseInt(localStorage.getItem('scl_invite_allies')  || '0') || 0;

  // 30-day challenge stats
  const thirtyDayDone = parseInt(localStorage.getItem('scl_30day_done') || '0') || 0;

  return { maxDailyStreak: maxDailyStreak, charLevel: charLevel, freqLevel: freqLevel,
           tiersDone: tiersDone, tierProgress: tierProgress,
           irlCompleted: irlCompleted, questsCreated: questsCreated, socialLevel: socialLevel,
           inviteAllies: inviteAllies, thirtyDayDone: thirtyDayDone };
}

/* ─────────────────────────────────────────────────────────────
   MAIN CHECK — call from any hook point
   Evaluates all ACHIEVEMENTS and awards newly earned ones.
   ───────────────────────────────────────────────────────────── */
function Achievements_check() {
  try {
    const d     = _buildAchievementData();
    const store = _loadAchievements();
    let anyNew  = false;
    ACHIEVEMENTS.forEach(function(a) {
      if (!store[a.id] && a.check(d)) {
        store[a.id] = { earned: Date.now() };
        anyNew = true;
        _showAchievementBanner(a);
      }
    });
    if (anyNew) {
      _saveAchievements(store);
      Achievements_render();
    }
  } catch(e) { console.error('Achievements_check:', e); }
}

/* ─────────────────────────────────────────────────────────────
   DAILY STREAK TRACKING
   Called from QuestEngine_completeDailyQuest().
   ───────────────────────────────────────────────────────────── */
function Achievements_trackDailyAndCheck() {
  try {
    const n     = new Date();
    const today = n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate();
    let streak  = {};
    try { streak = JSON.parse(localStorage.getItem(LS_DAILY_STREAK) || '{}'); } catch(e) {}

    if (streak.lastDate === today) { Achievements_check(); return; } // already tracked today

    // Is lastDate = yesterday?
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yesterday = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    streak.current  = (streak.lastDate === yesterday) ? (streak.current || 0) + 1 : 1;
    streak.max      = Math.max(streak.max || 0, streak.current);
    streak.lastDate = today;
    localStorage.setItem(LS_DAILY_STREAK, JSON.stringify(streak));
  } catch(e) { console.error('Achievements_trackDailyAndCheck:', e); }
  Achievements_check();
}

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT EARNED BANNER
   ───────────────────────────────────────────────────────────── */
const _TIER_COLORS = {
  bronze:   'var(--amber)',
  silver:   'var(--silver)',
  gold:     'var(--gold)',
  platinum: 'var(--gold)',
};
function _showAchievementBanner(a) {
  const color  = _TIER_COLORS[a.tier] || 'var(--gold)';
  const svg    = _medalSvg(a.medal || 'circle', color, false);
  const banner = document.createElement('div');
  banner.className = 'achievement-banner';
  banner.innerHTML =
    '<div class="ach-banner-tier" style="color:' + color + ';">' + a.tier.toUpperCase() + ' ACHIEVEMENT</div>' +
    '<div class="ach-banner-svg">' + svg + '</div>' +
    '<div class="ach-banner-title" style="color:' + color + ';">' + a.title + '</div>' +
    '<div class="ach-banner-desc">' + a.desc + '</div>';
  Object.assign(banner.style, {
    position:   'fixed',
    bottom:     '110px',
    left:       '50%',
    transform:  'translateX(-50%) translateY(60px)',
    opacity:    '0',
    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
    zIndex:     '9997',
    pointerEvents: 'none',
  });
  document.body.appendChild(banner);
  requestAnimationFrame(function() {
    banner.style.transform = 'translateX(-50%) translateY(0)';
    banner.style.opacity   = '1';
    setTimeout(function() {
      banner.style.transform = 'translateX(-50%) translateY(60px)';
      banner.style.opacity   = '0';
      setTimeout(function() { banner.remove(); }, 350);
    }, 3800);
  });
}

/* ─────────────────────────────────────────────────────────────
   FOUNDER BADGE — rendered before the character name
   ───────────────────────────────────────────────────────────── */
function _renderFounderBadge() {
  const el        = document.getElementById('charFounderBadge');
  const card      = document.getElementById('charCard');
  const activeRow = document.getElementById('founderActiveRow');
  const inputRow  = document.getElementById('founderInputRow');
  if (isFounder()) {
    const crownSvg = _medalSvg('crown', '#e8c96b', false);
    if (el) {
      el.innerHTML = '<span class="founder-crown-medal" title="Founder — Early Investor">' + crownSvg + '</span>';
      el.style.display = 'inline-flex';
    }
    if (card) card.classList.add('char-card--founder');
    if (activeRow) activeRow.style.display = 'block';
    if (inputRow)  inputRow.style.display  = 'none';
  } else {
    if (el) { el.innerHTML = ''; el.style.display = 'none'; }
    if (card) card.classList.remove('char-card--founder');
    if (activeRow) activeRow.style.display = 'none';
    if (inputRow)  inputRow.style.display  = 'block';
  }
}

/* ─────────────────────────────────────────────────────────────
   RENDER — medals on character card
   Populates #charMedals with earned badge icons.
   ───────────────────────────────────────────────────────────── */
function Achievements_render() {
  _renderFounderBadge();
  const el = document.getElementById('charMedals');
  if (!el) return;
  const store = _loadAchievements();
  // Exclude founder from the medals row — it shows above the name instead
  const earned = ACHIEVEMENTS.filter(function(a) { return a.id !== 'founder' && !!store[a.id]; });
  if (!earned.length) { el.innerHTML = ''; return; }

  el.innerHTML = earned.map(function(a) {
    const color = _TIER_COLORS[a.tier] || a.color;
    const dateStr = store[a.id].earned ? new Date(store[a.id].earned).toLocaleDateString() : '';
    return '<div class="ach-medal ach-medal--' + a.tier + '" style="border-color:' + color + '44;" ' +
           'title="' + a.title + '\n' + a.desc + (dateStr ? '\nEarned: ' + dateStr : '') + '">' +
           '<span class="ach-medal-icon" style="color:' + color + ';">' + _medalSvg(a.medal || 'circle', color, false) + '</span>' +
           '</div>';
  }).join('');
}

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENTS PAGE — full grid with progress bars
   ───────────────────────────────────────────────────────────── */
function Achievements_renderPage() {
  const el = document.getElementById('achievementsPage');
  if (!el) return;
  const store  = _loadAchievements();
  const d      = _buildAchievementData();
  const earned = Object.keys(store).length;
  const total  = ACHIEVEMENTS.length;

  // Group achievements
  const groups = {};
  ACHIEVEMENTS.forEach(function(a) {
    const g = a.group || 'Other';
    if (!groups[g]) groups[g] = [];
    groups[g].push(a);
  });

  const tierLabel = { bronze: 'BRONZE', silver: 'SILVER', gold: 'GOLD', platinum: 'PLATINUM' };

  let html = '<div class="ach-page-header">' +
    '<div class="ach-page-title">✦ ACHIEVEMENTS</div>' +
    '<div class="ach-page-count" style="color:var(--teal);">' + earned + ' / ' + total + ' EARNED</div>' +
    '<div class="ach-page-bar"><div class="ach-page-bar-fill" style="width:' + Math.round(earned/total*100) + '%"></div></div>' +
    '</div>';

  Object.keys(groups).forEach(function(gName) {
    html += '<div class="ach-group-label">' + gName.toUpperCase() + '</div>';
    html += '<div class="ach-card-grid">';
    groups[gName].forEach(function(a) {
      const isEarned  = !!store[a.id];
      const color     = isEarned ? (_TIER_COLORS[a.tier] || a.color) : 'var(--border)';
      const earnDate  = isEarned && store[a.id].earned ? new Date(store[a.id].earned).toLocaleDateString() : null;
      const svg       = _medalSvg(a.medal || 'circle', isEarned ? (_TIER_COLORS[a.tier] || a.color) : null, !isEarned);
      let progHtml    = '';
      if (!isEarned && a.progress) {
        const p = a.progress(d);
        const pct = p.max > 0 ? Math.round(p.val / p.max * 100) : 0;
        progHtml = '<div class="ach-card-prog-wrap"><div class="ach-card-prog-bar" style="width:' + pct + '%;background:' + (a.color || 'var(--teal)') + ';"></div></div>' +
                   '<div class="ach-card-prog-label">' + p.val + ' / ' + p.max + '</div>';
      }
      html += '<div class="ach-card' + (isEarned ? ' ach-card--earned ach-card--' + a.tier : ' ach-card--locked') + '"' +
              ' style="border-color:' + color + '33;">' +
              '<div class="ach-card-medal">' + svg + '</div>' +
              '<div class="ach-card-body">' +
              '<div class="ach-card-tier" style="color:' + color + ';">' + tierLabel[a.tier] + '</div>' +
              '<div class="ach-card-title" style="color:' + color + ';">' + a.title + '</div>' +
              '<div class="ach-card-desc">' + a.desc + '</div>' +
              (earnDate ? '<div class="ach-card-date">Earned ' + earnDate + '</div>' : '') +
              progHtml +
              '</div></div>';
    });
    html += '</div>';
  });

  el.innerHTML = html;
}

/* ─────────────────────────────────────────────────────────────
   INIT — called from QuestEngine_init()
   ───────────────────────────────────────────────────────────── */
function Achievements_init() {
  Achievements_check();
  Achievements_render();
}
