/**
 * SSC — calculator.js
 * Number interpretations, calculation logic, and results rendering.
 * Depends on: nothing (standalone)
 * Required by: app.js (window.calculateReading, window.buildFreqChart)
 */

/* ═══════════════════════════════════════════════════════════════
   ROOT INTERPRETATIONS — per frequency, per number (1–9, 11, 22, 33, 44)
   Keys used: name, essence, lp, ex, soul, outer, ach, theme
═══════════════════════════════════════════════════════════════ */

const ROOT = {
  1: {
    name: 'The Initiator', essence: 'Original Creative Force',
    lp:    'You are here to learn bold self-direction — to move first, pioneer new paths, and lead without waiting for permission. The simulation places you at the beginning of cycles and tests whether you will step forward or shrink back.',
    ex:    'You naturally carry leadership, pioneering instinct, and original thinking. You were made to start things without prompting, blaze new trails, and inspire others through confident action.',
    soul:  'Deep within, you crave autonomy, recognition, and the freedom to lead. Your soul yearns to be the initiator — the original spark that sets things in motion.',
    outer: 'The world sees you as confident, self-directed, and independent — a natural leader who moves forward without needing permission or approval.',
    ach:   'Your achievement energy centres on initiation and leadership. You accomplish most powerfully when you go first and forge new paths without hesitation.',
    theme: 'The overarching theme of your life involves initiating new cycles, developing independence, and learning that self-reliance is a gift — not a burden.',
  },
  2: {
    name: 'The Harmonizer', essence: 'Bridge & Balance',
    lp:    'You are here to master connection — to harmonize opposites, bridge divides, and find unity in duality. Every relationship the simulation brings is a mirror of your own inner polarities.',
    ex:    'You naturally carry diplomatic awareness, relational sensitivity, and dual-perspective vision. You see all sides, bring people together, and create peace from conflict.',
    soul:  'Deep within, you crave harmony, partnership, and the experience of being truly seen. Your soul yearns to belong — to meet and be met in genuine union.',
    outer: 'The world sees you as gentle, empathetic, and easy to trust — a natural mediator and peacemaker who brings calm to even the most charged situations.',
    ach:   'Your achievement energy centres on collaboration and partnership. You accomplish most powerfully through relationship and cooperative effort.',
    theme: 'The overarching theme of your life involves mastering relationship, learning to receive as well as give, and discovering wholeness through conscious connection.',
  },
  3: {
    name: 'The Creator', essence: 'Expression & Joy',
    lp:    'You are here to learn authentic self-expression — to channel creative force without performing for approval. The simulation blocks creativity until you stop seeking validation and start expressing truth.',
    ex:    'You naturally carry creative flow, expressiveness, and joyful energy. You communicate beautifully, uplift others naturally, and inspire through genuine authenticity.',
    soul:  'Deep within, you crave expression, joy, and creative freedom. Your soul yearns to be heard — to share its unique voice without apology or diminishment.',
    outer: 'The world sees you as charming, expressive, and magnetic — a natural communicator whose presence uplifts any room and inspires others to come alive.',
    ach:   'Your achievement energy centres on creative expression. You accomplish most powerfully when you allow authentic creativity to lead, free from the need for applause.',
    theme: 'The overarching theme of your life involves discovering and honouring your unique voice, finding joy through creation, and learning to complete what you begin.',
  },
  4: {
    name: 'The Builder', essence: 'Structure & Stability',
    lp:    'You are here to master discipline, order, and patient building. The simulation tests your relationship with structure — too rigid and it shatters you; too loose and chaos forces discipline upon you.',
    ex:    'You naturally carry organizational instinct, systematic thinking, and grounded presence. You create order from chaos and manifest through disciplined, sustained effort.',
    soul:  'Deep within, you crave stability, security, and the satisfaction of building something solid and lasting. Your soul yearns to create foundations that endure.',
    outer: 'The world sees you as reliable, methodical, and dependable — the one others count on to get things done and keep everything steady.',
    ach:   'Your achievement energy centres on building and consolidation. You accomplish most powerfully through sustained, disciplined effort compounded over time.',
    theme: "The overarching theme of your life involves learning the sacred nature of limitation, discovering that structure creates freedom, and building foundations that serve those who come after.",
  },
  5: {
    name: 'The Explorer', essence: 'Freedom Through Embodiment',
    lp:    'You are the central vessel — the interface between spirit and matter. Your lesson is full presence in the midst of constant change. The simulation provides endless variety to test whether you stay present or flee.',
    ex:    'You naturally carry adaptability, present-moment awareness, and dynamic responsiveness. You are the interface in the system — embodying freedom through presence, not escape.',
    soul:  'Deep within, you crave freedom, variety, and full sensory experience. Your soul yearns to explore — to taste life completely without being caged.',
    outer: 'The world sees you as adventurous, dynamic, and magnetically alive — someone who inhabits the present moment in a way others aspire to.',
    ach:   'Your achievement energy centres on adaptability and embodied presence. You accomplish most powerfully when you stay fully here and let each moment be enough.',
    theme: 'The overarching theme of your life involves mastering presence, discovering that true freedom is found within rather than through escape, and becoming the living interface between worlds.',
  },
  6: {
    name: 'The Nurturer', essence: 'Service & Responsibility',
    lp:    'You are here to learn that love requires boundaries — that serving others begins with serving yourself. The simulation places you in caretaking roles and tests whether you enable or empower.',
    ex:    'You naturally carry nurturing instinct, compassionate awareness, and integration ability. You are the integrator — nothing completes until it reaches you and becomes sustainable.',
    soul:  'Deep within, you crave love, belonging, and the fulfilment of being genuinely needed. Your soul yearns to nurture — to create a world where everyone feels cared for.',
    outer: 'The world sees you as warm, responsible, and caring — someone who shows up reliably and creates environments of safety and unconditional support.',
    ach:   'Your achievement energy centres on service and care. You accomplish most powerfully when you serve from wholeness rather than self-sacrifice.',
    theme: 'The overarching theme of your life involves mastering the balance between self-care and service, learning that boundaries are an act of love, and becoming a sustainable source of nurturance.',
  },
  7: {
    name: 'The Seeker', essence: 'Wisdom & Inner Knowing',
    lp:    'You are here to seek truth through direct experience — not merely intellectual knowing. The simulation enforces solitude until you stop looking to external authorities and begin trusting your own inner oracle.',
    ex:    'You naturally carry an analytical mind, introspective nature, and deep inner authority. You see beneath the surface and teach wisdom only after you have lived it.',
    soul:  'Deep within, you crave truth, understanding, and spiritual depth. Your soul yearns to pierce through illusion — to touch what is actually real beneath all the noise.',
    outer: 'The world sees you as introspective, intelligent, and quietly compelling — someone who observes carefully and carries a stillness others find deeply reassuring.',
    ach:   'Your achievement energy centres on investigation and inner mastery. You accomplish most powerfully when you trust your own knowing above any external validation.',
    theme: 'The overarching theme of your life involves the sacred quest for truth, learning to embody wisdom rather than merely accumulate knowledge, and finding the divine in the everyday.',
  },
  8: {
    name: 'The Power Master', essence: 'Authority & Manifestation',
    lp:    'You are here to master yourself — to discover that true power is self-mastery, not control of others. The simulation will make your temptations inescapable until you demonstrate dominion over impulse.',
    ex:    'You naturally carry authority, manifestation ability, and achievement drive. You demonstrate power-with rather than power-over, and you lead through earned respect.',
    soul:  'Deep within, you crave mastery, influence, and the satisfaction of tangible accomplishment. Your soul yearns to build something that proves what disciplined human will can achieve.',
    outer: 'The world sees you as authoritative, ambitious, and capable — someone who commands respect naturally and consistently delivers results.',
    ach:   'Your achievement energy centres on mastery and manifestation. You accomplish most powerfully when discipline, vision, and integrity are working in alignment.',
    theme: 'The overarching theme of your life involves learning the proper use of power, discovering that self-mastery precedes all other authority, and proving that material success is a spiritual test.',
  },
  9: {
    name: 'The Humanitarian', essence: 'Completion & Universal Service',
    lp:    'You are here to complete cycles with grace — to release what is finished and serve the greater good. The simulation brings repeated endings; your lesson is letting go with love.',
    ex:    'You naturally carry compassionate awareness, universal perspective, and completion orientation. You facilitate endings and serve collective evolution through wisdom freely shared.',
    soul:  'Deep within, you crave meaning, contribution, and the sense of having served something larger than yourself. Your soul yearns to give — to leave the world measurably better.',
    outer: 'The world sees you as compassionate, idealistic, and deeply wise — someone who holds all of humanity in their heart with genuine tenderness.',
    ach:   'Your achievement energy centres on completion and service to the whole. You accomplish most powerfully when you release attachment to outcomes and give freely.',
    theme: 'The overarching theme of your life involves learning graceful release, completing cycles consciously, and contributing your accumulated wisdom to collective evolution.',
  },
  11: {
    name: 'The Illuminated Bridge', essence: 'Master Channel Between Worlds',
    lp:    'A master number — your lesson is to channel higher wisdom while remaining grounded in human experience. Heightened sensitivity is your gift; rigorous daily grounding and energetic protection are its requirements.',
    ex:    'A master expression — you carry gateway frequency. You are literally wired to channel higher consciousness into material reality. Your sensitivity is a tool, not a burden.',
    soul:  'At the soul level, you carry an ancient yearning to bridge worlds — to bring something sacred through from the unseen into lived human experience.',
    outer: 'The world sees you as inspiring, otherworldly, and deeply intuitive — your presence seems to carry a light others feel but cannot name.',
    ach:   'Your achievement is in spiritual illumination and practical inspiration. You accomplish by grounding divine insight into real-world service that actually helps people.',
    theme: 'The overarching theme of your life is being a beacon — receiving higher frequencies and translating them faithfully into guidance that uplifts those around you.',
  },
  22: {
    name: 'The Master Builder', essence: 'Cosmic Architect of Material Reality',
    lp:    'A master number — you are here to manifest spiritual vision into lasting material form. Your mission is multi-generational. You will not see completion in this lifetime — build anyway.',
    ex:    'A master expression — you see what could be built and possess the strategic genius to make it real across generations. Patience and delegation are your essential disciplines.',
    soul:  'At the soul level, you carry a profound drive to create something that outlasts you — structures, movements, or systems that alter the course of what comes after.',
    outer: 'The world sees you as visionary, disciplined, and built for achievement at a scale most people cannot yet imagine.',
    ach:   'Your achievement is in monumental, lasting creation. You accomplish at a generational scale — your work serves long after your personal involvement ends.',
    theme: 'The overarching theme of your life is grounding cosmic vision into enduring material form — becoming the living bridge between the ideal and the real.',
  },
  33: {
    name: 'The Master Teacher', essence: 'Unconditional Love & Creative Service',
    lp:    'A master number — you embody unconditional love and creative service. You teach through beauty and heal through compassion. Your shadow is martyrdom; your master lesson is that self-care is not optional.',
    ex:    'A master expression — you carry double creative energy channelled into healing service. You teach through art and embody compassion as a lived demonstration.',
    soul:  'At the soul level, you carry the deepest possible longing to love without limit — to be a vessel through which healing moves into every life it touches.',
    outer: 'The world sees you as profoundly compassionate, creatively gifted, and spiritually seasoned — your presence alone carries a quality of healing others feel immediately.',
    ach:   'Your achievement is in teaching and healing through creative love. You accomplish by embodying unconditional compassion while maintaining the wholeness that makes it sustainable.',
    theme: 'The overarching theme of your life is learning to love sustainably — to be a channel for universal love without losing yourself in the current you are carrying.',
  },
  44: {
    name: 'The Master Manifestor', essence: 'Ultimate Material Mastery',
    lp:    'A master number — you carry supreme building and manifestation power. You create structures designed to stand for centuries. Your mission exceeds your lifetime; build knowing others will complete it.',
    ex:    'A master expression — you manifest what others call impossible and create systems built to outlast you. Legacy over ego is your north star.',
    soul:  'At the soul level, you carry an unshakeable drive to build — to demonstrate that human will, properly disciplined, can bring anything from spirit into permanent material form.',
    outer: 'The world sees you as extraordinarily capable, intensely focused, and built for achievement at a scale few people can comprehend.',
    ach:   'Your achievement is in century-level building. You accomplish by constructing systems and structures designed to function and serve long after your direct involvement ends.',
    theme: 'The overarching theme of your life is demonstrating that material mastery and spiritual integrity are not opposites — they are the same act performed at full power.',
  }
};

