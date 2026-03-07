// ─── Init (called after all HTML fragments are loaded) ───
function initApp() {
  showPage('home');
}

// ─── Page routing ───
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');
}

// ─── Mobile menu ───
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}

// ─── Numerology calculations ───
function reduceNumber(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  }
  return n;
}

const LETTER_VALUES = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:11,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:22,W:5,X:6,Y:7,Z:8
};
const VOWELS = new Set(['A','E','I','O','U','Y']);

function nameToValues(name) {
  return name.toUpperCase().replace(/[^A-Z]/g,'').split('');
}

function calcLifePath(m, d, y) {
  const sum = [...String(m), ...String(d), ...String(y)].reduce((a,c) => a + parseInt(c), 0);
  return reduceNumber(sum);
}

function calcExpression(full) {
  // Reduce each name separately, then sum
  return reduceNumber(
    full.trim().split(/\s+/).reduce((total, word) => {
      const wordSum = word.toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a,c) => a + (LETTER_VALUES[c]||0), 0);
      return total + reduceNumber(wordSum);
    }, 0)
  );
}

function calcSoul(full) {
  const sum = nameToValues(full).filter(c => VOWELS.has(c)).reduce((a,c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNumber(sum);
}

function calcOuter(full) {
  const sum = nameToValues(full).filter(c => !VOWELS.has(c)).reduce((a,c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNumber(sum);
}

const FREQ_LABELS = ['Life Path','Expression','Life Calling','Soul','Outer','Achievement','Theme'];
const FREQ_ROLES  = ['What You Learn','What You Carry','Your Mission','Your Inner Desire','Your Public Persona','How You Accomplish','Your Life Curriculum'];
const FREQ_DESC = {
  1:  'Independence, leadership, originality. You are here to forge your own path.',
  2:  'Harmony, cooperation, sensitivity. You are here to build bridges between worlds.',
  3:  'Creativity, expression, joy. You are here to bring beauty and communication into being.',
  4:  'Structure, discipline, foundation. You are here to build something that lasts.',
  5:  'Freedom, change, versatility. You are here to experience and catalyse transformation.',
  6:  'Love, responsibility, nurturing. You are here to care, heal, and create beauty.',
  7:  'Wisdom, introspection, mystery. You are here to seek truth beneath appearances.',
  8:  'Power, ambition, manifestation. You are here to master the material and leave a legacy.',
  9:  'Compassion, completion, universality. You are here to serve the greater whole.',
  11: 'Illumination, inspiration, spiritual sensitivity. A master number — heightened purpose.',
  22: 'Master builder, visionary pragmatism. A master number — world-scale creation.',
  33: 'Master teacher, compassionate wisdom. A master number — the highest service.'
};

function calculateReading() {
  const month = parseInt(document.getElementById('calc-month').value);
  const day   = parseInt(document.getElementById('calc-day').value);
  const year  = parseInt(document.getElementById('calc-year').value);
  const fullName = document.getElementById('calc-fullname').value.trim();

  if (!month || !day || !year || !fullName) {
    document.getElementById('results-area').innerHTML =
      `<div class="results-placeholder-icon" style="color:var(--rose)">⚠</div>
       <div class="results-placeholder-text">Please fill in all required fields</div>`;
    return;
  }

  const lp      = calcLifePath(month, day, year);
  const exp     = calcExpression(fullName);
  const soul    = calcSoul(fullName);
  const outer   = calcOuter(fullName);
  // Life Calling: concatenate Expression root + Life Path root, then reduce
  const calling = reduceNumber(parseInt(String(exp) + String(lp)));
  // Achievement: Month + Day
  const achieve = reduceNumber(month + day);
  // Theme: sum of year digits
  const theme   = reduceNumber(String(year).split('').reduce((a,c) => a + parseInt(c), 0));

  const numbers = [lp, exp, calling, soul, outer, achieve, theme];

  document.getElementById('results-area').innerHTML = `
    <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border-dim)">
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:8px">Reading for</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:20px;color:var(--gold)">${fullName}</div>
    </div>
    <div style="display:flex;justify-content:center;margin-bottom:40px">
      ${buildFreqChart(numbers)}
    </div>
    ${numbers.map((n, i) => `
      <div style="padding:20px 0;border-bottom:1px solid var(--border-dim);display:grid;grid-template-columns:50px 1fr;gap:16px;align-items:start">
        <div style="font-family:'Cinzel Decorative',serif;font-size:32px;color:var(--gold);line-height:1;text-align:center">${n}</div>
        <div>
          <div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">${FREQ_ROLES[i]}</div>
          <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-light);margin-bottom:8px">${FREQ_LABELS[i]}</div>
          <p style="font-size:15px;line-height:1.7;color:var(--text-dim);font-style:italic">${FREQ_DESC[n] || 'A complex frequency — explore its depths.'}</p>
        </div>
      </div>
    `).join('')}
    <p style="text-align:center;font-size:13px;color:var(--text-muted);font-style:italic;margin-top:24px">Download the full app for complete interpretations, archetype analysis, and personal insights.</p>
  `;
}


// ─── Frequency Chart (Star of David / Hexagram) ───────────────
function buildFreqChart(numbers) {
  // numbers order: [lifePath, expression, calling, soul, outer, achieve, theme]
  // Node positions (angle from centre, r=180):
  //   soul        = -90°  (top)          → numbers[3]
  //   expression  = 150°  (bottom-left)  → numbers[1]
  //   outer       = 30°   (bottom-right) → numbers[4]
  //   lifePath    = 90°   (bottom)       → numbers[0]
  //   achievement = -150° (top-left)     → numbers[5]
  //   theme       = -30°  (top-right)    → numbers[6]
  //   center                             → numbers[2] (Life Calling)

  const W = 380, H = 380, cx = 190, cy = 190, r = 148;

  function pt(angle) {
    const rad = angle * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const soul       = pt(-90);
  const expression = pt(150);
  const outer      = pt(30);
  const lifePath   = pt(90);
  const achievement= pt(-150);
  const theme      = pt(-30);

  // Colour palette per frequency
  const COLORS = {
    soul:        { stroke: '#c9a84c', fill: '#1a1408', text: '#e8c96b', tri: 'rgba(201,168,76,0.08)'  },
    expression:  { stroke: '#7b4fa6', fill: '#120b1a', text: '#a96ed4', tri: 'rgba(123,79,166,0.08)'  },
    outer:       { stroke: '#4a9494', fill: '#081414', text: '#7ec8c8', tri: 'rgba(74,148,148,0.08)'  },
    lifePath:    { stroke: '#c9a84c', fill: '#1a1408', text: '#e8c96b', tri: 'rgba(201,168,76,0.06)'  },
    achievement: { stroke: '#7b4fa6', fill: '#120b1a', text: '#a96ed4', tri: 'rgba(123,79,166,0.06)'  },
    theme:       { stroke: '#4a9494', fill: '#081414', text: '#7ec8c8', tri: 'rgba(74,148,148,0.06)'  },
  };

  const goldGlow  = '#c9a84c';
  const purpleGlow= '#7b4fa6';
  const tealGlow  = '#4a9494';

  function tri(a, b, c, fill, stroke) {
    return `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}"
      fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round" opacity="0.85"/>`;
  }

  function line(a, b, color, opacity = 0.3, w = 1) {
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"
      stroke="${color}" stroke-width="${w}" opacity="${opacity}" stroke-linecap="round"/>`;
  }

  function node(x, y, num, label, color, r2 = 22) {
    const isTop   = y < cy - 10;
    const isBot   = y > cy + 10;
    const isLeft  = x < cx - 10;
    const isRight = x > cx + 10;
    const labelDy = isTop ? -r2 - 22 : r2 + 14;
    const roleDy  = isTop ? -r2 - 8  : r2 + 26;

    return `
      <!-- glow ring -->
      <circle cx="${x}" cy="${y}" r="${r2 + 7}" fill="${color.fill}" stroke="${color.stroke}"
        stroke-width="1" opacity="0.4"/>
      <!-- main node -->
      <circle cx="${x}" cy="${y}" r="${r2}" fill="${color.fill}" stroke="${color.stroke}"
        stroke-width="1.5"/>
      <!-- number -->
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
        font-family="'Cinzel Decorative', serif" font-size="${num > 9 ? '13' : '16'}"
        fill="${color.text}" font-weight="700">${num}</text>
      <!-- label -->
      <text x="${x}" y="${y + labelDy}" text-anchor="middle"
        font-family="'Cinzel', serif" font-size="8" fill="${color.text}"
        letter-spacing="0.12em" opacity="0.9">${label.toUpperCase()}</text>
    `;
  }

  function centerNode(num) {
    return `
      <!-- center glow -->
      <circle cx="${cx}" cy="${cy}" r="38" fill="rgba(201,168,76,0.06)" stroke="${goldGlow}"
        stroke-width="1" opacity="0.5"/>
      <circle cx="${cx}" cy="${cy}" r="28" fill="#100e04" stroke="${goldGlow}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle"
        font-family="'Cinzel Decorative', serif" font-size="${num > 9 ? '13' : '16'}"
        fill="#e8c96b" font-weight="700">${num}</text>
      <text x="${cx}" y="${cy + 11}" text-anchor="middle"
        font-family="'Cinzel', serif" font-size="6.5" fill="#c9a84c"
        letter-spacing="0.14em" opacity="0.85">LIFE CALLING</text>
    `;
  }

  // Spoke lines from center to each outer node
  const spokes = [soul, expression, outer, lifePath, achievement, theme]
    .map(p => line({x:cx,y:cy}, p, goldGlow, 0.15, 0.8))
    .join('');

  // Cross-lines (connecting opposites)
  const crossLines = [
    line(soul, lifePath,       goldGlow,   0.22, 1.2),
    line(expression, theme,    purpleGlow, 0.22, 1.2),
    line(outer, achievement,   tealGlow,   0.22, 1.2),
  ].join('');

  // Triangle fills
  const upTri   = tri(soul, expression, outer,       'rgba(201,168,76,0.07)',  goldGlow);
  const downTri = tri(lifePath, achievement, theme,  'rgba(123,79,166,0.07)', purpleGlow);

  // Triangle outlines (edges)
  const upEdges = [
    line(soul, expression,   goldGlow,   0.5, 1.2),
    line(expression, outer,  goldGlow,   0.5, 1.2),
    line(outer, soul,        goldGlow,   0.5, 1.2),
  ].join('');
  const downEdges = [
    line(lifePath, achievement,   purpleGlow, 0.5, 1.2),
    line(achievement, theme,      purpleGlow, 0.5, 1.2),
    line(theme, lifePath,         purpleGlow, 0.5, 1.2),
  ].join('');

  // All 6 outer nodes
  const nodes = [
    node(soul.x,        soul.y,        numbers[1], 'Expression',  COLORS.soul),
    node(expression.x,  expression.y,  numbers[3], 'Soul',  COLORS.expression),
    node(outer.x,       outer.y,       numbers[4], 'Outer',       COLORS.outer),
    node(lifePath.x,    lifePath.y,    numbers[0], 'Life Path',   COLORS.lifePath),
    node(achievement.x, achievement.y, numbers[5], 'Achievement', COLORS.achievement),
    node(theme.x,       theme.y,       numbers[6], 'Theme',       COLORS.theme),
  ].join('');

  return `
    <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
      style="max-width:100%;overflow:visible"
      xmlns="http://www.w3.org/2000/svg">

      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#1a1620" stop-opacity="1"/>
          <stop offset="100%" stop-color="#05040a" stop-opacity="1"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- background -->
      <circle cx="${cx}" cy="${cy}" r="175" fill="url(#bgGrad)" stroke="rgba(201,168,76,0.12)" stroke-width="1"/>

      <!-- triangle fills -->
      ${upTri}
      ${downTri}

      <!-- triangle edges -->
      ${upEdges}
      ${downEdges}

      <!-- cross lines -->
      ${crossLines}

      <!-- spokes -->
      ${spokes}

      <!-- outer nodes -->
      ${nodes}

      <!-- center node -->
      ${centerNode(numbers[2])}

    </svg>`;
}

// ─── Blog ───
function openPost(id) {
  document.getElementById('blog-listing').style.display = 'none';
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));
  const post = document.getElementById(id);
  if (post) { post.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function closePosts() {
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));
  document.getElementById('blog-listing').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterBlog(category, btn) {
  document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const allCards = document.querySelectorAll('#page-blog .blog-card');
  allCards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.style.display = show ? 'flex' : 'none';
  });
}

// ── Expose functions called from inline HTML onclick attributes ──
window.calculateReading = calculateReading;
window.toggleMenu       = toggleMenu;
window.showPage         = showPage;
window.openPost         = openPost;
window.closePosts       = closePosts;
window.filterBlog       = filterBlog;

// ── Fallback: event delegation for calc button (in case onclick is dropped) ──
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('calc-btn')) {
    calculateReading();
  }
});
