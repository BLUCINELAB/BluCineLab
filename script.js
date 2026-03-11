const cursor = document.querySelector(".cursor");
const homeTitle = document.getElementById("homeTitle");
const homeTitleDock = document.getElementById("homeTitleDock");
const homeHero = document.getElementById("homeHero");
const heroChips = document.getElementById("heroChips");
const heroStatement = document.getElementById("heroStatement");
const pageProgressFill = document.querySelector(".page-progress-fill");

let cursorHideTimer = null;

/* CURSOR */

function showCursor(x, y) {
  if (!cursor) return;
  cursor.style.opacity = "1";
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
}

function fadeCursorLater(delay = 700) {
  if (!cursor) return;
  if (cursorHideTimer) clearTimeout(cursorHideTimer);
  cursorHideTimer = setTimeout(() => {
    cursor.style.opacity = "0";
  }, delay);
}

function createSparkBurst(x, y, amount = 10) {
  for (let i = 0; i < amount; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--dx", `${(Math.random() - 0.5) * 34}px`);
    spark.style.setProperty("--dy", `${-4 - Math.random() * 24}px`);
    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 900);
  }
}

document.addEventListener("mousemove", (e) => {
  showCursor(e.clientX, e.clientY);
  createSparkBurst(e.clientX, e.clientY, 8);
  handleTitleWaveAtPoint(e.clientX, e.clientY);
  fadeCursorLater(1200);
});

document.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  showCursor(touch.clientX, touch.clientY);
  createSparkBurst(touch.clientX, touch.clientY, 14);
  handleTitleWaveAtPoint(touch.clientX, touch.clientY);
  fadeCursorLater(900);
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  showCursor(touch.clientX, touch.clientY);
  createSparkBurst(touch.clientX, touch.clientY, 6);
  handleTitleWaveAtPoint(touch.clientX, touch.clientY);
  fadeCursorLater(900);
}, { passive: true });

document.addEventListener("touchend", () => {
  waveTargetIndex = null;
  startWaveLoop();
  fadeCursorLater(500);
}, { passive: true });

/* AUDIO */

let audioCtx = null;
let audioUnlocked = false;
let lastLetterSoundTime = 0;
let lastClickSoundTime = 0;

function ensureAudioContext() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: "interactive"
      });
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

function playSilentUnlockBuffer(ctx) {
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
  } catch (e) {}
}

async function unlockAudio() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state !== "running") {
      await ctx.resume();
    }
    playSilentUnlockBuffer(ctx);
    audioUnlocked = true;
  } catch (e) {}
}

["pointerdown", "touchstart", "touchend", "click"].forEach((eventName) => {
  document.addEventListener(eventName, unlockAudio, { passive: true });
});

function playLetterSound(intensity = 1) {
  const now = performance.now();
  if (now - lastLetterSoundTime < 95) return;
  lastLetterSoundTime = now;

  const ctx = ensureAudioContext();
  if (!ctx || !audioUnlocked) return;

  try {
    const t = ctx.currentTime;

    const master = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();
    const air = ctx.createBiquadFilter();

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const oscC = ctx.createOscillator();

    oscA.type = "triangle";
    oscB.type = "sine";
    oscC.type = "sine";

    const baseA = 430 + (intensity * 14);
    const baseB = 295 + (intensity * 10);
    const baseC = 690 + (intensity * 12);

    oscA.frequency.setValueAtTime(baseA, t);
    oscA.frequency.exponentialRampToValueAtTime(baseA * 0.88, t + 0.15);

    oscB.frequency.setValueAtTime(baseB, t);
    oscB.frequency.exponentialRampToValueAtTime(baseB * 0.92, t + 0.16);

    oscC.frequency.setValueAtTime(baseC, t);
    oscC.frequency.exponentialRampToValueAtTime(baseC * 0.84, t + 0.09);

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(950, t);
    lowpass.Q.setValueAtTime(0.75, t);

    air.type = "peaking";
    air.frequency.setValueAtTime(1200, t);
    air.Q.setValueAtTime(0.6, t);
    air.gain.setValueAtTime(1.2, t);

    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.02, t + 0.02);
    master.gain.exponentialRampToValueAtTime(0.012, t + 0.08);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.23);

    oscA.connect(lowpass);
    oscB.connect(lowpass);
    oscC.connect(air);
    air.connect(lowpass);
    lowpass.connect(master);
    master.connect(ctx.destination);

    oscA.start(t);
    oscB.start(t);
    oscC.start(t);

    oscA.stop(t + 0.24);
    oscB.stop(t + 0.24);
    oscC.stop(t + 0.14);
  } catch (e) {}
}

function playAppleClickSound(strength = 1) {
  const now = performance.now();
  if (now - lastClickSoundTime < 110) return;
  lastClickSoundTime = now;

  const ctx = ensureAudioContext();
  if (!ctx || !audioUnlocked) return;

  try {
    const t = ctx.currentTime;

    const master = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();
    const highpass = ctx.createBiquadFilter();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();

    osc1.type = "sine";
    osc2.type = "triangle";
    osc3.type = "sine";

    osc1.frequency.setValueAtTime(310 * strength, t);
    osc1.frequency.exponentialRampToValueAtTime(230, t + 0.08);

    osc2.frequency.setValueAtTime(620 * strength, t);
    osc2.frequency.exponentialRampToValueAtTime(320, t + 0.05);

    osc3.frequency.setValueAtTime(980, t);
    osc3.frequency.exponentialRampToValueAtTime(540, t + 0.035);

    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(180, t);

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1350, t);
    lowpass.Q.setValueAtTime(0.7, t);

    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.03, t + 0.007);
    master.gain.exponentialRampToValueAtTime(0.012, t + 0.035);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

    osc1.connect(highpass);
    osc2.connect(highpass);
    osc3.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(master);
    master.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);

    osc1.stop(t + 0.15);
    osc2.stop(t + 0.12);
    osc3.stop(t + 0.08);
  } catch (e) {}
}

