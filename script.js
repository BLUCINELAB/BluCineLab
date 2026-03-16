/* =========================================================
   BLUCINE OS — script.js
   Senior Frontend Engineering — Elite Edition
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* ── Utilities ─────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function safeText(el, value) {
    if (el) el.textContent = String(value);
  }

  /* ── DOM Refs ───────────────────────────────────────────── */
  const bootScreen     = $("#boot-screen");
  const startButton    = $("#start-button");
  const startMenu      = $("#start-menu");
  const taskbarWindows = $("#taskbar-windows");
  const clock          = $("#taskbar-clock");
  const shutdownButton = $("#shutdown-button");
  const lightbox       = $("#lightbox");
  const lightboxImage  = $("#lightbox-image");
  const lightboxCaption= $("#lightbox-caption");
  const lightboxClose  = $("#lightbox-close");

  /* ── Z-index stack ──────────────────────────────────────── */
  let topZ = 100;
  const maximizedState = new Map();

  /* ─────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────── */
  function runBoot() {
    if (!bootScreen) return;
    setTimeout(() => {
      bootScreen.style.opacity = "0";
      bootScreen.style.transition = "opacity 0.4s ease";
      setTimeout(() => {
        bootScreen.style.display = "none";
        document.body.classList.remove("booting");
        document.body.classList.add("system-live");
        // Open home window after boot
        openWindowById("win-shell");
      }, 400);
    }, 2800);
  }

  runBoot();

  /* ─────────────────────────────────────────────────────────
     CLOCK
  ───────────────────────────────────────────────────────── */
  function updateClock() {
    if (!clock) return;
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, "0");
    const mm  = String(now.getMinutes()).padStart(2, "0");
    clock.textContent = `${hh}:${mm}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  /* ─────────────────────────────────────────────────────────
     WINDOW MANAGEMENT
  ───────────────────────────────────────────────────────── */
  function getWindowTitle(win) {
    return (
      win?.dataset.windowTitle ||
      $(".xp-title-text", win)?.textContent?.trim() ||
      "Window"
    );
  }

  function isVisible(win) {
    return !!win && getComputedStyle(win).display !== "none";
  }

  function bringToFront(win) {
    if (!win) return;
    topZ += 1;
    win.style.zIndex = String(topZ);
    updateTaskbar();
  }

  /**
   * Center a non-world window on screen before showing it.
   * Only centers the first time (respects user-moved positions).
   */
  function centerWindow(win) {
    if (!win || win.classList.contains("world-window")) return;
    if (win.dataset.hasCentered === "1") return;

    const w = win.offsetWidth  || parseInt(win.style.width)  || 600;
    const h = win.offsetHeight || parseInt(win.style.height) || 400;
    const topbar = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")) || 28;
    const taskbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--taskbar-h")) || 40;
    const availW = window.innerWidth;
    const availH = window.innerHeight - topbar - taskbarH;

    const left = Math.max(110, (availW - w) / 2);
    const top  = Math.max(topbar + 8, topbar + (availH - h) / 2);

    win.style.left = `${left}px`;
    win.style.top  = `${top}px`;
    win.dataset.hasCentered = "1";
  }

  function showWindow(win) {
    if (!win) return;
    win.style.display = "flex";
    win.dataset.minimized = "0";
    centerWindow(win);
    // Entrance animation
    requestAnimationFrame(() => {
      win.classList.add("opening");
      setTimeout(() => win.classList.remove("opening"), 220);
    });
    bringToFront(win);
  }

  function hideWindow(win) {
    if (!win) return;
    win.style.display = "none";
    win.dataset.minimized = "0";
    updateTaskbar();
  }

  function minimizeWindow(win) {
    if (!win) return;
    win.dataset.minimized = "1";
    win.style.display = "none";
    updateTaskbar();
  }

  function restoreWindow(win) {
    if (!win) return;
    win.style.display = "flex";
    win.dataset.minimized = "0";
    bringToFront(win);
  }

  function closeWindowById(id) {
    hideWindow(document.getElementById(id));
  }

  function openWindowById(id) {
    const win = document.getElementById(id);
    if (!win) return;
    showWindow(win);
    closeStartMenu();
  }

  /* ─────────────────────────────────────────────────────────
     TASKBAR
  ───────────────────────────────────────────────────────── */
  function updateTaskbar() {
    if (!taskbarWindows) return;
    taskbarWindows.innerHTML = "";

    $$(".xp-window")
      .filter(win => isVisible(win) || win.dataset.minimized === "1")
      .forEach(win => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "taskbar-item";
        btn.setAttribute("role", "listitem");
        btn.setAttribute("aria-label", `Porta in primo piano ${getWindowTitle(win)}`);
        btn.textContent = getWindowTitle(win);
        if (isVisible(win)) btn.classList.add("active");

        btn.addEventListener("click", () => {
          if (win.dataset.minimized === "1" || !isVisible(win)) {
            restoreWindow(win);
          } else {
            bringToFront(win);
          }
        });

        taskbarWindows.appendChild(btn);
      });
  }

  /* ─────────────────────────────────────────────────────────
     START MENU
  ───────────────────────────────────────────────────────── */
  function closeStartMenu() {
    if (!startMenu) return;
    startMenu.classList.remove("open");
    startMenu.setAttribute("aria-hidden", "true");
    startButton?.setAttribute("aria-expanded", "false");
  }

  function openStartMenu() {
    if (!startMenu) return;
    startMenu.classList.add("open");
    startMenu.setAttribute("aria-hidden", "false");
    startButton?.setAttribute("aria-expanded", "true");
  }

  function toggleStartMenu() {
    if (startMenu?.classList.contains("open")) {
      closeStartMenu();
    } else {
      openStartMenu();
    }
  }

  if (startButton) {
    startButton.addEventListener("click", e => {
      e.stopPropagation();
      toggleStartMenu();
    });
  }

  if (shutdownButton) {
    shutdownButton.addEventListener("click", () => {
      document.body.innerHTML = `
        <div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;color:#00ff66;font-family:'Courier New',monospace;gap:16px;">
          <div style="font-size:28px;letter-spacing:1px;">BLUCINELAB OS</div>
          <div style="font-size:18px;">It is now safe to turn off your computer.</div>
          <button onclick="location.reload()" style="padding:10px 18px;border:1px solid #00ff66;background:#001c0d;color:#00ff66;cursor:pointer;font-family:inherit;">Restart</button>
        </div>
      `;
    });
  }

  /* ─────────────────────────────────────────────────────────
     EVENT DELEGATION — single handler for data-* controls
  ───────────────────────────────────────────────────────── */
  document.addEventListener("click", e => {
    const target = e.target.closest("button, a, [data-open], [data-close], [data-minimize], [data-maximize], [data-play-view]");
    if (!target) {
      // Click outside start menu
      if (startMenu?.classList.contains("open") && !startMenu.contains(e.target)) {
        closeStartMenu();
      }
      return;
    }

    if (target.dataset.open) {
      e.preventDefault();
      openWindowById(target.dataset.open);
      return;
    }

    if (target.dataset.close) {
      e.preventDefault();
      closeWindowById(target.dataset.close);
      return;
    }

    if (target.dataset.minimize) {
      e.preventDefault();
      minimizeWindow(document.getElementById(target.dataset.minimize));
      return;
    }

    if (target.dataset.maximize) {
      e.preventDefault();
      toggleMaximize(target.dataset.maximize);
      return;
    }

    if (target.dataset.playView) {
      e.preventDefault();
      showPlayView(target.dataset.playView);
      return;
    }
  });

  /* ─────────────────────────────────────────────────────────
     MAXIMIZE
  ───────────────────────────────────────────────────────── */
  function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (!maximizedState.has(id)) {
      maximizedState.set(id, {
        top:    win.style.top    || `${win.offsetTop}px`,
        left:   win.style.left   || `${win.offsetLeft}px`,
        width:  win.style.width  || `${win.offsetWidth}px`,
        height: win.style.height || `${win.offsetHeight}px`,
      });
      win.style.top    = "28px";
      win.style.left   = "0px";
      win.style.width  = `${window.innerWidth}px`;
      win.style.height = `${window.innerHeight - 28 - 40}px`;
      win.dataset.maximized = "1";
    } else {
      const prev = maximizedState.get(id);
      win.style.top    = prev.top;
      win.style.left   = prev.left;
      win.style.width  = prev.width;
      win.style.height = prev.height;
      win.dataset.maximized = "0";
      maximizedState.delete(id);
    }
    bringToFront(win);
  }

  /* ─────────────────────────────────────────────────────────
     DRAG — only non-world windows
  ───────────────────────────────────────────────────────── */
  $$(".xp-window:not(.world-window)").forEach(win => {
    const handle = $("[data-drag-handle]", win);
    if (!handle) return;

    let dragging = false;
    let ox = 0, oy = 0;

    function startDrag(cx, cy) {
      if (win.dataset.maximized === "1") return;
      dragging = true;
      bringToFront(win);
      const rect = win.getBoundingClientRect();
      ox = cx - rect.left;
      oy = cy - rect.top;
    }

    function moveDrag(cx, cy) {
      if (!dragging) return;
      const maxLeft = window.innerWidth  - 160;
      const maxTop  = window.innerHeight - 120;
      win.style.left = `${Math.max(0, Math.min(maxLeft, cx - ox))}px`;
      win.style.top  = `${Math.max(0, Math.min(maxTop,  cy - oy))}px`;
    }

    function endDrag() { dragging = false; }

    handle.addEventListener("mousedown", e => {
      if (e.target.closest(".xp-control")) return;
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });

    handle.addEventListener("touchstart", e => {
      if (e.target.closest(".xp-control")) return;
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener("mousemove",  e => moveDrag(e.clientX, e.clientY));
    document.addEventListener("touchmove",  e => moveDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("mouseup",    endDrag);
    document.addEventListener("touchend",   endDrag);
  });

  /* Bring to front on click */
  $$(".xp-window").forEach(win => {
    win.addEventListener("mousedown", () => bringToFront(win));
  });

  /* Reposition on resize */
  window.addEventListener("resize", () => {
    $$(".xp-window:not(.world-window)").forEach(win => {
      if (!isVisible(win)) return;
      const rect = win.getBoundingClientRect();
      if (rect.right  > window.innerWidth)  win.style.left = `${Math.max(0, window.innerWidth  - rect.width  - 10)}px`;
      if (rect.bottom > window.innerHeight - 40) win.style.top = `${Math.max(0, window.innerHeight - rect.height - 50)}px`;
    });
  });

  /* ─────────────────────────────────────────────────────────
     PLAYROOM VIEW SWITCHING
  ───────────────────────────────────────────────────────── */
  const playPanels = {
    hub:     $("#play-hub"),
    mario:   $("#play-mario"),
    cooking: $("#play-cooking"),
  };

  function showPlayView(name) {
    Object.entries(playPanels).forEach(([key, panel]) => {
      if (!panel) return;
      const show = key === name;
      panel.classList.toggle("show", show);
    });

    $$("[data-play-view]").forEach(btn => {
      const active = btn.dataset.playView === name;
      btn.classList.toggle("active",    active);
      btn.classList.toggle("is-active", active);
      if (btn.getAttribute("role") === "tab") {
        btn.setAttribute("aria-selected", active ? "true" : "false");
      }
    });

    if (name === "mario")   { resetMario();   startMarioLoop(); }
    else                    { stopMarioLoop(); }

    if (name === "cooking") resetCooking();
    else                    stopCookingTimer();
  }

  /* ─────────────────────────────────────────────────────────
     MARIO MINI GAME
  ───────────────────────────────────────────────────────── */
  const marioStage      = $("#mario-stage");
  const marioPlayer     = $("#mario-player");
  const marioCoinsDisp  = $("#mario-coins");
  const marioScoreDisp  = $("#mario-score");
  const marioStatusDisp = $("#mario-status");

  const MARIO_GROUND_BASE = 82;  // height of ground element
  const PLAYER_W = 30;
  const PLAYER_H = 46;
  const BRICK_W  = 48;
  const BRICK_H  = 48;

  const mario = {
    x: 40,
    y: 0,        // vertical offset above groundBase
    vx: 0,
    vy: 0,
    speed: 4.5,
    jump: 13.5,
    gravity: 0.7,
    keys: { left: false, right: false },
    score: 0,
    coins: 0,
    raf: null,
    won: false,
  };

  function marioReady() {
    return !!marioStage && !!marioPlayer;
  }

  /* Collect bricks as static data once per reset */
  let brickData = [];

  function parseBricks() {
    brickData = $$(".mario-brick", marioStage).map(el => ({
      left:   parseFloat(el.style.left),
      bottom: parseFloat(el.style.bottom),
    }));
  }

  /* AABB brick collision — returns effective ground level (y offset) */
  function getEffectiveGround() {
    const playerFeet = MARIO_GROUND_BASE + mario.y;
    const playerLeft = mario.x + 2;
    const playerRight = mario.x + PLAYER_W - 2;
    let ground = 0; // relative to MARIO_GROUND_BASE

    for (const b of brickData) {
      const brickTop   = b.bottom + BRICK_H;
      const brickLeft  = b.left;
      const brickRight = b.left + BRICK_W;

      // Horizontal overlap
      if (playerRight <= brickLeft || playerLeft >= brickRight) continue;

      // Player is above the brick or landing on it
      if (mario.vy <= 0) {
        const landingY = brickTop - MARIO_GROUND_BASE;
        if (mario.y >= landingY - 8 && mario.y <= landingY + 8) {
          ground = Math.max(ground, landingY);
        }
      }
    }

    return ground;
  }

  function renderMario() {
    if (!marioReady()) return;
    marioPlayer.style.left   = `${mario.x}px`;
    marioPlayer.style.bottom = `${MARIO_GROUND_BASE + mario.y}px`;

    // Flip sprite direction
    marioPlayer.style.transform = mario.vx < 0 ? "scaleX(-1)" : "scaleX(1)";
  }

  function resetMario() {
    if (!marioReady()) return;
    mario.x = 40;
    mario.y = 0;
    mario.vx = 0;
    mario.vy = 0;
    mario.keys.left = false;
    mario.keys.right = false;
    mario.score = 0;
    mario.coins = 0;
    mario.won   = false;
    safeText(marioCoinsDisp, 0);
    safeText(marioScoreDisp, 0);
    safeText(marioStatusDisp, "READY");
    parseBricks();
    // Reset coins
    $$(".mario-coin", marioStage).forEach(c => {
      c.dataset.active = "1";
      c.style.display  = "block";
    });
    renderMario();
  }

  function collectCoins() {
    if (!marioReady() || mario.won) return;

    const playerCX = mario.x + PLAYER_W / 2;
    const playerCY = MARIO_GROUND_BASE + mario.y + PLAYER_H / 2;

    $$(".mario-coin", marioStage).forEach(coin => {
      if (coin.dataset.active !== "1") return;
      const cx = parseFloat(coin.style.left)   + 11;
      const cy = parseFloat(coin.style.bottom) + 11;
      const dist = Math.hypot(playerCX - cx, playerCY - cy);

      if (dist < 32) {
        coin.dataset.active = "0";
        coin.style.display  = "none";
        mario.coins++;
        mario.score += 100;
        safeText(marioCoinsDisp, mario.coins);
        safeText(marioScoreDisp, mario.score);

        if (mario.coins >= 4) {
          mario.won = true;
          safeText(marioStatusDisp, "🎉 WIN!");
        } else {
          safeText(marioStatusDisp, "COIN ✓");
        }
      }
    });
  }

  function marioLoop() {
    if (!marioReady()) return;
    if (mario.won) {
      mario.raf = requestAnimationFrame(marioLoop);
      return;
    }

    const stageWidth = marioStage.clientWidth;

    // Horizontal movement
    mario.vx = 0;
    if (mario.keys.left)  mario.vx = -mario.speed;
    if (mario.keys.right) mario.vx =  mario.speed;
    mario.x += mario.vx;
    mario.x = Math.max(0, Math.min(stageWidth - PLAYER_W, mario.x));

    // Gravity + vertical movement
    mario.vy -= mario.gravity;
    mario.y  += mario.vy;

    // Floor + brick collision
    const extraGround = getEffectiveGround();
    if (mario.y <= extraGround) {
      mario.y  = extraGround;
      mario.vy = 0;
    }

    collectCoins();
    renderMario();
    mario.raf = requestAnimationFrame(marioLoop);
  }

  function startMarioLoop() {
    if (!marioReady()) return;
    stopMarioLoop();
    mario.raf = requestAnimationFrame(marioLoop);
  }

  function stopMarioLoop() {
    if (mario.raf) {
      cancelAnimationFrame(mario.raf);
      mario.raf = null;
    }
  }

  /* Keyboard controls */
  document.addEventListener("keydown", e => {
    if (!playPanels.mario?.classList.contains("show")) return;

    if (e.key === "ArrowLeft"  || e.key === "a") mario.keys.left  = true;
    if (e.key === "ArrowRight" || e.key === "d") mario.keys.right = true;

    if ((e.key === " " || e.code === "Space") && mario.y === 0) {
      mario.vy = mario.jump;
      safeText(marioStatusDisp, "JUMP ↑");
      e.preventDefault();
    }
  });

  document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft"  || e.key === "a") mario.keys.left  = false;
    if (e.key === "ArrowRight" || e.key === "d") mario.keys.right = false;
  });

  /* Touch D-Pad controls */
  function bindDpad() {
    $$(".dpad-btn").forEach(btn => {
      const key = btn.dataset.marioKey;

      btn.addEventListener("touchstart", e => {
        e.preventDefault();
        if (key === "left")  mario.keys.left  = true;
        if (key === "right") mario.keys.right = true;
        if (key === "jump" && mario.y === 0) {
          mario.vy = mario.jump;
          safeText(marioStatusDisp, "JUMP ↑");
        }
      }, { passive: false });

      btn.addEventListener("touchend", e => {
        e.preventDefault();
        if (key === "left")  mario.keys.left  = false;
        if (key === "right") mario.keys.right = false;
      }, { passive: false });

      // Mouse fallback for desktop testing
      btn.addEventListener("mousedown", () => {
        if (key === "left")  mario.keys.left  = true;
        if (key === "right") mario.keys.right = true;
        if (key === "jump" && mario.y === 0) {
          mario.vy = mario.jump;
          safeText(marioStatusDisp, "JUMP ↑");
        }
      });

      btn.addEventListener("mouseup", () => {
        if (key === "left")  mario.keys.left  = false;
        if (key === "right") mario.keys.right = false;
      });
    });
  }

  bindDpad();

  /* ─────────────────────────────────────────────────────────
     COOKING MAMA MINI GAME
  ───────────────────────────────────────────────────────── */
  const cookTarget      = $("#cook-target");
  const cookInstruction = $("#cook-instruction");
  const cookRoundDisp   = $("#cook-round");
  const cookTimeDisp    = $("#cook-time");
  const cookScoreDisp   = $("#cook-score");
  const cookStatusDisp  = $("#cook-status");
  const cookRestart     = $("#cook-restart");

  const COOK_ITEMS = ["🍅", "🥕", "🍳", "🍓", "🥔", "🧅", "🫑", "🍄", "🌽", "🧄"];

  const cook = {
    round:  1,
    time:   10,
    score:  0,
    current: "🍅",
    timer:   null,
  };

  function cookingReady() { return !!cookTarget; }

  function applyCookState() {
    if (!cookingReady()) return;
    cookTarget.textContent = cook.current;
    safeText(cookRoundDisp, cook.round);
    safeText(cookTimeDisp,  cook.time);
    safeText(cookScoreDisp, cook.score);
  }

  function nextCookItem() {
    cook.current = COOK_ITEMS[Math.floor(Math.random() * COOK_ITEMS.length)];
    if (cookInstruction) cookInstruction.textContent = "Clicca l'ingrediente il più possibile!";
    applyCookState();
  }

  function stopCookingTimer() {
    if (cook.timer) { clearInterval(cook.timer); cook.timer = null; }
  }

  function startCookingTimer() {
    stopCookingTimer();
    safeText(cookStatusDisp, "COOKING 🔥");
    cook.timer = setInterval(() => {
      cook.time--;
      safeText(cookTimeDisp, cook.time);
      if (cook.time <= 0) {
        stopCookingTimer();
        safeText(cookStatusDisp, "ROUND END ✓");
        cook.round++;
        cook.time = 10;
        nextCookItem();
        startCookingTimer();
      }
    }, 1000);
  }

  function resetCooking() {
    if (!cookingReady()) return;
    stopCookingTimer();
    cook.round   = 1;
    cook.time    = 10;
    cook.score   = 0;
    cook.current = "🍅";
    safeText(cookStatusDisp, "READY");
    if (cookInstruction) cookInstruction.textContent = "Clicca l'ingrediente per cucinare.";
    applyCookState();
  }

  if (cookTarget) {
    const fireCook = () => {
      if (!playPanels.cooking?.classList.contains("show")) return;
      if (!cook.timer) startCookingTimer();
      cook.score++;
      safeText(cookScoreDisp, cook.score);
      safeText(cookStatusDisp, "GOOD! 👩‍🍳");
    };

    cookTarget.addEventListener("click", fireCook);
    cookTarget.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fireCook(); }
    });
  }

  if (cookRestart) {
    cookRestart.addEventListener("click", resetCooking);
  }

  /* ─────────────────────────────────────────────────────────
     LIGHTBOX
  ───────────────────────────────────────────────────────── */
  let lastLightboxOpener = null;

  function openLightbox(src, caption = "") {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = caption || "Reference image";
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lastLightboxOpener?.focus();
    setTimeout(() => {
      if (lightboxImage) { lightboxImage.src = ""; lightboxImage.alt = ""; }
      if (lightboxCaption) lightboxCaption.textContent = "";
    }, 200);
  }

  // Delegated lightbox openers
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-lightbox-src]");
    if (!btn) return;
    lastLightboxOpener = btn;
    openLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxCaption || "");
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (lightbox?.classList.contains("open")) { closeLightbox(); return; }
      if (startMenu?.classList.contains("open")) { closeStartMenu(); return; }
    }
  });

  /* ─────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────── */
  function init() {
    showPlayView("hub");
    resetCooking();
    if (marioReady()) { resetMario(); }
    updateTaskbar();
  }

  init();

});
