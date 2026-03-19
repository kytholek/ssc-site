/**
 * netlify/functions/create-checkout.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Log method for debugging
  console.log('HTTP Method:', event.httpMethod);
  console.log('Body:', event.body);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed', method: event.httpMethod }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { email, name, month, day, year } = body;

  if (!email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email required' }),
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
          unit_amount: 2700,
          product_data: {
            name: 'SSC Full Frequency Guidebook',
            description: 'Your complete personalised numerology guidebook — all 7 frequencies, shadow work, and integration practices.',
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
