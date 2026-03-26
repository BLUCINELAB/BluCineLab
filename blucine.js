"use strict";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupStatusBadge();
  setupFooterYear();
});

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${index * 60}ms`;
    observer.observe(item);
  });
}

function setupStatusBadge() {
  const word = document.getElementById("statusWord");
  const badge = document.getElementById("statusBadge");
  if (!word || !badge) return;

  const states = [
    "online",
    "building",
    "framing",
    "editing",
    "staging",
    "listening",
  ];

  let index = 0;

  badge.addEventListener("click", () => {
    index = (index + 1) % states.length;
    word.textContent = states[index];
  });

  setInterval(() => {
    index = (index + 1) % states.length;
    word.textContent = states[index];
  }, 2800);
}

function setupFooterYear() {
  const yearNode = document.getElementById("footerYear");
  if (!yearNode) return;
  yearNode.textContent = new Date().getFullYear();
}"use strict";

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  setupStatusBadge();
  setupFooterYear();
});

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${index * 60}ms`;
    observer.observe(item);
  });
}

function setupStatusBadge() {
  const word = document.getElementById("statusWord");
  const badge = document.getElementById("statusBadge");
  if (!word || !badge) return;

  const states = [
    "online",
    "building",
    "framing",
    "editing",
    "staging",
    "listening",
  ];

  let index = 0;

  badge.addEventListener("click", () => {
    index = (index + 1) % states.length;
    word.textContent = states[index];
  });

  setInterval(() => {
    index = (index + 1) % states.length;
    word.textContent = states[index];
  }, 2800);
}

function setupFooterYear() {
  const yearNode = document.getElementById("footerYear");
  if (!yearNode) return;
  yearNode.textContent = new Date().getFullYear();
}
