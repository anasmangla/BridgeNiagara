// Program slider next/prev logic
window.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('#program-slider .program-slide');
  const nextBtn = document.querySelector('[data-program-next]');
  const prevBtn = document.querySelector('[data-program-prev]');
  const AUTO_INTERVAL_MS = 5000; // 5s autoplay interval per Nielsen Norman Group carousel study
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
    }, AUTO_INTERVAL_MS);
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
