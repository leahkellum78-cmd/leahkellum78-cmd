      const slides = document.querySelectorAll('.carousel-slide');
      let current = 0;

      function goTo(index) {
        slides[current].querySelector('video').pause();
        slides[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
      }

      document.querySelector('.arrow.right').addEventListener('click', () => goTo(current + 1));
      document.querySelector('.arrow.left').addEventListener('click', () => goTo(current - 1));