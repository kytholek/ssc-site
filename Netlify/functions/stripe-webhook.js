/**
 * netlify/functions/stripe-webhook.js
 */

const stripe    = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Anthropic = require('@anthropic-ai/sdk');
const { Resend } = require('resend');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend    = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // ── 1. Verify Stripe signature ─────────────────────────────────────────
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

  // ── 2. Extract customer data from checkout session metadata ───────────
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
    } catch(e) {
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

  // ── 3. Calculate frequencies ──────────────────────────────────────────
  const frequencies = calculateFrequencies(name, month, day, year);
  console.log('Frequencies:', frequencies);

  // ── 4. Generate guidebook with Claude ─────────────────────────────────
  console.log(`Generating guidebook for ${name} (${email})`);
  let guidebookHtml;
  try {
    guidebookHtml = await generateGuidebook({ name, month, day, year, frequencies, email });
  } catch (err) {
    console.error('Claude API error:', err.message);
    return { statusCode: 500, body: 'Guidebook generation failed' };
  }

  // ── 5. Send email ──────────────────────────────────────────────────────
  try {
    const resendResult = await resend.emails.send({
      from:    process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to:      email,
      subject: `✦ Your Simulation Source Code Guidebook`,
      html:    guidebookHtml,
    });
    console.log('Resend result:', JSON.stringify(resendResult));
    console.log(`Guidebook emailed to ${email}`);
  } catch (err) {
    console.error('Email send failed — full error:', JSON.stringify(err));
    return { statusCode: 500, body: 'Email delivery failed' };
  }

  return { statusCode: 200, body: JSON.stringify({ delivered: true, email }) };
};

// ── Frequency Calculator ──────────────────────────────────────────────────
function reduceToSingle(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

const LETTER_VALUES = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:11,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:22,W:5,X:6,Y:7,Z:8
};
const VOWELS = new Set(['A','E','I','O','U','Y']);

function letterValue(c) {
  return LETTER_VALUES[c.toUpperCase()] || 0;
}

function calculateFrequencies(name, month, day, year) {
  const chars = name.toUpperCase().replace(/[^A-Z]/g, '').split('');

  // Raw (compound) values before reduction
  const rawLifePath = [...String(month), ...String(day), ...String(year)].reduce((a,c) => a + Number(c), 0);
  const lifePath    = reduceToSingle(rawLifePath);

  const rawAchievement = month + day;
  const achievement    = reduceToSingle(rawAchievement);

  const rawTheme = String(year).split('').reduce((a,d) => a + Number(d), 0);
  const theme    = reduceToSingle(rawTheme);

  // Expression: reduce each name word separately then sum the word roots
  const rawExpression = name.trim().split(/\s+/).reduce((total, word) => {
    const wordSum = word.toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a,c) => a + letterValue(c), 0);
    return total + reduceToSingle(wordSum);
  }, 0);
  const expression = reduceToSingle(rawExpression);

  const rawSoul    = chars.filter(c => VOWELS.has(c)).reduce((a,c) => a + letterValue(c), 0);
  const soul       = reduceToSingle(rawSoul);

  const rawPersona = chars.filter(c => !VOWELS.has(c)).reduce((a,c) => a + letterValue(c), 0);
  const persona    = reduceToSingle(rawPersona);

  const rawDestiny = expression + lifePath;
  const destiny    = reduceToSingle(rawDestiny);

  return {
    lifePath, rawLifePath,
    achievement, rawAchievement,
    theme, rawTheme,
    expression, rawExpression,
    soul, rawSoul,
    persona, rawPersona,
    destiny, rawDestiny
  };
}

