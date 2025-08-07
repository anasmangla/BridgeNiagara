const { spawn } = require('child_process');

(async () => {
  const server = spawn('node', ['server.js'], {
    env: {
      ...process.env,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      SUCCESS_URL: 'https://example.com/success',
      CANCEL_URL: 'https://example.com/cancel',
      ALLOWED_ORIGINS: '*',
      PORT: '5556'
    },
    stdio: 'inherit'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Invalid amount should return 400
    let response = await fetch('http://localhost:5556/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: -100 })
    });
    if (response.status !== 400) {
      throw new Error(`Expected 400 for invalid amount, got ${response.status}`);
    }
    const body = await response.json();
    if (!body.error) {
      throw new Error('Expected error message for invalid amount');
    }

    // Stripe error should return 500
    response = await fetch('http://localhost:5556/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 999 })
    });
    if (response.status !== 500) {
      throw new Error(`Expected 500 when Stripe fails, got ${response.status}`);
    }
    console.log('Test passed: Server error cases handled');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
})();
