/* ═══════════════════════════════════════════════════
   ESTUDIO JURÍDICO DRA. PATRICIA GARCÍA — main.js
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. AÑO DINÁMICO EN EL FOOTER
  ───────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─────────────────────────────────────────────
     2. MENÚ HAMBURGUESA (mobile)
  ───────────────────────────────────────────── */
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('.header__nav-link') : [];

  function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !burger.classList.contains('active');
    burger.classList.toggle('active', isOpen);
    navMenu.classList.toggle('open',  isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  }

  if (burger && navMenu) {
    burger.addEventListener('click', () => toggleMenu());

    // Cerrar al hacer click en un link
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar al hacer click fuera del menú
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }


  /* ─────────────────────────────────────────────
     3. HEADER — sombra al hacer scroll
  ───────────────────────────────────────────── */
  const header = document.querySelector('.header');
  const HEADER_H = header ? header.offsetHeight : 64;
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // estado inicial
  }


  /* ─────────────────────────────────────────────
     4. ACCORDION DE FAQ (accesible)
  ───────────────────────────────────────────── */
  const faqBtns = document.querySelectorAll('.faq__question');

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(answerId);

      // Cerrar todos los demás
      faqBtns.forEach(other => {
        if (other !== btn) {
          const otherId = other.getAttribute('aria-controls');
          const otherAns = document.getElementById(otherId);
          other.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.classList.remove('open');
        }
      });

      // Toggle el actual
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.classList.toggle('open', !isOpen);
    });
  });


  /* ─────────────────────────────────────────────
     5. SMOOTH SCROLL — offset por el header fijo
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id     = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H - 8;
      
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────────
     6. ANIMACIÓN DE ENTRADA (Intersection Observer)
        — aparece al hacer scroll, sin librerías
  ───────────────────────────────────────────── */
  const animTargets = document.querySelectorAll(
    '.servicio-card, .porque__card, .sobre__grid, .faq__item, .contacto__item'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim--visible');
          observer.unobserve(entry.target); // una sola vez
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animTargets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`; // stagger por columna
      el.classList.add('anim--hidden');
      observer.observe(el);
    });
  }

}); // DOMContentLoaded
