const ALLOWED_ORIGINS = [
  'https://simulationsourcecode.com',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
];

console.log('FUNCTION LOADED FROM: netlify/functions (lowercase)');

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
  console.log('=== create-checkout invoked ===');
  console.log('Full event keys:', Object.keys(event));
  console.log('httpMethod:', event.httpMethod);
  console.log('method:', event.method);
  console.log('requestContext:', event.requestContext);
  console.log('headers:', JSON.stringify(event.headers));
  
  // Get the HTTP method - try multiple properties
  const httpMethod = event.httpMethod || event.method || (event.requestContext && event.requestContext.http && event.requestContext.http.method);
  console.log('Resolved httpMethod:', httpMethod);
  
  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return { statusCode: 200, headers: getCorsHeaders(event.headers.origin), body: '' };
  }

  if (httpMethod !== 'POST') {
    console.error('HTTP method is not POST. Received:', httpMethod, 'Type:', typeof httpMethod);
    return {
      statusCode: 405,
      headers: { ...getCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed. Expected POST, got ' + httpMethod }),
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
          unit_amount: 0,
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
