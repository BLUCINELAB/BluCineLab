document.documentElement.classList.add("js-enhanced");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const footerYear = document.getElementById("footerYear");
const statusWord = document.getElementById("statusWord");
const statusBadge = document.getElementById("statusBadge");
const reveals = document.querySelectorAll(".reveal");
const bgWaves = document.querySelector(".bg-waves");
const progressBar = document.getElementById("scrollProgressBar");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = [...document.querySelectorAll("main section[id]")];
const siteShell = document.getElementById("siteShell");
const interactiveCards = document.querySelectorAll(".interactive-card");

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (statusBadge && statusWord) {
  const states = ["online", "on site", "building", "live"];
  let stateIndex = 0;

  statusBadge.addEventListener("click", () => {
    stateIndex = (stateIndex + 1) % states.length;
    statusWord.textContent = states[stateIndex];
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

function updateProgressAndWaves() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  if (bgWaves) {
    const y = scrollTop * 0.08;
    bgWaves.style.transform = `translateY(${y}px)`;
  }
}

function updateActiveSection() {
  if (!sections.length || !navLinks.length) return;

  let currentId = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
}

window.addEventListener(
  "scroll",
  () => {
    updateProgressAndWaves();
    updateActiveSection();
  },
  { passive: true }
);

window.addEventListener("load", () => {
  updateProgressAndWaves();
  updateActiveSection();
});

/* ambient light follows pointer */
if (siteShell && window.matchMedia("(pointer:fine)").matches) {
  siteShell.addEventListener("pointermove", (e) => {
    const x = `${(e.clientX / window.innerWidth) * 100}%`;
    const y = `${(e.clientY / window.innerHeight) * 100}%`;
    document.documentElement.style.setProperty("--mx", x);
    document.documentElement.style.setProperty("--my", y);
  });
}

/* 3D tilt cards */
if (window.matchMedia("(pointer:fine)").matches) {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      const rotateY = ((px - 50) / 50) * 4.5;
      const rotateX = -((py - 50) / 50) * 4.5;

      card.style.setProperty("--px", `${px}%`);
      card.style.setProperty("--py", `${py}%`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.classList.remove("is-tilting");
    });
  });
}