(() => {
  "use strict";

  const doc = document;
  const html = doc.documentElement;
  const body = doc.body;

  const siteHeader = doc.getElementById("site-header");
  const navToggle = doc.querySelector(".nav-toggle");
  const siteNav = doc.getElementById("site-nav");
  const navLinks = Array.from(doc.querySelectorAll('.site-nav a[href^="#"]'));
  const footerYear = doc.getElementById("footerYear");
  const heroVideo = doc.querySelector(".hero-video");
  const heroVideoShell = doc.querySelector(".hero-video-shell");

  const desktopMQ = window.matchMedia("(min-width: 760px)");
  const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  let menuOpen = false;
  let ticking = false;
  let heroVideoObserver = null;

  function setFooterYear() {
    if (!footerYear) return;
    footerYear.textContent = String(new Date().getFullYear());
  }

  function getHeaderHeight() {
    return siteHeader ? siteHeader.offsetHeight : 0;
  }

  function setNavState(open) {
    if (!navToggle || !siteNav) return;

    menuOpen = Boolean(open);

    navToggle.setAttribute("aria-expanded", String(menuOpen));
    siteNav.classList.toggle("is-open", menuOpen);

    if (desktopMQ.matches) {
      html.style.overflow = "";
      body.style.overflow = "";
      siteNav.removeAttribute("aria-hidden");
      return;
    }

    if (menuOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      siteNav.setAttribute("aria-hidden", "false");
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      siteNav.setAttribute("aria-hidden", "true");
    }
  }

  function closeNav() {
    setNavState(false);
  }

  function toggleNav() {
    setNavState(!menuOpen);
  }

  function handleNavToggle() {
    if (!navToggle || !siteNav) return;

    setNavState(false);

    navToggle.addEventListener("click", toggleNav);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (!desktopMQ.matches) closeNav();
      });
    });

    doc.addEventListener("click", (event) => {
      if (!menuOpen || desktopMQ.matches) return;
      if (!siteHeader) return;

      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!siteHeader.contains(target)) {
        closeNav();
      }
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) {
        closeNav();
        navToggle.focus();
      }
    });

    const handleViewportChange = () => {
      if (desktopMQ.matches) {
        setNavState(false);
        siteNav.removeAttribute("aria-hidden");
      } else if (!menuOpen) {
        siteNav.setAttribute("aria-hidden", "true");
      }
      updateActiveNav();
    };

    addMQListener(desktopMQ, handleViewportChange);
    window.addEventListener("resize", handleViewportChange, { passive: true });
  }

  function setActiveLink(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function updateHeaderState() {
    if (!siteHeader) return;
    siteHeader.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
  }

  function updateActiveNav() {
    const sections = navLinks
      .map((link) => {
        const href = link.getAttribute("href");
        if (!href) return null;
        const id = href.slice(1);
        const section = doc.getElementById(id);
        return section ? { id, section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const offset = getHeaderHeight() + 120;
    let currentId = sections[0].id;

    sections.forEach(({ id, section }) => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) currentId = id;
    });

    const nearBottom =
      window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 8;

    if (nearBottom) {
      currentId = sections[sections.length - 1].id;
    }

    setActiveLink(currentId);
    updateHeaderState();
  }

  function requestActiveNavUpdate() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
  }

  function setupScrollSpy() {
    updateActiveNav();
    window.addEventListener("scroll", requestActiveNavUpdate, { passive: true });
    window.addEventListener("resize", requestActiveNavUpdate, { passive: true });
    window.addEventListener("orientationchange", requestActiveNavUpdate, {
      passive: true,
    });

    window.addEventListener("hashchange", () => {
      window.requestAnimationFrame(updateActiveNav);
    });
  }

  function tryPlay(video) {
    if (!video) return;
    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {});
    }
  }

  function stopHeroVideo() {
    if (!heroVideo) return;
    heroVideo.pause();
  }

  function startHeroVideo() {
    if (!heroVideo || reduceMotionMQ.matches) return;
    if (doc.visibilityState !== "visible") return;
    tryPlay(heroVideo);
  }

  function syncHeroVideoPreference() {
    if (!heroVideo) return;

    if (reduceMotionMQ.matches) {
      stopHeroVideo();
      try {
        heroVideo.currentTime = 0;
      } catch (_) {}
      return;
    }

    startHeroVideo();
  }

  function setupHeroVideoObserver() {
    if (!heroVideo || !heroVideoShell) return;

    if (heroVideoObserver) {
      heroVideoObserver.disconnect();
      heroVideoObserver = null;
    }

    if (reduceMotionMQ.matches) {
      stopHeroVideo();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      startHeroVideo();
      return;
    }

    heroVideoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            startHeroVideo();
          } else {
            stopHeroVideo();
          }
        });
      },
      {
        threshold: [0, 0.35, 0.7],
      }
    );

    heroVideoObserver.observe(heroVideoShell);
  }

  function setupHeroVideo() {
    if (!heroVideo) return;

    heroVideo.muted = true;
    heroVideo.playsInline = true;

    syncHeroVideoPreference();
    setupHeroVideoObserver();

    doc.addEventListener("visibilitychange", () => {
      if (doc.visibilityState === "visible") {
        syncHeroVideoPreference();
      } else {
        stopHeroVideo();
      }
    });

    addMQListener(reduceMotionMQ, () => {
      syncHeroVideoPreference();
      setupHeroVideoObserver();
    });
  }

  function addMQListener(mediaQuery, handler) {
    if (!mediaQuery) return;

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
      return;
    }

    if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handler);
    }
  }

  function init() {
    setFooterYear();
    handleNavToggle();
    setupScrollSpy();
    setupHeroVideo();
  }

  init();
})();
