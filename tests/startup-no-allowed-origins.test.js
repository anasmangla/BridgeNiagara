const { spawn } = require('child_process');

(async () => {
  const env = {
    ...process.env,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
    SUCCESS_URL: 'https://example.com/success',
    CANCEL_URL: 'https://example.com/cancel',
    PORT: '5557',
    STRIPE_WEBHOOK_SECRET: 'whsec_test'
  };
  delete env.ALLOWED_ORIGINS;

  const server = spawn('node', ['server.js'], {
    env,
    stdio: 'inherit'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const response = await fetch('http://localhost:5557/config');
    if (response.status !== 200) {
      throw new Error(`Expected 200 from /config, got ${response.status}`);
    }
    console.log('Test passed: Server starts without ALLOWED_ORIGINS');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
})();
