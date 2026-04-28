/* ─────────────────────────────────────────────────────────────
   BLUCINELAB — BLUCINE.JS / CLEAN CINEMATIC PREMIUM CUT
   Direction before execution.
───────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  /* ─────────────────────────────────────────────────────────
     DOM REFERENCES
  ───────────────────────────────────────────────────────── */
  const body = document.body;
  const header = document.getElementById("site-header");

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");

  const heroVideo = document.querySelector(".hero-video");

  const revealItems = document.querySelectorAll(".reveal");

  /* ─────────────────────────────────────────────────────────
     MOBILE NAVIGATION
  ───────────────────────────────────────────────────────── */
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");

      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

      body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav = siteNav.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     HEADER SCROLL STATE
  ───────────────────────────────────────────────────────── */
  const updateHeaderState = () => {
    if (!header) return;

    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();

  window.addEventListener(
    "scroll",
    updateHeaderState,
    { passive: true }
  );

  /* ─────────────────────────────────────────────────────────
     HERO VIDEO SAFE FALLBACK
     If no source or failed load → elegant visual shell only
  ───────────────────────────────────────────────────────── */
  if (heroVideo) {
    const source = heroVideo.querySelector("source");

    const disableVideo = () => {
      heroVideo.classList.add("video-disabled");
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
      heroVideo.controls = false;
    };

    if (!source || !source.getAttribute("src") || source.getAttribute("src").trim() === "") {
      disableVideo();
    }

    heroVideo.addEventListener("error", disableVideo);

    heroVideo.addEventListener("loadeddata", () => {
      heroVideo.classList.remove("video-disabled");
    });

    /* Optional subtle playback speed */
    heroVideo.addEventListener("canplay", () => {
      try {
        heroVideo.playbackRate = 0.85;
      } catch (e) {}
    });
  }

  /* ─────────────────────────────────────────────────────────
     REVEAL SYSTEM
     Elegant, subtle section entrances
  ───────────────────────────────────────────────────────── */
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal-init");
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  /* ─────────────────────────────────────────────────────────
     SMOOTH ANCHOR OFFSET
     Better fixed-header navigation
  ───────────────────────────────────────────────────────── */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);

      if (!target) return;

      e.preventDefault();

      const headerOffset = header ? header.offsetHeight + 18 : 90;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /* ─────────────────────────────────────────────────────────
     ACTIVE SECTION HIGHLIGHT
  ───────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navLinks.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      {
        threshold: 0.35
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ─────────────────────────────────────────────────────────
     REDUCED MOTION ACCESSIBILITY
  ───────────────────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = "auto";

    revealItems.forEach((item) => {
      item.classList.remove("reveal-init");
      item.classList.add("is-visible");
    });

    if (heroVideo) {
      heroVideo.pause();
    }
  }

  /* ─────────────────────────────────────────────────────────
     KEYBOARD ESC CLOSE NAV
  ───────────────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav?.classList.contains("is-open")) {
      siteNav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
      body.classList.remove("nav-open");
    }
  });

  /* ─────────────────────────────────────────────────────────
     PARALLAX MICRO-MOTION (DESKTOP ONLY)
     Subtle environmental movement
  ───────────────────────────────────────────────────────── */
  const isDesktop = window.innerWidth > 1024;
  const orbA = document.querySelector(".bg-orb-a");
  const orbB = document.querySelector(".bg-orb-b");

  if (isDesktop && orbA && orbB && !prefersReducedMotion.matches) {
    window.addEventListener(
      "mousemove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 18;
        const y = (e.clientY / window.innerHeight - 0.5) * 18;

        orbA.style.transform = `translate(${x * -1}px, ${y * -1}px)`;
        orbB.style.transform = `translate(${x}px, ${y}px)`;
      },
      { passive: true }
    );
  }

  /* ─────────────────────────────────────────────────────────
     PERFORMANCE / PAGE READY
  ───────────────────────────────────────────────────────── */
  window.requestAnimationFrame(() => {
    body.classList.add("page-ready");
  });
});
