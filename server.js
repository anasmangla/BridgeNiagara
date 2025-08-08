require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs/promises');
const {
  STRIPE_SECRET_KEY,
  SUCCESS_URL,
  CANCEL_URL,
  ALLOWED_ORIGINS,
  STRIPE_WEBHOOK_SECRET,
} = process.env;

if (!ALLOWED_ORIGINS) {
  console.warn('ALLOWED_ORIGINS not set; using default origin list.');
}

if (!STRIPE_SECRET_KEY || !SUCCESS_URL || !CANCEL_URL) {
  console.error(
    'Missing required environment variables: STRIPE_SECRET_KEY, SUCCESS_URL, and CANCEL_URL must be defined.'
  );
  process.exit(1);
}

if (!STRIPE_WEBHOOK_SECRET) {
  console.error('Missing STRIPE_WEBHOOK_SECRET environment variable.');
  process.exit(1);
}

const stripe = require('stripe')(STRIPE_SECRET_KEY);

const rateLimit = require('express-rate-limit');
const app = express();

// Basic rate limiting to prevent abuse
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

const defaultAllowedOrigins = [
  'https://bridgeniagara.org',
  'https://www.bridgeniagara.org',
];
const envAllowedOrigins = ALLOWED_ORIGINS;
// When ALLOWED_ORIGINS is not set, fall back to the default list above.
const allowedOrigins = envAllowedOrigins
  ? Array.from(
      new Set(
        envAllowedOrigins
          .split(',')
          .map((o) => o.trim())
          .concat(defaultAllowedOrigins)
      )
    )
  : defaultAllowedOrigins;

const corsOptions = !allowedOrigins || allowedOrigins.includes('*')
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

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      const { metadata, amount_total, id, created } = session;
      const donation = {
        metadata,
        amount_total,
        id,
        created: created
          ? new Date(created * 1000).toISOString()
          : new Date().toISOString(),
      };
      try {
        await fs.mkdir('data', { recursive: true });
        const filePath = 'data/donations.json';
        const tempPath = `${filePath}.tmp`;
        const lockPath = `${filePath}.lock`;
        const lock = await fs
          .open(lockPath, 'wx')
          .catch((err) => {
            if (err.code === 'EEXIST') {
              throw new Error('Unable to acquire lock for donations file');
            }
            throw err;
          });
        try {
          let donations = [];
          try {
            const existing = await fs.readFile(filePath, 'utf8');
            donations = JSON.parse(existing);
          } catch (err) {
            if (err.code !== 'ENOENT') {
              throw err;
            }
          }
          donations.push(donation);
          await fs.writeFile(tempPath, JSON.stringify(donations, null, 2));
          await fs.rename(tempPath, filePath);
        } finally {
          await lock.close();
          await fs.unlink(lockPath).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to store donation:', err);
        return res.status(500).send('Failed to process donation.');
      }
    }
  }

  res.status(200).send();
});

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

    // Donation details are persisted via the webhook after successful payment
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/submit-form', async (req, res) => {
  const { name, email, phone, program, availability, message, formType } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const MAX_MESSAGE_LENGTH = 500;
  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
  }

  try {
    const submission = {
      name,
      email,
      phone: phone || '',
      program: program || '',
      availability: availability || '',
      message: message || '',
      formType: formType || 'general',
      date: new Date().toISOString(),
    };

    await fs.mkdir('data', { recursive: true });
    const filePath = 'data/submissions.json';
    let submissions = [];
    try {
      const existing = await fs.readFile(filePath, 'utf8');
      submissions = JSON.parse(existing);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    submissions.push(submission);
    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));

    res.json({ message: 'Form submitted successfully.' });
  } catch (err) {
    console.error('Failed to store form submission:', err);
    res.status(500).json({ error: 'Failed to process submission.' });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Server running on port ${port}`));
