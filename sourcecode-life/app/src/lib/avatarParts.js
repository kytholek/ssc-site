/**
 * avatarParts.js
 *
 * Pixel-art avatar part definitions.
 * Each part is an array of [x, y, color] "pixels" on a 16×24 grid (1 unit = 3px rendered).
 * The canvas/SVG renders them as 3×3 colored squares.
 *
 * Grid coords:  x: 0–15, y: 0–23
 * Character is structured:
 *   Head:   y  0–7  (centered x 4–11)
 *   Body:   y  8–15 (centered x 3–12)
 *   Legs:   y 16–23 (centered x 4–11)
 *
 * Parts are keyed by category → array of options.
 * Each option has: id, label, pixels[]
 *
 * Colors reference CSS variables for theming, but also have fallback hex.
 * Colors used: skin tones, hair colors, outfit colors.
 *
 * Default selection per category is derived from playerData numbers:
 *   head    → lifePath root  (mod options length)
 *   hair    → calling root
 *   eyes    → expression root
 *   body    → soul root
 *   legs    → outer root
 *   accessory → theme
 */

// ── Pixel helpers ──────────────────────────────────────────────────────────
// px(x,y,color): one 3×3 square at grid coord (x,y)
const px = (x, y, c) => ({ x, y, c })

// ── Skin tones ─────────────────────────────────────────────────────────────
const SKIN = ['#f5cba7','#e6a97e','#c67c52','#9b5523','#6b3a2a','#fde8d0']
const HAIR = ['#111111','#3b2314','#6b3a1f','#8b5e2e','#d4a017','#c0392b','#8e44ad','#1a7abf','#00c3a0','#e8e8e8']
const EYE  = ['#2c3e50','#1a7abf','#27ae60','#7d3c98','#e67e22','#c0392b','#00c3a0','#f0c060']

export const SKIN_TONES = SKIN
export const HAIR_COLORS = HAIR
export const EYE_COLORS  = EYE

// ── HEAD SHAPES ─────────────────────────────────────────────────────────────
// 8 head styles; default by LP root
const makeHead = (skinIdx) => {
  const s = SKIN[skinIdx % SKIN.length]
  return [
    // face block
    px(5,1,s), px(6,1,s), px(7,1,s), px(8,1,s), px(9,1,s), px(10,1,s),
    px(4,2,s), px(5,2,s), px(6,2,s), px(7,2,s), px(8,2,s), px(9,2,s), px(10,2,s), px(11,2,s),
    px(4,3,s), px(5,3,s), px(6,3,s), px(7,3,s), px(8,3,s), px(9,3,s), px(10,3,s), px(11,3,s),
    px(4,4,s), px(5,4,s), px(6,4,s), px(7,4,s), px(8,4,s), px(9,4,s), px(10,4,s), px(11,4,s),
    px(4,5,s), px(5,5,s), px(6,5,s), px(7,5,s), px(8,5,s), px(9,5,s), px(10,5,s), px(11,5,s),
    px(5,6,s), px(6,6,s), px(7,6,s), px(8,6,s), px(9,6,s), px(10,6,s),
    // neck
    px(7,7,s), px(8,7,s),
  ]
}

