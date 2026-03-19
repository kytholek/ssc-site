exports.handler = async (event) => {
  console.log('Function invoked, method:', event.httpMethod);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed', received: event.httpMethod }),
    };
  }

  let stripe;
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe loaded OK');
  } catch(e) {
    console.error('Stripe load failed:', e.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Stripe load failed: ' + e.message }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, hasStripeKey: !!process.env.STRIPE_SECRET_KEY }),
  };
};
