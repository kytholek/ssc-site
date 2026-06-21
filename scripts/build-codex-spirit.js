'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const sourcePath = 'c:/Users/kytho/OneDrive/Desktop/Business/SSC/Diagrams/codex_spirit_animated.html';
const oldCodex = fs.readFileSync(path.join(ROOT, 'pages/codex.html'), 'utf8');

let svg = fs.readFileSync(sourcePath, 'utf8');
svg = svg.replace(/<style>[\s\S]*?<\/style>/, '');
svg = svg.replace(/^[^<]*<div[^>]*>/, '').replace(/<\/div>\s*$/, '');

const ids = ['elec', 'mag', 'aeth', 'eg', 'mg', 'ag', 'moon-fill', 'dbl-path', 'glow-gold', 'glow-blue', 'glow-silver', 'glow-emerald'];
ids.forEach((id) => {
  svg = svg.replace(new RegExp('id="' + id + '"', 'g'), 'id="cdxspirit-' + id + '"');
  svg = svg.replace(new RegExp('url\\(#' + id + '\\)', 'g'), 'url(#cdxspirit-' + id + ')');
});

const classMap = {
  'elec-halo': 'cdxspirit-elec-halo',
  'mag-halo': 'cdxspirit-mag-halo',
  'aeth-halo': 'cdxspirit-aeth-halo',
  'spin-outer': 'cdxspirit-spin-outer',
  'spin-inner': 'cdxspirit-spin-inner',
  'star1': 'cdxspirit-star1',
  'star2': 'cdxspirit-star2',
  'star3': 'cdxspirit-star3',
  'star4': 'cdxspirit-star4',
  'moon-g': 'cdxspirit-moon-g',
  'seq-flow': 'cdxspirit-seq-flow',
  'seq-glow': 'cdxspirit-seq-glow',
  'inf-flow-up': 'cdxspirit-inf-flow-up',
  'inf-flow-dn': 'cdxspirit-inf-flow-dn',
};
Object.entries(classMap).forEach(([from, to]) => {
  svg = svg.replace(new RegExp('class="' + from + '"', 'g'), 'class="' + to + '"');
});

svg = svg.replace('<svg width="100%"', '<svg class="codex-spirit-svg" width="100%"');
svg = svg.replace('role="img"', 'role="presentation" aria-hidden="true"');

const positions = {
  3: { left: '50%', top: '23.03%', plane: 'spirit', nature: 'electric' },
  1: { left: '32.35%', top: '34.87%', plane: 'mind', nature: 'electric' },
  2: { left: '67.65%', top: '34.87%', plane: 'body', nature: 'magnetic' },
  4: { left: '32.35%', top: '49.34%', plane: 'mind', nature: 'magnetic' },
  9: { left: '50%', top: '49.34%', plane: 'spirit', nature: 'aetheric' },
  5: { left: '67.65%', top: '49.34%', plane: 'body', nature: 'electric' },
  7: { left: '32.35%', top: '63.82%', plane: 'mind', nature: 'electric' },
  8: { left: '67.65%', top: '63.82%', plane: 'body', nature: 'magnetic' },
  6: { left: '50%', top: '73.03%', plane: 'spirit', nature: 'magnetic' },
};

const positionLabels = {
  1: 'Mind Axis · Upper Left',
  2: 'Body Axis · Upper Right',
  3: 'Spirit Gate · Upper Centre',
  4: 'Mind Axis · Left Meridian',
  5: 'Body Axis · Right Meridian',
  6: 'Spirit Gate · Lower Centre',
  7: 'Mind Axis · Lower Left',
  8: 'Body Axis · Lower Right',
  9: 'Aetheric Centre · Singularity',
};

function extractNode(n) {
  const re = new RegExp(
    '<div class="node" data-num="' + n + '"[\\s\\S]*?(?=\\n\\s*<div class="node"|\\n\\s*</div><!-- /codex-grid -->)'
  );
  const m = oldCodex.match(re);
  return m ? m[0] : '';
}

function buildHitNode(n) {
  const p = positions[n];
  let block = extractNode(n);
  block = block.replace(/data-plane="[^"]*"/, 'data-plane="' + p.plane + '"');
  block = block.replace(/data-col="[^"]*"\s*/, '');
  block = block.replace(/data-nature="[^"]*"/, 'data-nature="' + p.nature + '"');
  block = block.replace(
    /<div class="tooltip-position">[\s\S]*?<\/div>/,
    '<div class="tooltip-position">' + positionLabels[n] + '</div>'
  );
  if (n === 9) {
    block = block.replace(
      /<div class="tooltip-body">[\s\S]*?<\/div>/,
      '<div class="tooltip-body">The aetheric singularity at the heart of the matrix. Completion, release, and universal compassion — the field through which all frequencies pass.</div>'
    );
  }
  if (n === 5) {
    block = block.replace(
      /<div class="tooltip-essence">[\s\S]*?<\/div>/,
      '<div class="tooltip-essence">Electric · Freedom Through Presence</div>'
    );
    block = block.replace(
      /<div class="tooltip-body">[\s\S]*?<\/div>/,
      '<div class="tooltip-body">The explorer on the body meridian. Every path of transformation passes through 5. Freedom through full presence, not escape.</div>'
    );
  }
  block = block.replace(/<div class="node-inner">[\s\S]*?<\/div>\s*/, '');
  block = block.replace(
    '<div class="node"',
    '<div class="node codex-hit-node" style="left:' + p.left + ';top:' + p.top + '"'
  );
  return block;
}

const hitNodes = [3, 1, 2, 4, 9, 5, 7, 8, 6].map(buildHitNode).join('\n\n');

fs.writeFileSync(path.join(ROOT, 'pages/codex-spirit-svg.inc'), svg.trim());
fs.writeFileSync(path.join(ROOT, 'pages/codex-hit-nodes.inc'), hitNodes);
console.log('Wrote codex-spirit-svg.inc and codex-hit-nodes.inc');
