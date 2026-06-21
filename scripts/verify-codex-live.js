'use strict';
async function main() {
  const index = await fetch('http://localhost:3456/index.html').then((r) => r.text());
  const criticalBlock = index.slice(index.indexOf('var CRITICAL'), index.indexOf('var SECONDARY'));
  console.log('codex in CRITICAL:', criticalBlock.includes('include-codex'));
  console.log('initCodexPage hook:', index.includes('initCodexPage()'));

  const codex = await fetch('http://localhost:3456/pages/codex.html').then((r) => r.text());
  console.log('codex fragment bytes:', codex.length);
  console.log('spirit svg:', codex.includes('cdxspirit-elec'));
  console.log('node-card:', codex.includes('node-card'));
  console.log('modal-666:', codex.includes('modal-666'));
  console.log('modal-369:', codex.includes('modal-369'));
  console.log('reduced-motion:', codex.includes('prefers-reduced-motion'));

  const app = await fetch('http://localhost:3456/js/app.js').then((r) => r.text());
  console.log('no canvas fn:', !app.includes('_startCodexCanvas'));
  console.log('has initCodexPage:', app.includes('function initCodexPage'));
  console.log('nature colors:', app.includes('NATURE_COLORS_CDX'));
}
main().catch(console.error);
