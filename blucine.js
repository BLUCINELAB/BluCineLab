(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#site-header");
  const nav = document.querySelector("#site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const year = document.querySelector("#footer-year");

  if (year) year.textContent = String(new Date().getFullYear());

  const setNavigation = (open) => {
    if (!nav || !toggle) return;
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    body.classList.toggle("nav-open", open);
  };

  if (toggle && nav) {
    nav.dataset.open = "false";
    toggle.addEventListener("click", () => setNavigation(toggle.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNavigation(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNavigation(false);
    });
  }

  let waiting = false;
  const updateHeader = () => {
    if (header) header.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
    waiting = false;
  };

  window.addEventListener("scroll", () => {
    if (waiting) return;
    waiting = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  updateHeader();
})();