// 9 head shape variants (same base, different ear/chin pixels)
export const HEAD_STYLES = [
  { id:'h0', label:'Round',      pixels: (s) => makeHead(s) },
  { id:'h1', label:'Square',     pixels: (s) => [...makeHead(s), px(4,1,SKIN[s%6]), px(11,1,SKIN[s%6])] },
  { id:'h2', label:'Slim',       pixels: (s) => makeHead(s).filter(p => !(p.x===4||p.x===11)) },
  { id:'h3', label:'Wide',       pixels: (s) => [...makeHead(s), px(3,3,SKIN[s%6]), px(12,3,SKIN[s%6]), px(3,4,SKIN[s%6]), px(12,4,SKIN[s%6])] },
  { id:'h4', label:'Angular',    pixels: (s) => [...makeHead(s), px(4,1,SKIN[s%6]), px(11,1,SKIN[s%6]), px(3,2,SKIN[s%6]),  px(12,2,SKIN[s%6])] },
  { id:'h5', label:'Soft',       pixels: (s) => makeHead(s).filter(p => !((p.x===5||p.x===10)&&p.y===1)) },
  { id:'h6', label:'Long',       pixels: (s) => [...makeHead(s), px(7,7.5,SKIN[s%6]), px(8,7.5,SKIN[s%6])] },
  { id:'h7', label:'Broad',      pixels: (s) => [...makeHead(s), px(3,2,SKIN[s%6]), px(12,2,SKIN[s%6]), px(3,5,SKIN[s%6]), px(12,5,SKIN[s%6])] },
  { id:'h8', label:'Pointed',    pixels: (s) => [...makeHead(s), px(7,0,SKIN[s%6]), px(8,0,SKIN[s%6])] },
]

// ── HAIR STYLES ──────────────────────────────────────────────────────────────
const makeHair = (col) => {
  const c = HAIR[col % HAIR.length]
  return [
    px(5,0,c), px(6,0,c), px(7,0,c), px(8,0,c), px(9,0,c), px(10,0,c),
    px(4,1,c), px(5,1,c), px(10,1,c), px(11,1,c),
    px(4,2,c), px(11,2,c),
  ]
}

export const HAIR_STYLES = [
  { id:'hair0', label:'Short',    pixels:(c) => makeHair(c) },
  { id:'hair1', label:'Medium',   pixels:(c) => [...makeHair(c), px(4,3,HAIR[c%HAIR.length]), px(11,3,HAIR[c%HAIR.length])] },
  { id:'hair2', label:'Long',     pixels:(c) => [...makeHair(c),
    px(4,3,HAIR[c%10]), px(11,3,HAIR[c%10]), px(4,4,HAIR[c%10]), px(11,4,HAIR[c%10]), px(4,5,HAIR[c%10]), px(11,5,HAIR[c%10])] },
  { id:'hair3', label:'Mohawk',   pixels:(c) => [px(7,0,HAIR[c%10]), px(8,0,HAIR[c%10]), px(7,-1,HAIR[c%10]), px(8,-1,HAIR[c%10])] },
  { id:'hair4', label:'Bun',      pixels:(c) => [...makeHair(c), px(6,-1,HAIR[c%10]), px(7,-1,HAIR[c%10]), px(8,-1,HAIR[c%10]), px(9,-1,HAIR[c%10])] },
  { id:'hair5', label:'Spiky',    pixels:(c) => [
    px(5,0,HAIR[c%10]), px(7,-1,HAIR[c%10]), px(8,-1,HAIR[c%10]), px(10,0,HAIR[c%10]),
    px(4,1,HAIR[c%10]), px(11,1,HAIR[c%10]), px(4,2,HAIR[c%10]), px(11,2,HAIR[c%10]),
    px(6,-1,HAIR[c%10]), px(9,-1,HAIR[c%10]),
  ]},
  { id:'hair6', label:'Undercut', pixels:(c) => [
    px(4,1,HAIR[c%10]), px(5,1,HAIR[c%10]), px(9,1,HAIR[c%10]), px(10,1,HAIR[c%10]), px(11,1,HAIR[c%10]),
    px(4,2,HAIR[c%10]), px(11,2,HAIR[c%10]),
  ]},
  { id:'hair7', label:'Braids',   pixels:(c) => [...makeHair(c),
    px(4,3,HAIR[c%10]), px(11,3,HAIR[c%10]), px(4,4,HAIR[c%10]), px(11,4,HAIR[c%10]),
    px(4,5,HAIR[c%10]), px(11,5,HAIR[c%10]), px(4,6,HAIR[c%10]), px(11,6,HAIR[c%10]),
  ]},
  { id:'hair8', label:'None',     pixels:() => [] },
]

