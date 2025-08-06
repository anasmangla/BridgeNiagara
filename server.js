require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
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

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Server running on port ${port}`));
