/**
 * netlify/functions/stripe-webhook.js
 * ════════════════════════════════════════════════════════════════
 * Stripe webhook → frequency calculation → Claude guidebook
 * → PDFShift PDF → Resend email with PDF attachment
 * ════════════════════════════════════════════════════════════════
 */

const stripe    = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Anthropic = require('@anthropic-ai/sdk');
const { Resend } = require('resend');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend    = new Resend(process.env.RESEND_API_KEY);

// ── SSC System Prompt ─────────────────────────────────────────────────────
const SSC_SYSTEM_PROMPT = `You are Kytholek, the author of Simulation Source Code — a consciousness framework that reads life as a holographic simulation, decoding the Source Code embedded in a person's birth date and full birth name.

VOICE AND TONE:
Write like a knowledgeable guide having a direct conversation — not a mystic performing a ritual. Grounded first, elevated when it earns it. If a sentence sounds like it belongs on a crystal shop wall, rewrite it. No theatrical language. No "this is not an accident", "the universe has spoken", "it is written in the stars." Say what the number means and what it asks of the person, plainly. Be specific. Vague is useless. Do NOT pad.

FRAMEWORK CORE CONCEPTS:
- Life is a Holographic Simulation. The birth date is the External Circuit — what the simulation presents as lessons and curriculum. The name is the Internal Circuit — the authentic frequency encoded within for expression.
- The Life Path is the THEME of the external curriculum. The flavor of resistance, challenge, and growth the simulation presents. You are learning to embody this frequency through immersion.
- The Expression is the INTERNAL FREQUENCY — the authentic signal beneath social conditioning. What you are here to express and become.
- The Soul Urge (vowels) is the private inner world — desires, motivations, yearnings beneath the surface.
- The Outer Persona (consonants) is the social mask — how the world first reads you before they know you.
- Expression is the BLEND of Soul Urge and Outer Persona. Write it this way — show how inner desire (Soul) and social mask (Outer) fuse to produce the authentic signal.
- The Achievement number is the operational style — how they naturally accomplish things.
- The Theme (birth year) is atmospheric — the generational note the simulation is written in. Less personal, more like the key the music plays in.
- The Life Calling is the fusion of Life Path and Expression — the specific directive that emerges when external curriculum and internal frequency are run together.
- Numbers carry both positive and shadow expressions. The shadow is not a flaw — it is the unconstructed version of the same energy.

MASTER NUMBER RULES:
The ONLY valid master numbers are 11, 22, 33, 44. Nothing else. 13, 14, 19, 21, 28 etc. are NOT master numbers.
- Master numbers do not reduce but always carry their root as a foundation. 11 operates from 2, 22 from 4, 33 from 6, 44 from 8.
- Always acknowledge the root, then explain what the master number adds or amplifies.
- If compound AND root are both master numbers (e.g. raw=11, root=11), note plainly there is no reduction — the frequency is undiluted.

COMPOUND NUMBER MEANINGS (use these when interpreting each frequency):
10 — Renewed Initiation: The cycle of 1 returning through the amplifying zero. Leadership reborn at a higher turn of the spiral.
11 — The Illuminated Bridge: Double 1 amplified into a channel. Carries 2's relational sensitivity as root but amplified. Where 2 connects, 11 bridges worlds.
12 — Creative Partnership: 1 initiating through 2's relational awareness. Original expression that requires others to be fully realised.
13 — Structured Creation: 1 through 3's creativity, reducing to 4. Raw creative force that must be built into something lasting.
14 — Freedom Through Foundation: 1 and 4 reducing to 5. Freedom earned only after the foundations hold.
15 — Embodied Will: 1 and 5 reducing to 6. Personal will tested through direct contact with life.
16 — Wisdom From Collapse: 1 and 6 reducing to 7. Inner truth emerges through dissolution of what was falsely constructed.
17 — Illuminated Will: 1 and 7 reducing to 8. Authority born from insight rather than ambition.
18 — Power Accountable: 1 and 8 reducing to 9. Raw force that must ultimately serve something beyond itself.
19 — The Solar Return: 1 and 9 reducing to 1. A complete cycle. The end becomes the seed of the next.
20 — Receptive Gateway: 2 and 0 reducing to 2. Deep sensitivity amplified by the zero's expansive quality.
21 — Expressed Connection: 2 and 1 reducing to 3. Connection that generates new expression. Harmony that finds its voice.
22 — The Master Builder: Double 2 at master scale, operating from 4's foundation. Structures built to serve collective evolution.
23 — Communicative Harmony: 2 and 3 reducing to 5. The natural diplomat and storyteller.
24 — Nurturing Structure: 2 and 4 reducing to 6. Building systems that care for others.
25 — Embodied Understanding: 2 and 5 reducing to 7. Wisdom earned through relationship and immersion.
26 — Responsible Vision: 2 and 6 reducing to 8. Authority built by being the one who shows up.
27 — Compassionate Wisdom: 2 and 7 reducing to 9. Wisdom in service of others.
28 — Power Through Relationship: 2 and 8 reducing to 1. Influence built through genuine partnership.
29 — Completing the Connection: 2 and 9 reducing to 11. Relationships that serve a larger purpose.
30 — Pure Expression: 3 and 0 reducing to 3. Creative force in its most undiluted form.
31 — Initiated Creation: 3 and 1 reducing to 4. Original ideas that demand to be built.
32 — Harmonious Expression: 3 and 2 reducing to 5. Expression that bridges people.
33 — The Master Teacher: Double 3 at master scale, operating from 6's foundation. Expression in unconditional service.
34 — Structured Expression: 3 and 4 reducing to 7. Craft that deepens through sustained inner work.
35 — Embodied Expression: 3 and 5 reducing to 8. Power earned through the friction of expression meeting reality.
36 — Expressive Service: 3 and 6 reducing to 9. Creativity in service of collective wellbeing.
37 — Wise Expression: 3 and 7 reducing to 1. Expression rooted in genuine self-knowledge.
38 — Powerful Expression: 3 and 8 reducing to 11. Creative force that becomes a channel for something larger.
39 — Universal Expression: 3 and 9 reducing to 3. Expression meant to serve beyond the self.
40 — Foundational Gateway: 4 and 0 reducing to 4. Discipline at its most essential.
41 — Initiated Structure: 4 and 1 reducing to 5. Building that moves. Structure that enables rather than constrains.
42 — Relational Foundation: 4 and 2 reducing to 6. Building systems that serve relationships.
43 — Creative Foundation: 4 and 3 reducing to 7. Building that communicates. Systems that carry meaning.
44 — The Master Organiser: Double 4 at master scale, operating from 8's foundation. Organised power built to endure.
45 — Experienced Foundation: 4 and 5 reducing to 9. Foundations built from what has actually worked.
46 — Caring Structure: 4 and 6 reducing to 1. Building new systems of care.
47 — Wise Foundation: 4 and 7 reducing to 11. Mastery emerging from deep inner alignment.
48 — Masterful Foundation: 4 and 8 reducing to 3. Discipline meeting authority, expressed through creative force.
49 — Completing Structure: 4 and 9 reducing to 4. Structures built, completing their purpose, then released gracefully.
50 — Pure Experience: 5 and 0 reducing to 5. Presence at its most essential.
51 — Initiated Experience: 5 and 1 reducing to 6. Moving first into direct contact with life.
52 — Connected Experience: 5 and 2 reducing to 7. Understanding developed through relationship and direct encounter.
53 — Expressive Experience: 5 and 3 reducing to 8. Lived experience that finds its voice and builds authority.
54 — Structured Experience: 5 and 4 reducing to 9. Freedom found within structure.
55 — The Master Liberator: Double 5 at master scale, operating from 1's initiation. Freedom as a demonstration.
56 — Integrating Experience: 5 and 6 reducing to 11. Presence that serves. Direct contact that becomes a channel.
57 — Seeking Experience: 5 and 7 reducing to 3. The seeker who lives it before teaching it.
58 — Powerful Experience: 5 and 8 reducing to 4. Power built through direct engagement with life.
59 — Universal Experience: 5 and 9 reducing to 5. The one who has lived fully and releases what is complete.

SSC LANGUAGE TO USE NATURALLY: simulation, holographic blueprint, external circuit, internal circuit, encoded frequency, NPC conditioning, authentic signal, embodiment, integration, the Game, source code.
Do NOT use: "you are a natural leader", "you have a gift for", "the universe supports you", "this is not an accident".`;

