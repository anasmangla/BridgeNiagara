/* global Swiper */
// Initialize Swiper slider for community programs
// Automatically discovers BN* images in the images/ directory and builds
// the slider from them.
window.addEventListener('DOMContentLoaded', async () => {
  const sliderEl = document.getElementById('program-slider');
  if (!sliderEl) return;
  const wrapper = sliderEl.querySelector('.swiper-wrapper');

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

  // Inject discovered slides into the wrapper
  wrapper.innerHTML = '';
  slideImages.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${src}" alt="Community program ${idx + 1}" class="w-full h-full object-cover" />`;
    wrapper.appendChild(slide);
  });

  // Initialize Swiper with autoplay, navigation, keyboard control and pagination
  new Swiper('#program-slider', {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 600,
  });
});
