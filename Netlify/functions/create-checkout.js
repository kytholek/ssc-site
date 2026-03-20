const ALLOWED_ORIGINS = [
  'https://simulationsourcecode.com',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
];

function getCorsHeaders(requestOrigin) {
  const origin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : 'https://simulationsourcecode.com';
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: getCorsHeaders(event.headers.origin), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { email, name, month, day, year } = body;

  if (!email) {
    return {
      statusCode: 400,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email required' }),
    };
  }

  let stripe;
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch(e) {
    return {
      statusCode: 500,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Stripe load failed: ' + e.message }),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: 3700,
          product_data: {
            name: 'SSC Holographic Blueprint Reading',
            description: 'Your complete personalised frequency guidebook — all 7 frequencies, star chart, shadow work, and Quest Directive. Delivered as a branded PDF.',
          },
        },
        quantity: 1,
      }],
      metadata: {
        email:  email        || '',
        name:   name         || '',
        month:  String(month || ''),
        day:    String(day   || ''),
        year:   String(year  || ''),
      },
      success_url: 'https://simulationsourcecode.com/?payment=success',
      cancel_url:  'https://simulationsourcecode.com/?payment=cancelled',
    });

    console.log('Session created:', session.id);

    return {
      statusCode: 200,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
