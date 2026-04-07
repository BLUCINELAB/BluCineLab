(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  const footerYear = document.getElementById("footerYear");
  const videos = Array.from(document.querySelectorAll("video"));

  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      const target = event.target;
      if (
        siteNav.classList.contains("is-open") &&
        !siteNav.contains(target) &&
        !navToggle.contains(target)
      ) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = `#${entry.target.id}`;

          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === currentId;
            link.classList.toggle("is-active", isActive);
          });
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0.01,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  videos.forEach((video) => {
    const playVideo = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }
    };

    playVideo();

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          video.pause();
        } else {
          playVideo();
        }
      },
      { passive: true }
    );
  });
})();
