// Program slider using translateX
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('program-slider');
  if (!slider) return;
  const track = slider.querySelector('[data-program-track]');

  // Dynamically generate slides for all BN images
  track.innerHTML = '';
  const imageCount = 29;
  for (let i = 1; i <= imageCount; i++) {
    const slide = document.createElement('div');
    slide.className = 'program-slide w-full flex-shrink-0';
    const img = document.createElement('img');
    img.src = `images/BN${i}.jpg`;
    img.alt = `Community program ${i}`;
    img.className = 'w-full h-full object-cover';
    slide.appendChild(img);
    track.appendChild(slide);
  }

  const slides = track.querySelectorAll('.program-slide');
  const nextBtn = slider.querySelector('[data-program-next]');
  const prevBtn = slider.querySelector('[data-program-prev]');
  const total = slides.length;
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
