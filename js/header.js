// Inject shared header on pages
window.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById('header');
      if (container) {
        container.innerHTML = html;
      }
    })
    .catch((err) => console.error('Failed to load header:', err));
});
