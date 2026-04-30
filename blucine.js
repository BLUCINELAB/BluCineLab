(() => {
  "use strict";

  const doc  = document;
  const html = doc.documentElement;
  const body = doc.body;

  const siteHeader     = doc.getElementById("site-header");
  const navToggle      = doc.querySelector(".nav-toggle");
  const siteNav        = doc.getElementById("site-nav");
  const navLinks       = Array.from(doc.querySelectorAll('.site-nav a[href^="#"]'));
  const footerYear     = doc.getElementById("footerYear");
  const hero           = doc.querySelector(".hero");
  const heroVideo      = doc.querySelector(".hero-video");
  const heroVideoField = doc.querySelector(".hero-video-field");
  const revealEls      = Array.from(doc.querySelectorAll(".reveal"));

  const desktopMQ      = window.matchMedia("(min-width: 760px)");
  const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  let menuOpen   = false;
  let rafPending = false;

  /* ── MQ LISTENER COMPAT ─────────────────────────────────── */
  function addMQListener(mq, fn) {
    if (!mq) return;
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", fn);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(fn);
    }
  }

  /* ── FOOTER YEAR ────────────────────────────────────────── */
  function setFooterYear() {
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());
  }

  /* ── HEADER HEIGHT ──────────────────────────────────────── */
  function headerHeight() {
    return siteHeader ? siteHeader.offsetHeight : 0;
  }

  /* ── NAV STATE ──────────────────────────────────────────── */
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
      html.style.overflow  = "hidden";
      body.style.overflow  = "hidden";
      siteNav.setAttribute("aria-hidden", "false");
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      siteNav.setAttribute("aria-hidden", "true");
    }
  }

  function closeNav()  { setNavState(false); }
  function toggleNav() { setNavState(!menuOpen); }

  function initNav() {
    if (!navToggle || !siteNav) return;
    setNavState(false);

    navToggle.addEventListener("click", toggleNav);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (!desktopMQ.matches) closeNav();
      });
    });

    doc.addEventListener("click", (e) => {
      if (!menuOpen || desktopMQ.matches || !siteHeader) return;
      if (!siteHeader.contains(e.target)) closeNav();
    });

    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuOpen) {
        closeNav();
        navToggle.focus();
      }
    });

    const onViewportChange = () => {
      if (desktopMQ.matches) {
        setNavState(false);
        siteNav.removeAttribute("aria-hidden");
      } else if (!menuOpen) {
        siteNav.setAttribute("aria-hidden", "true");
      }
      requestScrollUpdate();
    };

    addMQListener(desktopMQ, onViewportChange);
    window.addEventListener("resize", onViewportChange, { passive: true });
  }

  /* ── SCROLL SPY ─────────────────────────────────────────── */
  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const href   = link.getAttribute("href");
      const active = href === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateScroll() {
    if (siteHeader) {
      siteHeader.dataset.scrolled = window.scrollY > 10 ? "true" : "false";
    }

    const sections = navLinks
      .map((link) => {
        const id = (link.getAttribute("href") || "").slice(1);
        const el = id ? doc.getElementById(id) : null;
        return el ? { id, el } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const offset    = headerHeight() + 120;
    let   currentId = sections[0].id;

    sections.forEach(({ id, el }) => {
      if (window.scrollY >= el.offsetTop - offset) currentId = id;
    });

    const atBottom =
      window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 8;
    if (atBottom) currentId = sections[sections.length - 1].id;

    setActiveLink(currentId);
  }

  function requestScrollUpdate() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(() => {
      updateScroll();
      rafPending = false;
    });
  }

  function initScrollSpy() {
    updateScroll();
    window.addEventListener("scroll",            requestScrollUpdate, { passive: true });
    window.addEventListener("resize",            requestScrollUpdate, { passive: true });
    window.addEventListener("orientationchange", requestScrollUpdate, { passive: true });
    window.addEventListener("hashchange", () => {
      window.requestAnimationFrame(updateScroll);
    });
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  function initReveal() {
    if (!revealEls.length) return;

    if (reduceMotionMQ.matches) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -48px 0px" }
    );

    revealEls.forEach((el) => obs.observe(el));
  }

  /* ── HERO VIDEO ─────────────────────────────────────────── */
  function markNoVideo() {
    if (hero)           hero.classList.add("hero--no-video");
    if (heroVideoField) heroVideoField.style.display = "none";
  }

  function tryPlay() {
    if (!heroVideo || reduceMotionMQ.matches)       return;
    if (doc.visibilityState !== "visible")          return;
    const p = heroVideo.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => markNoVideo());
    }
  }

  function stopVideo() {
    if (heroVideo) heroVideo.pause();
  }

  function syncVideoState() {
    if (!heroVideo) { markNoVideo(); return; }

    if (reduceMotionMQ.matches) {
      stopVideo();
      try { heroVideo.currentTime = 0; } catch (_) {}
      return;
    }

    tryPlay();
  }

  function initHeroVideo() {
    if (!heroVideo) { markNoVideo(); return; }

    heroVideo.muted       = true;
    heroVideo.playsInline = true;

    // Only a hard error (missing file, codec fail) triggers fallback.
    // "stalled" is intentionally excluded — it fires on slow connections
    // and resolves without intervention.
    heroVideo.addEventListener("error", markNoVideo, { once: true });

    syncVideoState();

    if (!reduceMotionMQ.matches && "IntersectionObserver" in window) {
      const target = heroVideoField || heroVideo;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio > 0.2) {
              tryPlay();
            } else {
              stopVideo();
            }
          });
        },
        { threshold: [0, 0.2, 0.6] }
      );

      obs.observe(target);
    }

    doc.addEventListener("visibilitychange", () => {
      doc.visibilityState === "visible" ? syncVideoState() : stopVideo();
    });

    addMQListener(reduceMotionMQ, syncVideoState);
  }

  /* ── INIT ───────────────────────────────────────────────── */
  function init() {
    setFooterYear();
    initNav();
    initScrollSpy();
    initReveal();
    initHeroVideo();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
