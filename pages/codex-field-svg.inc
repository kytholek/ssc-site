<svg class="codex-spirit-svg" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true" viewBox="0 0 460 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Glow filters -->
    <filter id="cdxfield-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="cdxfield-glow-amber" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="cdxfield-glow-violet" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="cdxfield-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Radial gradient for singularity -->
    <radialGradient id="cdxfield-singularity-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#c084fc" stop-opacity="1"/>
      <stop offset="45%"  stop-color="#7c3aed" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#050510" stop-opacity="0"/>
    </radialGradient>

    <!-- Radial gradient for torus halo -->
    <radialGradient id="cdxfield-halo-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#4f46e5" stop-opacity="0"/>
      <stop offset="60%"  stop-color="#4f46e5" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#050510" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!--
    NODE POSITIONS (centred in 460x500 canvas):
    3  = (230, 60)    electric
    1  = (150,130)    electric
    2  = (310,130)    magnetic
    4  = ( 80,250)    magnetic
    9  = (230,250)    aetheric  ← center
    5  = (380,250)    electric
    7  = (150,370)    electric
    8  = (310,370)    magnetic
    6  = (230,440)    magnetic
  -->

  <!-- RING OF VOID (0) — womb boundary encircling the vortex -->
  <g class="cdxfield-void-group">
    <circle class="cdxfield-void-ring-outer" cx="230" cy="250" r="232"/>
    <circle class="cdxfield-void-ring-inner" cx="230" cy="250" r="218"/>
  </g>

  <!-- OUTER TORUS HALO -->
  <ellipse class="cdxfield-field-halo" cx="230" cy="250" rx="200" ry="180"
    fill="url(#cdxfield-halo-grad)" stroke="none"/>

  <!-- TORUS FIELD LINES (rotating) -->
  <g class="cdxfield-torus-group" opacity="0.5">
    <!-- Horizontal ellipses simulating torus cross-sections -->
    <ellipse cx="230" cy="250" rx="195" ry="40" fill="none" stroke="#4f46e5" stroke-width="0.7" opacity="0.35"/>
    <ellipse cx="230" cy="250" rx="175" ry="70" fill="none" stroke="#4f46e5" stroke-width="0.6" opacity="0.28"/>
    <ellipse cx="230" cy="250" rx="145" ry="100" fill="none" stroke="#4f46e5" stroke-width="0.5" opacity="0.22"/>
    <ellipse cx="230" cy="250" rx="110" ry="130" fill="none" stroke="#6366f1" stroke-width="0.5" opacity="0.2"/>
    <ellipse cx="230" cy="250" rx="70"  ry="155" fill="none" stroke="#6366f1" stroke-width="0.5" opacity="0.18"/>
    <ellipse cx="230" cy="250" rx="30"  ry="170" fill="none" stroke="#818cf8" stroke-width="0.4" opacity="0.15"/>
  </g>

  <!-- Singularity aura rings (expanding outward from 9) -->
  <circle class="cdxfield-singularity-ring3" cx="230" cy="250" r="22" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0"/>
  <circle class="cdxfield-singularity-ring2" cx="230" cy="250" r="22" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0"/>
  <circle class="cdxfield-singularity-ring1" cx="230" cy="250" r="22" fill="none" stroke="#c084fc" stroke-width="1.5" opacity="0"/>

  <!-- BASE STRUCTURE LINES (very subtle) -->
  <g class="cdxfield-struct-line">
    <line x1="230" y1="60"  x2="150" y2="130"/>
    <line x1="230" y1="60"  x2="310" y2="130"/>
    <line x1="150" y1="130" x2="230" y2="250"/>
    <line x1="310" y1="130" x2="230" y2="250"/>
    <line x1="230" y1="250" x2="80"  y2="250"/>
    <line x1="230" y1="250" x2="380" y2="250"/>
    <line x1="230" y1="250" x2="150" y2="370"/>
    <line x1="230" y1="250" x2="310" y2="370"/>
    <line x1="150" y1="370" x2="230" y2="440"/>
    <line x1="310" y1="370" x2="230" y2="440"/>
  </g>

  <!-- MAGNETIC PATH — solid cyan — 2→4→8→6 -->
  <polyline class="cdxfield-mag-path"
    points="310,130 80,250 310,370 230,440"
    filter="url(#cdxfield-glow-cyan)"/>

  <!-- ELECTRIC PATH — dashed amber — 3→1→5→7 -->
  <polyline class="cdxfield-elec-path"
    points="230,60 150,130 380,250 150,370"
    filter="url(#cdxfield-glow-amber)"/>

  <!-- ═══════════════════════════════════
       NODES
  ════════════════════════════════════ -->

  <!-- NODE 3 — electric — top -->
  <g class="cdxfield-node-group cdxfield-node-electric">
    <circle class="cdxfield-node-ring" cx="230" cy="60" r="18" filter="url(#cdxfield-glow-soft)"/>
    <circle cx="230" cy="60" r="18" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.4"/>
    <text class="cdxfield-node-label" x="230" y="60" fill="#fbbf24">3</text>
  </g>

  <!-- NODE 1 — electric — mid-left -->
  <g class="cdxfield-node-group cdxfield-node-electric">
    <circle class="cdxfield-node-ring" cx="150" cy="130" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="150" y="130" fill="#fbbf24">1</text>
  </g>

  <!-- NODE 2 — magnetic — mid-right -->
  <g class="cdxfield-node-group cdxfield-node-magnetic">
    <circle class="cdxfield-node-ring" cx="310" cy="130" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="310" y="130" fill="#67e8f9">2</text>
  </g>

  <!-- NODE 4 — magnetic — far-left -->
  <g class="cdxfield-node-group cdxfield-node-magnetic">
    <circle class="cdxfield-node-ring" cx="80" cy="250" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="80" y="250" fill="#67e8f9">4</text>
  </g>

  <!-- NODE 5 — electric — far-right -->
  <g class="cdxfield-node-group cdxfield-node-electric">
    <circle class="cdxfield-node-ring" cx="380" cy="250" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="380" y="250" fill="#fbbf24">5</text>
  </g>

  <!-- NODE 7 — electric — lower-left -->
  <g class="cdxfield-node-group cdxfield-node-electric">
    <circle class="cdxfield-node-ring" cx="150" cy="370" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="150" y="370" fill="#fbbf24">7</text>
  </g>

  <!-- NODE 8 — magnetic — lower-right -->
  <g class="cdxfield-node-group cdxfield-node-magnetic">
    <circle class="cdxfield-node-ring" cx="310" cy="370" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="310" y="370" fill="#67e8f9">8</text>
  </g>

  <!-- NODE 6 — magnetic — bottom -->
  <g class="cdxfield-node-group cdxfield-node-magnetic">
    <circle class="cdxfield-node-ring" cx="230" cy="440" r="18" filter="url(#cdxfield-glow-soft)"/>
    <text class="cdxfield-node-label" x="230" y="440" fill="#67e8f9">6</text>
  </g>

  <!-- NODE 9 — AETHERIC SINGULARITY — center -->
  <g class="cdxfield-node-group cdxfield-node-aetheric" filter="url(#cdxfield-glow-violet)">
    <!-- Soft radial glow behind -->
    <circle cx="230" cy="250" r="50" fill="url(#cdxfield-singularity-grad)" opacity="0.5"/>
    <!-- Segmented outer ring -->
    <circle cx="230" cy="250" r="26" fill="#0d0020" stroke="#a855f7" stroke-width="2"
      stroke-dasharray="13.6 3.4"/>
    <!-- Pulsing core -->
    <circle class="cdxfield-singularity-core" cx="230" cy="250" r="18"
      fill="#1a0035" stroke="#c084fc" stroke-width="1.5"/>
    <!-- Inner dot -->
    <circle cx="230" cy="250" r="5" fill="#e9d5ff" opacity="0.9"/>
    <text class="cdxfield-node-label" x="230" y="250" fill="#e9d5ff" font-size="17">9</text>
  </g>

</svg>