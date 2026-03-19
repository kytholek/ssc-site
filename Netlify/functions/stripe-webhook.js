/**
 * netlify/functions/stripe-webhook.js
 * ════════════════════════════════════════════════════════════════
 * Listens for Stripe's `payment_intent.succeeded` webhook,
 * generates a personalised SSC Guidebook via the Claude API,
 * and emails the PDF to the customer via Resend (resend.com).
 *
 * SETUP — 5 steps:
 *  1. `npm install stripe @anthropic-ai/sdk resend`            (in repo root)
 *  2. Set these environment variables in Netlify → Site settings → Env vars:
 *       STRIPE_SECRET_KEY          sk_live_…
 *       STRIPE_WEBHOOK_SECRET      whsec_…   (from Stripe Dashboard → Webhooks)
 *       ANTHROPIC_API_KEY          sk-ant-…
 *       RESEND_API_KEY             re_…      (free tier: 3 000 emails/mo)
 *       FROM_EMAIL                 guidebook@yourdomain.com
 *  3. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *       URL: https://yourdomain.netlify.app/.netlify/functions/stripe-webhook
 *       Events: payment_intent.succeeded
 *  4. In Stripe Dashboard → Payment Links → your link → Advanced:
 *       Success URL: https://yourdomain.com/?payment=success
 *  5. Deploy to Netlify — it's live.
 * ════════════════════════════════════════════════════════════════
 */

const stripe    = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Anthropic = require('@anthropic-ai/sdk');
const { Resend } = require('resend');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend    = new Resend(process.env.RESEND_API_KEY);

// ── Netlify handler ────────────────────────────────────────────────────────
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

  // Only handle the event we care about
  if (stripeEvent.type !== 'payment_intent.succeeded') {
    return { statusCode: 200, body: 'Ignored event type' };
  }

  const paymentIntent = stripeEvent.data.object;

  // ── 2. Extract customer data ───────────────────────────────────────────
  // The client_reference_id was set in handleUnlockPayment() on the frontend:
  //   btoa(JSON.stringify({ name, month, day, year }))
  let userData = {};
  try {
    const ref = paymentIntent.metadata?.client_reference_id ||
                paymentIntent.client_reference_id || '';
    if (ref) {
      // Re-pad base64 if needed
      const padded = ref + '='.repeat((4 - ref.length % 4) % 4);
      userData = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    }
  } catch (e) {
    console.warn('Could not parse client_reference_id:', e.message);
  }

  // Get email from Stripe — try all possible sources
  let email = paymentIntent.receipt_email || paymentIntent.metadata?.email || userData.email || null;

  // If still no email, retrieve the full payment intent with customer expanded
  if (!email && paymentIntent.customer) {
    try {
      const customer = await stripe.customers.retrieve(paymentIntent.customer);
      email = customer.email || null;
      console.log('Got email from customer object:', email);
    } catch(e) {
      console.warn('Could not retrieve customer:', e.message);
    }
  }

  // Try the latest charge billing details as last resort
  if (!email && paymentIntent.latest_charge) {
    try {
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      email = charge.billing_details?.email || charge.receipt_email || null;
      console.log('Got email from charge:', email);
    } catch(e) {
      console.warn('Could not retrieve charge:', e.message);
    }
  }

  console.log('Payment intent id:', paymentIntent.id);
  console.log('All email sources:', {
    receipt_email: paymentIntent.receipt_email,
    metadata_email: paymentIntent.metadata?.email,
    userData_email: userData.email,
    customer: paymentIntent.customer,
    final_email: email
  });

  if (!email) {
    console.error('No email found on payment intent:', paymentIntent.id);
    return { statusCode: 200, body: 'No email — cannot deliver guidebook' };
  }

  const name  = userData.name  || 'Your Name';
  const month = Number(userData.month || 1);
  const day   = Number(userData.day   || 1);
  const year  = Number(userData.year  || 1990);

  // ── 3. Calculate the 7 frequencies (mirror your calculator.js logic) ───
  // Replace these placeholder calculations with your actual SSC formulas.
  const frequencies = calculateFrequencies(name, month, day, year);

  // ── 4. Generate personalised guidebook with Claude ─────────────────────
  console.log(`Generating guidebook for ${name} (${email})`);
  let guidebookHtml;
  try {
    guidebookHtml = await generateGuidebook({ name, month, day, year, frequencies, email });
  } catch (err) {
    console.error('Claude API error:', err);
    return { statusCode: 500, body: 'Guidebook generation failed' };
  }

  // ── 5. Email the guidebook ────────────────────────────────────────────
  try {
    await resend.emails.send({
      from:    process.env.FROM_EMAIL || 'guidebook@simulationsourcecode.com',
      to:      email,
      subject: `✦ Your Simulation Source Code Guidebook, ${name.split(' ')[0]}`,
      html:    guidebookHtml,
    });
    console.log(`Guidebook emailed to ${email}`);
  } catch (err) {
    console.error('Email send failed:', err);
    return { statusCode: 500, body: 'Email delivery failed' };
  }

  return { statusCode: 200, body: JSON.stringify({ delivered: true, email }) };
};

