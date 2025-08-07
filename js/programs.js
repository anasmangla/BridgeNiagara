// Hero slider next/prev logic
window.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const nextBtn = document.querySelector('[data-hero-next]');
  const prevBtn = document.querySelector('[data-hero-prev]');
  let index = 0;
  let interval;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('opacity-100', idx === i);
      slide.classList.toggle('opacity-0', idx !== i);
    });
  }

  function startAutoPlay() {
    interval = setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(interval);
    startAutoPlay();
  }

  if (slides.length) {
    showSlide(index);
    startAutoPlay();

    nextBtn?.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      showSlide(index);
      resetAutoPlay();
    });

    prevBtn?.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
      resetAutoPlay();
    });
  }
});
