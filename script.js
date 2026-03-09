var cursor = document.querySelector(".cursor");
var audioCtx = null;
var lastWaveSoundTime = 0;

/* ================= CURSOR + SPARKS ================= */

if (cursor) {
  document.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    createSparkBurst(e.clientX, e.clientY);
  });

  function createSparkBurst(x, y) {
    var amount = 12 + Math.floor(Math.random() * 14);

    for (var i = 0; i < amount; i++) {
      var spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.setProperty("--dx", ((Math.random() - 0.5) * 42) + "px");
      spark.style.setProperty("--dy", ((-6 - Math.random() * 30)) + "px");

      document.body.appendChild(spark);

      setTimeout(function (el) {
        return function () {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        };
      }(spark), 950);
    }
  }
}

/* ================= TITLE WAVE ================= */

var homeTitle = document.getElementById("homeTitle");

if (homeTitle) {
  var titleLetters = homeTitle.querySelectorAll("span");

  function resetWave() {
    titleLetters.forEach(function (letter) {
      letter.style.setProperty("--wave-strength", "0");
    });
  }

  function playSoftWaveSound() {
    var now = Date.now();
    if (now - lastWaveSoundTime < 140) return;
    lastWaveSoundTime = now;

    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var filter = audioCtx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(920, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.08);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.012, audioCtx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {
      /* ignore audio errors */
    }
  }

  homeTitle.addEventListener("mousemove", function (e) {
    var rect = homeTitle.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var progress = x / rect.width;
    var activeIndex = progress * (titleLetters.length - 1);

    titleLetters.forEach(function (letter, index) {
      var distance = Math.abs(index - activeIndex);
      var strength = Math.max(0, 1 - distance / 2.2);
      letter.style.setProperty("--wave-strength", strength.toFixed(3));
    });

    playSoftWaveSound();
  });

  homeTitle.addEventListener("mouseleave", function () {
    resetWave();
  });

  resetWave();
}

/* ================= REVEAL SECTIONS ================= */

var revealSections = document.querySelectorAll(".reveal-section, .section, .archive-section");

if (typeof IntersectionObserver !== "undefined") {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.16
  });

  revealSections.forEach(function (section) {
    revealObserver.observe(section);
  });
} else {
  revealSections.forEach(function (section) {
    section.classList.add("is-visible");
    section.classList.add("visible");
  });
}

/* ================= MAGNETIC / POP CARDS ================= */

var magneticCards = document.querySelectorAll(".magnetic-card");

magneticCards.forEach(function (card) {
  function onMove(e) {
    var rect = card.getBoundingClientRect();
    var px = ((e.clientX - rect.left) / rect.width) * 100;
    var py = ((e.clientY - rect.top) / rect.height) * 100;

    var ry = ((px / 100) - 0.5) * 7;
    var rx = (0.5 - (py / 100)) * 7;

    card.style.setProperty("--mx", px + "%");
    card.style.setProperty("--my", py + "%");
    card.classList.add("is-hovered");
    card.style.transform =
      "translateY(-8px) scale(1.018) rotateX(" +
      rx.toFixed(2) +
      "deg) rotateY(" +
      ry.toFixed(2) +
      "deg)";
  }

  function onLeave() {
    card.classList.remove("is-hovered");
    card.style.transform = "";
  }

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
});

/* ================= HOME TITLE DOCK + HERO MOTION ================= */

var homeTitleDock = document.getElementById("homeTitleDock");
var homeHero = document.getElementById("homeHero");
var heroChips = document.getElementById("heroChips");
var heroStatement = document.getElementById("heroStatement");

if (homeHero && homeTitle) {
  function updateHomeHeroMotion() {
    var scrollY = window.scrollY || window.pageYOffset || 0;
    var limit = window.innerHeight * 0.55;
    var progress = Math.min(scrollY / limit, 1);

    var titleScale = 1 - progress * 0.16;
    var titleY = progress * -72;
    var titleOpacity = 1 - progress * 0.38;

    homeTitle.style.transform =
      "translateY(" + titleY + "px) scale(" + titleScale + ")";
    homeTitle.style.opacity = titleOpacity;

    if (heroChips) {
      heroChips.style.transform = "translateY(" + (progress * -28) + "px)";
      heroChips.style.opacity = 1 - progress * 0.32;
    }

    if (heroStatement) {
      heroStatement.style.transform = "translateY(" + (progress * -20) + "px)";
      heroStatement.style.opacity = 1 - progress * 0.18;
    }

    if (homeTitleDock) {
      if (progress > 0.34) {
        homeTitleDock.classList.add("is-visible");
      } else {
        homeTitleDock.classList.remove("is-visible");
      }
    }
  }

  updateHomeHeroMotion();
  window.addEventListener("scroll", updateHomeHeroMotion, { passive: true });
}

/* ================= PARALLAX SECTION ================= */

var parallaxSections = document.querySelectorAll(".parallax-section");

function updateParallax() {
  parallaxSections.forEach(function (section) {
    var rect = section.getBoundingClientRect();
    var progress = (window.innerHeight - rect.top) * 0.03;
    var translateY = Math.max(0, Math.min(18, progress));
    section.style.transform = "translateY(" + translateY + "px)";
  });
}

updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });

/* ================= BG CANVAS ================= */

var canvas = document.getElementById("bgCanvas");

if (canvas) {
  var ctx = canvas.getContext("2d");

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  var blobs = [];

  for (var i = 0; i < 12; i++) {
    blobs.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 180 + Math.random() * 340,
      dx: (Math.random() - 0.5) * 0.18,
      dy: (Math.random() - 0.5) * 0.15,
      drift: Math.random() * 1000
    });
  }

  function drawBackground(t) {
    if (typeof t === "undefined") {
      t = 0;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = "screen";

    blobs.forEach(function (b) {
      b.x += b.dx;
      b.y += b.dy;

      if (b.x < -b.r || b.x > window.innerWidth + b.r) {
        b.dx *= -1;
      }

      if (b.y < -b.r || b.y > window.innerHeight + b.r) {
        b.dy *= -1;
      }

      var wobbleX = Math.sin(t * 0.00025 + b.drift) * 12;
      var wobbleY = Math.cos(t * 0.00018 + b.drift) * 10;

      var g = ctx.createRadialGradient(
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
    });

    for (var j = 0; j < 6; j++) {
      var x =
        window.innerWidth * (0.12 + j * 0.16) +
        Math.sin(t * 0.00022 + j) * 26;
      var y =
        window.innerHeight * (0.26 + Math.sin(j + t * 0.00016) * 0.08);
      var rx = 180 + Math.sin(j + t * 0.0003) * 16;
      var ry = 26 + Math.cos(j + t * 0.00027) * 5;

      var g2 = ctx.createRadialGradient(x, y, 0, x, y, rx);
      g2.addColorStop(0, "rgba(255,248,236,0.028)");
      g2.addColorStop(0.22, "rgba(175,220,255,0.022)");
      g2.addColorStop(1, "transparent");

      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.sin(j) * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(drawBackground);
  }

  drawBackground();
}