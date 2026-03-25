/**
 * SSC — Cloudflare Worker
 * Flow: Stripe webhook → verify → waitUntil(Anthropic → PDFShift → Resend)
 *
 * Environment variables (set in Cloudflare dashboard → Workers → Settings → Variables):
 *   STRIPE_SECRET              — sk_live_...
 *   STRIPE_WEBHOOK_SECRET      — whsec_...
 *   ANTHROPIC_API_KEY          — sk-ant-...
 *   PDFSHIFT_API_KEY           — your PDFShift API key
 *   RESEND_API_KEY             — re_...
 *   FROM_EMAIL                 — readings@yourdomain.com
 *   REPLY_TO_EMAIL             — support@yourdomain.com  (optional)
 */

const ALLOWED_ORIGINS = [
  'https://simulationsourcecode.com',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
];

function corsHeaders(requestOrigin) {
  const origin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : 'https://simulationsourcecode.com';
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

export default {

  // ── Queue consumer — runs with up to 15 min, no wall-clock pressure ──
  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        await processReading(message.body, env);
        message.ack();
      } catch (err) {
        console.error('Queue consumer error — will retry:', err);
        message.retry();
      }
    }
  },

  async fetch(request, env) {
    const url    = new URL(request.url);
    const origin = request.headers.get('origin') || '';

    // ── CORS preflight ────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ── Route dispatch ────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/api/session') {
      return handleCreateCheckout(request, env, origin);
    }

    if (request.method === 'POST' && url.pathname === '/submit-email') {
      return handleSubmitEmail(request, env, origin);
    }

    if (request.method !== 'POST' || url.pathname !== '/webhook/stripe') {
      return new Response('Not found', { status: 404 });
    }

    // ── Read raw body (needed for Stripe signature verification) ──
    const rawBody = await request.text();

    // ── Verify Stripe signature ──────────────────────────────
    const signature = request.headers.get('stripe-signature');
    let stripeEvent;

    try {
      stripeEvent = await verifyStripeSignature(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Stripe signature verification failed:', err.message);
      return new Response(`Webhook signature error: ${err.message}`, { status: 400 });
    }

    // ── Only process successful checkouts ───────────────────
    if (stripeEvent.type !== 'checkout.session.completed') {
      return new Response('Event type ignored', { status: 200 });
    }

    const session = stripeEvent.data.object;

    // ── Extract user data from Stripe metadata ───────────────
    // These are set when you create the Stripe checkout session
    const userData = {
      name:       session.metadata?.name        || session.customer_details?.name || 'Seeker',
      email:      session.metadata?.email       || session.customer_details?.email,
      birthMonth: parseInt(session.metadata?.birth_month),
      birthDay:   parseInt(session.metadata?.birth_day),
      birthYear:  parseInt(session.metadata?.birth_year),
      fullName:   session.metadata?.full_name   || session.metadata?.name,
      // Pre-calculated frequencies sent as metadata from the calculator
      lifePath:   parseInt(session.metadata?.life_path),
      expression: parseInt(session.metadata?.expression),
      lifeCalling:parseInt(session.metadata?.life_calling),
      soul:       parseInt(session.metadata?.soul),
      outer:      parseInt(session.metadata?.outer),
      achievement:parseInt(session.metadata?.achievement),
      theme:      parseInt(session.metadata?.theme),
    };

    if (!userData.email) {
      console.error('No customer email found in session:', session.id);
      return new Response('Missing customer email', { status: 200 }); // still 200 so Stripe doesn't retry
    }

    // ── Push to queue — returns 200 to Stripe in <1s ─────────
    await env.READINGS_QUEUE.send(userData);

    return new Response('OK', { status: 200 });
  }
};


// ════════════════════════════════════════════════════════════
//  BACKGROUND PROCESSING CHAIN
// ════════════════════════════════════════════════════════════

async function processReading(userData, env) {
  try {
    console.log(`Processing reading for ${userData.email}`);

    // Step 1 — Generate HTML reading via Anthropic
    const readingHTML = await generateReading(userData, env);
    console.log('Anthropic reading generated');

    // Step 2 — Convert HTML to PDF via PDFShift
    const pdfBuffer = await convertToPDF(readingHTML, env);
    console.log('PDF generated, size:', pdfBuffer.byteLength);

    // Step 3 — Send email with PDF via Resend
    await sendEmail(userData, pdfBuffer, env);
    console.log(`Email sent to ${userData.email}`);

  } catch (err) {
    console.error('Background processing failed:', err);
    // TODO: add a retry queue or alert here if needed
  }
}


