/* ======================================================
   BLUCINELAB — SCRIPT v4
   Refinement del v3
   Mantiene HTML + CSS esistenti
   ====================================================== */

const prefersReducedMotion = window.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
).matches ?? false;

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const HERO_TRANSITION = `opacity 1.4s ${EASING}, transform 1.4s ${EASING}`;

document.addEventListener("DOMContentLoaded", () => {
  const lens = document.querySelector(".lens");
  const year = document.getElementById("year");
  const hero = document.querySelector(".hero");
  const orbit = document.querySelector(".hero-orbit");
  const reveals = Array.from(document.querySelectorAll(".reveal"));

  setFooterYear(year);
  handleLensIntro(lens);
  initRevealSystem(reveals);
  initHeroIntro(hero);
  initHeroOrbitParallax(orbit);
});

function setFooterYear(yearNode) {
  if (!yearNode) return;
  yearNode.textContent = String(new Date().getFullYear());
}

function handleLensIntro(lens) {
  if (!lens) return;

  if (prefersReducedMotion) {
    lens.style.display = "none";
    return;
  }

  lens.addEventListener(
    "animationend",
    () => {
      lens.style.display = "none";
    },
    { once: true }
  );
}

function initRevealSystem(elements) {
  if (!elements.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  elements.forEach((el, index) => {
    el.dataset.revealIndex = String(index);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const index = Number(el.dataset.revealIndex || 0);

        el.style.transitionDelay = `${index * 120}ms`;
        el.classList.add("reveal-visible");
        obs.unobserve(el);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function initHeroIntro(hero) {
  if (!hero || prefersReducedMotion) return;

  hero.style.opacity = "0";
  hero.style.transform = "translate3d(0, 24px, 0)";
  hero.style.transition = HERO_TRANSITION;

  window.addEventListener(
    "load",
    () => {
      requestAnimationFrame(() => {
        hero.style.opacity = "1";
        hero.style.transform = "translate3d(0, 0, 0)";
      });
    },
    { once: true }
  );
}

function initHeroOrbitParallax(orbit) {
  if (!orbit || prefersReducedMotion) return;

  let ticking = false;

  const updateOrbit = () => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const offset = Math.min(scrollY * 0.06, 40);

    orbit.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateOrbit);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateOrbit();
}
