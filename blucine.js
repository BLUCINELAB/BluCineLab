const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const footerYear = document.getElementById("footerYear");
const statusWord = document.getElementById("statusWord");
const statusBadge = document.getElementById("statusBadge");
const reveals = document.querySelectorAll(".reveal");
const bgWaves = document.querySelector(".bg-waves");

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

/* reveal sicuro: aggiunge solo classe, non nasconde nulla */
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
      rootMargin: "0px 0px -6% 0px"
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* micro movimento onde */
if (bgWaves) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY * 0.08;
    bgWaves.style.transform = `translateY(${y}px)`;
  });
}