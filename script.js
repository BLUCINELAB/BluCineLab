/* ======================================================
   BLUCINELAB – SCRIPT v2.1
   Mood: cinematic midnight · lens opening
   ====================================================== */

/* Preferenze utente */
const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================
   1. INTRO LENS OPENING
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const lens = document.querySelector(".lens");

  if (!lens) return;

  // Rimuove l’overlay dopo l’apertura
  lens.addEventListener("animationend", () => {
    lens.style.display = "none";
  });

  // Optional: aggiunge una dissolvenza sonora se presente
  const introSound = document.getElementById("intro-sound");
  if (introSound && !prefersReducedMotion) {
    introSound.volume = 0;
    introSound.play().catch(() => {});
    let vol = 0;
    const fade = setInterval(() => {
      vol += 0.02;
      introSound.volume = vol;
      if (vol >= 0.3) clearInterval(fade);
    }, 100);
  }
});

/* ==========================================
   2. HERO INTRO FADE
   ========================================== */
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero");
  if (!hero || prefersReducedMotion) return;

  hero.style.opacity = "0";
  hero.style.transform = "translateY(32px)";
  hero.style.transition = "opacity 1.6s ease-out, transform 1.6s ease-out";

  requestAnimationFrame(() => {
    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";
  });
});

/* ==========================================
   3. SCROLL REVEAL – cinematic rise
   ========================================== */
(function initCinematicReveal() {
  const targets = document.querySelectorAll(".section figure, .section .fade-in");
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = 150 + Math.random() * 300; // micro-jitter naturale
          el.style.transition = `opacity 1.8s ease-out ${delay}ms, transform 1.8s ease-out ${delay}ms`;
          el.classList.add("reveal-visible");
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ==========================================
   4. LIGHT BREATH EFFECT (opzionale)
   ========================================== */
(function initLightBreathing() {
  const highlights = document.querySelectorAll(".accent, .highlight, .tagline");
  if (!highlights.length || prefersReducedMotion) return;

  highlights.forEach((el, i) => {
    const delay = i * 1200 + Math.random() * 800;
    el.animate(
      [
        { filter: "brightness(0.9)" },
        { filter: "brightness(1.15)" },
        { filter: "brightness(0.9)" },
      ],
      {
        duration: 5000 + Math.random() * 2000,
        iterations: Infinity,
        easing: "ease-in-out",
        delay,
      }
    );
  });
})();

/* ==========================================
   5. YEAR FOOTER UPDATE
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});