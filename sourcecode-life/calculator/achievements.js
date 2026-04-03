/* ═══════════════════════════════════════════════════════════════
   ACHIEVEMENTS SYSTEM
   Separate file — loaded after QuestEngine.js.
   All state lives in localStorage under 'scl_achievements'.
   Streak data lives in 'scl_daily_streak'.
   ═══════════════════════════════════════════════════════════════ */

const LS_ACHIEVEMENTS  = 'scl_achievements';
const LS_DAILY_STREAK  = 'scl_daily_streak';

/* ─────────────────────────────────────────────────────────────
   ACHIEVEMENT DEFINITIONS
   Each entry: { id, tier, icon, color, title, desc, check(data) }
   tier: 'bronze' | 'silver' | 'gold' | 'platinum'
   check(data) returns true when the achievement is earned.
   data = { maxDailyStreak, charLevel, freqLevel, tiersDone[] }
   ───────────────────────────────────────────────────────────── */
const ACHIEVEMENTS = [

  // ── Daily Streak ─────────────────────────────────────────
  { id: 'streak_7',
    tier: 'bronze', icon: '◈', color: 'var(--amber)',
    title: '7-DAY STREAK',
    desc:  'Complete the daily quest 7 days in a row',
    check: d => d.maxDailyStreak >= 7 },
  { id: 'streak_14',
    tier: 'silver', icon: '◈', color: 'var(--teal)',
    title: '14-DAY STREAK',
    desc:  'Complete the daily quest 14 days in a row',
    check: d => d.maxDailyStreak >= 14 },
  { id: 'streak_30',
    tier: 'gold',   icon: '◈', color: 'var(--gold)',
    title: '30-DAY STREAK',
    desc:  'Complete the daily quest 30 days in a row',
    check: d => d.maxDailyStreak >= 30 },

  // ── Character Level ───────────────────────────────────────
  { id: 'char_8',
    tier: 'bronze', icon: '⚔', color: 'var(--amber)',
    title: 'CHAR LVL 8',
    desc:  'Reach Character Level 8',
    check: d => d.charLevel >= 8 },
  { id: 'char_17',
    tier: 'silver', icon: '⚔', color: 'var(--teal)',
    title: 'CHAR LVL 17',
    desc:  'Reach Character Level 17',
    check: d => d.charLevel >= 17 },
  { id: 'char_26',
    tier: 'gold',   icon: '⚔', color: 'var(--gold)',
    title: 'CHAR LVL 26',
    desc:  'Reach Character Level 26',
    check: d => d.charLevel >= 26 },

  // ── Frequency Level ───────────────────────────────────────
  { id: 'freq_8',
    tier: 'bronze', icon: '◉', color: 'var(--amber)',
    title: 'FREQ LVL 8',
    desc:  'Reach Frequency Level 8',
    check: d => d.freqLevel >= 8 },
  { id: 'freq_17',
    tier: 'silver', icon: '◉', color: 'var(--teal)',
    title: 'FREQ LVL 17',
    desc:  'Reach Frequency Level 17',
    check: d => d.freqLevel >= 17 },
  { id: 'freq_26',
    tier: 'gold',   icon: '◉', color: 'var(--gold)',
    title: 'FREQ LVL 26',
    desc:  'Reach Frequency Level 26',
    check: d => d.freqLevel >= 26 },

  // ── Individual Life Quest Mastery (all 3 tiers complete) ──
  { id: 'tier_lp',
    tier: 'silver', icon: '★', color: 'var(--gold)',
    title: 'LP MASTERED',
    desc:  'Complete all 3 tiers of the Life Path quest',
    check: d => d.tiersDone.includes('lp') },
  { id: 'tier_cl',
    tier: 'silver', icon: '★', color: 'var(--teal)',
    title: 'CL MASTERED',
    desc:  'Complete all 3 tiers of the Life Calling quest',
    check: d => d.tiersDone.includes('cl') },
  { id: 'tier_ex',
    tier: 'silver', icon: '★', color: 'var(--purple)',
    title: 'EX MASTERED',
    desc:  'Complete all 3 tiers of the Expression quest',
    check: d => d.tiersDone.includes('ex') },
  { id: 'tier_so',
    tier: 'silver', icon: '★', color: 'var(--rose)',
    title: 'SO MASTERED',
    desc:  'Complete all 3 tiers of the Soul quest',
    check: d => d.tiersDone.includes('so') },
  { id: 'tier_ou',
    tier: 'silver', icon: '★', color: 'var(--purple)',
    title: 'OU MASTERED',
    desc:  'Complete all 3 tiers of the Outer quest',
    check: d => d.tiersDone.includes('ou') },
  { id: 'tier_ac',
    tier: 'silver', icon: '★', color: 'var(--amber)',
    title: 'AC MASTERED',
    desc:  'Complete all 3 tiers of the Achievement quest',
    check: d => d.tiersDone.includes('ac') },
  { id: 'tier_th',
    tier: 'silver', icon: '★', color: 'var(--text-mid)',
    title: 'TH MASTERED',
    desc:  'Complete all 3 tiers of the Theme quest',
    check: d => d.tiersDone.includes('th') },

  // ── Grand Mastery ─────────────────────────────────────────
  { id: 'all_tiers',
    tier: 'platinum', icon: '✦', color: 'var(--gold)',
    title: 'FULLY REALIZED',
    desc:  'Complete all tiers for all 7 life frequency quests',
    check: d => ['lp','cl','ex','so','ou','ac','th'].every(k => d.tiersDone.includes(k)) },
];

