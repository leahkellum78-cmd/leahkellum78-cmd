/* ─── 1. HAMBURGER NAV ──────────────────────────────────── */
/* NOTE: hamburger toggle was completely missing — now a real
   button with aria-expanded, ESC support, body scroll-lock. */
const navToggle = document.getElementById('navToggle');
const navPanel  = document.getElementById('primary-nav');

const setNavOpen = (open) => {
   if (!navToggle || !navPanel) return;
   navToggle.setAttribute('aria-expanded', open);
   navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
   document.body.classList.toggle('nav-open', open);
};

if (navToggle) {
   navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!isOpen);
   });
}

if (navPanel) {
   navPanel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setNavOpen(false));
   });
}

document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setNavOpen(false);
      navToggle && navToggle.focus();
   }
});


/* ─── 2. VIDEO CAROUSEL ─────────────────────────────────── */
/* NOTE: original carousel only had arrow navigation. Added dot
   indicators + pause-other-videos when switching. */
const slides = document.querySelectorAll('.carousel-slide');
const dots   = document.querySelectorAll('.carousel-dots .dot');
let current  = 0;

const goTo = (index) => {
   if (!slides.length) return;
   // Pause whatever video is currently playing.
   const currentVideo = slides[current].querySelector('video');
   if (currentVideo) currentVideo.pause();

   slides[current].classList.remove('active');
   dots[current] && dots[current].classList.remove('active');

   current = (index + slides.length) % slides.length;

   slides[current].classList.add('active');
   dots[current] && dots[current].classList.add('active');
};

const arrowRight = document.querySelector('.arrow.right');
const arrowLeft  = document.querySelector('.arrow.left');
arrowRight && arrowRight.addEventListener('click', () => goTo(current + 1));
arrowLeft  && arrowLeft.addEventListener('click',  () => goTo(current - 1));

dots.forEach(dot => {
   dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) goTo(idx);
   });
});

// NOTE: arrow keys scroll the carousel when it's the focused area.
document.querySelector('.carousel')?.addEventListener('keydown', (e) => {
   if (e.key === 'ArrowRight') goTo(current + 1);
   if (e.key === 'ArrowLeft')  goTo(current - 1);
});


/* ─── 3. SCROLL REVEALS ─────────────────────────────────── */
/* NOTE: subtle fade/slide-up as sections enter the viewport. */
const reveal = new IntersectionObserver(entries => {
   entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('main > section').forEach(s => reveal.observe(s));


/* ─── 4. LIGHTBOX ───────────────────────────────────────── */
/* NOTE: photo lightbox — clicking any gallery photo opens it
   full-size in an overlay. ESC, X button, and backdrop close it. */
const lb       = document.getElementById('lightbox');
const lbImage  = document.getElementById('lightboxImage');
const lbCap    = document.getElementById('lightboxCaption');
const lbClose  = document.getElementById('lightboxClose');
let lbReturnTo = null;

const openLightbox = (img) => {
   if (!lb || !lbImage) return;
   lb.removeAttribute('hidden');
   void lb.offsetWidth; // force reflow so the transition fires
   lb.setAttribute('data-active', '');
   document.body.classList.add('lb-open');

   lbImage.src = img.currentSrc || img.src;
   lbImage.alt = img.alt || '';
   lbCap.textContent = (img.alt || '').trim();

   lbReturnTo = img;
   requestAnimationFrame(() => lbClose && lbClose.focus());
};

const closeLightbox = () => {
   if (!lb) return;
   lb.removeAttribute('data-active');
   document.body.classList.remove('lb-open');
   setTimeout(() => {
      lb.setAttribute('hidden', '');
      lbImage.src = '';
      lbCap.textContent = '';
      if (lbReturnTo) lbReturnTo.focus();
   }, 280);
};

document.querySelectorAll('.photo img').forEach(img => {
   img.setAttribute('tabindex', '0');
   img.setAttribute('role', 'button');
   img.setAttribute('aria-label', `View larger: ${img.alt || 'photo'}`);
   img.addEventListener('click', () => openLightbox(img));
   img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         openLightbox(img);
      }
   });
});

lbClose && lbClose.addEventListener('click', closeLightbox);
lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape' && lb && lb.hasAttribute('data-active')) {
      closeLightbox();
   }
});