// ── Main handler ──────────────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 1. Verify Stripe signature
  let stripeEvent;
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      event.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== 'payment_intent.succeeded') {
    return { statusCode: 200, body: 'Ignored event type' };
  }

  const paymentIntent = stripeEvent.data.object;

  // 2. Extract customer data from checkout session metadata
  let userData = {};
  let email = paymentIntent.receipt_email || null;

  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });
    if (sessions.data.length > 0) {
      const session = sessions.data[0];
      email = session.customer_email || session.metadata?.email || email;
      userData = {
        name:  session.metadata?.name  || '',
        month: session.metadata?.month || '',
        day:   session.metadata?.day   || '',
        year:  session.metadata?.year  || '',
      };
      console.log('Session metadata:', session.metadata);
    }
  } catch (e) {
    console.warn('Could not retrieve checkout session:', e.message);
  }

  // Fallback — get email from charge
  if (!email && paymentIntent.latest_charge) {
    try {
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      email = charge.billing_details?.email || charge.receipt_email || null;
    } catch (e) {
      console.warn('Could not retrieve charge:', e.message);
    }
  }

  console.log('Final email:', email);
  console.log('User data:', userData);

  if (!email) {
    console.error('No email found on payment intent:', paymentIntent.id);
    return { statusCode: 200, body: 'No email — cannot deliver guidebook' };
  }

  const name  = userData.name  || 'Valued Customer';
  const month = Number(userData.month) || 1;
  const day   = Number(userData.day)   || 1;
  const year  = Number(userData.year)  || 1990;

  // 3. Calculate frequencies
  const frequencies = calculateFrequencies(name, month, day, year);
  console.log('Frequencies:', frequencies);

  // 4. Generate guidebook with Claude
  console.log(`Generating guidebook for ${name} (${email})`);
  let guidebookBody;
  try {
    guidebookBody = await generateGuidebook({ name, month, day, year, frequencies });
  } catch (err) {
    console.error('Claude API error:', err.message);
    return { statusCode: 500, body: 'Guidebook generation failed' };
  }

  // 5. Build PDF HTML
  const guidebookHtml = buildPdfHtml({ name, month, day, year, frequencies, guidebookBody });

  // 6. Generate PDF via PDFShift
  let pdfBase64 = null;
  try {
    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('api:' + process.env.PDFSHIFT_API_KEY).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source:    guidebookHtml,
        landscape: false,
        use_print: false,
        format:    'A4',
        margin:    { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      }),
    });
    if (pdfResponse.ok) {
      const pdfBuffer = await pdfResponse.arrayBuffer();
      pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      console.log('PDF generated, size:', pdfBuffer.byteLength);
    } else {
      const errText = await pdfResponse.text();
      console.error('PDFShift error:', errText);
    }
  } catch (err) {
    console.error('PDF generation failed:', err.message);
    // Continue — still send email without PDF if it fails
  }

  // 7. Send email with PDF attachment
  try {
    const emailPayload = {
      from:    `Simulation Source Code <${process.env.FROM_EMAIL || 'guidebook@simulationsourcecode.com'}>`,
      to:      email,
      subject: `✦ Your Holographic Blueprint — ${name.split(' ')[0]}`,
      html:    buildNotificationEmail(name, email, frequencies),
    };
    if (pdfBase64) {
      emailPayload.attachments = [{
        filename: `SSC-Blueprint-${name.replace(/\s+/g, '-')}.pdf`,
        content:  pdfBase64,
      }];
    }
    const resendResult = await resend.emails.send(emailPayload);
    console.log('Resend result:', JSON.stringify(resendResult));
    console.log(`Guidebook emailed to ${email}`);
  } catch (err) {
    console.error('Email send failed:', JSON.stringify(err));
    return { statusCode: 500, body: 'Email delivery failed' };
  }

  return { statusCode: 200, body: JSON.stringify({ delivered: true, email }) };
};