// ── EYES ─────────────────────────────────────────────────────────────────────
export const EYE_STYLES = [
  { id:'eye0', label:'Default',   pixels:(c) => [px(6,3,EYE[c%8]), px(9,3,EYE[c%8])] },
  { id:'eye1', label:'Wide',      pixels:(c) => [px(6,3,EYE[c%8]), px(7,3,EYE[c%8]), px(9,3,EYE[c%8]), px(10,3,EYE[c%8])] },
  { id:'eye2', label:'Narrow',    pixels:(c) => [px(6,3,'#111'), px(9,3,'#111'), px(6,3.3,EYE[c%8]), px(9,3.3,EYE[c%8])] },
  { id:'eye3', label:'Fierce',    pixels:(c) => [px(6,3,EYE[c%8]), px(9,3,EYE[c%8]), px(5,2.5,'#111'), px(11,2.5,'#111')] },
  { id:'eye4', label:'Star',      pixels:() => [px(6,3,'#f0c060'), px(9,3,'#f0c060')] },
  { id:'eye5', label:'Glitch',    pixels:() => [px(6,3,'#00e5cc'), px(9,3,'#f87171')] },
  { id:'eye6', label:'Void',      pixels:() => [px(6,3,'#111'), px(9,3,'#111')] },
  { id:'eye7', label:'Bright',    pixels:(c) => [px(6,3,'#fff'), px(9,3,'#fff'), px(6.3,3.3,EYE[c%8]), px(9.3,3.3,EYE[c%8])] },
  { id:'eye8', label:'Sleepy',    pixels:(c) => [px(6,3.4,EYE[c%8]), px(9,3.4,EYE[c%8])] },
]

// ── BODY / OUTFIT ─────────────────────────────────────────────────────────────
const OUTFIT_COLORS = ['#1a2a4a','#2d1b3d','#1a3a2a','#3a1a1a','#2a2a2a','#1a3a3a','#3a2a1a','#4a1a3a','#1a4a3a']

const makeBody = (col) => {
  const c = OUTFIT_COLORS[col % OUTFIT_COLORS.length]
  return [
    // shoulders
    px(4,8,c), px(5,8,c), px(6,8,c), px(7,8,c), px(8,8,c), px(9,8,c), px(10,8,c), px(11,8,c),
    // torso
    px(5,9,c), px(6,9,c), px(7,9,c), px(8,9,c), px(9,9,c), px(10,9,c),
    px(5,10,c),px(6,10,c),px(7,10,c),px(8,10,c),px(9,10,c),px(10,10,c),
    px(5,11,c),px(6,11,c),px(7,11,c),px(8,11,c),px(9,11,c),px(10,11,c),
    px(5,12,c),px(6,12,c),px(7,12,c),px(8,12,c),px(9,12,c),px(10,12,c),
    // arms
    px(3,9,c), px(4,9,c), px(11,9,c),  px(12,9,c),
    px(3,10,c),px(4,10,c),px(11,10,c), px(12,10,c),
    px(3,11,c),px(4,11,c),px(11,11,c), px(12,11,c),
    px(3,12,c),px(4,12,c),px(11,12,c), px(12,12,c),
    // waist
    px(5,13,c),px(6,13,c),px(7,13,c),px(8,13,c),px(9,13,c),px(10,13,c),
    px(5,14,c),px(6,14,c),px(7,14,c),px(8,14,c),px(9,14,c),px(10,14,c),
    px(5,15,c),px(6,15,c),px(7,15,c),px(8,15,c),px(9,15,c),px(10,15,c),
  ]
}

