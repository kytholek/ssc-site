# Stripe → Guidebook Automation — Setup Guide

## What you're deploying

| File | What it does |
|---|---|
| `calculator.html` | Replaces `pages/calculator.html` — adds the Unlock CTA after results |
| `stripe-cta.css` | New styles for the CTA card — add to `css/` and link in `index.html` |
| `stripe-webhook.js` | Netlify serverless function — runs on every successful payment |

---

## Step 1 — Netlify (free hosting for the function)

If your site isn't on Netlify yet:
1. Go to **netlify.com** → drag-and-drop your site folder to deploy.
2. Your site gets a URL like `https://yoursite.netlify.app`.

Then:
1. In your project root, create this folder structure:
   ```
   netlify/
     functions/
       stripe-webhook.js   ← paste the file here
   ```
2. In your project root, create (or edit) `netlify.toml`:
   ```toml
   [build]
     functions = "netlify/functions"
   ```
3. Run `npm init -y` in your project root (if no `package.json` yet), then:
   ```bash
   npm install stripe @anthropic-ai/sdk resend
   ```
4. Push / redeploy to Netlify.

---

## Step 2 — Environment variables (in Netlify Dashboard)

Go to **Site settings → Environment variables** and add:

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `RESEND_API_KEY` | resend.com → free account → API Keys |
| `FROM_EMAIL` | e.g. `guidebook@yourdomain.com` (must be verified in Resend) |

---

## Step 3 — Create your Stripe product + Payment Link

1. **Stripe Dashboard → Products → Add product**
   - Name: `SSC Full Frequency Guidebook`
   - Price: `$27.00` (one-time)

2. **Create a Payment Link** for that product.

3. In the Payment Link settings → **Advanced**:
   - ✅ Collect email address: **On**
   - Success URL: `https://yourdomain.com/?payment=success`

4. Copy the Payment Link URL (looks like `https://buy.stripe.com/abc123…`)

5. Paste it into `calculator.html` on this line:
   ```html
   data-stripe-url="https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE"
   ```

---

## Step 4 — Register the webhook with Stripe

1. **Stripe Dashboard → Developers → Webhooks → Add endpoint**
   - URL: `https://yoursitename.netlify.app/.netlify/functions/stripe-webhook`
   - Events to listen to: `payment_intent.succeeded`

2. After saving, click the endpoint → copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in Netlify.

---

## Step 5 — Drop the files into your project

1. Copy `calculator.html` → replace `pages/calculator.html`
2. Copy `stripe-cta.css` → save as `css/stripe-cta.css`
3. In `index.html`, add this line after the existing stylesheet links:
   ```html
   <link rel="stylesheet" href="css/stripe-cta.css">
   ```

---

## Step 6 — Wire up the show/hide in calculator.js

After your `calculateReading()` function renders results, add **one line**:

```javascript
// At the very end of calculateReading(), after results are shown:
var cta = document.getElementById('unlock-cta');
if (cta) {
  cta.style.display = 'block';
  cta.setAttribute('aria-hidden', 'false');
  // Smooth scroll into view
  setTimeout(function() {
    cta.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}
```

---

## Step 7 — Test end-to-end

1. Use Stripe's **test mode** — your test Payment Link will be at a different URL.
2. Use test card: `4242 4242 4242 4242` / any future date / any CVC.
3. After payment, you'll be redirected to `?payment=success` and see the toast.
4. Check your Netlify function logs: **Netlify Dashboard → Functions → stripe-webhook → Logs**.
5. Confirm the email arrives.

Switch to **live mode** keys when ready to go live.

---

## How the data flows

```
User fills calculator
      ↓
calculateReading() renders 7 frequencies
      ↓
Unlock CTA appears (calculator.html)
      ↓
User enters email → clicks button
      ↓
handleUnlockPayment():
  - stores { name, DOB, email } in sessionStorage
  - encodes name+DOB as base64 → appended to Stripe URL as client_reference_id
  - redirects to Stripe Checkout
      ↓
User pays on Stripe
      ↓
Stripe fires payment_intent.succeeded webhook
      ↓
stripe-webhook.js:
  - verifies Stripe signature
  - decodes client_reference_id to get name + DOB
  - re-calculates 7 frequencies (same logic as calculator.js)
  - calls Claude API → generates 1500–2500 word personalised guidebook
  - wraps in branded HTML email
  - sends via Resend to customer email
      ↓
Customer receives their guidebook ✦
      ↓
User is redirected to /?payment=success → toast confirmation shown
```

---

## Pricing (all free tiers cover early-stage volume)

| Service | Free tier |
|---|---|
| Netlify Functions | 125k requests/month |
| Stripe | No monthly fee — 2.9% + 30¢ per transaction |
| Anthropic API | Pay-per-use — ~$0.08–0.15 per guidebook (Opus) |
| Resend | 3,000 emails/month free |

At $27/guidebook, your margin after fees and AI generation cost is approximately **$26.50** per sale.
