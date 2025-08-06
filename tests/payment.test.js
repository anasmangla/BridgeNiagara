const { spawn } = require('child_process');

(async () => {
  // Start the server with test environment variables
  const server = spawn('node', ['server.js'], {
    env: {
      ...process.env,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      SUCCESS_URL: 'https://example.com/success',
      CANCEL_URL: 'https://example.com/cancel',
      ALLOWED_ORIGINS: '*',
      PORT: '5555',
      NODE_OPTIONS: '--require=./tests/stripe-mock.js'
    },
    stdio: 'inherit'
  });

  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const response = await fetch('http://localhost:5555/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.url || typeof data.url !== 'string') {
      throw new Error('Session URL was not returned');
    }

    console.log('Test passed: Session URL returned');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
})();