// ════════════════════════════════════════════════════════════
//  STEP 1 — ANTHROPIC: GENERATE HTML READING
// ════════════════════════════════════════════════════════════

async function generateReading(u, env) {

  const prompt = `You are the Simulation Source Code numerology system. Generate a complete, beautifully formatted HTML reading for the following person. The HTML will be converted to PDF so make it visually rich and print-ready.

PERSON'S DATA:
- Name: ${u.fullName || u.name}
- Birth Date: ${u.birthMonth}/${u.birthDay}/${u.birthYear}

THEIR 7 FREQUENCIES:
1. Life Path: ${u.lifePath} — What You Learn
2. Expression: ${u.expression} — What You Carry  
3. Life Calling: ${u.lifeCalling} — Your Mission
4. Soul: ${u.soul} — Your Inner Desire
5. Outer: ${u.outer} — Your Public Persona
6. Achievement: ${u.achievement} — How You Accomplish
7. Theme: ${u.theme} — Your Life Curriculum

INSTRUCTIONS:
- Write a deeply personal, specific interpretation for each frequency
- Speak directly to ${u.fullName || u.name} using "you"
- Draw connections between the frequencies — show how they interact
- Include a closing synthesis paragraph tying all 7 together
- The tone is mystical, intelligent, and grounded — not generic horoscope language
- Frame everything through the Simulation Source Code lens: these are encoded parameters in their simulation

OUTPUT: Complete HTML document with inline CSS. Dark theme: background #05040a, gold #c9a84c, text #e8e2d0. Use Google Fonts — add this exact link tag in <head>: <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">. Use font-family: 'Cinzel', serif for headings and font-family: 'EB Garamond', Georgia, serif for body text. Make it feel like a sacred document. Include the person's name prominently in the header. No markdown — pure HTML only.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':         'application/json',
      'x-api-key':            env.ANTHROPIC_API_KEY,
      'anthropic-version':    '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: 16000,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const html = data.content?.[0]?.text;

  if (!html) throw new Error('No content returned from Anthropic');

  // Strip markdown code fences if the model wrapped the HTML despite instructions
  const cleaned = html
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  if (!cleaned.match(/^<!DOCTYPE|^<html/i)) {
    console.warn('Anthropic response may not be valid HTML — first 80 chars:', cleaned.slice(0, 80));
  }

  return cleaned;
}


// ════════════════════════════════════════════════════════════
//  STEP 2 — PDFSHIFT: CONVERT HTML TO PDF
// ════════════════════════════════════════════════════════════

async function convertToPDF(html, env) {

  // PDFShift uses Basic Auth: username = api, password = your key
  const credentials = btoa(`api:${env.PDFSHIFT_API_KEY}`);

  const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify({
      source:     html,
      landscape:  false,
      use_print:  false,
      format:     'Letter',
      margin: {
        top:    '20mm',
        right:  '15mm',
        bottom: '20mm',
        left:   '15mm',
      },
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PDFShift error ${response.status}: ${err}`);
  }

  return await response.arrayBuffer();
}


// ════════════════════════════════════════════════════════════
//  STEP 3 — RESEND: EMAIL PDF TO CUSTOMER
// ════════════════════════════════════════════════════════════