export const BODY_STYLES = [
  { id:'body0', label:'Tunic',      pixels:(c) => makeBody(c) },
  { id:'body1', label:'Armor',      pixels:(c) => [...makeBody(c),
    px(5,8,'#aaa'), px(10,8,'#aaa'), px(5,9,'#888'), px(10,9,'#888'),
  ]},
  { id:'body2', label:'Robe',       pixels:(c) => [...makeBody(c),
    px(4,14,OUTFIT_COLORS[c%9]), px(11,14,OUTFIT_COLORS[c%9]),
    px(4,15,OUTFIT_COLORS[c%9]), px(11,15,OUTFIT_COLORS[c%9]),
  ]},
  { id:'body3', label:'Jacket',     pixels:(c) => [...makeBody(c),
    px(7,8,'#222'), px(8,8,'#222'), px(7,9,'#222'), px(8,9,'#222'),
    px(7,10,'#222'), px(8,10,'#222'),
  ]},
  { id:'body4', label:'Cloak',      pixels:(c) => [...makeBody(c),
    px(3,8,OUTFIT_COLORS[c%9]), px(12,8,OUTFIT_COLORS[c%9]),
    px(2,9,OUTFIT_COLORS[c%9]), px(13,9,OUTFIT_COLORS[c%9]),
    px(2,10,OUTFIT_COLORS[c%9]),px(13,10,OUTFIT_COLORS[c%9]),
    px(2,11,OUTFIT_COLORS[c%9]),px(13,11,OUTFIT_COLORS[c%9]),
    px(2,12,OUTFIT_COLORS[c%9]),px(13,12,OUTFIT_COLORS[c%9]),
    px(2,13,OUTFIT_COLORS[c%9]),px(13,13,OUTFIT_COLORS[c%9]),
    px(2,14,OUTFIT_COLORS[c%9]),px(13,14,OUTFIT_COLORS[c%9]),
  ]},
  { id:'body5', label:'Vest',       pixels:(c) => [...makeBody(c),
    px(7,9,'#555'), px(8,9,'#555'), px(7,10,'#555'), px(8,10,'#555'),
  ]},
  { id:'body6', label:'Monk',       pixels:(c) => [...makeBody(c).map(p => ({...p, c:'#4a3a1a'}))  ] },
  { id:'body7', label:'Commander',  pixels:(c) => [...makeBody(c),
    px(5,8,'#c0c0c0'), px(6,8,'#c0c0c0'), px(9,8,'#c0c0c0'), px(10,8,'#c0c0c0'),
    px(7,9,'#f0c060'), px(8,9,'#f0c060'),
  ]},
  { id:'body8', label:'Cyberpunk',  pixels:(c) => [...makeBody(c).map(p => ({...p, c:'#111'})),
    px(6,9,'#00e5cc'), px(9,9,'#00e5cc'), px(6,11,'#00e5cc'), px(9,11,'#00e5cc'),
  ]},
]

// ── LEGS ──────────────────────────────────────────────────────────────────────
const LEG_COLORS = ['#1a1a2e','#2e1a1a','#1a2e1a','#2e2e1a','#2e1a2e','#1a2e2e','#111','#2a2a2a','#3a3a1a']

