(function () {
  var menuToggle = document.querySelector(".menu-toggle");
  var siteNav = document.querySelector(".site-nav");
  var footerYear = document.getElementById("footerYear");
  var progressBar = document.getElementById("scrollProgressBar");
  var bgWaves = document.querySelector(".bg-waves");
  var statusBadge = document.getElementById("statusBadge");
  var statusWord = document.getElementById("statusWord");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    var navLinks = siteNav.querySelectorAll("a");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  if (statusBadge && statusWord) {
    var states = ["online", "on site", "building", "live"];
    var stateIndex = 0;

    statusBadge.addEventListener("click", function () {
      stateIndex++;
      if (stateIndex >= states.length) {
        stateIndex = 0;
      }
      statusWord.textContent = states[stateIndex];
    });
  }

  function updateScrollEffects() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && docHeight > 0) {
      var progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + "%";
    }

    if (bgWaves) {
      var y = scrollTop * 0.08;
      bgWaves.style.transform = "translateY(" + y + "px)";
    }
  }

  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  window.addEventListener("load", updateScrollEffects);
})();