/* TITLE GLOW */

let titleLetters = [];
let waveTargetIndex = null;
let waveCurrentIndex = null;
let waveRAF = null;

if (homeTitle) {
  titleLetters = Array.from(homeTitle.querySelectorAll("span"));
}

function applyWave(indexValue) {
  if (!titleLetters.length || indexValue === null) return;

  titleLetters.forEach((letter, index) => {
    const distance = Math.abs(index - indexValue);
    const strength = Math.max(0, 1 - distance / 2.45);
    letter.style.setProperty("--wave-strength", strength.toFixed(3));
  });
}

function clearWave() {
  if (!titleLetters.length) return;
  titleLetters.forEach((letter) => {
    letter.style.setProperty("--wave-strength", "0");
  });
}

function animateWave() {
  if (waveTargetIndex === null) {
    waveCurrentIndex = null;
    clearWave();
    waveRAF = null;
    return;
  }

  if (waveCurrentIndex === null) {
    waveCurrentIndex = waveTargetIndex;
  } else {
    waveCurrentIndex += (waveTargetIndex - waveCurrentIndex) * 0.24;
  }

  applyWave(waveCurrentIndex);

  if (Math.abs(waveTargetIndex - waveCurrentIndex) < 0.002) {
    waveCurrentIndex = waveTargetIndex;
  }

  waveRAF = requestAnimationFrame(animateWave);
}

function startWaveLoop() {
  if (!waveRAF) {
    waveRAF = requestAnimationFrame(animateWave);
  }
}

function setWaveFromClientX(clientX) {
  if (!homeTitle || !titleLetters.length) return;

  const rect = homeTitle.getBoundingClientRect();
  const x = clientX - rect.left;
  const progress = Math.max(0, Math.min(1, x / rect.width));
  const nextIndex = progress * (titleLetters.length - 1);

  const previousIndex = waveTargetIndex;
  waveTargetIndex = nextIndex;
  startWaveLoop();

  if (previousIndex === null || Math.abs(previousIndex - nextIndex) > 0.14) {
    playLetterSound(1);
  }
}

function handleTitleWaveAtPoint(clientX, clientY) {
  if (!homeTitle) return;
  const rect = homeTitle.getBoundingClientRect();

  if (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  ) {
    setWaveFromClientX(clientX);
  } else {
    waveTargetIndex = null;
    startWaveLoop();
  }
}

if (homeTitle) {
  homeTitle.addEventListener("mousemove", (e) => {
    setWaveFromClientX(e.clientX);
  });

  homeTitle.addEventListener("mouseenter", (e) => {
    setWaveFromClientX(e.clientX);
    playLetterSound(0.9);
  });

  homeTitle.addEventListener("mouseleave", () => {
    waveTargetIndex = null;
    startWaveLoop();
  });

  homeTitle.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    setWaveFromClientX(touch.clientX);
    playLetterSound(0.95);
  }, { passive: true });
}

/* CLICK SOUND */

function attachClickToInteractivePanels() {
  const selectors = [
    ".button-chip",
    ".panel-button",
    ".hero-statement",
    ".manifesto-block",
    ".featured-card",
    ".cluster-card",
    ".project-card",
    ".archive-panel",
    ".project-hero",
    ".project-meta-card",
    ".project-text-card",
    ".project-sticky-card",
    ".project-footer-card",
    ".back-link",
    ".project-gallery-card",
    ".related-project-card",
    ".contact-card",
    ".studio-card"
  ];

  const panels = document.querySelectorAll(selectors.join(","));

  panels.forEach((panel) => {
    panel.addEventListener("mousedown", () => {
      playAppleClickSound(1);
    });

    panel.addEventListener("touchstart", () => {
      playAppleClickSound(1);
    }, { passive: true });

    panel.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        playAppleClickSound(0.95);
      }
    });
  });
}

attachClickToInteractivePanels();

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

/* HOME SCROLL */

if (homeHero && homeTitle && homeTitleDock) {
  function updateHomeHeroMotion() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const limit = window.innerHeight * 0.55;
    const progress = Math.min(scrollY / limit, 1);

    const titleScale = 1 - progress * 0.14;
    const titleY = (progress * -68) - (progress * 14);
    const titleOpacity = 1 - progress * 0.34;

    homeTitle.style.transform = `translateY(${titleY}px) scale(${titleScale})`;
    homeTitle.style.opacity = titleOpacity;

    if (heroChips) {
      heroChips.style.transform = `translateY(${-18 * progress}px)`;
      heroChips.style.opacity = 1 - progress * 0.20;
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

/* PAGE PROGRESS */

function updatePageProgress() {
  if (!pageProgressFill) return;

  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  pageProgressFill.style.height = `${Math.min(100, Math.max(0, progress))}%`;
}

updatePageProgress();
window.addEventListener("scroll", updatePageProgress, { passive: true });
window.addEventListener("resize", updatePageProgress);

/* BG CANVAS */

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