async function sendEmail(userData, pdfBuffer, env) {

  const firstName = (userData.fullName || userData.name).split(' ')[0];

  // Convert PDF buffer to base64 for Resend attachment
  const pdfBase64 = arrayBufferToBase64(pdfBuffer);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from:    env.FROM_EMAIL,
      to:      [userData.email],
      reply_to: env.REPLY_TO_EMAIL || env.FROM_EMAIL,
      subject: `${firstName}, your Simulation Source Code reading is ready`,
      html: `
        <div style="background:#05040a;color:#e8e2d0;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 32px;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:#c9a84c;margin-bottom:12px;">Simulation Source Code</div>
            <h1 style="font-size:24px;font-weight:300;color:#c9a84c;margin:0 0 8px;">Your Blueprint Has Been Decoded</h1>
            <div style="width:60px;height:1px;background:#c9a84c;opacity:.4;margin:16px auto;"></div>
          </div>
          
          <p style="font-size:17px;line-height:1.8;color:#b8b0a0;margin-bottom:20px;">
            ${firstName},
          </p>
          <p style="font-size:17px;line-height:1.8;color:#b8b0a0;margin-bottom:20px;">
            Your complete Simulation Source Code reading is attached to this email as a PDF.
          </p>
          <p style="font-size:17px;line-height:1.8;color:#b8b0a0;margin-bottom:20px;">
            Inside you will find interpretations for all seven of your encoded frequencies — 
            your Life Path, Expression, Life Calling, Soul, Outer, Achievement, and Theme — 
            along with a synthesis of how they work together in your simulation.
          </p>
          <p style="font-size:15px;line-height:1.8;color:#7a7060;margin-top:40px;padding-top:24px;border-top:1px solid rgba(201,168,76,.15);">
            Simulation Source Code · <a href="https://simulationsourcecode.com" style="color:#c9a84c;text-decoration:none;">simulationsourcecode.com</a>
          </p>
        </div>
      `,
      attachments: [
        {
          filename:    `SSC-Reading-${(userData.fullName || userData.name).replace(/\s+/g, '-')}.pdf`,
          content:     pdfBase64,
          content_type: 'application/pdf',
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error ${response.status}: ${err}`);
  }

  return await response.json();
}


// ════════════════════════════════════════════════════════════
//  STRIPE SIGNATURE VERIFICATION (no Node crypto — Web Crypto API)
// ════════════════════════════════════════════════════════════

async function verifyStripeSignature(payload, signature, secret) {
  if (!signature) throw new Error('Missing stripe-signature header');

  // Parse the signature header: t=timestamp,v1=hash
  const parts = Object.fromEntries(
    signature.split(',').map(part => {
      const [key, ...val] = part.split('=');
      return [key, val.join('=')];
    })
  );

  const timestamp = parts['t'];
  const v1        = parts['v1'];

  if (!timestamp || !v1) throw new Error('Invalid stripe-signature format');

  // Reject if timestamp is more than 5 minutes old
  const tolerance = 300; // seconds
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > tolerance) {
    throw new Error('Stripe webhook timestamp too old');
  }

  // Compute expected signature using Web Crypto API
  const signedPayload = `${timestamp}.${payload}`;
  const encoder       = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  );

  const expectedSig = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison to prevent timing attacks
  if (!timingSafeEqual(expectedSig, v1)) {
    throw new Error('Stripe signature mismatch');
  }

  // Parse and return the event
  return JSON.parse(payload);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}


// ════════════════════════════════════════════════════════════
//  UTILITY
// ════════════════════════════════════════════════════════════

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}


// ════════════════════════════════════════════════════════════
//  CREATE CHECKOUT — POST /create-checkout
// ════════════════════════════════════════════════════════════

async function handleCreateCheckout(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }

  const { email, name, month, day, year,
          life_path, expression, life_calling,
          soul, outer, achievement, theme } = body;

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email required' }), {
      status: 400,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }

  try {
    const params = new URLSearchParams({
      'payment_method_types[0]':                        'card',
      'mode':                                           'payment',
      'customer_email':                                 email,
      'line_items[0][price_data][currency]':            'usd',
      'line_items[0][price_data][unit_amount]':         '0',
      'line_items[0][price_data][product_data][name]':  'SSC Guidebook Report',
      'line_items[0][price_data][product_data][description]': 'Your complete personalised frequency guidebook — all 7 frequencies decoded, shadow work, and Life Calling directive. Delivered as a PDF.',
      'line_items[0][quantity]':                        '1',
      'metadata[email]':                                email        || '',
      'metadata[name]':                                 name         || '',
      'metadata[birth_month]':                          String(month || ''),
      'metadata[birth_day]':                            String(day   || ''),
      'metadata[birth_year]':                           String(year  || ''),
      'metadata[life_path]':                            String(life_path    || ''),
      'metadata[expression]':                           String(expression   || ''),
      'metadata[life_calling]':                         String(life_calling || ''),
      'metadata[soul]':                                 String(soul         || ''),
      'metadata[outer]':                                String(outer        || ''),
      'metadata[achievement]':                          String(achievement  || ''),
      'metadata[theme]':                                String(theme        || ''),
      'success_url':                                    'https://simulationsourcecode.com/?payment=success',
      'cancel_url':                                     'https://simulationsourcecode.com/?payment=cancelled',
    });

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe error:', session.error?.message);
      return new Response(JSON.stringify({ error: session.error?.message || 'Stripe error' }), {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('create-checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }
}


// ════════════════════════════════════════════════════════════
//  SUBMIT EMAIL — POST /submit-email
// ════════════════════════════════════════════════════════════

async function handleSubmitEmail(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }

  const { email } = body;
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email required' }), {
      status: 400,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    env.FROM_EMAIL || 'readings@simulationsourcecode.com',
        to:      [email],
        subject: 'Your Free Life Path Intro — Simulation Source Code',
        html:    `<p>Thanks for connecting. Your free Life Path intro is on its way.</p><p>— Kytholek</p>`,
      }),
    });
  } catch (err) {
    console.error('submit-email error:', err);
    // Still return success — don't surface email errors to the user
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}
