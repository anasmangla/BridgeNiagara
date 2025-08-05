import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
  const { amount, mode, name, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Donation' },
          unit_amount: amount
        },
        quantity: 1
      }],
      success_url: 'http://localhost:8000/success.html',
      cancel_url: 'http://localhost:8000/donate.html',
      customer_email: email || undefined,
      metadata: { name }
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(4242, () => console.log('Server running on port 4242'));
