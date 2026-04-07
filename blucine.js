/**
 * blucine.js — BluCineLab
 * Nav · Year · Live Board · Modal
 */
(function () {
  "use strict";

  /* ── Nav ──────────────────────────────────────────────────── */
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav   = document.querySelector(".site-nav");
  const navLinks  = Array.from(document.querySelectorAll(".site-nav a"));
  const sections  = navLinks
    .map(link => { const id = link.getAttribute("href"); return id ? document.querySelector(id) : null; })
    .filter(Boolean);

  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", function (e) {
      if (siteNav.classList.contains("is-open") && !siteNav.contains(e.target) && !navToggle.contains(e.target)) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === id));
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 }
    );
    sections.forEach(s => observer.observe(s));
  }

  /* ── Project data ─────────────────────────────────────────── */
  const PROJECTS = [
    {
      id: "cyanotype",
      title: "Cyanotype — Trace as Image",
      status: "Production / Exhibited",
      statusClass: "exhibited",
      type: "Installation · Image · Material process",
      description: "A series of cyanotype works developed through direct exposure, where image emerges as trace rather than representation. The process becomes the subject itself.",
      extra: "Presented at Trasforma Festival 2026 (Bergamo), a platform exploring contemporary art and circular economy.",
      meta: [
        { label: "Location", value: "Bergamo" },
        { label: "Context",  value: "Trasforma Festival 2026" },
        { label: "Type",     value: "Installation / Image / Material process" }
      ],
      cardClass:  "live-card--cyanotype",
      modalClass: "lb-modal--cyanotype",
      images: {
        intima: "INTIMA-SoniaGiudici.jpg",
        detail: "DETAIL1-SoniaGiudici.JPEG"
      },
      svgPrimary: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="cp"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter>
          <radialGradient id="cg" cx="45%" cy="50%" r="55%"><stop offset="0%" stop-color="rgba(80,140,200,0.25)"/><stop offset="100%" stop-color="rgba(5,15,30,0)"/></radialGradient>
        </defs>
        <rect width="800" height="450" fill="#0a1828"/>
        <rect width="800" height="450" fill="url(#cg)"/>
        <rect width="800" height="450" fill="transparent" filter="url(#cp)" opacity="0.28"/>
        <path d="M80 320 Q200 240 360 280 Q520 320 680 220" stroke="rgba(140,200,240,0.22)" stroke-width="1.6" fill="none"/>
        <path d="M60 350 Q200 265 370 305 Q540 345 710 245" stroke="rgba(120,185,228,0.14)" stroke-width="1.1" fill="none"/>
        <ellipse cx="350" cy="220" rx="200" ry="130" fill="rgba(73,120,180,0.10)"/>
      </svg>`,
      svgHover: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="ch"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter>
        </defs>
        <rect width="800" height="450" fill="#071525"/>
        <rect width="800" height="450" fill="transparent" filter="url(#ch)" opacity="0.35"/>
        <ellipse cx="320" cy="200" rx="220" ry="140" fill="rgba(30,80,140,0.35)"/>
        <ellipse cx="480" cy="280" rx="160" ry="110" fill="rgba(20,60,110,0.28)"/>
        <path d="M80 320 Q240 230 400 270 Q560 310 720 210" stroke="rgba(180,225,250,0.35)" stroke-width="2" fill="none"/>
      </svg>`,
      svgModal: `<svg viewBox="0 0 1200 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="cm"><feTurbulence type="fractalNoise" baseFrequency="0.60" numOctaves="5" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter>
          <radialGradient id="cmg" cx="50%" cy="60%" r="60%"><stop offset="0%" stop-color="rgba(73,120,200,0.28)"/><stop offset="100%" stop-color="rgba(5,12,25,0)"/></radialGradient>
        </defs>
        <rect width="1200" height="380" fill="#091724"/>
        <rect width="1200" height="380" fill="url(#cmg)"/>
        <rect width="1200" height="380" fill="transparent" filter="url(#cm)" opacity="0.32"/>
        <ellipse cx="500" cy="180" rx="340" ry="200" fill="rgba(40,100,170,0.18)"/>
        <path d="M60 300 Q300 200 600 240 Q900 280 1140 180" stroke="rgba(160,215,248,0.30)" stroke-width="1.8" fill="none"/>
        <path d="M80 270 Q310 175 600 215 Q890 255 1140 155" stroke="rgba(180,225,250,0.15)" stroke-width="0.9" fill="none"/>
      </svg>`
    },
    {
      id: "cube-system",
      title: "Cube System",
      status: "Production",
      statusClass: "production",
      type: "Installation · Spatial image",
      description: "A reflective chamber conceived through image, projection, sound and spatial contrast. A structure where light becomes form and form becomes language.",
      extra: "The Cube System explores the relationship between enclosed space and projected image, using reflection as both a material and a conceptual device.",
      meta: [
        { label: "Location", value: "Bologna" },
        { label: "Year",     value: "2026" },
        { label: "Type",     value: "Installation / Spatial image" }
      ],
      cardClass: "", modalClass: "", images: null,
      svgPrimary: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="cup"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter></defs>
        <rect width="800" height="450" fill="#0e0e0e" filter="url(#cup)" opacity="0.9"/>
        <polygon points="400,80 620,200 620,360 400,480 180,360 180,200" fill="none" stroke="rgba(244,239,231,0.07)" stroke-width="1.2"/>
        <polygon points="400,110 585,215 585,345 400,450 215,345 215,215" fill="none" stroke="rgba(244,239,231,0.10)" stroke-width="0.8"/>
        <ellipse cx="400" cy="270" rx="140" ry="100" fill="rgba(216,177,122,0.05)"/>
      </svg>`,
      svgHover: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="cuh"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter></defs>
        <rect width="800" height="450" fill="#0f0e0b" filter="url(#cuh)" opacity="0.95"/>
        <polygon points="400,60 640,190 640,380 400,510 160,380 160,190" fill="none" stroke="rgba(216,177,122,0.20)" stroke-width="1.5"/>
        <ellipse cx="400" cy="270" rx="180" ry="120" fill="rgba(216,177,122,0.08)"/>
        <ellipse cx="400" cy="270" rx="80" ry="55" fill="rgba(216,177,122,0.12)"/>
      </svg>`,
      svgModal: `<svg viewBox="0 0 1200 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="cum"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter></defs>
        <rect width="1200" height="380" fill="#0d0d0d" filter="url(#cum)" opacity="0.88"/>
        <polygon points="600,40 900,185 900,330 600,475 300,330 300,185" fill="none" stroke="rgba(216,177,122,0.14)" stroke-width="1.4"/>
        <ellipse cx="600" cy="255" rx="220" ry="150" fill="rgba(216,177,122,0.07)"/>
      </svg>`
    },
    {
      id: "audiovisual",
      title: "Audiovisual Commissions",
      status: "Ongoing",
      statusClass: "ongoing",
      type: "Moving image · Direction",
      description: "Narrative and visual productions designed to carry atmosphere, identity and editorial clarity. Image and sound shaped as one deliberate structure for brand and cultural contexts.",
      extra: "A continuous line of work that adapts format and scale to the nature of each commission — from short-form identity films to longer documentary structures.",
      meta: [
        { label: "Context", value: "Brand and cultural contexts" },
        { label: "Status",  value: "Ongoing" },
        { label: "Type",    value: "Moving image / Direction / Editing & sound" }
      ],
      cardClass: "", modalClass: "", images: null,
      svgPrimary: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="avp"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
        <rect width="800" height="450" fill="#0d0e18" filter="url(#avp)" opacity="0.85"/>
        <g opacity="0.5">${Array.from({length:36},(_,i)=>{const x=30+i*21,h=20+Math.abs(Math.sin(i*.8)*100),y=225-h/2;return`<rect x="${x}" y="${y}" width="5" height="${h}" fill="rgba(73,108,167,${(.5+Math.sin(i*.6)*.3).toFixed(2)})" rx="2"/>`;}).join("")}</g>
      </svg>`,
      svgHover: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="avh"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
        <rect width="800" height="450" fill="#0c0d18" filter="url(#avh)" opacity="0.9"/>
        <ellipse cx="400" cy="225" rx="280" ry="160" fill="rgba(73,108,167,0.10)"/>
        <circle cx="400" cy="225" r="110" fill="none" stroke="rgba(73,108,167,0.25)" stroke-width="1.2"/>
        <circle cx="400" cy="225" r="55" fill="rgba(73,108,167,0.18)"/>
        <circle cx="400" cy="225" r="18" fill="rgba(73,108,167,0.45)"/>
      </svg>`,
      svgModal: `<svg viewBox="0 0 1200 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="avm"><feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
        <rect width="1200" height="380" fill="#0c0e18" filter="url(#avm)" opacity="0.88"/>
        <g opacity="0.45">${Array.from({length:55},(_,i)=>{const x=20+i*21.4,h=15+Math.abs(Math.sin(i*.75)*130),y=190-h/2;return`<rect x="${x}" y="${y}" width="4" height="${h}" fill="rgba(73,108,167,${(.45+Math.sin(i*.55)*.3).toFixed(2)})" rx="2"/>`;}).join("")}</g>
      </svg>`
    },
    {
      id: "visual-language",
      title: "Visual Language Building",
      status: "Research",
      statusClass: "research",
      type: "Identity · Presence systems",
      description: "Development of visual coherence across image, tone, digital presence and communication structures for studios, organisations and special projects.",
      extra: "A research-driven process that begins with observation and ends in a system — not a style guide, but a set of decisions that hold across time and format.",
      meta: [
        { label: "Context", value: "Studios, organisations and special projects" },
        { label: "Status",  value: "Research / Ongoing" },
        { label: "Type",    value: "Identity / Visual language / Presence systems" }
      ],
      cardClass: "", modalClass: "", images: null,
      svgPrimary: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="vlp"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter></defs>
        <rect width="800" height="450" fill="#0e0c0a" filter="url(#vlp)" opacity="0.85"/>
        <line x1="266" y1="40" x2="266" y2="420" stroke="rgba(216,177,122,0.06)" stroke-width="0.8"/>
        <line x1="533" y1="40" x2="533" y2="420" stroke="rgba(216,177,122,0.06)" stroke-width="0.8"/>
        <line x1="40" y1="150" x2="770" y2="150" stroke="rgba(216,177,122,0.06)" stroke-width="0.8"/>
        <line x1="40" y1="300" x2="770" y2="300" stroke="rgba(216,177,122,0.06)" stroke-width="0.8"/>
        <rect x="120" y="180" width="100" height="100" fill="none" stroke="rgba(216,177,122,0.18)" stroke-width="1" rx="4"/>
        <rect x="350" y="170" width="100" height="120" fill="rgba(216,177,122,0.06)" stroke="rgba(216,177,122,0.12)" stroke-width="0.8" rx="4"/>
        <rect x="580" y="185" width="100" height="90" fill="none" stroke="rgba(216,177,122,0.14)" stroke-width="0.8" rx="4"/>
      </svg>`,
      svgHover: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="vlh"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter></defs>
        <rect width="800" height="450" fill="#120f0b" filter="url(#vlh)" opacity="0.9"/>
        <rect x="110" y="165" width="130" height="130" fill="rgba(216,177,122,0.10)" stroke="rgba(216,177,122,0.22)" stroke-width="1" rx="4"/>
        <rect x="335" y="155" width="130" height="150" fill="rgba(216,177,122,0.08)" stroke="rgba(216,177,122,0.18)" stroke-width="1" rx="4"/>
        <rect x="565" y="170" width="130" height="120" fill="rgba(216,177,122,0.06)" stroke="rgba(216,177,122,0.15)" stroke-width="1" rx="4"/>
        <line x1="240" y1="230" x2="335" y2="230" stroke="rgba(216,177,122,0.30)" stroke-width="0.8"/>
        <line x1="465" y1="230" x2="565" y2="230" stroke="rgba(216,177,122,0.30)" stroke-width="0.8"/>
      </svg>`,
      svgModal: `<svg viewBox="0 0 1200 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs><filter id="vlm"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="overlay"/></filter></defs>
        <rect width="1200" height="380" fill="#110e0b" filter="url(#vlm)" opacity="0.9"/>
        <line x1="400" y1="30" x2="400" y2="360" stroke="rgba(216,177,122,0.07)" stroke-width="0.8"/>
        <line x1="800" y1="30" x2="800" y2="360" stroke="rgba(216,177,122,0.07)" stroke-width="0.8"/>
        <rect x="100" y="150" width="200" height="120" fill="rgba(216,177,122,0.08)" stroke="rgba(216,177,122,0.18)" stroke-width="1" rx="4"/>
        <rect x="500" y="140" width="200" height="140" fill="rgba(216,177,122,0.06)" stroke="rgba(216,177,122,0.14)" stroke-width="1" rx="4"/>
        <rect x="900" y="155" width="200" height="110" fill="rgba(216,177,122,0.07)" stroke="rgba(216,177,122,0.16)" stroke-width="1" rx="4"/>
      </svg>`
    }
  ];

  /* ── Render cards ─────────────────────────────────────────── */
  const grid      = document.getElementById("liveGrid");
  const liveCount = document.getElementById("liveCount");

  if (grid) {
    PROJECTS.forEach((project, index) => {
      const card = document.createElement("article");
      const isFeatured = index === 0;
      const classes = ["live-card", "panel"];
      if (project.cardClass) classes.push(project.cardClass);
      if (isFeatured)        classes.push("live-card--featured");
      card.className = classes.join(" ");
      card.setAttribute("role", "listitem");
      card.setAttribute("tabindex", "0");
      card.setAttribute("data-project", project.id);
      card.setAttribute("aria-label", "Open project: " + project.title);

      card.innerHTML = `
        <div class="lc-visual" aria-hidden="true">
          <div class="lc-img lc-img--primary">${project.svgPrimary}</div>
          <div class="lc-img lc-img--hover">${project.svgHover}</div>
          <div class="lc-status-badge lc-status--${project.statusClass}">
            <span class="lc-status-dot"></span>${project.status}
          </div>
        </div>
        <div class="lc-body">
          <div class="lc-meta-row"><span class="lc-type">${project.type}</span></div>
          <h3 class="lc-title">${project.title}</h3>
          <p class="lc-desc">${project.description}</p>
          <div class="lc-reveal">
            <p class="lc-reveal-text">${project.meta[0] ? project.meta[0].value : ""}</p>
            <span class="lc-open-cta">Open project →</span>
          </div>
        </div>`;

      card.addEventListener("click", () => openModal(project));
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(project); }
      });

      grid.appendChild(card);
    });

    if (liveCount) liveCount.textContent = PROJECTS.length + " active";
  }

  /* ── Modal ────────────────────────────────────────────────── */
  const modalOverlay = document.getElementById("lbModal");
  const modalInner   = document.getElementById("lbModalInner");
  const modalClose   = document.getElementById("lbModalClose");
  const modalVisual  = document.getElementById("lbModalVisual");
  const modalStatus  = document.getElementById("lbModalStatus");
  const modalTitle   = document.getElementById("lbModalTitle");
  const modalDesc    = document.getElementById("lbModalDesc");
  const modalExtra   = document.getElementById("lbModalExtra");
  const modalMeta    = document.getElementById("lbModalMeta");

  let previousFocus = null;

  function statusColor(cls) {
    return { exhibited:"#5b9fd6", production:"#d8b17a", ongoing:"#3fa76a", research:"#9b80c8" }[cls] || "#aaa";
  }

  function openModal(project) {
    if (!modalOverlay) return;
    previousFocus = document.activeElement;

    /* Reset: remove is-open so layers start at opacity:0 */
    modalOverlay.classList.remove("is-open");

    modalInner.className = "lb-modal" + (project.modalClass ? " " + project.modalClass : "");

    /* Step 1: visual */
    modalVisual.innerHTML = project.svgModal || project.svgPrimary;

    /* Step 2: content */
    modalStatus.innerHTML =
      `<span style="width:7px;height:7px;border-radius:50%;display:inline-block;flex:0 0 auto;` +
      `background:${statusColor(project.statusClass)};box-shadow:0 0 5px ${statusColor(project.statusClass)}77;` +
      `margin-right:6px;"></span>${project.status}`;
    modalTitle.textContent = project.title;
    modalDesc.textContent  = project.description;
    modalExtra.textContent = project.extra;
    modalMeta.innerHTML    = project.meta.map(m => `<dt>${m.label}</dt><dd>${m.value}</dd>`).join("");

    /* Step 3: images (project-specific) */
    const existing = modalInner.querySelector(".lb-modal-images");
    if (existing) existing.remove();

    if (project.images) {
      const imgSection = document.createElement("div");
      imgSection.className = "lb-modal-images";

      const bridge = document.createElement("p");
      bridge.className   = "lb-modal-bridge";
      bridge.textContent = "A photographic trace of presence. Form dissolves into matter.";

      const imgIntima = document.createElement("img");
      imgIntima.src       = project.images.intima;
      imgIntima.alt       = "";
      imgIntima.className = "lb-modal-img lb-modal-img--intima";
      imgIntima.loading   = "lazy";
      imgIntima.decoding  = "async";

      const imgDetail = document.createElement("img");
      imgDetail.src       = project.images.detail;
      imgDetail.alt       = "";
      imgDetail.className = "lb-modal-img lb-modal-img--detail";
      imgDetail.loading   = "lazy";
      imgDetail.decoding  = "async";

      imgSection.appendChild(bridge);
      imgSection.appendChild(imgIntima);
      imgSection.appendChild(imgDetail);

      const contentEl = modalInner.querySelector(".lb-modal-content");
      if (contentEl) {
        contentEl.after ? contentEl.after(imgSection) : contentEl.parentNode.insertBefore(imgSection, contentEl.nextSibling);
      }
    }

    modalOverlay.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";

    /* Double rAF: browser paints reset state before transition fires */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalOverlay.classList.add("is-open");
        modalInner.scrollTop = 0;
        modalClose.focus();
      });
    });
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    previousFocus = null;
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("is-open")) closeModal();
  });

  /* Focus trap */
  if (modalInner) {
    modalInner.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        modalInner.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

})();
