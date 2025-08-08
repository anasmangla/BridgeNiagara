const volunteerForm = document.getElementById('volunteer-form');
const volunteerStatus = document.getElementById('volunteer-status');
const MAX_MESSAGE_LENGTH = 500;

volunteerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  volunteerStatus.textContent = '';
  volunteerStatus.className = 'mt-4 hidden';
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    volunteerStatus.textContent = 'Please enter a valid email address.';
    volunteerStatus.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded';
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    volunteerStatus.textContent = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
    volunteerStatus.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded';
    return;
  }
  if (!volunteerForm.checkValidity()) {
    volunteerForm.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(volunteerForm).entries());
  data.formType = 'volunteer';
  try {
    const res = await fetch(`${window.SERVER_URL}/submit-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      volunteerStatus.textContent = result.message || 'Thank you for volunteering! We will contact you soon.';
      volunteerStatus.className = 'mt-4 p-4 bg-green-100 text-green-700 rounded';
      volunteerForm.reset();
    } else {
      volunteerStatus.textContent = result.error || 'Submission failed. Please try again.';
      volunteerStatus.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded';
    }
  } catch (err) {
    volunteerStatus.textContent = 'An error occurred. Please try again.';
    volunteerStatus.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded';
  }
});

