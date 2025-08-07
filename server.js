require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { STRIPE_SECRET_KEY, SUCCESS_URL, CANCEL_URL } = process.env;

if (!STRIPE_SECRET_KEY || !SUCCESS_URL || !CANCEL_URL) {
  console.error(
    'Missing required environment variables: STRIPE_SECRET_KEY, SUCCESS_URL, and CANCEL_URL must be defined.'
  );
  process.exit(1);
}

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const rateLimit = require('express-rate-limit');
const app = express();

// Basic rate limiting to prevent abuse
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

const corsOptions = allowedOrigins.includes('*')
  ? { origin: true }
  : {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/config', (req, res) => {
  res.json({ mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '' });
});

app.post('/create-checkout-session', async (req, res) => {

  try {
    const { amount, mode, name, email, phone } = req.body;
    const donationAmount = parseInt(amount, 10);
    if (!Number.isInteger(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode || 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Bridge Niagara Donation' },
            unit_amount: donationAmount,
          },
          quantity: 1,
        },
      ],
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      customer_email: email || undefined,
      metadata: {
        name: name || '',
        email: email || '',
        phone: phone || ''
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/submit-form', (req, res) => {
  const { name, email, message, formType } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  console.log(`Form submission (${formType || 'general'}):`, { name, email, message });
  res.json({ success: true });
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Server running on port ${port}`));
