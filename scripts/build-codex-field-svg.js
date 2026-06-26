'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(
  'c:/Users/kytho/OneDrive/Desktop/Business/SSC/Diagrams/electro_magnetic_codex.html',
  'utf8'
);

let svg = src.match(/<svg id="field"[\s\S]*?<\/svg>/)[0];
svg = svg.replace(
  'id="field"',
  'class="codex-spirit-svg" viewBox="0 0 460 500" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true"'
);
svg = svg.replace(/ viewBox="0 0 460 500"/, '');

const ids = ['glow-cyan', 'glow-amber', 'glow-violet', 'glow-soft', 'singularity-grad', 'halo-grad'];
ids.forEach((id) => {
  svg = svg.replace(new RegExp('id="' + id + '"', 'g'), 'id="cdxfield-' + id + '"');
  svg = svg.replace(new RegExp('url\\(#' + id + '\\)', 'g'), 'url(#cdxfield-' + id + ')');
});

const classMap = {
  'field-halo': 'cdxfield-field-halo',
  'torus-group': 'cdxfield-torus-group',
  'singularity-ring3': 'cdxfield-singularity-ring3',
  'singularity-ring2': 'cdxfield-singularity-ring2',
  'singularity-ring1': 'cdxfield-singularity-ring1',
  'struct-line': 'cdxfield-struct-line',
  'mag-path': 'cdxfield-mag-path',
  'elec-path': 'cdxfield-elec-path',
  'node-group node-electric': 'cdxfield-node-group cdxfield-node-electric',
  'node-group node-magnetic': 'cdxfield-node-group cdxfield-node-magnetic',
  'node-group node-aetheric': 'cdxfield-node-group cdxfield-node-aetheric',
  'node-ring': 'cdxfield-node-ring',
  'node-label': 'cdxfield-node-label',
  'singularity-core': 'cdxfield-singularity-core',
};

Object.entries(classMap).forEach(([from, to]) => {
  svg = svg.replace(new RegExp('class="' + from + '"', 'g'), 'class="' + to + '"');
});

const out = path.join(ROOT, 'pages', 'codex-field-svg.inc');
fs.writeFileSync(out, svg.trim());
console.log('Wrote', out);
