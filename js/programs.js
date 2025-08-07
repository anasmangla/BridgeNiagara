// Program slider logic
window.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.program-slide');
  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('hidden', idx !== i);
    });
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  if (slides.length) {
    showSlide(index);
    const nextBtn = document.querySelector('[data-program-next]');
    const prevBtn = document.querySelector('[data-program-prev]');

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    setInterval(nextSlide, 5000);
  }
});
