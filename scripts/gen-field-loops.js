'use strict';

const CX = 230;
const CY = 250;
const RY = 190; // poles at y=60 and y=440
const VOID_R = 232;
const MAX_RX = VOID_R - 14; // stay clearly inside void ring
const COUNT = 5;

function ellipsePath(rx) {
  return (
    'M' + CX + ',60' +
    ' A' + rx + ',' + RY + ' 0 1,1 ' + CX + ',440' +
    ' A' + rx + ',' + RY + ' 0 1,1 ' + CX + ',60 Z'
  );
}

const strokes = ['#7c6cf0', '#5e58e0', '#4f7ed8', '#44b4c8', '#44f0b0'];
const dashes = ['24 7', '20 8', '16 9', '12 10', '8 12'];

const rxValues = Array.from({ length: COUNT }, (_, i) => {
  const minRx = 28;
  return Math.round(minRx + (i * (MAX_RX - minRx)) / (COUNT - 1));
});

console.log('  <g class="cdxfield-field-loops" opacity="0.95">');
rxValues.forEach((rx, i) => {
  const cls = i % 2 === 0 ? 'cdxfield-torus-line' : 'cdxfield-torus-line-rev';
  const sw = (1.28 - i * 0.04).toFixed(2);
  const op = (0.72 - i * 0.03).toFixed(2);
  console.log(
    '    <path class="' + cls + '" d="' + ellipsePath(rx) + '"' +
    ' stroke="' + strokes[i] + '" stroke-width="' + sw + '"' +
    ' stroke-dasharray="' + dashes[i] + '" opacity="' + op + '"/>'
  );
});
console.log('  </g>');
