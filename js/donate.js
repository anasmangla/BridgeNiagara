import { getDonationAmount, isValidAmount } from './donationHelpers.mjs';

// Donation page interactions (modified)
window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.donate-tab');
  const modeInput = document.getElementById('donation-mode');
  const form = document.getElementById('donation-form');
  const amountButtons = document.querySelectorAll('.amount-btn');
  const amountInput = document.getElementById('amount');
  const customInput = document.querySelector('input[name="custom_amount"]');
  const errorMessage = document.getElementById('error-message');

  // Highlight selected preset amount and clear custom input
  amountButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountButtons.forEach((b) => b.classList.remove('bg-green-700', 'text-white'));
      btn.classList.add('bg-green-700', 'text-white');
      amountInput.value = btn.dataset.value;
      if (customInput) customInput.value = '';
    });
  });

  // If typing custom amount, clear preset selections
  if (customInput) {
    customInput.addEventListener('input', () => {
      amountInput.value = '';
      amountButtons.forEach((b) => b.classList.remove('bg-green-700', 'text-white'));
    });
  }

  // Determine backend base URL from configuration
  let SERVER_URL =
    (typeof window !== 'undefined' && window.SERVER_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.SERVER_URL);
  // Default to current origin when not provided
  if (!SERVER_URL) {
    SERVER_URL = window.location.origin;
  }

  // Prefill donation amount from query parameter
  const params = new URLSearchParams(window.location.search);
  const amountParam = params.get('amount');
  if (amountParam) {
    const presetValues = ['10000', '50000', '100000', '150000', '200000'];
    if (presetValues.includes(amountParam)) {
      const btn = document.querySelector(`.amount-btn[data-value="${amountParam}"]`);
      if (btn) btn.click();
    } else if (customInput) {
      // Convert whole-dollar amounts to cents if necessary
      const numeric = parseFloat(amountParam);
      if (!isNaN(numeric) && numeric < 1000) {
        customInput.value = Math.round(numeric * 100).toString();
      } else {
        customInput.value = amountParam;
      }
    }
  }

  // Tab switching logic (one-time vs monthly)
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
    if (errorMessage) {
      errorMessage.textContent = '';
    }
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.amount = getDonationAmount(data);
    delete data.custom_amount;

    if (!isValidAmount(data.amount)) {
      alert('Please enter a valid donation amount.');
      return;
    }

    data.mode = data.mode === 'subscription' ? 'subscription' : 'payment';

    try {
      const res = await fetch(`${SERVER_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const contentType = res.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        await res.text();
        throw new Error('Donation service unavailable');
      }
      const body = await res.json();
      if (!res.ok) {
        if (res.status >= 500 && errorMessage) {
          errorMessage.textContent = body.error || 'An unexpected error occurred. Please try again later.';
          return;
        }
        throw new Error(body.error || 'Failed to create session');
      }
      const { url } = body;
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      if (errorMessage) {
        errorMessage.textContent = err.message;
      } else {
        alert(err.message);
      }
    }
  });
});
