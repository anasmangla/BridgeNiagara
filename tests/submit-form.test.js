const { spawn } = require('child_process');
const fs = require('fs/promises');

(async () => {
  const server = spawn('node', ['server.js'], {
    env: {
      ...process.env,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
      SUCCESS_URL: 'https://example.com/success',
      CANCEL_URL: 'https://example.com/cancel',
      ALLOWED_ORIGINS: '*',
      PORT: '5558',
      STRIPE_WEBHOOK_SECRET: 'whsec_test'
    },
    stdio: 'inherit'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Valid submission
    let response = await fetch('http://localhost:5558/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John Doe', email: 'john@example.com', message: 'Hello' })
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200 for valid submission, got ${response.status}`);
    }
    let body = await response.json();
    if (body.message !== 'Form submitted successfully.') {
      throw new Error('Expected success message for valid submission');
    }

    // Missing required fields
    response = await fetch('http://localhost:5558/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@example.com' })
    });
    if (response.status !== 400) {
      throw new Error(`Expected 400 for missing fields, got ${response.status}`);
    }
    body = await response.json();
    if (body.error !== 'Name and email are required.') {
      throw new Error('Expected missing fields error message');
    }

    // Invalid email
    response = await fetch('http://localhost:5558/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John Doe', email: 'invalid-email' })
    });
    if (response.status !== 400) {
      throw new Error(`Expected 400 for invalid email, got ${response.status}`);
    }
    body = await response.json();
    if (body.error !== 'Invalid email address.') {
      throw new Error('Expected invalid email error message');
    }

    // Message too long
    const longMessage = 'a'.repeat(501);
    response = await fetch('http://localhost:5558/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John Doe', email: 'john@example.com', message: longMessage })
    });
    if (response.status !== 400) {
      throw new Error(`Expected 400 for long message, got ${response.status}`);
    }
    body = await response.json();
    if (!body.error || !body.error.includes('Message must be')) {
      throw new Error('Expected long message error');
    }

    console.log('Test passed: /submit-form validates input and accepts valid submissions');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.kill();
    try {
      await fs.rm('data', { recursive: true, force: true });
    } catch {}
  }
})();
