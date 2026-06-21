'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(ROOT, 'pages/codex-spirit-svg.inc'), 'utf8');
const hitNodes = fs.readFileSync(path.join(ROOT, 'pages/codex-hit-nodes.inc'), 'utf8');

const html = `<div class="page" id="page-codex">
<style>
/* ══ Codex Spirit Page — SPA Fragment ═══════════════════════════════════════ */

#page-codex.active {
  animation: codexPageIn .5s ease-out .15s both;
}
@keyframes codexPageIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

#page-codex .cdx-wrap {
  position: relative;
  min-height: 100vh;
  background: #07070F;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#page-codex .cdx-wrap::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(1px 1px at 8%  12%, rgba(245,200,66,.2) 0%,transparent 100%),
    radial-gradient(1px 1px at 22% 38%, rgba(255,255,255,.12) 0%,transparent 100%),
    radial-gradient(1px 1px at 68% 28%, rgba(255,255,255,.08) 0%,transparent 100%),
    radial-gradient(1px 1px at 83% 58%, rgba(55,138,221,.15) 0%,transparent 100%),
    radial-gradient(1px 1px at 33% 72%, rgba(192,192,224,.12) 0%,transparent 100%);
}

#page-codex.cdx-active .cdx-gate { opacity: 0; transform: translate(-50%, -50%) scale(.55); pointer-events: none; }

#page-codex .cdx-revealed {
  position: relative; overflow: visible;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
  padding: 80px 24px 140px; gap: 0;
  pointer-events: all; z-index: 1; width: 100%;
}

#page-codex .codex-header { text-align: center; margin-bottom: 32px; }
#page-codex .codex-eyebrow { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.5em; text-transform:uppercase; color:#C0C0D8; opacity:.7; margin-bottom:12px; }
#page-codex .codex-title { font-family:'Cormorant SC',serif; font-weight:300; font-size:clamp(36px,6vw,68px); color:#F5C842; line-height:1.05; margin-bottom:14px; letter-spacing:.08em; text-shadow:0 0 60px rgba(245,200,66,.25); }
#page-codex .codex-instruction { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; text-transform:uppercase; color:rgba(192,192,216,.45); margin-bottom:24px; text-align:center; }

#page-codex .matrix-hud { position:relative; display:flex; flex-direction:column; align-items:center; width:100%; max-width:680px; }

#page-codex .codex-spirit-wrap {
  position: relative;
  width: 100%;
  max-width: 680px;
  background: #07070F;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 680 / 760;
}

#page-codex .codex-spirit-svg {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}

#page-codex .codex-hit-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
}

#page-codex .codex-hit-node {
  position: absolute;
  width: 13%;
  aspect-ratio: 1;
  min-width: 44px;
  min-height: 44px;
  max-width: 88px;
  max-height: 88px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid transparent;
  background: transparent;
  transition: border-color .25s, box-shadow .25s, transform .25s cubic-bezier(.34,1.56,.64,1);
  z-index: 10;
}

#page-codex .codex-hit-node:hover,
#page-codex .codex-hit-node.pinned {
  border-color: rgba(245,200,66,.55);
  box-shadow: 0 0 28px rgba(245,200,66,.25);
  transform: translate(-50%, -50%) scale(1.08);
  z-index: 20;
}

#page-codex .codex-hit-node[data-nature="magnetic"]:hover,
#page-codex .codex-hit-node[data-nature="magnetic"].pinned {
  border-color: rgba(55,138,221,.65);
  box-shadow: 0 0 28px rgba(55,138,221,.3);
}

#page-codex .codex-hit-node[data-nature="aetheric"]:hover,
#page-codex .codex-hit-node[data-nature="aetheric"].pinned {
  border-color: rgba(192,192,224,.75);
  box-shadow: 0 0 36px rgba(192,192,224,.35);
}

#page-codex .node-tooltip { display: none; }

/* Spirit SVG animations */
@keyframes cdxspirit-pulse-elec { 0%,100%{opacity:0.55} 50%{opacity:1} }
@keyframes cdxspirit-pulse-mag  { 0%,100%{opacity:0.55} 50%{opacity:1} }
@keyframes cdxspirit-pulse-aeth { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
@keyframes cdxspirit-spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes cdxspirit-spin-rev   { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes cdxspirit-star-twinkle { 0%,100%{opacity:0.2} 50%{opacity:0.8} }
@keyframes cdxspirit-moon-pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
@keyframes cdxspirit-seq-travel { 0%{stroke-dashoffset:2000} 100%{stroke-dashoffset:0} }
@keyframes cdxspirit-inf-travel { 0%{stroke-dashoffset:1200} 100%{stroke-dashoffset:0} }

#page-codex .cdxspirit-elec-halo { animation: cdxspirit-pulse-elec 3s ease-in-out infinite; }
#page-codex .cdxspirit-mag-halo  { animation: cdxspirit-pulse-mag  3.4s ease-in-out infinite; }
#page-codex .cdxspirit-aeth-halo { animation: cdxspirit-pulse-aeth 2.5s ease-in-out infinite; }
#page-codex .cdxspirit-spin-outer { transform-origin:340px 375px; animation: cdxspirit-spin-slow 60s linear infinite; }
#page-codex .cdxspirit-spin-inner { transform-origin:340px 375px; animation: cdxspirit-spin-rev 40s linear infinite; }
#page-codex .cdxspirit-star1 { animation: cdxspirit-star-twinkle 2.3s ease-in-out infinite; }
#page-codex .cdxspirit-star2 { animation: cdxspirit-star-twinkle 3.1s ease-in-out infinite 0.5s; }
#page-codex .cdxspirit-star3 { animation: cdxspirit-star-twinkle 1.9s ease-in-out infinite 1.1s; }
#page-codex .cdxspirit-star4 { animation: cdxspirit-star-twinkle 2.7s ease-in-out infinite 0.3s; }
#page-codex .cdxspirit-moon-g { animation: cdxspirit-moon-pulse 4s ease-in-out infinite; }
#page-codex .cdxspirit-seq-flow,
#page-codex .cdxspirit-seq-glow { stroke-dasharray: 2000; animation: cdxspirit-seq-travel 8s ease-in-out infinite; }
#page-codex .cdxspirit-inf-flow-up { stroke-dasharray: 1200; animation: cdxspirit-inf-travel 5s ease-in-out infinite 1s; }
#page-codex .cdxspirit-inf-flow-dn { stroke-dasharray: 1200; animation: cdxspirit-inf-travel 5s ease-in-out infinite 3.5s; }

#page-codex .plane-legend { margin-top:36px; display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:680px; }
#page-codex .legend-row { display:flex; gap:20px; justify-content:center; flex-wrap:wrap; align-items:center; }
#page-codex .legend-divider { width:180px; height:1px; background:linear-gradient(90deg,transparent,rgba(245,200,66,.2),transparent); }
#page-codex .plane-item { display:flex; align-items:center; gap:7px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; text-transform:uppercase; color:#9b9080; }
#page-codex .plane-dot   { width:7px; height:7px; border-radius:50%; }
#page-codex .plane-square { width:9px; height:9px; border-radius:2px; opacity:.75; flex-shrink:0; }
#page-codex .legend-label { font-family:'Cinzel',serif; font-size:7px; letter-spacing:.4em; text-transform:uppercase; color:rgba(245,200,66,.35); margin-bottom:6px; text-align:center; }
#page-codex .void-item { display:flex; align-items:center; gap:8px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.3em; text-transform:uppercase; color:rgba(192,192,216,.55); border:1px solid rgba(192,192,216,.15); border-radius:20px; padding:5px 14px; }
#page-codex .void-ring { width:9px; height:9px; border-radius:50%; border:1.5px solid rgba(192,192,216,.5); }
#page-codex .legend-col-item { cursor:pointer; transition:color .2s; }
#page-codex .legend-col-item:hover .plane-square { opacity:1; }
#page-codex .legend-col-item:hover { color:#e8dfc8; }

#page-codex .pattern-triggers { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:4px; width:100%; max-width:680px; }
#page-codex .sixes-trigger,
#page-codex .tesla-trigger  { display:flex; flex-direction:column; align-items:center; gap:4px; border-radius:6px; padding:12px 20px; cursor:pointer; transition:all .25s; flex:1; min-width:160px; max-width:280px; background:none; }
#page-codex .sixes-trigger { background:rgba(245,200,66,.04); border:1px solid rgba(245,200,66,.18); }
#page-codex .sixes-trigger:hover { background:rgba(245,200,66,.10); border-color:rgba(245,200,66,.4); }
#page-codex .tesla-trigger  { background:rgba(55,138,221,.04); border:1px solid rgba(55,138,221,.18); text-decoration:none; }
#page-codex .tesla-trigger:hover  { background:rgba(55,138,221,.10); border-color:rgba(55,138,221,.5); }
#page-codex .sixes-trigger-num { font-family:'Cinzel Decorative',serif; font-size:20px; color:#F5C842; letter-spacing:.15em; text-shadow:0 0 20px rgba(245,200,66,.4); }
#page-codex .tesla-trigger-num { font-family:'Cinzel Decorative',serif; font-size:20px; color:#7ec8c8; letter-spacing:.15em; text-shadow:0 0 20px rgba(55,138,221,.4); }
#page-codex .sixes-trigger-label,
#page-codex .tesla-trigger-label  { font-family:'Cinzel',serif; font-size:7px; letter-spacing:.25em; text-transform:uppercase; }
#page-codex .sixes-trigger-label  { color:rgba(245,200,66,.45); }
#page-codex .tesla-trigger-label  { color:rgba(55,138,221,.55); }

#page-codex .master-note { margin-top:24px; font-family:'Cinzel',serif; font-size:8px; letter-spacing:.2em; text-transform:uppercase; color:rgba(245,200,66,.35); text-align:center; padding:10px 20px; border:1px solid rgba(245,200,66,.08); border-radius:4px; cursor:pointer; transition:color .2s,border-color .2s; text-decoration:none; display:inline-block; }
#page-codex .master-note:hover { color:rgba(245,200,66,.7); border-color:rgba(245,200,66,.25); }

#page-codex .pattern-modal-backdrop { display:none; position:fixed; inset:0; z-index:500; background:rgba(5,4,10,.85); backdrop-filter:blur(6px); align-items:center; justify-content:center; padding:24px; }
#page-codex .pattern-modal-backdrop.open { display:flex; }
#page-codex .pattern-modal { position:relative; max-width:480px; width:100%; background:#0d0b18; border-radius:10px; padding:36px 32px 28px; text-align:center; animation:modalIn .25s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes modalIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
#page-codex .pattern-modal-close { position:absolute; top:12px; right:14px; background:none; border:none; color:#9b9080; font-size:18px; cursor:pointer; transition:color .2s; line-height:1; }
#page-codex .pattern-modal-close:hover { color:#e8dfc8; }
#page-codex .pattern-modal-eyebrow { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.45em; text-transform:uppercase; margin-bottom:12px; opacity:.7; }
#page-codex .pattern-modal.gold-modal { border:1px solid rgba(245,200,66,.3); }
#page-codex .pattern-modal.gold-modal::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,#F5C842,transparent); }
#page-codex .pattern-modal.gold-modal .pattern-modal-eyebrow { color:#7a6330; }
#page-codex .pattern-modal.teal-modal { border:1px solid rgba(55,138,221,.3); }
#page-codex .pattern-modal.teal-modal::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,#378ADD,transparent); }
#page-codex .pattern-modal.teal-modal .pattern-modal-eyebrow { color:#378ADD; }
#page-codex .pattern-modal-num { font-family:'Cinzel Decorative',serif; font-size:32px; letter-spacing:.15em; margin-bottom:16px; line-height:1; }
#page-codex .gold-modal .pattern-modal-num { color:#F5C842; text-shadow:0 0 30px rgba(245,200,66,.4); }
#page-codex .teal-modal .pattern-modal-num { color:#7ec8c8; text-shadow:0 0 30px rgba(55,138,221,.4); }
#page-codex .pattern-modal-body { font-size:15px; line-height:1.8; color:#9b9080; margin-bottom:20px; text-align:left; }
#page-codex .pattern-modal-body strong { color:#e8dfc8; }
#page-codex .pattern-modal-link { display:inline-block; font-family:'Cinzel',serif; font-size:9px; letter-spacing:.25em; text-transform:uppercase; padding:10px 22px; border-radius:4px; text-decoration:none; transition:all .2s; }
#page-codex .gold-modal .pattern-modal-link { color:#F5C842; border:1px solid rgba(245,200,66,.3); background:rgba(245,200,66,.04); }
#page-codex .gold-modal .pattern-modal-link:hover { background:rgba(245,200,66,.12); border-color:#F5C842; }
#page-codex .teal-modal .pattern-modal-link { color:#7ec8c8; border:1px solid rgba(55,138,221,.3); background:rgba(55,138,221,.04); }
#page-codex .teal-modal .pattern-modal-link:hover { background:rgba(55,138,221,.14); border-color:#7ec8c8; }

#page-codex .node-card {
  position:fixed; bottom:0; left:0; right:0;
  display:flex; align-items:center; gap:24px;
  padding:18px 32px;
  background:rgba(7,7,15,0.97); border-top:1px solid rgba(55,138,221,0.2);
  z-index:300; transform:translateY(100%);
  transition:transform .3s cubic-bezier(.34,1.2,.64,1),border-color .3s;
  pointer-events:none;
}
#page-codex .node-card.visible { transform:translateY(0); pointer-events:auto; }
#page-codex .node-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(245,200,66,0.4),transparent); }
#page-codex .nc-number { font-family:'Cinzel Decorative',serif; font-size:clamp(36px,5vw,56px); line-height:1; flex-shrink:0; min-width:60px; text-align:center; transition:color .2s,text-shadow .2s; }
#page-codex .nc-divider { width:1px; height:60px; background:rgba(55,138,221,0.2); flex-shrink:0; }
#page-codex .nc-info { flex:1; min-width:0; }
#page-codex .nc-name { font-family:'Cinzel',serif; font-size:clamp(10px,1.4vw,13px); letter-spacing:.28em; text-transform:uppercase; color:#e8dfc8; margin-bottom:3px; }
#page-codex .nc-position { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:rgba(192,192,216,0.55); margin-bottom:4px; }
#page-codex .nc-essence  { font-family:'Cinzel',serif; font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:#7ec8c8; margin-bottom:6px; }
#page-codex .nc-body { font-size:13px; line-height:1.6; color:#9b9080; max-width:480px; }
#page-codex .nc-actions { display:flex; flex-direction:column; gap:8px; flex-shrink:0; }
#page-codex .nc-btn { font-family:'Cinzel',serif; font-size:8px; letter-spacing:.22em; text-transform:uppercase; padding:8px 16px; border-radius:3px; text-decoration:none; text-align:center; transition:background .2s,border-color .2s; white-space:nowrap; }
#page-codex .nc-btn-lp   { color:#F5C842; border:1px solid rgba(245,200,66,.3); }
#page-codex .nc-btn-lp:hover   { background:rgba(245,200,66,.1); border-color:#F5C842; }
#page-codex .nc-btn-calc { color:#7ec8c8; border:1px solid rgba(55,138,221,.3); }
#page-codex .nc-btn-calc:hover { background:rgba(55,138,221,.1); border-color:#7ec8c8; }

@media(max-width:768px) {
  #page-codex .cdx-revealed { padding: 60px 16px 120px; }
  #page-codex .codex-instruction { display:none; }
}
@media(max-width:640px) {
  #page-codex .cdx-revealed { padding: 50px 12px 100px; }
  #page-codex .node-card { flex-wrap:wrap; gap:12px; padding:14px 20px; }
  #page-codex .nc-divider { display:none; }
  #page-codex .nc-body { display:none; }
  #page-codex .nc-actions { flex-direction:row; }
  #page-codex .pattern-modal-backdrop { align-items:flex-end; padding:0; }
  #page-codex .pattern-modal { border-radius:12px 12px 0 0; max-width:100%; animation:slideUp .3s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
}
@media(prefers-reduced-motion: reduce) {
  #page-codex .cdxspirit-spin-outer,
  #page-codex .cdxspirit-spin-inner,
  #page-codex .cdxspirit-elec-halo,
  #page-codex .cdxspirit-mag-halo,
  #page-codex .cdxspirit-aeth-halo,
  #page-codex .cdxspirit-star1,
  #page-codex .cdxspirit-star2,
  #page-codex .cdxspirit-star3,
  #page-codex .cdxspirit-star4,
  #page-codex .cdxspirit-moon-g,
  #page-codex .cdxspirit-seq-flow,
  #page-codex .cdxspirit-seq-glow,
  #page-codex .cdxspirit-inf-flow-up,
  #page-codex .cdxspirit-inf-flow-dn { animation: none !important; }
  #page-codex animateTransform { display: none; }
}
</style>

<div class="cdx-wrap">
  <div class="cdx-revealed">

    <header class="codex-header">
      <div class="codex-eyebrow">The Architecture of Consciousness</div>
      <h1 class="codex-title">The Codex</h1>
    </header>

    <div class="codex-instruction">Hover to explore &nbsp;·&nbsp; Click to pin</div>

    <div class="matrix-hud">
      <div class="codex-spirit-wrap" id="codex-spirit-wrap">
        ${svg}
        <div class="codex-hit-layer" id="codex-grid">
${hitNodes}
        </div>
      </div>
    </div>

    <div class="plane-legend">
      <div class="void-item"><div class="void-ring"></div>0 · The Void — The ring that contains all</div>
      <div class="legend-divider"></div>
      <div style="text-align:center;width:100%">
        <div class="legend-label">Structural Patterns</div>
        <div class="pattern-triggers">
          <button class="sixes-trigger" onclick="window.openModal&&openModal('modal-666')" id="sixes-trigger">
            <span class="sixes-trigger-num">6 · 6 · 6</span>
            <span class="sixes-trigger-label">Every column &amp; row · Tap to reveal</span>
          </button>
          <button class="tesla-trigger" onclick="window.openModal&&openModal('modal-369')">
            <span class="tesla-trigger-num">3 · 6 · 9</span>
            <span class="tesla-trigger-label">The Spirit axis · Tesla's pattern</span>
          </button>
        </div>
      </div>
      <div class="legend-divider"></div>
      <div style="text-align:center;width:100%">
        <div class="legend-label">Natures of Energy</div>
        <div class="legend-row">
          <div class="plane-item"><div class="plane-dot" style="background:#F5C842"></div>Electric | 1·3·5·7</div>
          <div class="plane-item"><div class="plane-dot" style="background:#378ADD"></div>Magnetic | 2·4·6·8</div>
          <div class="plane-item"><div class="plane-dot" style="background:#C0C0E0"></div>Aetheric | 9·0</div>
        </div>
      </div>
    </div>

    <a href="/blog/master-numbers-11-22-33-numerology/" class="master-note">
      &#10022; &nbsp; Master numbers 11, 22 &amp; 33 do not reduce — they transcend the matrix &nbsp; &#10022;
    </a>

    <div style="margin:48px auto 20px;max-width:560px;padding:36px 28px;background:linear-gradient(135deg,rgba(13,11,24,.9),rgba(24,21,48,.8));border:1px solid rgba(245,200,66,.2);border-radius:10px;text-align:center;">
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:rgba(245,200,66,.6);margin-bottom:12px;">&#10022;&nbsp;&nbsp;Your Blueprint&nbsp;&nbsp;&#10022;</div>
      <p style="font-family:'Cormorant SC',serif;font-size:20px;color:rgba(245,200,66,.9);margin:0 0 12px;">See Where You Sit in the Codex</p>
      <p style="font-size:15px;line-height:1.8;color:rgba(255,255,255,.55);margin-bottom:24px;">Every node you explored maps to a frequency in your personal blueprint. Calculate yours to see which positions you occupy.</p>
      <a href="/#calculator" onclick="if(typeof showPage==='function'){event.preventDefault();showPage('calculator');}" style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:.3em;text-transform:uppercase;padding:14px 28px;border-radius:5px;background:rgba(55,138,221,.2);border:1px solid rgba(126,200,200,.4);color:rgba(126,200,200,.9);text-decoration:none;display:inline-block;">&#11042;&nbsp;Calculate My Blueprint&nbsp;&#11042;</a>
    </div>

  </div>
</div>

<div class="node-card" id="node-card">
  <div class="nc-number" id="nc-number">—</div>
  <div class="nc-divider"></div>
  <div class="nc-info">
    <div class="nc-name"     id="nc-name"></div>
    <div class="nc-position" id="nc-position"></div>
    <div class="nc-essence"  id="nc-essence"></div>
    <div class="nc-body"     id="nc-body"></div>
  </div>
  <div class="nc-actions" id="nc-actions"></div>
</div>

<div class="pattern-modal-backdrop" id="modal-666" onclick="window.closeModal&&closeModal('modal-666',event)">
  <div class="pattern-modal gold-modal">
    <button class="pattern-modal-close" onclick="window.closeModal&&closeModal('modal-666')">&times;</button>
    <div class="pattern-modal-eyebrow">The Structural Law</div>
    <div class="pattern-modal-num">6 · 6 · 6</div>
    <div class="pattern-modal-body">
      Every row of the Codex reduces to <strong>6</strong>:<br>
      &nbsp;&nbsp;Mind row: 1 + 2 + 3 = <strong>6</strong><br>
      &nbsp;&nbsp;Body row: 4 + 5 + 6 = 15 → <strong>6</strong><br>
      &nbsp;&nbsp;Spirit row: 7 + 8 + 9 = 24 → <strong>6</strong><br><br>
      Both diagonals reduce to <strong>6</strong>:<br>
      &nbsp;&nbsp;1 + 5 + 9 = 15 → <strong>6</strong><br>
      &nbsp;&nbsp;3 + 5 + 7 = 15 → <strong>6</strong><br><br>
      The outer ring of the matrix — every edge, every corner path — frames the entire system in 6. This is not a symbol of evil. It is the structural law of integration: <strong>6 is the number that holds everything together.</strong>
    </div>
    <a class="pattern-modal-link" href="/blog/666-numerology-meaning/">Read: 666 Is Not What You Think &#8594;</a>
  </div>
</div>

<div class="pattern-modal-backdrop" id="modal-369" onclick="window.closeModal&&closeModal('modal-369',event)">
  <div class="pattern-modal teal-modal">
    <button class="pattern-modal-close" onclick="window.closeModal&&closeModal('modal-369')">&times;</button>
    <div class="pattern-modal-eyebrow">Tesla's Key</div>
    <div class="pattern-modal-num">3 · 6 · 9</div>
    <div class="pattern-modal-body">
      Each column of the Codex reduces to 3, 6, or 9:<br>
      &nbsp;&nbsp;Mind column: 1 + 4 + 7 = 12 → <strong>3</strong><br>
      &nbsp;&nbsp;Body column: 2 + 5 + 8 = 15 → <strong>6</strong><br>
      &nbsp;&nbsp;Spirit column: 3 + 6 + 9 = 18 → <strong>9</strong><br><br>
      Tesla said if you knew the magnificence of 3, 6 and 9 you would have a key to the universe. The Codex shows exactly why — <strong>every column reduces to 3, 6, or 9.</strong> They are the Aetheric axis running through the entire system.
    </div>
    <a class="pattern-modal-link" href="/blog/3-6-9-pattern-tesla-numerology/">Read: Why Tesla Was Right &#8594;</a>
  </div>
</div>
</div>
`;

fs.writeFileSync(path.join(ROOT, 'pages/codex.html'), html);
console.log('Wrote pages/codex.html');
