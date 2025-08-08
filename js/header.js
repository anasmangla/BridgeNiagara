// Inject shared header on pages
window.addEventListener('DOMContentLoaded', () => {
  const headerUrl = window.location.hostname === 'bridgeniagara.org'
    ? 'https://www.bridgeniagara.org/header.html'
    : '/header.html';

  fetch(headerUrl)
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById('header');
      if (container) {
        container.innerHTML = html;
        const toggle = container.querySelector('#nav-toggle');
        const menu = container.querySelector('#nav-menu');
        if (toggle && menu) {
          toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            menu.classList.toggle('hidden');
          });
        }
      }
    })
    .catch((err) => console.error('Failed to load header:', err));
});