/* ═══════════════════════════════════════════════════════════════
   LIFE CALLING INTERPRETATIONS — name, essence, summary
═══════════════════════════════════════════════════════════════ */

const CALLING = {
  1:  { name: 'The Pioneer Leader',        essence: 'Initiating New Realities',        summary: 'Your mission is to go first — to initiate new realities through bold, authentic leadership. The simulation places you at the beginning of movements and innovations so others can follow your trail.' },
  2:  { name: 'The Sacred Harmonizer',     essence: 'Bridging Divides Through Unity',  summary: 'Your mission is to bridge divides and create unity from separation. You are the relational glue — positioned exactly where opposites meet and collaboration is the only path forward.' },
  3:  { name: 'The Creative Catalyst',     essence: 'Inspiring Through Expression',    summary: 'Your mission is to inspire through authentic creative expression — to translate the unseen into seen and the felt into expressed.' },
  4:  { name: 'The Sacred Architect',      essence: 'Building Foundations That Last',  summary: 'Your mission is to build systems, structures, and foundations that outlast you. You create the containers others inhabit — transforming chaos into order.' },
  5:  { name: 'The Freedom Embodier',      essence: 'Teaching Presence Through Being', summary: 'Your mission is to experience fully and teach freedom through embodiment. You are the pivot point — demonstrating that true freedom is being completely here.' },
  6:  { name: 'The Compassionate Guardian',essence: 'Nurturing from Wholeness',        summary: 'Your mission is to nurture in balanced, sustainable ways. You are the integrator — ensuring growth becomes grounded in reality.' },
  7:  { name: 'The Mystic Teacher',        essence: 'Revealing Truth Through Wisdom',  summary: 'Your mission is to seek truth and share wisdom born from direct experience.' },
  8:  { name: 'The Power Master',          essence: 'Wielding Authority With Wisdom',  summary: 'Your mission is to master power and demonstrate responsible authority.' },
  9:  { name: 'The World Server',          essence: 'Completing Cycles With Grace',    summary: 'Your mission is to complete cycles and serve humanity.' },
  11: { name: 'The Illuminated Channel',   essence: 'Bridging Spirit and Matter',      summary: 'A master calling — your mission is to bridge spiritual and material realms.' },
  22: { name: 'The Master Builder',        essence: 'Manifesting Grand Visions',       summary: 'A master calling — your mission is to build at the largest scale.' },
  33: { name: 'The Master Healer',         essence: 'Embodying Compassionate Service', summary: 'A master calling — your mission is to heal through unconditional love.' },
  44: { name: 'The Master Organizer',      essence: 'Creating Universal Systems',      summary: 'A master calling — your mission is to organize chaos at the grandest scale.' },
  55: { name: 'The Master Liberator',      essence: 'Embodying Total Freedom',          summary: 'A master calling — your mission is to become freedom itself so completely that others remember they can be free in your presence. You are not here to seek liberation — you are here to be it.' },
  66: { name: 'The Master Heart Healer',   essence: 'Loving at Full Capacity',          summary: 'A master calling — your mission is to carry and transmit double heart frequency. You hold enough love to heal a room, a lineage, a generation — but the work is learning to love cleanly, without martyrdom.' },
  77: { name: 'The Master Mystic',         essence: 'Perceiving the Code of Reality',   summary: 'A master calling — your mission is to perceive what others cannot and give it voice. Your connection to universal intelligence is not metaphorical. You know what you were never taught. The work is complete trust in your own perception.' },
  88: { name: 'The Master of Power',       essence: 'Wielding Absolute Integrity',      summary: 'A master calling — your mission is to carry double power frequency and demonstrate that true authority and complete integrity are the same thing. You manifest at a scale that reshapes material reality.' },
  99: { name: 'The Universal Completer',   essence: 'Completing What Cannot Be Left',   summary: 'A master calling — your mission is to close loops so old they predate your awareness of them. You carry the frequency of absolute completion — the final exhale of cycles that have been running for lifetimes.' }
};