// ════════════════════════════════════════════════════════════════
// FREQUENCY CALCULATOR
// Replace the stub logic below with your actual SSC calculations.
// This should mirror calculator.js so the numbers are consistent.
// ════════════════════════════════════════════════════════════════
function reduceToSingle(n) {
  // Reduce to single digit unless 11, 22, 33 (master numbers)
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

function letterValue(char) {
  const c = char.toUpperCase();
  if (c < 'A' || c > 'Z') return 0;
  return (c.charCodeAt(0) - 64);           // A=1 … Z=26
}

function calculateFrequencies(name, month, day, year) {
  // ── Life Path (full DOB reduced) ──
  const lifePath = reduceToSingle(
    reduceToSingle(month) + reduceToSingle(day) + reduceToSingle(year)
  );

  // ── Achievement (month + day) ──
  const achievement = reduceToSingle(reduceToSingle(month) + reduceToSingle(day));

  // ── Theme (birth year reduced) ──
  const theme = reduceToSingle(
    String(year).split('').reduce((a, d) => a + Number(d), 0)
  );

  // ── Expression (all letters in full name) ──
  const expressionSum = name.toUpperCase().replace(/[^A-Z]/g, '')
    .split('').reduce((a, c) => a + letterValue(c), 0);
  const expression = reduceToSingle(expressionSum);

  // ── Soul (vowels only) ──
  const vowelSum = name.toUpperCase().replace(/[^AEIOU]/g, '')
    .split('').reduce((a, c) => a + letterValue(c), 0);
  const soul = reduceToSingle(vowelSum);

  // ── Persona (consonants only) ──
  const consonantSum = name.toUpperCase().replace(/[^B-DF-HJ-NP-TV-Z]/g, '')
    .split('').replace(/[^A-Z]/g, '')
    .split('').reduce((a, c) => a + letterValue(c), 0);
  const persona = reduceToSingle(consonantSum);

  // ── Destiny (expression + lifepath) ──
  const destiny = reduceToSingle(expression + lifePath);

  return { lifePath, achievement, theme, expression, soul, persona, destiny };
}

// ════════════════════════════════════════════════════════════════
// GUIDEBOOK GENERATOR
// Calls Claude to write the full personalised report,
// then wraps it in a branded HTML email template.
// ════════════════════════════════════════════════════════════════
async function generateGuidebook({ name, month, day, year, frequencies, email }) {
  const months = ['','January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const dob = `${months[month]} ${day}, ${year}`;
  const firstName = name.split(' ')[0];

  const prompt = `You are the author of the Simulation Source Code system — a consciousness framework
that decodes life as a simulated experience through seven numerological frequencies.

Write a complete, deeply personalised FREQUENCY GUIDEBOOK for the following person.

PERSONAL DATA:
- Full birth name: ${name}
- Date of birth: ${dob}
- Email: ${email}

THEIR SEVEN FREQUENCIES:
1. Theme (birth year):       ${frequencies.theme}
2. Life Path (full DOB):     ${frequencies.lifePath}
3. Achievement (month+day):  ${frequencies.achievement}
4. Expression (all letters): ${frequencies.expression}
5. Soul (vowels):            ${frequencies.soul}
6. Persona (consonants):     ${frequencies.persona}
7. Destiny (expression+LP):  ${frequencies.destiny}

GUIDELINES:
- Write in an elevated, mystical yet grounded tone — like a wise mentor who has decoded the simulation.
- Address ${firstName} directly throughout.
- For EACH frequency: explain its archetype, its gifts, its shadow/challenge, and 3–5 specific integration practices.
- Include a section on how their frequencies interact (especially LP + Expression + Soul).
- End with a personalised "Quest Directive" — a short, powerful paragraph about what ${firstName}'s simulation is asking them to master.
- Use HTML formatting with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags. Do NOT use markdown.
- Length: 1500–2500 words. Thorough but every sentence earns its place.
- Do NOT include a preamble or meta-commentary. Start directly with the guidebook content.`;

  const message = await anthropic.messages.create({
    model:      'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  const guidebookBody = message.content[0].text;

  // ── Wrap in branded HTML email ─────────────────────────────────────────
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

  <div class="content">
    ${guidebookBody}
  </div>

  <div class="footer">
    <p>
      Simulation Source Code &nbsp;·&nbsp; simulationsourcecode.com<br>
      This report was generated exclusively for ${email}<br>
      <a href="https://simulationsourcecode.com">Visit the site</a>
    </p>
  </div>
</div>
</body>
</html>`;
}
