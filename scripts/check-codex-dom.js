'use strict';
const fs = require('fs');
const html = fs.readFileSync('pages/codex.html', 'utf8');
let depth = 0;
let inPage = false;
let cardInside = false;
const tokens = html.match(/<\/?div[^>]*>/gi) || [];
let pos = 0;
for (const tok of tokens) {
  const idx = html.indexOf(tok, pos);
  pos = idx + tok.length;
  if (tok.includes('id="page-codex"')) inPage = true;
  if (tok.startsWith('</')) depth--;
  else depth++;
  if (tok.includes('id="node-card"') && inPage && depth > 0) cardInside = true;
}
console.log('node-card inside open page-codex:', cardInside);
console.log('final depth:', depth);
