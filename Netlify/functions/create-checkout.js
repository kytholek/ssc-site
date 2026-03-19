/**
 * netlify/functions/create-checkout.js
 * ══════════════════════════════════════════════════════════════
 * Creates a Stripe Checkout Session with the user's name + DOB
 * stored in metadata, then returns the session URL.
 *
 * Called by handleUnlockPayment() in calculator.js via fetch().
 * ══════════════════════════════════════════════════════════════
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { email, name, month, day, year } = body;

  if (!email) {
    return { statusCode: 400, body: 'Email required' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: 2700, // $27.00 in cents
          product_data: {
            name: 'SSC Full Frequency Guidebook',
            description: 'Your complete personalised numerology guidebook — all 7 frequencies, shadow work, and integration practices.',
          },
        },
        quantity: 1,
      }],
      metadata: {
        email,
        name:  name  || '',
        month: String(month || ''),
        day:   String(day   || ''),
        year:  String(year  || ''),
      },
      success_url: `${process.env.SITE_URL || 'https://simulationsourcecode.com'}/?payment=success`,
      cancel_url:  `${process.env.SITE_URL  || 'https://simulationsourcecode.com'}/?payment=cancelled`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe session creation failed:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
