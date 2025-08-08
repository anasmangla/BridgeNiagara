const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const MAX_MESSAGE_LENGTH = 500;

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  contactStatus.textContent = '';
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    contactStatus.textContent = 'Please enter a valid email address.';
    contactStatus.className = 'text-red-700 mt-2';
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    contactStatus.textContent = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
    contactStatus.className = 'text-red-700 mt-2';
    return;
  }
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(contactForm).entries());
  data.formType = 'contact';
  try {
    const res = await fetch(`${window.SERVER_URL}/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      contactStatus.textContent = result.message || 'Thank you for reaching out!';
      contactStatus.className = 'text-green-700 mt-2';
      contactForm.reset();
    } else {
      contactStatus.textContent = result.error || 'Submission failed. Please try again.';
      contactStatus.className = 'text-red-700 mt-2';
    }
  } catch (err) {
    contactStatus.textContent = 'An error occurred. Please try again.';
    contactStatus.className = 'text-red-700 mt-2';
  }
});