// ── Guidebook Generator ───────────────────────────────────────────────────
async function generateGuidebook({ name, month, day, year, frequencies, email }) {
  const months = ['','January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dob = `${months[month]} ${day}, ${year}`;
  const firstName = name.split(' ')[0];

  const prompt = `You are Kytholek, the author of Simulation Source Code — a consciousness framework that reads life as a holographic simulation, decoding the Source Code embedded in a person's birth date and full birth name. You write with an elevated, direct, and grounded tone — mystical but never vague. You speak plainly about complex things. You address the reader as if you have decoded their signal and are now handing them the map.

You are writing a COMPLETE HOLOGRAPHIC BLUEPRINT READING for the following person.

PERSONAL DATA:
- Full birth name: ${name}
- Date of birth: ${dob}

THEIR COMPOUND FREQUENCIES (always lead with the compound number, then show the reduction, then interpret both):
1. Theme (birth year):                    ${frequencies.rawTheme} / ${frequencies.theme}
2. Life Path (full DOB):                  ${frequencies.rawLifePath} / ${frequencies.lifePath}
3. Achievement (month + day):             ${frequencies.rawAchievement} / ${frequencies.achievement}
4. Expression (full name - all letters):  ${frequencies.rawExpression} / ${frequencies.expression}
5. Soul Urge (vowels only):               ${frequencies.rawSoul} / ${frequencies.soul}
6. Outer Persona (consonants only):       ${frequencies.rawPersona} / ${frequencies.persona}
7. Life Calling (Expression + Life Path): ${frequencies.rawDestiny} / ${frequencies.destiny}

FRAMEWORK CONTEXT (write from within this understanding):
- Life is a Holographic Simulation — the birth date is the External Circuit (what the simulation presents as lessons), the name is the Internal Circuit (the frequency encoded within for expression).
- The Life Path is not what you do — it is the THEME of the external curriculum. The flavor of resistance, challenge and growth the simulation presents. You are learning to embody this frequency through immersion.
- The Expression number is the INTERNAL FREQUENCY — the authentic signal beneath social conditioning. What you are here to express and become. Buried beneath the programming.
- The Life Calling is the fusion — the specific directive that emerges when your Life Path lesson and Expression frequency are combined into a single compound signal.
- The Soul Urge (vowels) is the private inner world — the desires, motivations and yearnings that operate beneath the surface. The inner compass.
- The Outer Persona (consonants) is the social mask — how the world first reads you before they know you. The energetic impression you leave.
- CRITICAL — Expression section: Do NOT write about Expression in isolation. The Expression is the BLEND of Soul Urge and Outer Persona coming together. The vowels (Soul) are the inner fire. The consonants (Persona) are the outer form. Together they produce the Expression signal. Write it this way — show how Soul and Outer merge to create the Expression the person carries.
- The Achievement number (month + day) is how they naturally accomplish things — their operational style for moving through tasks and goals.
- The Theme (birth year) is atmospheric — a generational frequency that flavors the whole simulation run. Less personal, more like the key the music is written in.
- Numbers carry both positive and shadow expressions. Name both without softening either.
- The compound number reveals the specific flavour and story of the energy before it reduces. The root reveals the core operating frequency beneath. Honour both — the compound is the experience, the root is the essence.

STRUCTURE TO FOLLOW (use these as HTML h2 headings):
1. Opening — address ${firstName} directly. 2-3 sentences. State what their simulation is running and what this reading is.
2. The External Circuit — Life Path ${frequencies.rawLifePath}/${frequencies.lifePath}: The curriculum the simulation has designed for them. What lessons life will bring. Positive expression and shadow expression. How to work with it.
3. The Internal Circuit — Expression ${frequencies.rawExpression}/${frequencies.expression}: Write this as the blend of Soul (${frequencies.rawSoul}/${frequencies.soul}) and Outer Persona (${frequencies.rawPersona}/${frequencies.persona}) fusing into Expression. Show how the inner desire (Soul) and the social mask (Outer) combine to produce the authentic frequency this person is encoded to express. Shadow and positive. What integration looks like.
4. The Life Calling — ${frequencies.rawDestiny}/${frequencies.destiny}: The specific mission directive. What happens when Life Path and Expression are run together. The compound number story, the root essence, and the practical directive.
5. Achievement — ${frequencies.rawAchievement}/${frequencies.achievement}: How they are wired to accomplish. Operational style. Where they thrive and where they stall.
6. Theme — ${frequencies.rawTheme}/${frequencies.theme}: The atmospheric frequency of their birth year. The generational note their simulation is written in.
7. The Frequency Interaction — How their key numbers speak to each other. Where the friction lives. Where the alignment is. What the simulation is asking them to integrate.
8. Quest Directive — A single, powerful closing paragraph. Direct. Personal. What ${firstName}'s simulation is asking them to master in this run. Written like a transmission, not a summary.

TONE AND VOICE RULES:
- Write like a knowledgeable guide having a real conversation — not a mystic performing a ritual. Direct, warm, and clear. No theatrical language. No phrases like "this is not an accident" or "the universe has spoken" or "it is written in the stars." Just say what the number means and what it asks of the person.
- Grounded first, elevated when it earns it. If a sentence sounds like it belongs on a crystal shop wall, rewrite it.
- Use SSC language naturally — simulation, blueprint, external circuit, internal circuit, encoded frequency, conditioning, authentic signal, embodiment, integration — but don't overdo it. Use it where it clarifies, not where it decorates.
- Do NOT use generic affirmation language: "you are a natural leader", "you have a gift for", "the universe supports you." Say what the frequency actually encodes and what it asks of the person practically.
- Be specific. Vague is useless. If you're writing about a 4 Life Path, say what the 4 actually demands of them — not just "structure and discipline."
- Do NOT pad. If a sentence doesn't add something real, cut it.
- Do NOT over-mystify. The power is in the precision, not the poetry.

MASTER NUMBER RULES:
- Master numbers (11, 22, 33, 44) do NOT reduce in the standard way, but they always carry the energy of their root as the foundation they operate from.
- 11 operates from the platform of 2 — but at a higher octave. Always briefly describe what the root (2) means as the base, then explain how 11 elevates or intensifies that energy.
- 22 operates from 4 as its foundation. 33 from 6. 44 from 8. Always acknowledge the root.
- Example for 11: "11 carries the core sensitivity and relational awareness of 2, but amplified — turned up to a frequency that can bridge rather than just connect. The 2 beneath it is still present; the lesson of partnership, balance, and receptivity still applies. What 11 adds is the channel — a heightened sensitivity that, when grounded, becomes genuine insight."
- If the compound AND root are both master numbers (e.g. raw=22, root=22), note that there is no reduction — the frequency is undiluted. This is rare and worth naming plainly, not dramatically.

FORMAT:
- Use HTML: <h2> for main sections, <h3> for sub-points, <p> for body, <ul><li> for shadow/positive lists. No markdown. No preamble.
- Length: 1500-2000 words. Dense and useful.
- Begin directly with the Opening section. No title. No preamble.`;

  const message = await anthropic.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  });

  const guidebookBody = message.content[0].text;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Simulation Source Code Guidebook</title>
