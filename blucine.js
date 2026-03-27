document.documentElement.classList.add("js-enhanced");

var menuToggle = document.querySelector(".menu-toggle");
var siteNav = document.querySelector(".site-nav");
var footerYear = document.getElementById("footerYear");
var statusWord = document.getElementById("statusWord");
var statusBadge = document.getElementById("statusBadge");
var reveals = document.querySelectorAll(".reveal");
var bgWaves = document.querySelector(".bg-waves");
var progressBar = document.getElementById("scrollProgressBar");
var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
var sections = document.querySelectorAll("main section[id]");
var siteShell = document.getElementById("siteShell");

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", function () {
    var isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  var navItems = siteNav.querySelectorAll("a");
  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (statusBadge && statusWord) {
  var states = ["online", "on site", "building", "live"];
  var stateIndex = 0;

  statusBadge.addEventListener("click", function () {
    stateIndex = (stateIndex + 1) % states.length;
    statusWord.textContent = states[stateIndex];
  });
}

if ("IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
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

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });
} else {
  reveals.forEach(function (el) {
    el.classList.add("is-visible");
  });
}

function updateProgressAndWaves() {
  var scrollTop = window.scrollY || window.pageYOffset;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var progress = 0;

  if (docHeight > 0) {
    progress = (scrollTop / docHeight) * 100;
  }

  if (progressBar) {
    progressBar.style.width = Math.min(progress, 100) + "%";
  }

  if (bgWaves) {
    var y = scrollTop * 0.08;
    bgWaves.style.transform = "translateY(" + y + "px)";
  }
}

function updateActiveSection() {
  if (!sections.length || !navLinks.length) {
    return;
  }

  var currentId = "";

  sections.forEach(function (section) {
    var rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      currentId = section.id;
    }
  });

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    var isActive = href === "#" + currentId;
    link.classList.toggle("is-active", isActive);
  });
}

window.addEventListener(
  "scroll",
  function () {
    updateProgressAndWaves();
    updateActiveSection();
  },
  { passive: true }
);

window.addEventListener("load", function () {
  updateProgressAndWaves();
  updateActiveSection();
});

if (siteShell && window.matchMedia("(pointer:fine)").matches) {
  siteShell.addEventListener("pointermove", function (e) {
    var x = (e.clientX / window.innerWidth) * 100 + "%";
    var y = (e.clientY / window.innerHeight) * 100 + "%";
    document.documentElement.style.setProperty("--mx", x);
    document.documentElement.style.setProperty("--my", y);
  });
}