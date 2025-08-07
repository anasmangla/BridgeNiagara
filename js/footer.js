// Inject shared footer on pages
window.addEventListener('DOMContentLoaded', () => {
  fetch('/footer.html')
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById('footer');
      if (container) {
        container.innerHTML = html;
      }
    })
    .catch((err) => console.error('Failed to load footer:', err));
});
