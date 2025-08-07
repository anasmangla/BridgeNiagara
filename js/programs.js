// Hero slider next/prev logic
window.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const nextBtn = document.querySelector('[data-hero-next]');
  const prevBtn = document.querySelector('[data-hero-prev]');
  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('hidden', idx !== i);
    });
  }

  if (slides.length && nextBtn && prevBtn) {
    showSlide(index);

    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });

    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });
  }
});
