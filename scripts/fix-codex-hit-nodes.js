'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pages', 'codex.html');
let html = fs.readFileSync(filePath, 'utf8');

const nodes = {
  3: { cx: 340, cy: 175 },
  1: { cx: 220, cy: 265 },
  2: { cx: 460, cy: 265 },
  4: { cx: 220, cy: 375 },
  9: { cx: 340, cy: 375 },
  5: { cx: 460, cy: 375 },
  7: { cx: 220, cy: 485 },
  8: { cx: 460, cy: 485 },
  6: { cx: 340, cy: 555 },
};

html = html.replace(/\s*<!DOCTYPE html>\s*\r?\n<div style="background:#07070F[^"]*">/i, '\n');
html = html.replace(
  /<svg class="codex-spirit-svg" width="100%" viewBox="0 0 680 760"/,
  '<svg class="codex-spirit-svg" viewBox="0 0 680 760" preserveAspectRatio="xMidYMid meet"'
);

html = html.replace(
  /\s*<div class="node-name">[^<]*<\/div><div class="node-dot"><\/div><\/div>\s*\r?\n\s*<div class="node-tooltip">/g,
  '\n              <div class="node-tooltip">'
);

Object.entries(nodes).forEach(([num, { cx, cy }]) => {
  const left = ((cx / 680) * 100).toFixed(4);
  const top = ((cy / 760) * 100).toFixed(4);
  const re = new RegExp(
    '(<div class="node codex-hit-node" style=")[^"]*(" data-num="' + num + '")',
    'g'
  );
  html = html.replace(re, '$1left:' + left + '%;top:' + top + '%$2');
});

// Drop extra wrapper div: hit-layer closes, then one div too many before matrix-hud ends
html = html.replace(
  /(\s*<\/div>\s*\r?\n\s*<\/div>\s*\r?\n\s*<\/div>\s*\r?\n\s*<div class="plane-legend">)/,
  '\n        </div>\n      </div>\n\n    <div class="plane-legend">'
);

fs.writeFileSync(filePath, html);
console.log('Fixed codex hit nodes');