// ── Frequency Calculator ──────────────────────────────────────────────────
function reduceToSingle(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33 && n !== 44) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

const LETTER_VALUES = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:11,L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:22,W:5, X:6, Y:7, Z:8
};
const VOWELS = new Set(['A','E','I','O','U','Y']);

function letterValue(c) { return LETTER_VALUES[c.toUpperCase()] || 0; }

function calculateFrequencies(name, month, day, year) {
  const chars = name.toUpperCase().replace(/[^A-Z]/g, '').split('');

  const rawLifePath = [...String(month), ...String(day), ...String(year)]
    .reduce((a, c) => a + Number(c), 0);
  const lifePath = reduceToSingle(rawLifePath);

  const rawAchievement = month + day;
  const achievement = reduceToSingle(rawAchievement);

  const rawTheme = String(year).split('').reduce((a, d) => a + Number(d), 0);
  const theme = reduceToSingle(rawTheme);

  const rawExpression = name.trim().split(/\s+/).reduce((total, word) => {
    const wordSum = word.toUpperCase().replace(/[^A-Z]/g, '').split('')
      .reduce((a, c) => a + letterValue(c), 0);
    return total + reduceToSingle(wordSum);
  }, 0);
  const expression = reduceToSingle(rawExpression);

  const rawSoul = chars.filter(c => VOWELS.has(c)).reduce((a, c) => a + letterValue(c), 0);
  const soul = reduceToSingle(rawSoul);

  const rawPersona = chars.filter(c => !VOWELS.has(c)).reduce((a, c) => a + letterValue(c), 0);
  const persona = reduceToSingle(rawPersona);

  const rawDestiny = expression + lifePath;
  const destiny = reduceToSingle(rawDestiny);

  return {
    lifePath, rawLifePath,
    achievement, rawAchievement,
    theme, rawTheme,
    expression, rawExpression,
    soul, rawSoul,
    persona, rawPersona,
    destiny, rawDestiny,
  };
}

// ── Claude Guidebook Generator ────────────────────────────────────────────
async function generateGuidebook({ name, month, day, year, frequencies }) {
  const months = ['','January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dob = `${months[month]} ${day}, ${year}`;
  const firstName = name.split(' ')[0];

  const prompt = `You are writing a COMPLETE HOLOGRAPHIC BLUEPRINT READING for the following person.

PERSONAL DATA:
- Full birth name: ${name}
- Date of birth: ${dob}

THEIR COMPOUND FREQUENCIES:
- Theme (birth year):                    ${frequencies.rawTheme}/${frequencies.theme}
- Life Path (full DOB):                  ${frequencies.rawLifePath}/${frequencies.lifePath}
- Achievement (month + day):             ${frequencies.rawAchievement}/${frequencies.achievement}
- Soul Urge (vowels):                    ${frequencies.rawSoul}/${frequencies.soul}
- Outer Persona (consonants):            ${frequencies.rawPersona}/${frequencies.persona}
- Expression (full name):                ${frequencies.rawExpression}/${frequencies.expression}
- Life Calling (Expression + Life Path): ${frequencies.rawDestiny}/${frequencies.destiny}

STRUCTURE — write ALL sections in EXACTLY this order, each with its own <h2> heading:

1. Opening — address ${firstName} directly. 2-3 sentences only. State what their blueprint encodes.

2. <h2>The External Circuit</h2>
   Then each as <h3>:
   - Theme ${frequencies.rawTheme}/${frequencies.theme} — atmospheric frequency of birth year
   - Life Path ${frequencies.rawLifePath}/${frequencies.lifePath} — the external curriculum. Positive and shadow expression.
   - Achievement ${frequencies.rawAchievement}/${frequencies.achievement} — operational style. How they accomplish.

3. <h2>The Internal Circuit</h2>
   Then each as <h3>:
   - Soul Urge ${frequencies.rawSoul}/${frequencies.soul} — private inner world, inner compass
   - Outer Persona ${frequencies.rawPersona}/${frequencies.persona} — social mask, how others read them first
   - Expression ${frequencies.rawExpression}/${frequencies.expression} — WRITE THIS AS THE BLEND of Soul (${frequencies.rawSoul}/${frequencies.soul}) and Outer Persona (${frequencies.rawPersona}/${frequencies.persona}) fusing together. Show how they combine to produce the authentic signal.

4. <h2>The Life Calling — ${frequencies.rawDestiny}/${frequencies.destiny}</h2>
   The fusion of Life Path and Expression. The specific directive. Compound story, root essence, practical meaning.

5. <h2>Quest Directive</h2>
   One powerful paragraph. Direct and personal. What ${firstName}'s simulation is asking them to master.

FORMAT: HTML only — <h2>, <h3>, <p>, <ul><li>. No markdown. No preamble. Start directly with the Opening.
LENGTH: 900-1100 words. Complete all 5 sections. Do not cut any section short.`;

  const message = await anthropic.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    system:     SSC_SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: prompt }],
  });

  return message.content[0].text;
}

