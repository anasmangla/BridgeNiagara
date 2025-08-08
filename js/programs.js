// Program slider using translateX
// Automatically discovers BN* images in the images/ directory and builds
// the slider from them.
window.addEventListener('DOMContentLoaded', async () => {
  const slider = document.getElementById('program-slider');
  if (!slider) return;
  const track = slider.querySelector('[data-program-track]');

  // Preserve any original markup in case auto-discovery fails
  const originalHTML = track.innerHTML;

  // Fallback list if dynamic discovery finds nothing
  const fallbackImages = [
    'images/BN1.jpg',
    'images/BN2.jpg',
    'images/BN3.jpg',
    'images/BN4.jpg',
    'images/BN5.jpg',
    'images/BN6.jpg',
    'images/BN7.jpg'
  ];

  // Helper to check if an image exists using a lightweight Image object
  const imageExists = (path) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = path;
    });

  // Auto-discover sequential BN images (BN1.jpg, BN2.jpeg, BN3.JPG, ...)
  const slideImages = [];
  const exts = ['.jpg', '.jpeg', '.JPG'];
  for (let i = 1; ; i++) {
    let found = false;
    for (const ext of exts) {
      const path = `images/BN${i}${ext}`;
      if (await imageExists(path)) {
        slideImages.push(path);
        found = true;
        break;
      }
    }
    if (!found) break;
  }

  // If discovery failed, attempt to use the fallback list
  if (slideImages.length === 0 && fallbackImages.length) {
    slideImages.push(...fallbackImages);
  }

  // Inject slides if we have any; otherwise keep original HTML
  if (slideImages.length) {
    track.innerHTML = '';
    slideImages.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'program-slide w-full flex-shrink-0';
      slide.innerHTML = `<img src="${src}" alt="Community program ${idx + 1}" class="w-full h-full object-cover" />`;
      track.appendChild(slide);
    });
  } else {
    track.innerHTML = originalHTML;
  }
  const total = track.querySelectorAll('.program-slide').length;
  const nextBtn = slider.querySelector('[data-program-next]');
  const prevBtn = slider.querySelector('[data-program-prev]');
  let index = 0;
  let timer;

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function start() {
    timer = setInterval(() => goTo(index + 1), 3000);
  }

  function reset() {
    clearInterval(timer);
    start();
  }

  nextBtn?.addEventListener('click', () => {
    goTo(index + 1);
    reset();
  });

  prevBtn?.addEventListener('click', () => {
    goTo(index - 1);
    reset();
  });

  // touch handlers for swipe
  let startX = 0;
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(timer);
  });

  slider.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(index - 1) : goTo(index + 1);
    }
    reset();
  });

  goTo(0);
  start();
});
