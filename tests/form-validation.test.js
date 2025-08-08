function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

(async () => {
  const { getDonationAmount, isValidAmount } = await import('../js/donationHelpers.mjs');
  try {
    let amount = getDonationAmount({ amount: '1000', custom_amount: '' });
    assert(amount === 1000, 'Preset amount parsed incorrectly');
    assert(isValidAmount(amount), 'Preset amount should be valid');

    amount = getDonationAmount({ amount: '', custom_amount: '50' });
    assert(amount === 5000, 'Custom amount conversion failed');
    assert(isValidAmount(amount), 'Custom amount should be valid');

    amount = getDonationAmount({ amount: '', custom_amount: '' });
    assert(!isValidAmount(amount), 'Missing amount should be invalid');

    amount = getDonationAmount({ amount: '', custom_amount: '-5' });
    assert(!isValidAmount(amount), 'Negative amount should be invalid');

    console.log('Test passed: Form validation helpers work correctly');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  }
})();
