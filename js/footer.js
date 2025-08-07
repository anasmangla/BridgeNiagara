// Inject shared footer on pages
window.addEventListener('DOMContentLoaded', () => {
  const footerUrl = window.location.hostname.startsWith('www.')
    ? '/footer.html'
    : 'https://www.bridgeniagara.org/footer.html';

  fetch(footerUrl)
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById('footer');
      if (container) {
        container.innerHTML = html;
      }
    })
    .catch((err) => console.error('Failed to load footer:', err));
});