export const LEG_STYLES = [
  { id:'legs0', label:'Pants',   pixels:(c) => {
    const lc = LEG_COLORS[c%9]
    return [
      px(5,16,lc),px(6,16,lc),px(7,16,lc),px(8,16,lc),px(9,16,lc),px(10,16,lc),
      px(5,17,lc),px(6,17,lc),px(7,17,lc),px(8,17,lc),px(9,17,lc),px(10,17,lc),
      px(5,18,lc),px(6,18,lc),  px(9,18,lc),px(10,18,lc),
      px(5,19,lc),px(6,19,lc),  px(9,19,lc),px(10,19,lc),
      px(5,20,lc),px(6,20,lc),  px(9,20,lc),px(10,20,lc),
      px(5,21,lc),px(6,21,lc),  px(9,21,lc),px(10,21,lc),
      px(5,22,lc),px(6,22,lc),  px(9,22,lc),px(10,22,lc),
    ]
  }},
  { id:'legs1', label:'Shorts',  pixels:(c) => {
    const lc = LEG_COLORS[c%9]; const sc = SKIN[0]
    return [
      px(5,16,lc),px(6,16,lc),px(7,16,lc),px(8,16,lc),px(9,16,lc),px(10,16,lc),
      px(5,17,lc),px(6,17,lc),px(9,17,lc),px(10,17,lc),
      px(5,18,sc),px(6,18,sc),  px(9,18,sc),px(10,18,sc),
      px(5,19,sc),px(6,19,sc),  px(9,19,sc),px(10,19,sc),
      px(5,20,sc),px(6,20,sc),  px(9,20,sc),px(10,20,sc),
    ]
  }},
  { id:'legs2', label:'Robe',    pixels:(c) => {
    const lc = OUTFIT_COLORS[c%9]
    return [
      px(4,16,lc),px(5,16,lc),px(6,16,lc),px(7,16,lc),px(8,16,lc),px(9,16,lc),px(10,16,lc),px(11,16,lc),
      px(4,17,lc),px(5,17,lc),px(6,17,lc),px(7,17,lc),px(8,17,lc),px(9,17,lc),px(10,17,lc),px(11,17,lc),
      px(4,18,lc),px(5,18,lc),px(6,18,lc),px(7,18,lc),px(8,18,lc),px(9,18,lc),px(10,18,lc),px(11,18,lc),
      px(4,19,lc),px(5,19,lc),px(6,19,lc),px(7,19,lc),px(8,19,lc),px(9,19,lc),px(10,19,lc),px(11,19,lc),
      px(4,20,lc),px(5,20,lc),px(6,20,lc),px(7,20,lc),px(8,20,lc),px(9,20,lc),px(10,20,lc),px(11,20,lc),
    ]
  }},
  { id:'legs3', label:'Boots',   pixels:(c) => {
    const lc = LEG_COLORS[c%9]; const bc = '#222'
    return [
      px(5,16,lc),px(6,16,lc),px(7,16,lc),px(8,16,lc),px(9,16,lc),px(10,16,lc),
      px(5,17,lc),px(6,17,lc),px(9,17,lc),px(10,17,lc),
      px(5,18,lc),px(6,18,lc),  px(9,18,lc),px(10,18,lc),
      px(5,19,lc),px(6,19,lc),  px(9,19,lc),px(10,19,lc),
      px(4,20,bc),px(5,20,bc),px(6,20,bc),  px(9,20,bc),px(10,20,bc),px(11,20,bc),
      px(4,21,bc),px(5,21,bc),px(6,21,bc),  px(9,21,bc),px(10,21,bc),px(11,21,bc),
      px(4,22,bc),px(5,22,bc),px(6,22,bc),  px(9,22,bc),px(10,22,bc),px(11,22,bc),
    ]
  }},
  { id:'legs4', label:'Armor',   pixels:() => {
    const lc = '#888'
    return [
      px(5,16,lc),px(6,16,lc),px(7,16,lc),px(8,16,lc),px(9,16,lc),px(10,16,lc),
      px(5,17,lc),px(6,17,lc),px(9,17,lc),px(10,17,lc),
      px(5,18,lc),px(6,18,lc),  px(9,18,lc),px(10,18,lc),
      px(5,19,'#aaa'),px(6,19,'#aaa'),  px(9,19,'#aaa'),px(10,19,'#aaa'),
      px(5,20,lc),px(6,20,lc),  px(9,20,lc),px(10,20,lc),
      px(5,21,lc),px(6,21,lc),  px(9,21,lc),px(10,21,lc),
      px(4,22,'#555'),px(5,22,'#555'),px(6,22,'#555'),  px(9,22,'#555'),px(10,22,'#555'),px(11,22,'#555'),
    ]
  }},
]

