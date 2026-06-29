/**
 * Numerical Spiral (0–39) — Codex view
 * Unified 36° grid; Play traces the path, Reset shows all nodes.
 */
function initCodexSpiral(container) {
  if (!container || container.dataset.initialized === '1') return;

  var svg      = container.querySelector('.cdx-spiral-svg');
  var bangG    = container.querySelector('.cdx-spiral-bang-layer');
  var spokeG   = container.querySelector('.cdx-spiral-spokes');
  var ringG    = container.querySelector('.cdx-spiral-rings');
  var nodeG    = container.querySelector('.cdx-spiral-nodes');
  var ap       = container.querySelector('.cdx-spiral-arc');
  var flashEl  = container.querySelector('.cdx-spiral-bang-flash');
  var btnPlay  = container.querySelector('[data-spiral-action="play"]');
  var btnReset = container.querySelector('[data-spiral-action="reset"]');

  if (!svg || !spokeG || !ringG || !nodeG || !ap || !btnPlay || !btnReset) return;

  var CX = 330;
  var CY = 340;
  /* Tighter ring spacing → smoother 0→39 energy path */
  var RADII = [0, 52, 96, 140, 184];
  var SPOKE_LEN = RADII[4] + 4;
  var NS = 'http://www.w3.org/2000/svg';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function slotAngle(slot) { return (-90 + slot * 36) * Math.PI / 180; }

  function nodePos(n) {
    if (n === 0) return { x: 0, y: 0, ring: 0 };
    var ring = n <= 9 ? 1 : n <= 19 ? 2 : n <= 29 ? 3 : 4;
    var slot = (n - 1) % 10;
    var r = RADII[ring];
    var a = slotAngle(slot);
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, ring: ring };
  }

  var pts = [];
  for (var n = 0; n <= 39; n++) {
    var p = nodePos(n);
    pts.push({ x: p.x, y: p.y, ring: p.ring, label: String(n), n: n });
  }

  function extrapolate(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function buildEnergyPath(coords) {
    if (coords.length < 2) return '';
    var world = coords.map(function(p) { return { x: CX + p.x, y: CY + p.y, ring: p.ring, n: p.n }; });
    var lead = extrapolate(world[0], world[1], -0.42);
    var tail = extrapolate(world[world.length - 2], world[world.length - 1], 1.28);
    var extended = [lead].concat(world, [tail]);
    var tension = 0.72;
    var d = 'M ' + world[0].x.toFixed(1) + ' ' + world[0].y.toFixed(1);

    for (var i = 1; i < world.length; i++) {
      var p0 = extended[i - 1];
      var p1 = world[i - 1];
      var p2 = world[i];
      var p3 = extended[i + 2] || tail;
      var seg = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      var outBias = p2.ring > p1.ring ? 0.16 : 0.08;
      var c1x = (p2.x - p0.x);
      var c1y = (p2.y - p0.y);
      var c2x = (p3.x - p1.x);
      var c2y = (p3.y - p1.y);
      var radial1 = { x: p1.x - CX, y: p1.y - CY };
      var radial2 = { x: p2.x - CX, y: p2.y - CY };
      var rlen1 = Math.hypot(radial1.x, radial1.y) || 1;
      var rlen2 = Math.hypot(radial2.x, radial2.y) || 1;
      var cp1 = {
        x: p1.x + c1x * tension / 6 + (radial1.x / rlen1) * seg * outBias,
        y: p1.y + c1y * tension / 6 + (radial1.y / rlen1) * seg * outBias
      };
      var cp2 = {
        x: p2.x - c2x * tension / 6 + (radial2.x / rlen2) * seg * outBias * 0.45,
        y: p2.y - c2y * tension / 6 + (radial2.y / rlen2) * seg * outBias * 0.45
      };
      d += ' C ' + cp1.x.toFixed(1) + ' ' + cp1.y.toFixed(1) + ',' +
            cp2.x.toFixed(1) + ' ' + cp2.y.toFixed(1) + ',' +
            p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    return d;
  }

  RADII.slice(1).forEach(function(r) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', CX);
    c.setAttribute('cy', CY);
    c.setAttribute('r', r);
    c.setAttribute('stroke-width', '0.5');
    c.classList.add('cdx-spiral-ring-guide');
    ringG.appendChild(c);
  });

  for (var s = 0; s < 10; s++) {
    var a = slotAngle(s);
    var x2 = CX + Math.cos(a) * SPOKE_LEN;
    var y2 = CY + Math.sin(a) * SPOKE_LEN;
    var line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', CX);
    line.setAttribute('y1', CY);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke-width', '0.5');
    line.classList.add('cdx-spiral-spoke');
    spokeG.appendChild(line);
  }

  ap.setAttribute('d', buildEnergyPath(pts));

  var ringR = [18, 15, 15, 16, 17];
  var ringFS = [13, 11, 11, 10, 10];
  var ringC = ['r0', 'r1', 'r2', 'r3', 'r4'];
  var nodeEls = [];

  pts.forEach(function(p) {
    var wx = CX + p.x;
    var wy = CY + p.y;
    var ring = p.ring || 0;
    var g = document.createElementNS(NS, 'g');
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', wx);
    c.setAttribute('cy', wy);
    c.setAttribute('r', ringR[ring]);
    c.setAttribute('stroke-width', '1.5');
    c.classList.add('cdx-spiral-node-' + ringC[ring] + 'c');
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', wx);
    t.setAttribute('y', wy);
    t.setAttribute('font-size', ringFS[ring]);
    t.classList.add('cdx-spiral-node-label');
    t.classList.add('cdx-spiral-node-' + ringC[ring] + 't');
    t.textContent = p.label;
    g.appendChild(c);
    g.appendChild(t);
    nodeG.appendChild(g);
    nodeEls.push(g);
  });

  var totalLen = 0;
  try { totalLen = ap.getTotalLength(); } catch (e) { totalLen = 3500; }

  function computeNodeDistances() {
    var distances = [];
    var next = 0;
    var samples = 120;
    for (var si = 0; si <= samples && next < pts.length; si++) {
      var len = (si / samples) * totalLen;
      var pt = ap.getPointAtLength(len);
      while (next < pts.length) {
        var tx = CX + pts[next].x;
        var ty = CY + pts[next].y;
        if (Math.hypot(pt.x - tx, pt.y - ty) < 20) {
          distances[next] = len;
          next++;
        } else {
          break;
        }
      }
    }
    for (var i = 0; i < pts.length; i++) {
      if (distances[i] == null) {
        distances[i] = totalLen * (i / Math.max(1, pts.length - 1));
      }
    }
    return distances;
  }

  var nodeDistances = computeNodeDistances();

  ap.style.strokeDasharray = totalLen;
  ap.style.strokeDashoffset = '0';
  nodeEls.forEach(function(el) { el.style.opacity = '1'; });

  var raf = null;
  var particleRaf = null;
  var t0 = null;
  var running = false;
  var DUR = 5200;

  function showAll() {
    ap.style.strokeDashoffset = '0';
    nodeEls.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transition = 'none';
    });
  }

  function hideAll() {
    ap.style.strokeDashoffset = String(totalLen);
    nodeEls.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transition = 'none';
    });
  }

  function ease(x) {
    return x < 0.5
      ? 4 * x * x * x
      : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function visibleAtLength(len) {
    var count = 0;
    for (var i = 0; i < nodeDistances.length; i++) {
      if (nodeDistances[i] <= len + 8) count = i + 1;
    }
    return count;
  }

  function tick(ts) {
    if (!t0) t0 = ts;
    var raw = Math.min((ts - t0) / DUR, 1);
    var e = ease(raw);
    var drawn = totalLen * e;

    ap.style.strokeDashoffset = (totalLen * (1 - e)).toFixed(1);

    var visible = visibleAtLength(drawn);
    nodeEls.forEach(function(el, i) {
      if (i < visible) {
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity = '1';
      } else {
        el.style.transition = 'none';
        el.style.opacity = '0';
      }
    });

    if (raw < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      running = false;
      btnPlay.textContent = '\u25B6 Play';
    }
  }

  function pulseRings() {
    ringG.querySelectorAll('circle').forEach(function(c, i) {
      c.style.transition = 'opacity .5s ease, stroke-width .5s ease';
      c.style.opacity = '0.45';
      c.style.strokeWidth = '1.4';
      setTimeout(function() {
        c.style.opacity = '';
        c.style.strokeWidth = '';
      }, 420 + i * 90);
    });
  }

  function playBigBang() {
    if (reducedMotion) return;

    if (flashEl) {
      flashEl.classList.remove('is-active');
      void flashEl.offsetWidth;
      flashEl.classList.add('is-active');
    }

    if (bangG) {
      bangG.innerHTML = '';
      var core = document.createElementNS(NS, 'circle');
      core.setAttribute('cx', CX);
      core.setAttribute('cy', CY);
      core.setAttribute('r', 22);
      core.classList.add('cdx-spiral-bang-core');
      bangG.appendChild(core);
      requestAnimationFrame(function() { core.classList.add('is-active'); });

      [0, 1, 2].forEach(function(i) {
        var shock = document.createElementNS(NS, 'circle');
        shock.setAttribute('cx', CX);
        shock.setAttribute('cy', CY);
        shock.setAttribute('r', 24 + i * 14);
        shock.classList.add('cdx-spiral-bang-shock');
        shock.style.animationDelay = (i * 0.1) + 's';
        bangG.appendChild(shock);
        requestAnimationFrame(function() { shock.classList.add('is-active'); });
      });

      var particles = [];
      for (var i = 0; i < 28; i++) {
        var p = document.createElementNS(NS, 'circle');
        p.setAttribute('cx', CX);
        p.setAttribute('cy', CY);
        p.setAttribute('r', 1 + Math.random() * 2);
        p.setAttribute('fill', i % 3 === 0 ? '#F5C842' : (i % 3 === 1 ? '#AFA9EC' : '#fffef0'));
        bangG.appendChild(p);
        particles.push({
          el: p,
          angle: (i / 28) * Math.PI * 2 + Math.random() * 0.4,
          speed: 2.2 + Math.random() * 3.5,
          life: 0,
          maxLife: 28 + Math.random() * 18
        });
      }

      if (particleRaf) cancelAnimationFrame(particleRaf);
      function particleTick() {
        var alive = false;
        particles.forEach(function(pt) {
          pt.life += 1;
          if (pt.life > pt.maxLife) {
            pt.el.setAttribute('opacity', '0');
            return;
          }
          alive = true;
          var dist = pt.speed * pt.life;
          var x = CX + Math.cos(pt.angle) * dist;
          var y = CY + Math.sin(pt.angle) * dist;
          var fade = 1 - pt.life / pt.maxLife;
          pt.el.setAttribute('cx', x.toFixed(1));
          pt.el.setAttribute('cy', y.toFixed(1));
          pt.el.setAttribute('opacity', (fade * 0.95).toFixed(2));
        });
        if (alive) particleRaf = requestAnimationFrame(particleTick);
      }
      particleRaf = requestAnimationFrame(particleTick);
    }

    pulseRings();
  }

  container._playBigBang = playBigBang;

  function stopPlayback() {
    cancelAnimationFrame(raf);
    if (particleRaf) cancelAnimationFrame(particleRaf);
    running = false;
    btnPlay.textContent = '\u25B6 Play';
  }

  function startPlayback() {
    if (running) return;
    stopPlayback();
    if (reducedMotion) {
      showAll();
      return;
    }
    hideAll();
    t0 = null;
    running = true;
    btnPlay.textContent = '\u25A0 Stop';
    playBigBang();
    setTimeout(function() {
      if (!running) return;
      requestAnimationFrame(tick);
    }, 420);
  }

  container._playSpiral = startPlayback;
  container._stopSpiral = stopPlayback;

  btnPlay.addEventListener('click', function() {
    if (running) {
      stopPlayback();
      return;
    }
    startPlayback();
  });

  btnReset.addEventListener('click', function() {
    stopPlayback();
    showAll();
  });

  container.dataset.initialized = '1';
}

function triggerCodexSpiralAutoPlay(page) {
  var root = page && page.querySelector('.cdx-spiral-root');
  if (!root || typeof root._playSpiral !== 'function') return;
  root._playSpiral();
}

window.initCodexSpiral = initCodexSpiral;
window.triggerCodexSpiralAutoPlay = triggerCodexSpiralAutoPlay;
window.triggerCodexSpiralBang = triggerCodexSpiralAutoPlay;
