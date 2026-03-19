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
    await resend.emails.send({
      from:    process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to:      email,
      subject: `✦ Your Simulation Source Code Guidebook`,
      html:    guidebookHtml,
    });
    console.log(`Guidebook emailed to ${email}`);
  } catch (err) {
    console.error('Email send failed:', err.message);
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

  const lifePath   = reduceToSingle(
    [...String(month), ...String(day), ...String(year)].reduce((a,c) => a + Number(c), 0)
  );
  const achievement = reduceToSingle(month + day);
  const theme       = reduceToSingle(
    String(year).split('').reduce((a,d) => a + Number(d), 0)
  );

  // Expression: reduce each name word separately then sum
  const expression = reduceToSingle(
    name.trim().split(/\s+/).reduce((total, word) => {
      const wordSum = word.toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a,c) => a + letterValue(c), 0);
      return total + reduceToSingle(wordSum);
    }, 0)
  );

  const soul    = reduceToSingle(chars.filter(c => VOWELS.has(c)).reduce((a,c) => a + letterValue(c), 0));
  const persona = reduceToSingle(chars.filter(c => !VOWELS.has(c)).reduce((a,c) => a + letterValue(c), 0));
  const destiny = reduceToSingle(expression + lifePath);

  return { lifePath, achievement, theme, expression, soul, persona, destiny };
}

// ── Guidebook Generator ───────────────────────────────────────────────────
async function generateGuidebook({ name, month, day, year, frequencies, email }) {
  const months = ['','January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dob = `${months[month]} ${day}, ${year}`;
  const firstName = name.split(' ')[0];

  const prompt = `You are the author of the Simulation Source Code system — a consciousness framework that decodes life as a simulated experience through seven numerological frequencies.

Write a complete, deeply personalised FREQUENCY GUIDEBOOK for the following person.

PERSONAL DATA:
- Full birth name: ${name}
- Date of birth: ${dob}

THEIR SEVEN FREQUENCIES:
1. Theme (birth year):       ${frequencies.theme}
2. Life Path (full DOB):     ${frequencies.lifePath}
3. Achievement (month+day):  ${frequencies.achievement}
4. Expression (all letters): ${frequencies.expression}
5. Soul (vowels):            ${frequencies.soul}
6. Persona (consonants):     ${frequencies.persona}
7. Destiny (expression+LP):  ${frequencies.destiny}

GUIDELINES:
- Write in an elevated, mystical yet grounded tone.
- Address ${firstName} directly throughout.
- For EACH frequency: explain its archetype, gifts, shadow/challenge, and 2-3 integration practices.
- Include a section on how their key frequencies interact.
- End with a "Quest Directive" — a powerful paragraph about what ${firstName}'s simulation is asking them to master.
- Use HTML: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>. No markdown.
- Length: 1200-1800 words.
- Start directly with the content. No preamble.`;

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
  body { margin:0; padding:0; background:#05040a; font-family:'Georgia',serif; color:#e8dfc8; }
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
<body>
<div class="wrapper">
  <div class="header">
    <div class="header-eyebrow">Simulation Source Code</div>
    <h1 class="header-title">Your Complete Frequency Guidebook</h1>
    <p class="header-name">${name} · ${dob}</p>
  </div>
  <div class="freq-row">
    <span class="freq-badge">Theme · ${frequencies.theme}</span>
    <span class="freq-badge">Life Path · ${frequencies.lifePath}</span>
    <span class="freq-badge">Achievement · ${frequencies.achievement}</span>
    <span class="freq-badge">Expression · ${frequencies.expression}</span>
    <span class="freq-badge">Soul · ${frequencies.soul}</span>
    <span class="freq-badge">Persona · ${frequencies.persona}</span>
    <span class="freq-badge">Destiny · ${frequencies.destiny}</span>
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
</body>
</html>`;
}