/* ═══════════════════════════════════════════════════════════════
   FREQUENCY METADATA — labels and role descriptions
═══════════════════════════════════════════════════════════════ */

const FREQ_LABELS = ['Life Path','Expression','Life Calling','Soul','Outer','Achievement','Theme'];
const FREQ_ROLES  = ['What You Learn','What You Carry','Your Mission','Your Inner Desire','Your Public Persona','How You Accomplish','Your Life Curriculum'];
const FREQ_DESC = {
  1:  'Independence, leadership, originality. You are here to forge your own path.',
  2:  'Harmony, cooperation, sensitivity. You are here to build bridges between worlds.',
  3:  'Creativity, expression, joy. You are here to bring beauty and communication into being.',
  4:  'Structure, discipline, foundation. You are here to build something that lasts.',
  5:  'Freedom, change, versatility. You are here to experience and catalyse transformation.',
  6:  'Love, responsibility, nurturing. You are here to care, heal, and create beauty.',
  7:  'Wisdom, introspection, mystery. You are here to seek truth beneath appearances.',
  8:  'Power, ambition, manifestation. You are here to master the material and leave a legacy.',
  9:  'Compassion, completion, universality. You are here to serve the greater whole.',
  11: 'Illumination, inspiration, spiritual sensitivity. A master number — heightened purpose.',
  22: 'Master builder, visionary pragmatism. A master number — world-scale creation.',
  33: 'Master teacher, compassionate wisdom. A master number — the highest service.'
};