// ── HEADGEAR (crown, hat, etc. — renders on TOP of head) ─────────────────────
export const HEADGEAR_STYLES = [
  { id:'hg0',  label:'None',   pixels:() => [] },
  { id:'hg1',  label:'Crown',  pixels:() => [
    px(5,-1,'#f0c060'), px(7,-1,'#f0c060'), px(9,-1,'#f0c060'), px(11,-1,'#f0c060'),
    px(5,0,'#f0c060'), px(6,0,'#f0c060'), px(7,0,'#f0c060'), px(8,0,'#f0c060'), px(9,0,'#f0c060'), px(10,0,'#f0c060'), px(11,0,'#f0c060'),
  ]},
  { id:'hg2',  label:'Hood',   pixels:() => [
    px(4,0,'#2a2a2a'), px(5,0,'#2a2a2a'), px(6,0,'#2a2a2a'), px(7,0,'#2a2a2a'), px(8,0,'#2a2a2a'), px(9,0,'#2a2a2a'), px(10,0,'#2a2a2a'), px(11,0,'#2a2a2a'),
    px(3,1,'#2a2a2a'), px(4,1,'#2a2a2a'), px(11,1,'#2a2a2a'), px(12,1,'#2a2a2a'),
    px(3,2,'#2a2a2a'), px(12,2,'#2a2a2a'), px(3,3,'#2a2a2a'), px(12,3,'#2a2a2a'),
    px(3,4,'#2a2a2a'), px(12,4,'#2a2a2a'), px(3,5,'#2a2a2a'), px(12,5,'#2a2a2a'),
  ]},
  { id:'hg3',  label:'Hat',    pixels:() => [
    px(5,0,'#8b4513'), px(6,0,'#8b4513'), px(7,0,'#8b4513'), px(8,0,'#8b4513'), px(9,0,'#8b4513'), px(10,0,'#8b4513'),
    px(6,-1,'#8b4513'), px(7,-1,'#8b4513'), px(8,-1,'#8b4513'), px(9,-1,'#8b4513'),
    px(6,-2,'#8b4513'), px(7,-2,'#8b4513'), px(8,-2,'#8b4513'), px(9,-2,'#8b4513'),
    px(4,0.3,'#8b4513'), px(11,0.3,'#8b4513'),
  ]},
  { id:'hg4',  label:'Halo',   pixels:() => [
    px(5,-1,'#f0c060'), px(6,-1,'#f0c060'), px(7,-1,'#f0c060'), px(8,-1,'#f0c060'), px(9,-1,'#f0c060'), px(10,-1,'#f0c060'),
  ]},
  { id:'hg5',  label:'Horns',  pixels:() => [
    px(5,-1,'#c0392b'), px(5,-2,'#c0392b'), px(10,-1,'#c0392b'), px(10,-2,'#c0392b'),
  ]},
  { id:'hg6',  label:'Mask',   pixels:() => [
    px(5,3,'#00e5cc'), px(6,3,'#00e5cc'), px(7,3,'#00e5cc'), px(8,3,'#00e5cc'), px(9,3,'#00e5cc'), px(10,3,'#00e5cc'),
    px(5,4,'#00e5cc'), px(10,4,'#00e5cc'),
    px(5,5,'#00e5cc'), px(6,5,'#00e5cc'), px(7,5,'#00e5cc'), px(8,5,'#00e5cc'), px(9,5,'#00e5cc'), px(10,5,'#00e5cc'),
  ]},
  { id:'hg7',  label:'Glasses',pixels:() => [
    px(5,3,'#888'), px(6,3,'#888'), px(7,3,'#888'), px(9,3,'#888'), px(10,3,'#888'), px(11,3,'#888'), px(8,3,'#555'),
  ]},
  { id:'hg8',  label:'Antenna',pixels:() => [
    px(8,-1,'#00e5cc'), px(8,-2,'#00e5cc'), px(8,-3,'#f0c060'),
  ]},
]

