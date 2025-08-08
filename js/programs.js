// Program slider using translateX
// Automatically discovers BN* images in the images/ directory and builds
// the slider from them.
window.addEventListener('DOMContentLoaded', async () => {
  const slider = document.getElementById('program-slider');
  if (!slider) return;
  const track = slider.querySelector('[data-program-track]');

  // Auto-discover sequential BN images (BN1.jpg, BN2.jpeg, BN3.JPG, ...)
  const slideImages = [];
  const exts = ['.jpg', '.jpeg', '.JPG'];
  for (let i = 1; ; i++) {
    let found = false;
    for (const ext of exts) {
      const path = `images/BN${i}${ext}`;
      try {
        const res = await fetch(path, { method: 'HEAD' });
        if (res.ok) {
          slideImages.push(path);
          found = true;
          break;
        }
      } catch {
        // ignore network errors and continue
      }
    }
    if (!found) break;
  }

  // Inject discovered slides into the track
  track.innerHTML = '';
  slideImages.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'program-slide w-full flex-shrink-0';
    slide.innerHTML = `<img src="${src}" alt="Community program ${idx + 1}" class="w-full h-full object-cover" />`;
    track.appendChild(slide);
  });

  const slides = track.querySelectorAll('.program-slide');
  const total = slides.length;
  const nextBtn = slider.querySelector('[data-program-next]');
  const prevBtn = slider.querySelector('[data-program-prev]');
  if (total === 0) return;
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
