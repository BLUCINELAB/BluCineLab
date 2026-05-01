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
  const revealEls = Array.from(doc.querySelectorAll(".reveal"));
  const desktopMQ = window.matchMedia("(min-width: 760px)");
  const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  let menuOpen = false;
  let rafPending = false;

  function addMQListener(mq, fn) {
    if (!mq) return;
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", fn);
    else if (typeof mq.addListener === "function") mq.addListener(fn);
  }

  function setFooterYear() {
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());
  }

  function headerHeight() {
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

    html.style.overflow = menuOpen ? "hidden" : "";
    body.style.overflow = menuOpen ? "hidden" : "";
    siteNav.setAttribute("aria-hidden", menuOpen ? "false" : "true");
  }

  function closeNav() { setNavState(false); }
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

    doc.addEventListener("click", (event) => {
      if (!menuOpen || desktopMQ.matches || !siteHeader) return;
      if (!siteHeader.contains(event.target)) closeNav();
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) {
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

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function updateScroll() {
    if (siteHeader) siteHeader.dataset.scrolled = window.scrollY > 10 ? "true" : "false";

    const sections = navLinks
      .map((link) => {
        const id = (link.getAttribute("href") || "").slice(1);
        const el = id ? doc.getElementById(id) : null;
        return el ? { id, el } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const offset = headerHeight() + 120;
    let currentId = sections[0].id;

    sections.forEach(({ id, el }) => {
      if (window.scrollY >= el.offsetTop - offset) currentId = id;
    });

    const atBottom = window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 8;
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
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    window.addEventListener("orientationchange", requestScrollUpdate, { passive: true });
    window.addEventListener("hashchange", () => window.requestAnimationFrame(updateScroll));
  }

  function initReveal() {
    if (!revealEls.length) return;

    if (reduceMotionMQ.matches || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -48px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  function init() {
    setFooterYear();
    initNav();
    initScrollSpy();
    initReveal();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