<style>
  body { margin:0; padding:0; background:#05040a !important; background-color:#05040a !important; font-family:'Georgia',serif; color:#e8dfc8; }
  * { -webkit-text-size-adjust:none; }
  .wrapper { background-color:#05040a !important; }
  .wrapper { max-width:680px; margin:0 auto; padding:40px 24px 60px; }
  .header { text-align:center; padding-bottom:32px; border-bottom:1px solid rgba(201,168,76,.2); margin-bottom:40px; }
  .header-eyebrow { font-family:Arial,sans-serif; font-size:10px; letter-spacing:.4em; text-transform:uppercase; color:#4a9494; margin-bottom:12px; }
  .header-title { font-size:28px; color:#e8c96b; font-weight:normal; letter-spacing:.05em; margin:0 0 8px; }
  .header-name { font-size:16px; color:#9b9080; font-style:italic; margin:0; }
  .freq-badge { display:inline-block; background:rgba(74,148,148,.15); border:1px solid rgba(126,200,200,.3); border-radius:4px; padding:4px 12px; font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#7ec8c8; font-family:Arial,sans-serif; margin:0 4px 8px; }
  .freq-row { text-align:center; margin-bottom:40px; }
  .content h2 { font-size:22px; color:#e8c96b; font-weight:normal; letter-spacing:.05em; margin:40px 0 12px; padding-bottom:8px; border-bottom:1px solid rgba(201,168,76,.15); }
  .content h3 { font-size:17px; color:#c9a84c; font-weight:normal; letter-spacing:.03em; margin:28px 0 8px; }
  .content p { font-size:16px; line-height:1.8; color:#d4cbb8; margin:0 0 16px; }
  .content ul { padding-left:24px; margin:0 0 16px; }
  .content li { font-size:16px; line-height:1.75; color:#d4cbb8; margin-bottom:6px; }
  .content strong { color:#e8dfc8; }
  .content em { color:#c9a84c; font-style:italic; }
  .footer { margin-top:56px; padding-top:24px; border-top:1px solid rgba(201,168,76,.12); text-align:center; }
  .footer p { font-family:Arial,sans-serif; font-size:11px; color:#5c5448; letter-spacing:.15em; text-transform:uppercase; line-height:1.7; }
  .footer a { color:#7a6330; text-decoration:none; }
</style>
</head>
<body style="margin:0;padding:0;background-color:#05040a;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#05040a;">
<tr><td align="center" style="background-color:#05040a;padding:40px 16px;">
<div class="wrapper" style="background-color:#05040a;">
  <div class="header">
    <div class="header-eyebrow">Simulation Source Code</div>
    <h1 class="header-title">Your Complete Frequency Guidebook</h1>
    <p class="header-name">${name} · ${dob}</p>
  </div>
  <div class="freq-row">
    <span class="freq-badge">Theme · ${frequencies.rawTheme}/${frequencies.theme}</span>
    <span class="freq-badge">Life Path · ${frequencies.rawLifePath}/${frequencies.lifePath}</span>
    <span class="freq-badge">Achievement · ${frequencies.rawAchievement}/${frequencies.achievement}</span>
    <span class="freq-badge">Expression · ${frequencies.rawExpression}/${frequencies.expression}</span>
    <span class="freq-badge">Soul · ${frequencies.rawSoul}/${frequencies.soul}</span>
    <span class="freq-badge">Persona · ${frequencies.rawPersona}/${frequencies.persona}</span>
    <span class="freq-badge">Life Calling · ${frequencies.rawDestiny}/${frequencies.destiny}</span>
  </div>
  <div class="content">${guidebookBody}</div>
  <div class="footer">
    <p>
      Simulation Source Code &nbsp;·&nbsp; simulationsourcecode.com<br>
      Generated exclusively for ${email}<br>
      <a href="https://simulationsourcecode.com">Visit the site</a>
    </p>
  </div>
</div>
</td></tr>
</table>
</body>
</html>`;
}
