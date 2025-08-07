const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter((file) => file.endsWith('.test.js'));

for (const file of testFiles) {
  const result = spawnSync('node', [path.join(testsDir, file)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--require=./tests/stripe-mock.js' },
  });
  if (result.status !== 0) {
    process.exit(result.status);
  }
}