/* ─────────────────────────────────────────────────────────────
   STORAGE HELPERS
   ───────────────────────────────────────────────────────────── */
function _loadAchievements() {
  try { return JSON.parse(localStorage.getItem(LS_ACHIEVEMENTS) || '{}'); } catch(e) { return {}; }
}
function _saveAchievements(store) {
  try { localStorage.setItem(LS_ACHIEVEMENTS, JSON.stringify(store)); } catch(e) {}
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
  try {
    const lqp = JSON.parse(localStorage.getItem('scl_lqp') || '{}');
    const pd  = typeof playerData !== 'undefined' ? playerData : null;
    if (pd && typeof TIERED_OBJECTIVES !== 'undefined') {
      ['lp','cl','ex','so','ou','ac','th'].forEach(function(qKey) {
        if (!pd[qKey]) return;
        const root = pd[qKey].root;
        for (var t = 1; t <= 3; t++) {
          const objs = (TIERED_OBJECTIVES[root] && TIERED_OBJECTIVES[root][t]) ? TIERED_OBJECTIVES[root][t] : [];
          const prog = (lqp[qKey] && lqp[qKey][t]) ? lqp[qKey][t] : [];
          if (!objs.length) return; // no objectives defined yet
          const tierDone = objs.every(function(_, i) { return !!prog[i]; });
          if (!tierDone) return; // not all tiers complete — stop checking this key
        }
        tiersDone.push(qKey);
      });
    }
  } catch(e) {}

  return { maxDailyStreak: maxDailyStreak, charLevel: charLevel, freqLevel: freqLevel, tiersDone: tiersDone };
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
  const banner = document.createElement('div');
  banner.className = 'achievement-banner';
  banner.innerHTML =
    '<div class="ach-banner-tier" style="color:' + color + ';">' + a.tier.toUpperCase() + ' ACHIEVEMENT</div>' +
    '<div class="ach-banner-icon" style="color:' + color + ';">' + a.icon + '</div>' +
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
   RENDER — medals on character card
   Populates #charMedals with earned badge icons.
   ───────────────────────────────────────────────────────────── */
function Achievements_render() {
  const el = document.getElementById('charMedals');
  if (!el) return;
  const store = _loadAchievements();
  const earned = ACHIEVEMENTS.filter(function(a) { return !!store[a.id]; });
  if (!earned.length) { el.innerHTML = ''; return; }

  el.innerHTML = earned.map(function(a) {
    const color = _TIER_COLORS[a.tier] || a.color;
    const dateStr = store[a.id].earned ? new Date(store[a.id].earned).toLocaleDateString() : '';
    return '<div class="ach-medal ach-medal--' + a.tier + '" style="border-color:' + color + '44;" ' +
           'title="' + a.title + '\n' + a.desc + (dateStr ? '\nEarned: ' + dateStr : '') + '">' +
           '<span class="ach-medal-icon" style="color:' + color + ';">' + a.icon + '</span>' +
           '<span class="ach-medal-title" style="color:' + color + ';">' + a.title + '</span>' +
           '</div>';
  }).join('');
}

/* ─────────────────────────────────────────────────────────────
   INIT — called from QuestEngine_init()
   ───────────────────────────────────────────────────────────── */
function Achievements_init() {
  Achievements_check();
  Achievements_render();
}
