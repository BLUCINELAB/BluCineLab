(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#site-header");
  const nav = document.querySelector("#site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const year = document.querySelector("#footer-year");

  if (year) year.textContent = String(new Date().getFullYear());

  const polaroidTarget = document.querySelector('img[src="asset/portfolio/anton-nov83.webp"]');
  if (polaroidTarget) {
    polaroidTarget.src = "asset/portfolio/recent-polaroid.webp";
    polaroidTarget.alt = "Polaroid portrait of a red-haired woman against a reflective gold surface.";
    polaroidTarget.width = 1483;
    polaroidTarget.height = 1800;

    const caption = polaroidTarget.closest("figure")?.querySelector("figcaption");
    if (caption) {
      caption.innerHTML = "<span>Polaroid study</span><span>Portrait / instant film</span>";
    }
  }

  const beatriceHeading = Array.from(document.querySelectorAll(".team-list h3"))
    .find((heading) => heading.textContent.trim() === "Beatrice Visentin");

  if (beatriceHeading) {
    const article = beatriceHeading.closest("article");
    const placeholder = article?.querySelector(':scope > span[aria-hidden="true"]');

    if (article && placeholder) {
      const link = document.createElement("a");
      link.href = "https://www.instagram.com/beatrice_visentin_28/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Beatrice Visentin on Instagram");
      link.textContent = "↗";
      placeholder.replaceWith(link);
    }
  }

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
