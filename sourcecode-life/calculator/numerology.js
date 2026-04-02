/**
 * SOURCE CODE: LIFE â numerology.js
 * Pure numerology engine. Zero DOM dependencies.
 * All exports used by app.js and data.js
 */

const LV = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:11,L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:22,W:5, X:6, Y:7, Z:8
};

const VOWELS  = new Set(['A','E','I','O','U','Y']);
const MASTERS = new Set([11,22,33,44,55,66,77,88,99]);

/** Reduce n to single digit, preserving master numbers */
function reduce(n) {
  while (n > 9 && !MASTERS.has(n))
    n = String(n).split('').reduce((a, d) => a + +d, 0);
  return n;
}

/** Display: "22/4" when compound â  root, else just "7" */
function fmt(root, compound) {
  if (!compound || compound === root) return String(root);
  return compound + '/' + root;
}

/** Reduce to 1â9 without preserving masters (for chart counting) */
function reduceToSimple(n) {
  let r = n;
  while (r > 9) r = String(r).split('').reduce((a, d) => a + +d, 0);
  return r;
}

/** Reduce letter master values (K=11, V=22) to simple digit for charts */
function reduceLetterVal(n) {
  if (n === 11) return 2;
  if (n === 22) return 4;
  return reduceToSimple(n);
}

function calcLifePath(m, d, y) {
  const total = [m, d, ...String(y).split('').map(Number)].reduce((a, b) => a + b, 0);
  return { root: reduce(total), compound: total };
}

function calcNameNumbers(name) {
  const names = name.trim().split(/\s+/);
  let expressionSum = 0, soulSum = 0, outerSum = 0;
  names.forEach(n => {
    const L = n.toUpperCase().replace(/[^A-Z]/g, '').split('');
    const vs = L.filter(l =>  VOWELS.has(l)).reduce((a, l) => a + (LV[l] || 0), 0);
    const cs = L.filter(l => !VOWELS.has(l)).reduce((a, l) => a + (LV[l] || 0), 0);
    const es = L.reduce((a, l) => a + (LV[l] || 0), 0);
    expressionSum += reduce(es);
    soulSum       += vs;
    outerSum      += cs;
  });
  return {
    soul:  { root: reduce(soulSum),       compound: soulSum       },
    outer: { root: reduce(outerSum),      compound: outerSum      },
    expr:  { root: reduce(expressionSum), compound: expressionSum }
  };
}

function calcAchievement(m, d) {
  const t = m + d;
  return { root: reduce(t), compound: t };
}

function calcTheme(y) {
  const t = String(y).split('').reduce((a, d) => a + +d, 0);
  return { root: reduce(t), compound: t };
}

/**
 * Full calculation â returns all 7 frequencies plus raw inputs.
 * @returns {{ lp, ex, cl, so, ou, ac, th, name, m, d, y }}
 */
function computeAll(m, d, y, name) {
  const lp = calcLifePath(m, d, y);
  const nn = calcNameNumbers(name);
  const ac = calcAchievement(m, d);
  const th = calcTheme(y);
  const clCompound = parseInt(String(nn.expr.root) + String(lp.root));
  const cl = { root: reduce(clCompound), compound: clCompound };
  return { lp, ex: nn.expr, cl, so: nn.soul, ou: nn.outer, ac, th, name, m, d, y };
}

/** Count occurrences of digits 1â9 in an array of numbers */
function countNums1to9(arr) {
  const counts = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  arr.forEach(n => {
    let r = n;
    while (r > 9) r = String(r).split('').reduce((a, d) => a + +d, 0);
    if (r >= 1 && r <= 9) counts[r]++;
  });
  return counts;
}
