const cursor = document.querySelector(".cursor");
const homeTitle = document.getElementById("homeTitle");
const homeTitleDock = document.getElementById("homeTitleDock");
const homeHero = document.getElementById("homeHero");
const heroChips = document.getElementById("heroChips");
const heroStatement = document.getElementById("heroStatement");

/* CURSOR + SPARKS */

if (cursor) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    createSparkBurst(e.clientX, e.clientY);
  });

  function createSparkBurst(x, y) {
    const amount = 10;

    for (let i = 0; i < amount; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--dx", `${(Math.random() - 0.5) * 34}px`);
      spark.style.setProperty("--dy", `${-4 - Math.random() * 24}px`);
      document.body.appendChild(spark);

      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
      }, 900);
    }
  }
}

/* TITLE WAVE */

if (homeTitle) {
  const titleLetters = homeTitle.querySelectorAll("span");

  function resetWave() {
    titleLetters.forEach((letter) => {
      letter.style.setProperty("--wave-strength", "0");
    });
  }

  homeTitle.addEventListener("mousemove", (e) => {
    const rect = homeTitle.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const activeIndex = progress * (titleLetters.length - 1);

    titleLetters.forEach((letter, index) => {
      const distance = Math.abs(index - activeIndex);
      const strength = Math.max(0, 1 - distance / 2.35);
      letter.style.setProperty("--wave-strength", strength.toFixed(3));
    });
  });

  homeTitle.addEventListener("mouseleave", resetWave);
  resetWave();
}

/* REVEAL */

const revealSections = document.querySelectorAll(".reveal-section, .section");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.16 });

  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

/* HERO DOCK */

if (homeHero && homeTitle && homeTitleDock) {
  function updateHomeHeroMotion() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const limit = window.innerHeight * 0.55;
    const progress = Math.min(scrollY / limit, 1);

    const titleScale = 1 - progress * 0.16;
    const titleY = progress * -72;
    const titleOpacity = 1 - progress * 0.38;

    homeTitle.style.transform = `translateY(${titleY}px) scale(${titleScale})`;
    homeTitle.style.opacity = titleOpacity;

    if (heroChips) {
      heroChips.style.transform = `translateY(${-20 * progress}px)`;
      heroChips.style.opacity = 1 - progress * 0.24;
    }

    if (heroStatement) {
      heroStatement.style.transform = `translateY(${-14 * progress}px)`;
      heroStatement.style.opacity = 1 - progress * 0.12;
    }

    if (progress > 0.34) {
      homeTitleDock.classList.add("is-visible");
    } else {
      homeTitleDock.classList.remove("is-visible");
    }
  }

  updateHomeHeroMotion();
  window.addEventListener("scroll", updateHomeHeroMotion, { passive: true });
}

/* BACKGROUND CANVAS */

const canvas = document.getElementById("bgCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const blobs = [];

  for (let i = 0; i < 10; i++) {
    blobs.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 180 + Math.random() * 280,
      dx: (Math.random() - 0.5) * 0.16,
      dy: (Math.random() - 0.5) * 0.13,
      drift: Math.random() * 1000
    });
  }

  function drawBackground(t = 0) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = "screen";

    blobs.forEach((b) => {
      b.x += b.dx;
      b.y += b.dy;

      if (b.x < -b.r || b.x > window.innerWidth + b.r) b.dx *= -1;
      if (b.y < -b.r || b.y > window.innerHeight + b.r) b.dy *= -1;

      const wobbleX = Math.sin(t * 0.00025 + b.drift) * 10;
      const wobbleY = Math.cos(t * 0.00018 + b.drift) * 8;

      const g = ctx.createRadialGradient(
        b.x + wobbleX, b.y + wobbleY, 0,
        b.x + wobbleX, b.y + wobbleY, b.r
      );

      g.addColorStop(0, "rgba(205,225,255,0.075)");
      g.addColorStop(0.30, "rgba(150,190,255,0.045)");
      g.addColorStop(0.55, "rgba(120,165,255,0.022)");
      g.addColorStop(1, "transparent");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x + wobbleX, b.y + wobbleY, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(drawBackground);
  }

  drawBackground();
}