// Maps each frequency index to its ROOT key
// numbers array order: [lp, exp, calling, soul, outer, achieve, theme]
const FREQ_ROOT_KEYS = ['lp', 'ex', null, 'soul', 'outer', 'ach', 'theme'];

/* ═══════════════════════════════════════════════════════════════
   CALCULATION FUNCTIONS
═══════════════════════════════════════════════════════════════ */

function reduceNumber(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  }
  return n;
}

const LETTER_VALUES = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:11,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:22,W:5,X:6,Y:7,Z:8
};
const VOWELS = new Set(['A','E','I','O','U','Y']);

function nameToValues(name) {
  return name.toUpperCase().replace(/[^A-Z]/g,'').split('');
}

function calcLifePath(m, d, y) {
  const sum = [...String(m), ...String(d), ...String(y)].reduce((a,c) => a + parseInt(c), 0);
  return reduceNumber(sum);
}

function calcExpression(full) {
  // Reduce each name separately, then sum
  return reduceNumber(
    full.trim().split(/\s+/).reduce((total, word) => {
      const wordSum = word.toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a,c) => a + (LETTER_VALUES[c]||0), 0);
      return total + reduceNumber(wordSum);
    }, 0)
  );
}

function calcSoul(full) {
  const sum = nameToValues(full).filter(c => VOWELS.has(c)).reduce((a,c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNumber(sum);
}

function calcOuter(full) {
  const sum = nameToValues(full).filter(c => !VOWELS.has(c)).reduce((a,c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNumber(sum);
}

function calculateReading() {
  const month = parseInt(document.getElementById('calc-month').value);
  const day   = parseInt(document.getElementById('calc-day').value);
  const year  = parseInt(document.getElementById('calc-year').value);
  const fullName = document.getElementById('calc-fullname').value.trim();

  if (!month || !day || !year || !fullName) {
    document.getElementById('results-area').innerHTML =
      `<div class="results-placeholder-icon" style="color:var(--rose)">⚠</div>
       <div class="results-placeholder-text">Please fill in all required fields</div>`;
    return;
  }

  const lp      = calcLifePath(month, day, year);
  const exp     = calcExpression(fullName);
  const soul    = calcSoul(fullName);
  const outer   = calcOuter(fullName);
  // Life Calling: concatenate Expression root + Life Path root, then reduce
  const calling = reduceNumber(parseInt(String(exp) + String(lp)));
  // Achievement: Month + Day
  const achieve = reduceNumber(month + day);
  // Theme: sum of year digits
  const theme   = reduceNumber(String(year).split('').reduce((a,c) => a + parseInt(c), 0));

  const numbers = [lp, exp, calling, soul, outer, achieve, theme];

  const freqRows = numbers.map((n, i) => {
    const rootKey = FREQ_ROOT_KEYS[i];
    const entry   = ROOT[n] || {};

    if (rootKey === null) {
      const c = CALLING[n] || {};
      return `
        <div style="padding:20px 0;border-bottom:1px solid var(--border-dim);display:grid;grid-template-columns:50px 1fr;gap:16px;align-items:start">
          <div style="font-family:'Cinzel Decorative',serif;font-size:32px;color:var(--gold);line-height:1;text-align:center">${n}</div>
          <div>
            <div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">${FREQ_ROLES[i]}</div>
            <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-light);margin-bottom:6px">${FREQ_LABELS[i]}${c.name ? ' — ' + c.name : ''}</div>
            ${c.essence ? `<div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--teal);margin-bottom:8px;opacity:0.8">${c.essence}</div>` : ''}
            <p style="font-size:15px;line-height:1.7;color:var(--text-dim);font-style:italic">${c.summary || 'A powerful mission frequency.'}</p>
          </div>
        </div>`;
    }

    const interp = entry[rootKey] || '';
    return `
      <div style="padding:20px 0;border-bottom:1px solid var(--border-dim);display:grid;grid-template-columns:50px 1fr;gap:16px;align-items:start">
        <div style="font-family:'Cinzel Decorative',serif;font-size:32px;color:var(--gold);line-height:1;text-align:center">${n}</div>
        <div>
          <div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">${FREQ_ROLES[i]}</div>
          <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-light);margin-bottom:6px">${FREQ_LABELS[i]}${entry.name ? ' — ' + entry.name : ''}</div>
          ${entry.essence ? `<div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--teal);margin-bottom:8px;opacity:0.8">${entry.essence}</div>` : ''}
          <p style="font-size:15px;line-height:1.7;color:var(--text-dim);font-style:italic">${interp || 'A deep frequency — download the app for full interpretation.'}</p>
        </div>
      </div>`;
  }).join('');

  document.getElementById('results-area').innerHTML = `
    <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border-dim)">
      <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:8px">Reading for</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:20px;color:var(--gold)">${fullName}</div>
    </div>
    <div style="display:flex;justify-content:center;margin-bottom:40px">
      ${buildFreqChart(numbers)}
    </div>
    ${freqRows}
    <p style="text-align:center;font-size:13px;color:var(--text-muted);font-style:italic;margin-top:24px">Download the full app for complete interpretations, archetype analysis, and personal insights.</p>
  `;
}


// ─── Frequency Chart (Star of David / Hexagram) ───────────────
function buildFreqChart(numbers) {
  // numbers: [lifePath, expression, calling, soul, outer, achieve, theme]
  // Positions:
  //   expression  = -90°  top           → numbers[3]
  //   soul        = 150°  bottom-left   → numbers[1]
  //   outer       = 30°   bottom-right  → numbers[4]
  //   lifePath    = 90°   bottom        → numbers[0]
  //   achievement = -150° top-left      → numbers[5]
  //   theme       = -30°  top-right     → numbers[6]
  //   center                            → numbers[2]

  const W = 380, H = 380, cx = 190, cy = 190, r = 148;

  function pt(angle) {
    const rad = angle * Math.PI / 180;
    return { x: +(cx + r * Math.cos(rad)).toFixed(2),
             y: +(cy + r * Math.sin(rad)).toFixed(2) };
  }

  const soul       = pt(-90);
  const expression = pt(150);
  const outer      = pt(30);
  const lifePath   = pt(90);
  const achievement= pt(-150);
  const theme      = pt(-30);

  const gold   = '#c9a84c';
  const purple = '#7b4fa6';
  const teal   = '#4a9494';

  const COLORS = {
    soul:        { stroke: gold,   fill: '#1a1408', text: '#e8c96b' },
    expression:  { stroke: purple, fill: '#120b1a', text: '#a96ed4' },
    outer:       { stroke: teal,   fill: '#081414', text: '#7ec8c8' },
    lifePath:    { stroke: gold,   fill: '#1a1408', text: '#e8c96b' },
    achievement: { stroke: purple, fill: '#120b1a', text: '#a96ed4' },
    theme:       { stroke: teal,   fill: '#081414', text: '#7ec8c8' },
  };

  // ── Animation helpers ──────────────────────────────────────
  // Each element gets a class + inline animation-delay via a <style> block

  // Animated line: draws from center outward using stroke-dasharray trick
  function aLine(a, b, color, opacity, w, delay) {
    const len = Math.hypot(b.x - a.x, b.y - a.y).toFixed(1);
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"
      stroke="${color}" stroke-width="${w}" opacity="${opacity}" stroke-linecap="round"
      stroke-dasharray="${len}" stroke-dashoffset="${len}"
      style="animation: sscDash 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s forwards"/>`;
  }

  // Triangle that scales from center
  function aTri(a, b, c, fill, stroke, delay) {
    return `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}"
      fill="${fill}" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round"
      transform-origin="${cx} ${cy}"
      style="animation: sscScale 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both"/>`;
  }

  // Node group: scales up from cx,cy
  function aNode(x, y, num, label, color, r2, delay) {
    const labelDy = y < cy - 10 ? -(r2 + 22) : r2 + 14;
    return `<g transform-origin="${x} ${y}"
        style="animation: sscNodePop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both">
      <circle cx="${x}" cy="${y}" r="${r2 + 7}" fill="${color.fill}" stroke="${color.stroke}"
        stroke-width="1" opacity="0.4"/>
      <circle cx="${x}" cy="${y}" r="${r2}" fill="${color.fill}" stroke="${color.stroke}"
        stroke-width="1.5"/>
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
        font-family="'Cinzel Decorative',serif" font-size="${num > 9 ? 13 : 16}"
        fill="${color.text}" font-weight="700">${num}</text>
      <text x="${x}" y="${y + labelDy}" text-anchor="middle"
        font-family="'Cinzel',serif" font-size="8" fill="${color.text}"
        letter-spacing="0.12em" opacity="0.9">${label.toUpperCase()}</text>
    </g>`;
  }

  function aCenterNode(num, delay) {
    return `<g transform-origin="${cx} ${cy}"
        style="animation: sscNodePop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both">
      <circle cx="${cx}" cy="${cy}" r="38" fill="rgba(201,168,76,0.06)" stroke="${gold}"
        stroke-width="1" opacity="0.5"/>
      <circle cx="${cx}" cy="${cy}" r="28" fill="#100e04" stroke="${gold}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" dominant-baseline="central"
        font-family="'Cinzel Decorative',serif" font-size="${num > 9 ? 13 : 16}"
        fill="#e8c96b" font-weight="700">${num}</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle"
        font-family="'Cinzel',serif" font-size="6.5" fill="${gold}"
        letter-spacing="0.14em" opacity="0.85">LIFE CALLING</text>
    </g>`;
  }

  // ── Timing (seconds) ──────────────────────────────────────
  // 0.0  background circle fades in
  // 0.1  center node pops
  // 0.2  spokes draw out
  // 0.5  triangle fills scale up
  // 0.7  triangle edges draw
  // 0.85 cross lines draw
  // 1.0–1.6  outer nodes pop in staggered

  const bgCircle = `<circle cx="${cx}" cy="${cy}" r="175"
    fill="url(#bgGrad)" stroke="rgba(201,168,76,0.12)" stroke-width="1"
    style="animation: sscFadeIn 0.4s ease 0s both"/>`;

  // Pulsating glow layers — start after all nodes have appeared (~1.5s)
  const pulseDelay = 1.6;
  const glowLayers = `
    <circle cx="${cx}" cy="${cy}" r="162" fill="none" stroke="${gold}" stroke-width="18"
      opacity="0" filter="url(#sscGlow)"
      style="animation: sscPulse1 3.2s ease-in-out ${pulseDelay}s infinite"/>
    <circle cx="${cx}" cy="${cy}" r="148" fill="none" stroke="${purple}" stroke-width="12"
      opacity="0" filter="url(#sscGlow)"
      style="animation: sscPulse2 3.2s ease-in-out ${pulseDelay + 0.4}s infinite"/>
    <circle cx="${cx}" cy="${cy}" r="175" fill="url(#pulseGrad)"
      opacity="0"
      style="animation: sscPulse3 3.2s ease-in-out ${pulseDelay + 0.8}s infinite"/>
  `;

  const centerPulse = `<circle cx="${cx}" cy="${cy}" r="0" fill="none" stroke="${gold}" stroke-width="1.5" opacity="0.6"
    style="animation: sscRipple 1.2s ease-out 0.15s both"/>`;

  const spokes = [soul, expression, outer, lifePath, achievement, theme]
    .map((p, i) => aLine({x:cx,y:cy}, p, gold, 0.18, 0.8, 0.2 + i*0.03))
    .join('');

  const upFill   = aTri(soul, expression, outer,      'rgba(201,168,76,0.07)',  gold,   0.5);
  const downFill = aTri(lifePath, achievement, theme, 'rgba(123,79,166,0.07)', purple, 0.55);

  const upEdges = [
    aLine(soul, expression,  gold,   0.55, 1.4, 0.70),
    aLine(expression, outer, gold,   0.55, 1.4, 0.76),
    aLine(outer, soul,       gold,   0.55, 1.4, 0.82),
  ].join('');
  const downEdges = [
    aLine(lifePath, achievement, purple, 0.55, 1.4, 0.72),
    aLine(achievement, theme,    purple, 0.55, 1.4, 0.78),
    aLine(theme, lifePath,       purple, 0.55, 1.4, 0.84),
  ].join('');

  const crossLines = [
    aLine(soul, lifePath,     gold,   0.25, 1.2, 0.88),
    aLine(expression, theme,  purple, 0.25, 1.2, 0.92),
    aLine(outer, achievement, teal,   0.25, 1.2, 0.96),
  ].join('');

  const outerNodes = [
    aNode(soul.x,        soul.y,        numbers[3], 'Expression',  COLORS.soul,        22, 1.05),
    aNode(theme.x,       theme.y,       numbers[6], 'Theme',       COLORS.theme,       22, 1.15),
    aNode(outer.x,       outer.y,       numbers[4], 'Outer',       COLORS.outer,       22, 1.20),
    aNode(lifePath.x,    lifePath.y,    numbers[0], 'Life Path',   COLORS.lifePath,    22, 1.25),
    aNode(achievement.x, achievement.y, numbers[5], 'Achievement', COLORS.achievement, 22, 1.35),
    aNode(expression.x,  expression.y,  numbers[1], 'Soul',        COLORS.expression,  22, 1.40),
  ].join('');

  return `
    <style>
      @keyframes sscFadeIn  { from { opacity:0 } to { opacity:1 } }
      @keyframes sscScale   { from { transform:scale(0); opacity:0 } to { transform:scale(1); opacity:1 } }
      @keyframes sscNodePop { from { transform:scale(0); opacity:0 } to { transform:scale(1); opacity:1 } }
      @keyframes sscDash    { to   { stroke-dashoffset:0 } }
      @keyframes sscRipple  { from { r:0; opacity:0.8 } to { r:160; opacity:0 } }
      @keyframes sscPulse1  { 0%,100% { r:162; opacity:0.10 } 50% { r:178; opacity:0.28 } }
      @keyframes sscPulse2  { 0%,100% { r:148; opacity:0.08 } 50% { r:168; opacity:0.20 } }
      @keyframes sscPulse3  { 0%,100% { opacity:0.06 } 50% { opacity:0.18 } }
    </style>
    <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
      style="max-width:100%;overflow:visible"
      xmlns="http://www.w3.org/2000/svg">

      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#1a1620" stop-opacity="1"/>
          <stop offset="100%" stop-color="#05040a" stop-opacity="1"/>
        </radialGradient>
        <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#7b4fa6" stop-opacity="0"/>
          <stop offset="60%"  stop-color="#c9a84c" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="#4a9494" stop-opacity="0.10"/>
        </radialGradient>
        <filter id="sscGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      ${bgCircle}
      ${glowLayers}
      ${centerPulse}
      ${upFill}
      ${downFill}
      ${upEdges}
      ${downEdges}
      ${crossLines}
      ${spokes}
      ${outerNodes}
      ${aCenterNode(numbers[2], 0.1)}

    </svg>`;
}

/* ═══════════════════════════════════════════════════════════════
   EXPOSE TO WINDOW
═══════════════════════════════════════════════════════════════ */

window.calculateReading = calculateReading;
window.buildFreqChart   = buildFreqChart;