// ── ACCESSORIES (held items — renders to the SIDE of character) ───────────────
export const ACCESSORY_STYLES = [
  { id:'acc0', label:'None',      pixels:() => [] },
  { id:'acc1', label:'Sword',     pixels:() => [
    px(14,10,'#d1d5db'), px(14,11,'#d1d5db'), px(14,12,'#9ca3af'), px(14,13,'#9ca3af'), px(14,14,'#9ca3af'), px(14,15,'#9ca3af'),
    px(13,9,'#a16207'), px(13,10,'#a16207'), px(13,11,'#a16207'), px(13,12,'#a16207'),
    px(14,8,'#a16207'),
  ]},
  { id:'acc2', label:'Shield',    pixels:() => [
    px(14,10,'#6b7280'), px(14,11,'#6b7280'), px(14,12,'#6b7280'), px(14,13,'#6b7280'), px(14,14,'#6b7280'),
    px(13,10,'#374151'), px(13,11,'#374151'), px(13,12,'#374151'), px(13,13,'#374151'), px(13,14,'#374151'),
  ]},
  { id:'acc3', label:'Staff',     pixels:() => [
    px(14,8,'#8b5e34'), px(14,9,'#8b5e34'), px(14,10,'#8b5e34'), px(14,11,'#8b5e34'), px(14,12,'#8b5e34'), px(14,13,'#8b5e34'), px(14,14,'#8b5e34'), px(14,15,'#8b5e34'),
    px(14,7,'#7c3aed'),
  ]},
  { id:'acc4', label:'Tome',      pixels:() => [
    px(13,10,'#5b3b2a'), px(13,11,'#5b3b2a'), px(14,10,'#5b3b2a'), px(14,11,'#5b3b2a'),
    px(13,12,'#d6b37a'), px(13,13,'#d6b37a'), px(14,12,'#d6b37a'), px(14,13,'#d6b37a'),
  ]},
  { id:'acc5', label:'Dagger',    pixels:() => [
    px(14,10,'#d1d5db'), px(14,11,'#d1d5db'), px(14,12,'#7c4f27'), px(14,13,'#7c4f27'), px(14,14,'#7c4f27'),
    px(13,10,'#d1d5db'),
  ]},
  { id:'acc6', label:'Bow',       pixels:() => [
    px(14,8,'#8b5e34'), px(14,9,'#8b5e34'), px(14,10,'#8b5e34'), px(14,11,'#8b5e34'), px(14,12,'#8b5e34'), px(14,13,'#8b5e34'), px(14,14,'#8b5e34'), px(14,15,'#8b5e34'),
    px(13,9,'#d1d5db'), px(13,10,'#d1d5db'), px(13,11,'#d1d5db'),
  ]},
  { id:'acc7', label:'Orb',       pixels:() => [
    px(14,8,'#f59e0b'), px(13,8,'#f59e0b'), px(14,9,'#f59e0b'), px(13,9,'#f59e0b'),
    px(14,10,'#6b4a2b'), px(14,11,'#6b4a2b'), px(14,12,'#6b4a2b'), px(14,13,'#6b4a2b'),
  ]},
  { id:'acc8', label:'Wand',      pixels:() => [
    px(14,9,'#334155'), px(14,10,'#334155'), px(14,11,'#334155'), px(14,12,'#334155'), px(14,13,'#334155'), px(14,14,'#334155'),
    px(14,8,'#22d3ee'), px(13,8,'#22d3ee'), px(15,8,'#22d3ee'), px(14,7,'#22d3ee'),
  ]},
]

// ── AURA / BACKGROUND GLOW ───────────────────────────────────────────────────
export const AURA_COLORS = [
  { id:'aura0', label:'None',      color: 'transparent' },
  { id:'aura1', label:'Teal',      color: 'rgba(0,229,180,0.15)' },
  { id:'aura2', label:'Gold',      color: 'rgba(240,192,96,0.15)' },
  { id:'aura3', label:'Crimson',   color: 'rgba(220,38,38,0.15)' },
  { id:'aura4', label:'Violet',    color: 'rgba(139,92,246,0.15)' },
  { id:'aura5', label:'Sage',      color: 'rgba(74,222,128,0.15)' },
  { id:'aura6', label:'Amber',     color: 'rgba(251,191,36,0.12)' },
  { id:'aura7', label:'Ice',       color: 'rgba(147,197,253,0.15)' },
  { id:'aura8', label:'Void',      color: 'rgba(0,0,0,0.6)' },
]

