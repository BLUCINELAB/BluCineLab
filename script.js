/* ======================================================
   BLUCINELAB – SCRIPT v3
   Adattato all'HTML + CSS esistenti, senza modificarli
   ====================================================== */

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================
   1. DOM READY
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const lens = document.querySelector(".lens");
  const year = document.getElementById("year");
  const reveals = document.querySelectorAll(".reveal");

  /* Footer year */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Lens intro */
  if (lens) {
    if (prefersReducedMotion) {
      lens.style.display = "none";
    } else {
      lens.addEventListener(
        "animationend",
        () => {
          lens.style.display = "none";
        },
        { once: true }
      );
    }
  }

  /* Reveal elements già presenti nel markup */
  if (reveals.length) {
    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add("reveal-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry, index) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.style.transitionDelay = `${index * 120}ms`;
            el.classList.add("reveal-visible");
            obs.unobserve(el);
          });
        },
        { threshold: 0.16 }
      );

      reveals.forEach((el) => observer.observe(el));
    }
  }
});

/* ==========================================
   2. HERO INTRO FADE
   ========================================== */
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion) return;

  hero.style.opacity = "0";
  hero.style.transform = "translateY(24px)";
  hero.style.transition =
    "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)";

  requestAnimationFrame(() => {
    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";
  });
});

/* ==========================================
   3. HERO ORBIT MICRO PARALLAX
   - usa .hero-orbit che esiste già
   - non richiede modifiche al CSS
   ========================================== */
(function initHeroOrbitParallax() {
  const orbit = document.querySelector(".hero-orbit");
  if (!orbit || prefersReducedMotion) return;

  let ticking = false;

  function updateOrbit() {
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = Math.min(scrollY * 0.06, 40);
    orbit.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateOrbit);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateOrbit();
})();
