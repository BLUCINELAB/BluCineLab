const cursor = document.querySelector(".cursor");

/* ================= CURSOR + SPARKS ================= */

if (cursor) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;

    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";

    createSpark(mx, my);
  });

  function createSpark(x, y) {
    if (Math.random() > 0.55) return;

    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.setProperty("--dx", (Math.random() - 0.5) * 24 + "px");
    spark.style.setProperty("--dy", (-10 - Math.random() * 22) + "px");

    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 850);
  }
}

/* ================= REVEAL SECTIONS ================= */

const revealSections = document.querySelectorAll(".reveal-section, .section, .archive-section");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible", "visible");
    }
  });
}, {
  threshold: 0.16
});

revealSections.forEach((section) => revealObserver.observe(section));

/* ================= MAGNETIC / POP CARDS ================= */

const magneticCards = document.querySelectorAll(".magnetic-card");

magneticCards.forEach((card) => {
  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    const ry = ((px / 100) - 0.5) * 7;
    const rx = (0.5 - (py / 100)) * 7;

    card.style.setProperty("--mx", `${px}%`);
    card.style.setProperty("--my", `${py}%`);
    card.classList.add("is-hovered");
    card.style.transform = `translateY(-8px) scale(1.018) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  }

  function onLeave() {
    card.classList.remove("is-hovered");
    card.style.transform = "";
  }

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
});

/* ================= HOME TITLE DOCK ================= */

const homeTitle = document.getElementById("homeTitle");
const dock = document.getElementById("homeTitleDock");
const homeHero = document.getElementById("homeHero");

if (homeTitle && dock && homeHero) {
  function updateHomeDock() {
    const rect = homeHero.getBoundingClientRect();
    const trigger = rect.bottom < window.innerHeight * 0.46;

    if (trigger) {
      dock.classList.add("is-visible");
    } else {
      dock.classList.remove("is-visible");
    }
  }

  updateHomeDock();
  window.addEventListener("scroll", updateHomeDock, { passive: true });
}

/* ================= PARALLAX SECTIONS ================= */

const parallaxSections = document.querySelectorAll(".parallax-section");

function updateParallax() {
  parallaxSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.03;
    section.style.transform = `translateY(${Math.max(0, Math.min(18, offset))}px)`;
  });
}

updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });

/* ================= BG CANVAS ================= */

const canvas = document.getElementById("bgCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const blobs = [];

  for (let i = 0; i < 12; i++) {
    blobs.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 180 + Math.random() * 340,
      dx: (Math.random() - 0.5) * 0.18,
      dy: (Math.random() - 0.5) * 0.15,
      drift: Math.random() * 1000
    });
  }

  function drawBackground(t = 0) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = "screen";

    for (const b of blobs) {
      b.x += b.dx;
      b.y += b.dy;

      if (b.x < -b.r || b.x > window.innerWidth + b.r) b.dx *= -1;
      if (b.y < -b.r || b.y > window.innerHeight + b.r) b.dy *= -1;

      const wobbleX = Math.sin(t * 0.00025 + b.drift) * 12;
      const wobbleY = Math.cos(t * 0.00018 + b.drift) * 10;

      const g = ctx.createRadialGradient(
        b.x + wobbleX,
        b.y + wobbleY,
        0,
        b.x + wobbleX,
        b.y + wobbleY,
        b.r
      );

      g.addColorStop(0, "rgba(205,225,255,0.08)");
      g.addColorStop(0.28, "rgba(150,190,255,0.05)");
      g.addColorStop(0.5, "rgba(120,165,255,0.028)");
      g.addColorStop(1, "transparent");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x + wobbleX, b.y + wobbleY, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 6; i++) {
      const x = window.innerWidth * (0.12 + i * 0.16) + Math.sin(t * 0.00022 + i) * 26;
      const y = window.innerHeight * (0.26 + Math.sin(i + t * 0.00016) * 0.08);
      const rx = 180 + Math.sin(i + t * 0.0003) * 16;
      const ry = 26 + Math.cos(i + t * 0.00027) * 5;

      const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0, "rgba(255,248,236,0.028)");
      g.addColorStop(0.22, "rgba(175,220,255,0.022)");
      g.addColorStop(1, "transparent");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.sin(i) * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(drawBackground);
  }

  drawBackground();
}