// ── Default derivation from player numbers ───────────────────────────────────
/**
 * Given playerData, returns a default avatar config.
 * Numbers map modulo to part index so every character gets a unique starting point.
 */
export function deriveDefaultAvatar(playerData) {
  const lp  = playerData?.lp?.root  || 1
  const cl  = playerData?.cl?.root  || 1
  const ex  = playerData?.ex?.root  || 1
  const so  = playerData?.so?.root  || 1
  const ou  = playerData?.ou?.root  || 1
  const ac  = playerData?.ac?.root  || 1

  // Skin tone: life path influences complexion (reduced to 0-5)
  const skinIdx = ((lp - 1) % SKIN.length + SKIN.length) % SKIN.length

  return {
    headStyle:   (lp - 1) % HEAD_STYLES.length,
    hairStyle:   (cl - 1) % HAIR_STYLES.length,
    hairColor:   (ex - 1) % HAIR.length,
    eyeStyle:    (ex - 1) % EYE_STYLES.length,
    eyeColor:    (so - 1) % EYE.length,
    bodyStyle:   (so - 1) % BODY_STYLES.length,
    legStyle:    (ou - 1) % LEG_STYLES.length,
    headgear:    0,
    accessory:   (ac - 1) % ACCESSORY_STYLES.length,
    aura:        (cl - 1) % AURA_COLORS.length,
    skinTone:    skinIdx,
    catEars:     false,
    gender:      'male',
  }
}

// ── Avatar → pixel list (for rendering) ──────────────────────────────────────
export function buildAvatarPixels(config) {
  const {
    headStyle, hairStyle, hairColor, eyeStyle, eyeColor,
    bodyStyle, legStyle, headgear, accessory, skinTone, catEars,
  } = config

  const catEarPixels = catEars
    ? [
        px(5,-1,HAIR[(hairColor || 0) % HAIR.length]),
        px(10,-1,HAIR[(hairColor || 0) % HAIR.length]),
        px(5,-2,HAIR[(hairColor || 0) % HAIR.length]),
        px(10,-2,HAIR[(hairColor || 0) % HAIR.length]),
      ]
    : []

  return [
    ...BODY_STYLES[bodyStyle]?.pixels(bodyStyle)   || [],
    ...LEG_STYLES[legStyle]?.pixels(legStyle)       || [],
    ...HEAD_STYLES[headStyle]?.pixels(skinTone)     || [],
    ...HAIR_STYLES[hairStyle]?.pixels(hairColor)    || [],
    ...HEADGEAR_STYLES[headgear]?.pixels()          || [],
    ...catEarPixels,
    ...EYE_STYLES[eyeStyle]?.pixels(eyeColor)       || [],
    ...ACCESSORY_STYLES[accessory]?.pixels()        || [],
  ]
}

// ── Storage key ──────────────────────────────────────────────────────────────
export const AVATAR_KEY = 'scl_avatar_config'
export const AVATAR_OWNER_KEY = 'scl_avatar_owner'

export function avatarOwnerSignature(playerData) {
  const name = String(playerData?.name || '').trim().toLowerCase()
  const m = String(playerData?.m || '')
  const d = String(playerData?.d || '')
  const y = String(playerData?.y || '')
  return `${name}|${m}|${d}|${y}`
}

export function loadAvatar() {
  try { return JSON.parse(localStorage.getItem(AVATAR_KEY)) || null } catch { return null }
}

export function saveAvatar(config, playerData = null) {
  try {
    localStorage.setItem(AVATAR_KEY, JSON.stringify(config))
    if (playerData) {
      localStorage.setItem(AVATAR_OWNER_KEY, avatarOwnerSignature(playerData))
    }
  } catch { /* quota */ }
}
