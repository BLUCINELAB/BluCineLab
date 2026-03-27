document.documentElement.className += " js-enhanced";

var menuToggle = document.querySelector(".menu-toggle");
var siteNav = document.querySelector(".site-nav");
var footerYear = document.getElementById("footerYear");
var statusWord = document.getElementById("statusWord");
var statusBadge = document.getElementById("statusBadge");
var reveals = document.querySelectorAll(".reveal");
var bgWaves = document.querySelector(".bg-waves");
var progressBar = document.getElementById("scrollProgressBar");
var navLinks = document.querySelectorAll(".site-nav a");
var sections = document.querySelectorAll("main section[id]");
var siteShell = document.getElementById("siteShell");

if (footerYear) {
  footerYear.innerHTML = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.onclick = function () {
    var isOpen = siteNav.classList.contains("is-open");

    if (isOpen) {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    } else {
      siteNav.classList.add("is-open");
      menuToggle.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
    }
  };

  var i;
  for (i = 0; i < navLinks.length; i++) {
    navLinks[i].onclick = function () {
      siteNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };
  }
}

if (statusBadge && statusWord) {
  var states = ["online", "on site", "building", "live"];
  var stateIndex = 0;

  statusBadge.onclick = function () {
    stateIndex = stateIndex + 1;
    if (stateIndex >= states.length) {
      stateIndex = 0;
    }
    statusWord.innerHTML = states[stateIndex];
  };
}

function revealAll() {
  var i;
  for (i = 0; i < reveals.length; i++) {
    reveals[i].classList.add("is-visible");
  }
}

if ("IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    var i;
    for (i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("is-visible");
        revealObserver.unobserve(entries[i].target);
      }
    }
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px"
  });

  var j;
  for (j = 0; j < reveals.length; j++) {
    revealObserver.observe(reveals[j]);
  }
} else {
  revealAll();
}

function updateProgressAndWaves() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var progress = 0;

  if (docHeight > 0) {
    progress = (scrollTop / docHeight) * 100;
  }

  if (progressBar) {
    progressBar.style.width = progress + "%";
  }

  if (bgWaves) {
    bgWaves.style.transform = "translateY(" + (scrollTop * 0.08) + "px)";
  }
}

function updateActiveSection() {
  if (!sections.length || !navLinks.length) {
    return;
  }

  var currentId = "";
  var i;
  var rect;

  for (i = 0; i < sections.length; i++) {
    rect = sections[i].getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      currentId = sections[i].id;
    }
  }

  for (i = 0; i < navLinks.length; i++) {
    var href = navLinks[i].getAttribute("href");
    if (href === "#" + currentId) {
      navLinks[i].classList.add("is-active");
    } else {
      navLinks[i].classList.remove("is-active");
    }
  }
}

window.onscroll = function () {
  updateProgressAndWaves();
  updateActiveSection();
};

window.onload = function () {
  updateProgressAndWaves();
  updateActiveSection();
};

if (siteShell && window.matchMedia && window.matchMedia("(pointer:fine)").matches) {
  siteShell.onmousemove = function (e) {
    var x = (e.clientX / window.innerWidth) * 100 + "%";
    var y = (e.clientY / window.innerHeight) * 100 + "%";
    document.documentElement.style.setProperty("--mx", x);
    document.documentElement.style.setProperty("--my", y);
  };
}