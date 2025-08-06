window.addEventListener('DOMContentLoaded', () => {
  fetch('/config')
    .then((response) => response.json())
    .then((config) => {
      const iframe = document.getElementById('map');
      if (iframe && config.mapsApiKey) {
        const base = 'https://www.google.com/maps/embed/v1/place';
        const params = new URLSearchParams({
          key: config.mapsApiKey,
          q: '6951 Williams Road, Niagara Falls, NY 14304'
        });
        iframe.src = `${base}?${params.toString()}`;
      }
    })
    .catch((err) => console.error('Failed to load map:', err));
});
