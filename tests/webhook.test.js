const { spawn } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

(async () => {
  const dataDir = path.join(__dirname, '..', 'data');
  await fs.rm(dataDir, { recursive: true, force: true });

  const server = spawn('node', ['server.js'], {
    env: {
      ...process.env,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      SUCCESS_URL: 'https://example.com/success',
      CANCEL_URL: 'https://example.com/cancel',
      ALLOWED_ORIGINS: '*',
      PORT: '5557',
      STRIPE_WEBHOOK_SECRET: 'whsec_test'
    },
    stdio: 'inherit'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const paidEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_paid',
          payment_status: 'paid',
          amount_total: 2000,
          metadata: { name: 'Alice' },
          created: 1234567890
        }
      }
    };

    let response = await fetch('http://localhost:5557/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': 'test' },
      body: JSON.stringify(paidEvent)
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200 for paid event, got ${response.status}`);
    }

    const filePath = path.join(dataDir, 'donations.json');
    const donations = JSON.parse(await fs.readFile(filePath, 'utf8'));
    if (!Array.isArray(donations) || donations.length !== 1) {
      throw new Error('Paid donation was not stored');
    }
    if (!donations[0].created) {
      throw new Error('Donation timestamp missing');
    }

    const unpaidEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_unpaid',
          payment_status: 'unpaid',
          amount_total: 1000,
          metadata: { name: 'Bob' },
          created: 1234567891
        }
      }
    };

    response = await fetch('http://localhost:5557/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': 'test' },
      body: JSON.stringify(unpaidEvent)
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200 for unpaid event, got ${response.status}`);
    }

    const donationsAfter = JSON.parse(await fs.readFile(filePath, 'utf8'));
    if (donationsAfter.length !== 1) {
      throw new Error('Unpaid donation was incorrectly stored');
    }

    console.log('Test passed: Webhook stores only paid donations with timestamp');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
    await fs.rm(dataDir, { recursive: true, force: true });
  }
})();
