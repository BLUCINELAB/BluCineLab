document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
     HELPERS
  ========================= */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const isTouchDevice =
    window.matchMedia("(hover: none)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  /* =========================
     CURSOR
  ========================= */

  const cursor = $("#cursor");
  const cursorTrail = $("#cursorTrail");

  if (cursor && cursorTrail && !isTouchDevice) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const hoverTargets = "a, button, .archive-item, .lab-entry, .studio-area";

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        cursor.style.background = "#c8b38b";

        cursorTrail.style.width = "34px";
        cursorTrail.style.height = "34px";
        cursorTrail.style.borderColor = "rgba(200,179,139,.8)";
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.style.width = "8px";
        cursor.style.height = "8px";
        cursor.style.background = "#ffffff";

        cursorTrail.style.width = "24px";
        cursorTrail.style.height = "24px";
        cursorTrail.style.borderColor = "#ffffff";
      }
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.14;
      trailY += (mouseY - trailY) * 0.14;
      cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
      requestAnimationFrame(animateTrail);
    }

    animateTrail();
  } else {
    if (cursor) cursor.style.display = "none";
    if (cursorTrail) cursorTrail.style.display = "none";
  }

  /* =========================
     MOBILE NAV
  ========================= */

  const nav = $("#nav");
  const navMenuBtn = $("#nav-menu-btn");
  const navMobile = $("#nav-mobile");
  const navMobileLinks = $$(".nav-mobile-link");

  if (navMenuBtn && navMobile) {
    navMenuBtn.addEventListener("click", () => {
      navMobile.classList.toggle("is-open");

      const open = navMobile.classList.contains("is-open");
      navMobile.style.display = open ? "block" : "none";
      navMenuBtn.classList.toggle("is-open", open);
    });

    navMobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMobile.classList.remove("is-open");
        navMobile.style.display = "none";
        navMenuBtn.classList.remove("is-open");
      });
    });
  }

  /* =========================
     NAV ACTIVE + BG
  ========================= */

  const sections = [
    { id: "home", el: $("#home") },
    { id: "archive", el: $("#archive") },
    { id: "studio", el: $("#studio") },
    { id: "lab", el: $("#lab") },
    { id: "contact", el: $("#contact") }
  ].filter((s) => s.el);

  const navLinks = $$(".nav-link");

  function updateNavState() {
    const scrollY = window.scrollY;
    const navHeight = nav ? nav.offsetHeight : 72;
    const probe = scrollY + navHeight + window.innerHeight * 0.2;

    if (nav) {
      nav.style.background =
        scrollY > 20 ? "rgba(5,11,18,0.92)" : "rgba(5,11,18,0.8)";
    }

    let currentId = "home";

    sections.forEach((section) => {
      if (section.el.offsetTop <= probe) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const linkId = link.dataset.navLink;
      link.style.color = linkId === currentId ? "#ffffff" : "#cfd7e0";
      link.style.opacity = linkId === currentId ? "1" : ".8";
    });
  }

  window.addEventListener("scroll", updateNavState, { passive: true });
  window.addEventListener("resize", updateNavState);
  updateNavState();

  /* =========================
     SMOOTH SCROLL
  ========================= */

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({
        top,
        behavior: "smooth"
      });
    });
  });

  /* =========================
     HERO TITLE REVEAL
  ========================= */

  const heroLines = $$(".hero-line");
  if (heroLines.length) {
    heroLines.forEach((line) => {
      const delay = Number(line.dataset.delay || 0);
      line.style.opacity = "0";
      line.style.transform = "translateY(24px)";
      line.style.transition = "opacity .8s ease, transform .8s ease";

      setTimeout(() => {
        line.style.opacity = "1";
        line.style.transform = "translateY(0)";
      }, 400 + delay);
    });
  }

  /* =========================
     HERO TITLE LETTER GLOW
  ========================= */

  const heroTitleLetters = $$(".hero-title span");
  heroTitleLetters.forEach((letter) => {
    letter.style.transition = "filter .18s ease, transform .18s ease, text-shadow .18s ease";

    letter.addEventListener("mouseenter", () => {
      letter.style.filter = "brightness(1.25)";
      letter.style.transform = "translateY(-2px)";
      letter.style.textShadow = "0 0 18px rgba(180,210,255,.35)";
    });

    letter.addEventListener("mouseleave", () => {
      letter.style.filter = "";
      letter.style.transform = "";
      letter.style.textShadow = "";
    });
  });

  /* =========================
     HERO CANVAS
  ========================= */

  const heroCanvas = $("#heroCanvas");

  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    let w = 0;
    let h = 0;
    let particles = [];

    function resizeCanvas() {
      w = heroCanvas.offsetWidth;
      h = heroCanvas.offsetHeight;
      heroCanvas.width = w * devicePixelRatio;
      heroCanvas.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      const count = window.innerWidth < 768 ? 24 : 52;
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.5,
        a: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.22 + 0.04)
      }));
    }

    function drawHeroCanvas() {
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.28,
        0,
        w * 0.5,
        h * 0.28,
        Math.max(w * 0.5, h * 0.5)
      );
      grad.addColorStop(0, "rgba(55,90,150,0.18)");
      grad.addColorStop(0.45, "rgba(20,35,60,0.08)");
      grad.addColorStop(1, "rgba(5,11,18,0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,170,255,${p.a})`;
        ctx.fill();
      });

      requestAnimationFrame(drawHeroCanvas);
    }

    resizeCanvas();
    drawHeroCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  /* =========================
     ARCHIVE FILTER
  ========================= */

  const filterButtons = $$(".filter-btn");
  const archiveItems = $$(".archive-item");
  const archiveCount = $(".archive-count");

  if (filterButtons.length && archiveItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        let visibleCount = 0;

        archiveItems.forEach((item) => {
          const category = item.dataset.category;
          const show = filter === "all" || category === filter;

          item.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });

        if (archiveCount) {
          const labelMap = {
            all: "3 categorie",
            "case-study": "Case Study",
            confidential: "Confidenziale",
            process: "Processo"
          };
          archiveCount.textContent =
            filter === "all"
              ? `${visibleCount} voci · ${labelMap[filter]}`
              : `${visibleCount} voci · ${labelMap[filter]}`;
        }
      });
    });
  }

  /* =========================
     SCROLL REVEAL
  ========================= */

  const revealTargets = $$(".archive-item, .studio-area, .lab-entry, .contact-inner");

  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity .7s ease, transform .7s ease";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  /* =========================
     PROJECT OVERLAY
  ========================= */

  const overlay = $("#project-overlay");
  const overlayBody = $("#po-body");
  const overlayLabel = $("#po-label");
  const overlayClose = $("#po-close");

  const projects = {
    "project-1": {
      label: "Exhibition",
      title: "Paesaggi di una mente",
      year: "2024",
      body: `
        <div class="overlay-project">
          <h2 style="font-family:'Oswald',sans-serif;font-size:42px;letter-spacing:.04em;margin-bottom:12px;">Paesaggi di una mente</h2>
          <p style="opacity:.6;margin-bottom:28px;">Exhibition · 2024</p>
          <p style="line-height:1.8;max-width:720px;">
            Progetto espositivo per una mostra di fotografia contemporanea.
            Il lavoro mette insieme atmosfera, struttura visiva, ritmo delle superfici
            e relazione tra immagine, spazio e lettura.
          </p>
        </div>
      `
    },
    "project-3": {
      label: "Brand Direction",
      title: "Superficie Confidenziale",
      year: "2024",
      body: `
        <div class="overlay-project">
          <h2 style="font-family:'Oswald',sans-serif;font-size:42px;letter-spacing:.04em;margin-bottom:12px;">Superficie Confidenziale</h2>
          <p style="opacity:.6;margin-bottom:28px;">Brand Direction · 2024</p>
          <p style="line-height:1.8;max-width:720px;">
            Progetto riservato. La pagina mostra soltanto una forma sintetica del lavoro:
            sistema visivo, tono, identità e direzione complessiva.
          </p>
        </div>
      `
    },
    "project-4": {
      label: "Film",
      title: "Forma in divenire",
      year: "2023",
      body: `
        <div class="overlay-project">
          <h2 style="font-family:'Oswald',sans-serif;font-size:42px;letter-spacing:.04em;margin-bottom:12px;">Forma in divenire</h2>
          <p style="opacity:.6;margin-bottom:28px;">Film · 2023</p>
          <p style="line-height:1.8;max-width:720px;">
            Studio cinematografico e visivo sul processo, sul tempo dell’immagine
            e sulla costruzione progressiva di una forma narrativa.
          </p>
        </div>
      `
    }
  };

  function openOverlay(projectKey) {
    if (!overlay || !overlayBody || !overlayLabel) return;
    const project = projects[projectKey];
    if (!project) return;

    overlayLabel.textContent = project.label;
    overlayBody.innerHTML = project.body;
    overlay.style.display = "block";
    body.style.overflow = "hidden";
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.style.display = "none";
    body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const projectLink = e.target.closest('a[href^="#project-"]');
    if (!projectLink) return;

    const href = projectLink.getAttribute("href");
    const key = href.replace("#", "");

    if (projects[key]) {
      e.preventDefault();
      openOverlay(key);
    }
  });

  if (overlayClose) {
    overlayClose.addEventListener("click", closeOverlay);
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeOverlay();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });

  /* =========================
     BASIC MOBILE NAV STYLE HOOK
  ========================= */

  if (navMobile && !navMobile.classList.contains("is-open")) {
    navMobile.style.display = "none";
  }
});