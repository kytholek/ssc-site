'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const codexPath = path.join(ROOT, 'pages', 'codex.html');
let html = fs.readFileSync(codexPath, 'utf8');
const svg = fs.readFileSync(path.join(ROOT, 'pages', 'codex-field-svg.inc'), 'utf8');

const hitPos = {
  3: '50.0000%;top:12.0000%',
  1: '32.6087%;top:26.0000%',
  2: '67.3913%;top:26.0000%',
  4: '17.3913%;top:50.0000%',
  9: '50.0000%;top:50.0000%',
  5: '82.6087%;top:50.0000%',
  7: '32.6087%;top:74.0000%',
  8: '67.3913%;top:74.0000%',
  6: '50.0000%;top:88.0000%',
};

Object.entries(hitPos).forEach(([num, pos]) => {
  const re = new RegExp(
    '(<div class="node codex-hit-node" style="left:)[^"]*(" data-num="' + num + '")',
    'g'
  );
  html = html.replace(re, '$1' + pos + '$2');
});

html = html.replace(
  /<svg class="codex-spirit-svg"[\s\S]*?<\/svg>/,
  svg.trim()
);

fs.writeFileSync(codexPath, html);
console.log('Patched codex.html SVG and hit nodes');