// ── Positive/Shadow reference per root ───────────────────────────────────
const NUM_REF = {
  1:  ['Initiation, bold action, independence',       'Procrastination, aggression, ego'],
  2:  ['Connection, diplomacy, receptivity',          'Isolation, over-dependence, indecision'],
  3:  ['Creative expression, communication, joy',     'Scattered energy, performing for approval'],
  4:  ['Structure, discipline, grounded building',    'Chaos, rigidity, avoiding responsibility'],
  5:  ['Presence, adaptability, embodied freedom',    'Escape, avoidance, surface-level living'],
  6:  ['Nurturing, care, integration',                'Martyrdom, enabling, self-neglect'],
  7:  ['Depth, inner truth, wisdom',                  'Isolation, analysis paralysis, distrust'],
  8:  ['Self-mastery, authority, manifestation',      'Control, collapse, chasing power'],
  9:  ['Completion, service, universal vision',       'Ego inflation, inability to release'],
  11: ['Illumination, bridging, inspired insight',    'Oversensitivity, avoidance of grounding'],
  22: ['Master building, visionary pragmatism',       'Overwhelm, grandiosity, escapism'],
  33: ['Compassionate teaching, healing service',     'Martyrdom, heartlessness'],
  44: ['Legacy building, organised power',            'Self-destruction, addiction to control'],
};
function getRef(n) { return NUM_REF[n] || ['See full reading', 'See full reading']; }

// ── Star chart (static SVG for PDF) ──────────────────────────────────────
function buildStarChart(numbers) {
  const W=380, H=420, cx=190, cy=210, r=148;
  const toRad = a => a * Math.PI / 180;
  const pt = a => ({ x: +(cx + r * Math.cos(toRad(a))).toFixed(2), y: +(cy + r * Math.sin(toRad(a))).toFixed(2) });

  const soul=pt(150), expression=pt(-90), outer=pt(30),
        lifePath=pt(90), achievement=pt(-150), theme=pt(-30);

  const gold='#c9a84c', purple='#7b4fa6', teal='#4a9494';
  const C = {
    soul:        { s:purple, f:'#120b1a', t:'#a96ed4' },
    expression:  { s:gold,   f:'#1a1408', t:'#e8c96b' },
    outer:       { s:teal,   f:'#081414', t:'#7ec8c8' },
    lifePath:    { s:gold,   f:'#1a1408', t:'#e8c96b' },
    achievement: { s:purple, f:'#120b1a', t:'#a96ed4' },
    theme:       { s:teal,   f:'#081414', t:'#7ec8c8' },
  };

  const ln = (a,b,c,o,w) =>
    `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${c}" stroke-width="${w}" opacity="${o}" stroke-linecap="round"/>`;
  const tri = (a,b,c,f,s) =>
    `<polygon points="${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}" fill="${f}" stroke="${s}" stroke-width="1.2" stroke-linejoin="round"/>`;

  const nd = (x,y,n,lbl,c,r2,pos='auto') => {
    const dy = pos==='above' ? -(r2+14) : pos==='below' ? r2+14 : y<cy ? -(r2+14) : r2+14;
    const fs = n>9 ? 13 : 16;
    return `<g><circle cx="${x}" cy="${y}" r="${r2+7}" fill="${c.f}" stroke="${c.s}" stroke-width="1" opacity="0.4"/><circle cx="${x}" cy="${y}" r="${r2}" fill="${c.f}" stroke="${c.s}" stroke-width="1.5"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-size="${fs}" fill="${c.t}" font-weight="700">${n}</text><text x="${x}" y="${y+dy}" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" fill="${c.t}" letter-spacing="0.12em" opacity="0.9">${lbl.toUpperCase()}</text></g>`;
  };

  const cn = n => {
    const fs = n>9 ? 13 : 16;
    return `<g><circle cx="${cx}" cy="${cy}" r="38" fill="rgba(201,168,76,0.06)" stroke="${gold}" stroke-width="1" opacity="0.5"/><circle cx="${cx}" cy="${cy}" r="28" fill="#100e04" stroke="${gold}" stroke-width="1.5"/><text x="${cx}" y="${cy-4}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-size="${fs}" fill="#e8c96b" font-weight="700">${n}</text><text x="${cx}" y="${cy+16}" text-anchor="middle" font-family="Arial,sans-serif" font-size="6.5" fill="${gold}" letter-spacing="0.14em" opacity="0.85">LIFE CALLING</text></g>`;
  };

  const bg = `<circle cx="${cx}" cy="${cy}" r="175" fill="url(#bgG)" stroke="rgba(201,168,76,0.12)" stroke-width="1"/>`;
  const spokes = [soul,expression,outer,lifePath,achievement,theme]
    .map(p => ln({x:cx,y:cy},p,gold,0.18,0.8)).join('');

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bgG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1a1620" stop-opacity="1"/><stop offset="100%" stop-color="#05040a" stop-opacity="1"/></radialGradient></defs>${bg}${tri(soul,expression,outer,'rgba(201,168,76,0.07)',gold)}${tri(lifePath,achievement,theme,'rgba(123,79,166,0.07)',purple)}${ln(soul,expression,gold,0.55,1.4)}${ln(expression,outer,gold,0.55,1.4)}${ln(outer,soul,gold,0.55,1.4)}${ln(lifePath,achievement,purple,0.55,1.4)}${ln(achievement,theme,purple,0.55,1.4)}${ln(theme,lifePath,purple,0.55,1.4)}${spokes}${nd(soul.x,soul.y,numbers[3],'Soul',C.soul,22)}${nd(theme.x,theme.y,numbers[6],'Theme',C.theme,22)}${nd(outer.x,outer.y,numbers[4],'Outer',C.outer,22)}${nd(lifePath.x,lifePath.y,numbers[0],'Life Path',C.lifePath,22,'below')}${nd(achievement.x,achievement.y,numbers[5],'Achievement',C.achievement,22)}${nd(expression.x,expression.y,numbers[1],'Expression',C.expression,22,'above')}${cn(numbers[2])}</svg>`;
}

