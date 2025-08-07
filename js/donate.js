// Donation page interactions
window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.donate-tab');
  const modeInput = document.getElementById('donation-mode');
  const form = document.getElementById('donation-form');
  const amountButtons = document.querySelectorAll('.amount-btn');
  const amountInput = document.getElementById('amount');
  const customInput = document.querySelector('input[name="custom_amount"]');

  amountButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountButtons.forEach((b) => b.classList.remove('bg-green-700', 'text-white'));
      btn.classList.add('bg-green-700', 'text-white');
      amountInput.value = btn.dataset.value;
      if (customInput) customInput.value = '';
    });
  });

  if (customInput) {
    customInput.addEventListener('input', () => {
      amountInput.value = '';
      amountButtons.forEach((b) => b.classList.remove('bg-green-700', 'text-white'));
    });
  }

  // Determine base URL from environment or current origin
  const SERVER_URL =
    (typeof window !== 'undefined' && window.SERVER_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.SERVER_URL) ||
    window.location.origin;

  // Prefill donation amount from query parameter
  const params = new URLSearchParams(window.location.search);
  const amountParam = params.get('amount');
  if (amountParam) {
    const presetValues = ['10000', '50000', '100000', '150000', '200000'];
    if (presetValues.includes(amountParam)) {
      const btn = document.querySelector(`.amount-btn[data-value="${amountParam}"]`);
      if (btn) btn.click();
    } else if (customInput) {
      customInput.value = amountParam;
    }
  }

  // Tab switching logic
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('bg-green-700', 'text-white');
        t.classList.add('bg-gray-200', 'text-gray-800');
      });
      tab.classList.remove('bg-gray-200', 'text-gray-800');
      tab.classList.add('bg-green-700', 'text-white');
      modeInput.value = tab.dataset.mode;
    });
  });

  // Submit logic
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (!data.amount) {
      const custom = parseFloat(data.custom_amount || '0');
      data.amount = Math.round(custom * 100);
    } else {
      data.amount = parseInt(data.amount, 10);
    }
    delete data.custom_amount;

    data.mode = data.mode === 'subscription' ? 'subscription' : 'payment';

    try {
      const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else alert('Something went wrong. Please try again.');
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while processing your donation.');
    }
  });
});

