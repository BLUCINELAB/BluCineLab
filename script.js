/* ======================================================
   BLUCINELAB – SCRIPT v2.0
   Fade-in · Scroll reveal
   Nessuna dipendenza esterna
   ====================================================== */

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==============================
   HERO FADE-IN
   ============================== */

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-inner");

  if (!hero) return;

  if (prefersReducedMotion) {
    hero.style.opacity = "1";
    hero.style.transform = "none";
    return;
  }

  hero.style.opacity = "0";
  hero.style.transform = "translateY(32px)";

  requestAnimationFrame(() => {
    hero.style.transition = "opacity 1.2s ease-out, transform 1.2s ease-out";
    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";
  });
});

/* ==============================
   SCROLL REVEAL SEZIONI
   ============================== */

(function initSectionReveal() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  if (prefersReducedMotion) {
    sections.forEach((section) => {
      section.style.opacity = "1";
      section.style.transform = "none";
    });
    return;
  }

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "opacity 0.9s ease-out, transform 0.9s ease-out";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
    }
  );

  sections.forEach((section) => observer.observe(section));
})();