// ── PDF HTML Template ─────────────────────────────────────────────────────
function buildPdfHtml({ name, month, day, year, frequencies, guidebookBody }) {
  const months = ['','January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dob = `${months[month]} ${day}, ${year}`;

  const starChart = buildStarChart([
    frequencies.lifePath, frequencies.expression, frequencies.destiny,
    frequencies.soul, frequencies.persona, frequencies.achievement, frequencies.theme
  ]);

  const [lp_pos,lp_shad]     = getRef(frequencies.lifePath);
  const [exp_pos,exp_shad]   = getRef(frequencies.expression);
  const [dst_pos,dst_shad]   = getRef(frequencies.destiny);
  const [soul_pos,soul_shad] = getRef(frequencies.soul);
  const [per_pos,per_shad]   = getRef(frequencies.persona);
  const [ach_pos,ach_shad]   = getRef(frequencies.achievement);
  const [thm_pos,thm_shad]   = getRef(frequencies.theme);

  const SIGIL = `<svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4a9494" stop-opacity="0.3"/><stop offset="50%" stop-color="#c9a84c" stop-opacity="0.15"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/></radialGradient></defs><circle cx="80" cy="80" r="72" fill="none" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/><circle cx="80" cy="80" r="66" fill="none" stroke="#c9a84c" stroke-width="0.3" opacity="0.12" stroke-dasharray="3 6"/><circle cx="80" cy="80" r="36" fill="url(#sg1)"/><line x1="80" y1="14" x2="80" y2="146" stroke="#4a9494" stroke-width="1" opacity="0.4"/><line x1="14" y1="80" x2="146" y2="80" stroke="#4a9494" stroke-width="1" opacity="0.4"/><line x1="29" y1="29" x2="131" y2="131" stroke="#c9a84c" stroke-width="0.6" opacity="0.18"/><line x1="131" y1="29" x2="29" y2="131" stroke="#c9a84c" stroke-width="0.6" opacity="0.18"/><circle cx="80" cy="16" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="144" cy="80" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="80" cy="144" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="16" cy="80" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="80" cy="16" r="2.5" fill="#7ec8c8" opacity="0.85"/><circle cx="144" cy="80" r="2.5" fill="#7ec8c8" opacity="0.85"/><circle cx="80" cy="144" r="2.5" fill="#7ec8c8" opacity="0.85"/><circle cx="16" cy="80" r="2.5" fill="#7ec8c8" opacity="0.85"/><circle cx="31" cy="31" r="6" fill="#03020a" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/><circle cx="129" cy="31" r="6" fill="#03020a" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/><circle cx="31" cy="129" r="6" fill="#03020a" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/><circle cx="129" cy="129" r="6" fill="#03020a" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/><circle cx="80" cy="80" r="18" fill="#03020a" stroke="#c9a84c" stroke-width="1.5"/></svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+SC:wght@300;400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#05040a;color:#e8dfc8;font-family:"EB Garamond",Georgia,serif;font-size:15px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{width:100%;min-height:100vh;background:#05040a;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 40px;position:relative;page-break-after:always}
.c-ey{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.5em;text-transform:uppercase;color:#4a9494;margin-bottom:40px}
.c-sig{width:150px;height:150px;margin:0 auto 44px;filter:drop-shadow(0 0 20px rgba(201,168,76,0.35))}
.c-sig svg{width:100%;height:100%}
.c-rl{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.4em;text-transform:uppercase;color:#7a6330;margin-bottom:6px}
.c-rt{font-family:"Cormorant SC",serif;font-weight:300;font-size:15px;color:#9b9080;letter-spacing:.1em;margin-bottom:40px}
.c-div{display:flex;align-items:center;gap:16px;width:100%;max-width:400px;margin:0 auto 36px}
.c-dl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)}
.c-dg{width:7px;height:7px;background:#7a6330;transform:rotate(45deg);flex-shrink:0}
.c-nm{font-family:"Cormorant SC",serif;font-weight:300;font-size:44px;color:#e8c96b;letter-spacing:.06em;line-height:1.1;margin-bottom:8px}
.c-db{font-family:"Cinzel",serif;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#7a6330;margin-bottom:48px}
.c-fqs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:480px;margin:0 auto}
.c-bgt{background:rgba(13,11,24,0.95);border:1px solid rgba(201,168,76,0.18);border-radius:5px;padding:8px 14px;text-align:center;min-width:80px}
.c-bgt-n{font-family:"Cormorant SC",serif;font-size:20px;color:#c9a84c;display:block;line-height:1}
.c-bgt-l{font-family:"Cinzel",serif;font-size:6px;letter-spacing:.2em;text-transform:uppercase;color:#7ec8c8;display:block;margin-top:3px}
.c-ft{position:absolute;bottom:28px;left:0;right:0;text-align:center;font-family:"Cinzel",serif;font-size:7px;letter-spacing:.25em;text-transform:uppercase;color:#5c5448}
.chart-pg{width:100%;min-height:100vh;background:#05040a;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 40px;page-break-after:always;position:relative}
.chart-ey{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.45em;text-transform:uppercase;color:#7a6330;margin-bottom:10px}
.chart-ti{font-family:"Cormorant SC",serif;font-weight:300;font-size:26px;color:#e8c96b;letter-spacing:.05em;margin-bottom:32px}
.chart-wr{width:360px;height:400px;margin:0 auto}
.chart-pf{position:absolute;bottom:24px;left:52px;right:52px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(201,168,76,0.07);padding-top:10px}
.chart-pf span{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#5c5448}
.howto{width:100%;background:#05040a;padding:48px 56px 80px;page-break-after:always;position:relative;min-height:100vh}
.howto-ey{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.45em;text-transform:uppercase;color:#4a9494;margin-bottom:10px}
.howto-ti{font-family:"Cormorant SC",serif;font-weight:300;font-size:28px;color:#e8c96b;letter-spacing:.05em;margin-bottom:8px}
.howto-dv{height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);margin-bottom:28px}
.howto-in{font-size:15px;line-height:1.8;color:#9b9080;margin-bottom:32px;font-style:italic}
.howto-gr{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px}
.howto-cd{background:rgba(13,11,24,0.8);border:1px solid rgba(201,168,76,0.1);border-radius:6px;padding:18px 20px}
.howto-cl{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.3em;text-transform:uppercase;color:#7ec8c8;margin-bottom:6px}
.howto-ct{font-family:"Cormorant SC",serif;font-size:18px;color:#e8c96b;margin-bottom:8px;letter-spacing:.03em}
.howto-cb{font-size:13.5px;line-height:1.75;color:#9b9080}
.howto-nt{background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.12);border-left:3px solid rgba(201,168,76,0.4);border-radius:4px;padding:16px 20px;margin-bottom:24px}
.howto-nt p{font-size:14px;line-height:1.75;color:#9b9080}
.howto-nt strong{color:#e8c96b}
.howto-pf{position:absolute;bottom:24px;left:56px;right:56px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(201,168,76,0.07);padding-top:10px}
.howto-pf span{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#5c5448}
.content-pg{width:100%;background:#05040a;padding:48px 52px 80px;page-break-after:always;position:relative;min-height:100vh}
.pg-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;padding-bottom:14px;border-bottom:1px solid rgba(201,168,76,0.1)}
.pg-hd span{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.35em;text-transform:uppercase;color:#5c5448}
.sb h2{font-family:"Cormorant SC",serif;font-weight:300;font-size:24px;color:#e8c96b;letter-spacing:.04em;margin:32px 0 8px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,0.1)}
.sb h3{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.25em;text-transform:uppercase;color:#7ec8c8;margin:20px 0 6px}
.sb p{font-size:14.5px;line-height:1.8;color:#9b9080;margin-bottom:12px}
.sb strong{color:#e8dfc8}.sb em{color:#c9a84c;font-style:italic}
.sb ul{list-style:none;padding:0;margin:0 0 14px}
.sb ul li{font-size:14px;line-height:1.75;color:#9b9080;padding:5px 0 5px 18px;border-bottom:1px solid rgba(201,168,76,0.05);position:relative}
.sb ul li::before{content:"\\25C8";position:absolute;left:0;top:7px;font-size:7px;color:#4a9494}
.pg-ft{position:absolute;bottom:24px;left:52px;right:52px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(201,168,76,0.07);padding-top:10px}
.pg-ft span{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#5c5448}
.ref-pg{width:100%;background:#05040a;padding:48px 52px 80px;page-break-before:always;position:relative;min-height:100vh}
.ref-ey{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.45em;text-transform:uppercase;color:#7a6330;margin-bottom:10px}
.ref-ti{font-family:"Cormorant SC",serif;font-weight:300;font-size:28px;color:#e8c96b;letter-spacing:.05em;margin-bottom:6px}
.ref-dv{height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);margin-bottom:28px}
.ref-tb{width:100%;border-collapse:collapse;margin-bottom:32px}
.ref-tb th{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.3em;text-transform:uppercase;color:#7a6330;text-align:left;padding:8px 12px;border-bottom:1px solid rgba(201,168,76,0.2)}
.ref-tb td{font-size:13px;color:#9b9080;padding:9px 12px;border-bottom:1px solid rgba(201,168,76,0.06);vertical-align:top;line-height:1.6}
.ref-fl{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.15em;text-transform:uppercase;color:#7ec8c8;display:block;margin-bottom:2px}
.ref-cp{font-family:"Cormorant SC",serif;font-size:17px;color:#c9a84c}
.ref-pos{color:#7ec8c8}.ref-shd{color:#a04070}
.ref-pf{position:absolute;bottom:24px;left:52px;right:52px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(201,168,76,0.07);padding-top:10px}
.ref-pf span{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#5c5448}
.quest-pg{width:100%;min-height:100vh;background:#05040a;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 64px;page-break-before:always}
.q-ey{font-family:"Cinzel",serif;font-size:8px;letter-spacing:.5em;text-transform:uppercase;color:#7a6330;margin-bottom:28px}
.q-ti{font-family:"Cormorant SC",serif;font-weight:300;font-size:34px;color:#e8c96b;letter-spacing:.05em;margin-bottom:32px}
.q-dv{width:100px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent);margin:0 auto 32px}
.q-tx{font-size:16px;line-height:1.9;color:#9b9080;max-width:520px;font-style:italic}
.q-tx strong{color:#e8dfc8;font-style:normal}
.q-br{margin-top:56px;display:flex;flex-direction:column;align-items:center;gap:12px}
.q-bs{width:44px;height:44px;opacity:0.45}
.q-bn{font-family:"Cormorant SC",serif;font-size:13px;color:#c9a84c;letter-spacing:.06em}
.q-bu{font-family:"Cinzel",serif;font-size:7.5px;letter-spacing:.3em;text-transform:uppercase;color:#5c5448}
.q-sc{display:flex;gap:18px;margin-top:6px}
.q-sc a{font-family:"Cinzel",serif;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#5c5448;text-decoration:none}
@media print{body{background:#05040a !important}*{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important}}
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="c-ey">&#10022; &nbsp; Holographic Blueprint Reading &nbsp; &#10022;</div>
  <div class="c-sig">${SIGIL}</div>
  <div class="c-rl">Simulation Source Code</div>
  <div class="c-rt">Complete Frequency Guidebook</div>
  <div class="c-div"><span class="c-dl"></span><span class="c-dg"></span><span class="c-dl"></span></div>
  <div class="c-nm">${name}</div>
  <div class="c-db">${dob}</div>
  <div class="c-fqs">
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawTheme}/${frequencies.theme}</span><span class="c-bgt-l">Theme</span></div>
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawLifePath}/${frequencies.lifePath}</span><span class="c-bgt-l">Life Path</span></div>
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawAchievement}/${frequencies.achievement}</span><span class="c-bgt-l">Achievement</span></div>
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawExpression}/${frequencies.expression}</span><span class="c-bgt-l">Expression</span></div>
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawSoul}/${frequencies.soul}</span><span class="c-bgt-l">Soul</span></div>
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawPersona}/${frequencies.persona}</span><span class="c-bgt-l">Persona</span></div>
    <div class="c-bgt"><span class="c-bgt-n">${frequencies.rawDestiny}/${frequencies.destiny}</span><span class="c-bgt-l">Life Calling</span></div>
  </div>
  <div class="c-ft">simulationsourcecode.com &nbsp;&#183;&nbsp; &#10022; &nbsp;&#183;&nbsp; Generated exclusively for ${name}</div>
</div>

<!-- STAR CHART -->
<div class="chart-pg">
  <div class="chart-ey">Your Frequency Map</div>
  <div class="chart-ti">The Seven Frequencies</div>
  <div class="chart-wr">${starChart}</div>
  <div class="chart-pf"><span>Simulation Source Code</span><span>${name}</span></div>
</div>

<!-- HOW TO READ -->
<div class="howto">
  <div class="howto-ey">Before You Begin</div>
  <div class="howto-ti">How to Read This Blueprint</div>
  <div class="howto-dv"></div>
  <p class="howto-in">This is not a personality profile. It is a map of the frequencies encoded in your birth date and full name &#8212; the two circuits through which your simulation runs. Read it as direction, not description.</p>
  <div class="howto-gr">
    <div class="howto-cd">
      <div class="howto-cl">Birth Date</div>
      <div class="howto-ct">The External Circuit</div>
      <div class="howto-cb">Your birth date encodes the curriculum the simulation has designed for you &#8212; the themes, resistances, and lessons life will keep presenting. Theme sets the atmospheric note. Life Path is the core curriculum. Achievement is how you are wired to move through it.</div>
    </div>
    <div class="howto-cd">
      <div class="howto-cl">Full Birth Name</div>
      <div class="howto-ct">The Internal Circuit</div>
      <div class="howto-cb">Your name encodes the frequency you are here to express. Soul is the inner world. Outer Persona is the social mask. Expression is what emerges when they fuse. This is the authentic signal beneath conditioning &#8212; your inner dominion.</div>
    </div>
    <div class="howto-cd">
      <div class="howto-cl">The Numbers</div>
      <div class="howto-ct">Positive &amp; Shadow</div>
      <div class="howto-cb">Every frequency has both a positive and shadow expression. The shadow is not a flaw &#8212; it is the unconstructed version of the same energy. The work is not to eliminate the shadow, but to understand it so it stops running on autopilot.</div>
    </div>
    <div class="howto-cd">
      <div class="howto-cl">The Fusion</div>
      <div class="howto-ct">The Life Calling</div>
      <div class="howto-cb">The Life Calling is the fusion of your Life Path and Expression. It is not a career suggestion &#8212; it is the specific directive that emerges when your external curriculum and internal frequency are run together.</div>
    </div>
  </div>
  <div class="howto-nt">
    <p><strong>On compound numbers:</strong> Every frequency is shown as compound/root (e.g. 35/8). The compound number tells the story of how the energy arrived. The root is the core operating frequency. The compound is the experience; the root is the essence. Both matter.</p>
  </div>
  <div class="howto-pf"><span>Simulation Source Code</span><span>simulationsourcecode.com</span></div>
</div>

<!-- CONTENT -->
<div class="content-pg">
  <div class="pg-hd"><span>Simulation Source Code</span><span>${name}</span></div>
  <div class="sb">${guidebookBody}</div>
  <div class="pg-ft"><span>Holographic Blueprint Reading</span><span>simulationsourcecode.com</span></div>
</div>

<!-- REFERENCE TABLE -->
<div class="ref-pg">
  <div class="ref-ey">Quick Reference</div>
  <div class="ref-ti">Your Frequency Map at a Glance</div>
  <div class="ref-dv"></div>
  <table class="ref-tb">
    <thead><tr><th>Frequency</th><th>Compound / Root</th><th>Positive</th><th>Shadow</th></tr></thead>
    <tbody>
      <tr><td><span class="ref-fl">External &#183; Atmospheric</span>Theme</td><td><span class="ref-cp">${frequencies.rawTheme}/${frequencies.theme}</span></td><td class="ref-pos">${thm_pos}</td><td class="ref-shd">${thm_shad}</td></tr>
      <tr><td><span class="ref-fl">External &#183; Curriculum</span>Life Path</td><td><span class="ref-cp">${frequencies.rawLifePath}/${frequencies.lifePath}</span></td><td class="ref-pos">${lp_pos}</td><td class="ref-shd">${lp_shad}</td></tr>
      <tr><td><span class="ref-fl">External &#183; Operational</span>Achievement</td><td><span class="ref-cp">${frequencies.rawAchievement}/${frequencies.achievement}</span></td><td class="ref-pos">${ach_pos}</td><td class="ref-shd">${ach_shad}</td></tr>
      <tr><td><span class="ref-fl">Internal &#183; Inner World</span>Soul Urge</td><td><span class="ref-cp">${frequencies.rawSoul}/${frequencies.soul}</span></td><td class="ref-pos">${soul_pos}</td><td class="ref-shd">${soul_shad}</td></tr>
      <tr><td><span class="ref-fl">Internal &#183; Social Mask</span>Outer Persona</td><td><span class="ref-cp">${frequencies.rawPersona}/${frequencies.persona}</span></td><td class="ref-pos">${per_pos}</td><td class="ref-shd">${per_shad}</td></tr>
      <tr><td><span class="ref-fl">Internal &#183; Authentic Signal</span>Expression</td><td><span class="ref-cp">${frequencies.rawExpression}/${frequencies.expression}</span></td><td class="ref-pos">${exp_pos}</td><td class="ref-shd">${exp_shad}</td></tr>
      <tr><td><span class="ref-fl">The Directive</span>Life Calling</td><td><span class="ref-cp">${frequencies.rawDestiny}/${frequencies.destiny}</span></td><td class="ref-pos">${dst_pos}</td><td class="ref-shd">${dst_shad}</td></tr>
    </tbody>
  </table>
  <div class="ref-pf"><span>Simulation Source Code</span><span>${name} &nbsp;&#183;&nbsp; ${dob}</span></div>
</div>

<!-- QUEST DIRECTIVE -->
<div class="quest-pg">
  <div class="q-ey">&#10022; &nbsp; Final Transmission &nbsp; &#10022;</div>
  <div class="q-ti">Quest Directive</div>
  <div class="q-dv"></div>
  <div class="q-tx">${(guidebookBody.match(/<h2[^>]*>[^<]*Quest[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i) || ['',''])[1].replace(/<[^>]+>/g,'').trim()}</div>
  <div class="q-br">
    <svg class="q-bs" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4a9494" stop-opacity="0.3"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/></radialGradient></defs><circle cx="80" cy="80" r="72" fill="none" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/><circle cx="80" cy="80" r="36" fill="url(#sg2)"/><line x1="80" y1="14" x2="80" y2="146" stroke="#4a9494" stroke-width="1" opacity="0.4"/><line x1="14" y1="80" x2="146" y2="80" stroke="#4a9494" stroke-width="1" opacity="0.4"/><circle cx="80" cy="16" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="144" cy="80" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="80" cy="144" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="16" cy="80" r="8" fill="#03020a" stroke="#4a9494" stroke-width="1"/><circle cx="80" cy="80" r="18" fill="#03020a" stroke="#c9a84c" stroke-width="1.5"/></svg>
    <div class="q-bn">Simulation Source Code</div>
    <div class="q-bu">simulationsourcecode.com</div>
    <div class="q-sc">
      <a href="https://www.instagram.com/simulationsourcecode">Instagram</a>
      <a href="https://www.youtube.com/@kytholek">YouTube</a>
      <a href="https://substack.com/@kyelthomas">Substack</a>
      <a href="https://www.tiktok.com/@kytholek">TikTok</a>
    </div>
  </div>
</div>

</body>
</html>`;
}

// ── Simple notification email ─────────────────────────────────────────────
function buildNotificationEmail(name, email, frequencies) {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body{margin:0;padding:0;background-color:#05040a;font-family:Georgia,serif;color:#e8dfc8}.wrap{max-width:560px;margin:0 auto;padding:48px 32px}.sigil{text-align:center;font-size:32px;color:#c9a84c;margin-bottom:24px}.eyebrow{font-family:Arial,sans-serif;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:#4a9494;text-align:center;margin-bottom:12px}.title{font-size:26px;color:#e8c96b;font-weight:normal;text-align:center;margin-bottom:8px}.sub{font-size:14px;color:#9b9080;font-style:italic;text-align:center;margin-bottom:36px}.divider{height:1px;background:rgba(201,168,76,0.15);margin:32px 0}.body{font-size:16px;line-height:1.8;color:#9b9080;margin-bottom:20px}.body strong{color:#e8dfc8}.freqs{background:rgba(13,11,24,0.9);border:1px solid rgba(201,168,76,0.15);border-radius:8px;padding:20px;margin:28px 0;text-align:center}.badge{display:inline-block;background:rgba(74,148,148,0.12);border:1px solid rgba(126,200,200,0.25);border-radius:4px;padding:4px 10px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#7ec8c8;margin:3px}.ft{font-family:Arial,sans-serif;font-size:10px;color:#5c5448;text-align:center;letter-spacing:.15em;text-transform:uppercase;line-height:1.8}.ft a{color:#7a6330;text-decoration:none}</style></head><body><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#05040a;"><tr><td align="center" style="padding:40px 16px;"><div class="wrap"><div class="sigil">&#10022;</div><div class="eyebrow">Simulation Source Code</div><div class="title">Your Blueprint is Ready</div><div class="sub">${firstName} &mdash; your complete frequency guidebook is attached</div><div class="divider"></div><p class="body">Your <strong>Holographic Blueprint Reading</strong> is attached as a PDF. Open it to access your complete seven-frequency analysis &mdash; External Circuit, Internal Circuit, Life Calling, and Quest Directive.</p><div class="freqs"><span class="badge">Theme &middot; ${frequencies.rawTheme}/${frequencies.theme}</span><span class="badge">Life Path &middot; ${frequencies.rawLifePath}/${frequencies.lifePath}</span><span class="badge">Achievement &middot; ${frequencies.rawAchievement}/${frequencies.achievement}</span><span class="badge">Expression &middot; ${frequencies.rawExpression}/${frequencies.expression}</span><span class="badge">Soul &middot; ${frequencies.rawSoul}/${frequencies.soul}</span><span class="badge">Persona &middot; ${frequencies.rawPersona}/${frequencies.persona}</span><span class="badge">Life Calling &middot; ${frequencies.rawDestiny}/${frequencies.destiny}</span></div><div class="divider"></div><div class="ft">Simulation Source Code &nbsp;&middot;&nbsp; <a href="https://simulationsourcecode.com">simulationsourcecode.com</a><br>Generated exclusively for ${email}</div></div></td></tr></table></body></html>`;
}
