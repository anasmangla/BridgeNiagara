// Program slider next/prev logic
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('program-slider');
  const slides = document.querySelectorAll('#program-slider .program-slide');
  const nextBtn = document.querySelector('[data-program-next]');
  const prevBtn = document.querySelector('[data-program-prev]');
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
      nextSlide();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
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
    startAutoPlay();

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
      }
    });

    slider?.addEventListener('mouseenter', stopAutoPlay);
    slider?.addEventListener('mouseleave', startAutoPlay);
  }
});
