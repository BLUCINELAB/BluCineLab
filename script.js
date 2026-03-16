/* =========================================================
   BLUCINE OS — script.js
   Full Rewrite / Mandata 3 di 3
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ─────────────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function safeText(el, value) {
    if (el) el.textContent = String(value);
  }

  function safeAttr(el, name, value) {
    if (el) el.setAttribute(name, String(value));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  const UI = {
    isTouch: window.matchMedia("(pointer: coarse)").matches,
    isMobile: window.matchMedia("(max-width: 760px)").matches,
  };

  function getViewportHeight() {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  function getTopbarHeight() {
    return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--topbar-h"),
      10
    ) || 28;
  }

  function getTaskbarHeight() {
    return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--taskbar-h"),
      10
    ) || 44;
  }

  function setAppHeight() {
    document.documentElement.style.setProperty("--app-h", `${getViewportHeight()}px`);
  }

  function setDeviceFlags() {
    UI.isTouch = window.matchMedia("(pointer: coarse)").matches;
    UI.isMobile = window.matchMedia("(max-width: 760px)").matches;

    document.documentElement.classList.add("app-ready");
    document.body.classList.add("app-ready");
    document.body.classList.toggle("mobile-device", UI.isMobile);
  }

  /* ─────────────────────────────────────────────────────────
     DOM REFS
  ───────────────────────────────────────────────────────── */
  const bootScreen = $("#boot-screen");
  const startButton = $("#start-button");
  const startMenu = $("#start-menu");
  const taskbarWindows = $("#taskbar-windows");
  const clock = $("#taskbar-clock");
  const shutdownButton = $("#shutdown-button");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  const lightboxClose = $("#lightbox-close");
  const statusDevice = $("#status-device");
  const statusRuntime = $("#status-runtime");

  const allWindows = $$(".xp-window");

  /* ─────────────────────────────────────────────────────────
     APP STATE
  ───────────────────────────────────────────────────────── */
  let topZ = 100;
  const maximizedState = new Map();
  let lastFocusedWindow = null;
  let lastLightboxOpener = null;

  /* ─────────────────────────────────────────────────────────
     INITIAL VIEWPORT SETUP
  ───────────────────────────────────────────────────────── */
  setAppHeight();
  setDeviceFlags();

  window.addEventListener("resize", () => {
    setAppHeight();
    setDeviceFlags();
    repositionWindowsAfterResize();
    updateRuntimeStatus();
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      setAppHeight();
      repositionWindowsAfterResize();
    });

    window.visualViewport.addEventListener("scroll", () => {
      setAppHeight();
    });
  }

  /* ─────────────────────────────────────────────────────────
     TOP STATUS
  ───────────────────────────────────────────────────────── */
  function updateRuntimeStatus(text) {
    safeText(statusDevice, UI.isMobile ? "MOBILE MODE" : "DESKTOP MODE");
    if (text) safeText(statusRuntime, text);
  }

  updateRuntimeStatus("SHELL READY");

  /* ─────────────────────────────────────────────────────────
     CLOCK
  ───────────────────────────────────────────────────────── */
  function updateClock() {
    if (!clock) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clock.textContent = `${hh}:${mm}`;
  }

  updateClock();
  setInterval(updateClock, 10000);

  /* ─────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────── */
  function runBoot() {
    if (!bootScreen) {
      document.body.classList.remove("booting");
      document.body.classList.add("system-live");
      updateRuntimeStatus("SYSTEM ONLINE");
      openWindowById("win-shell");
      return;
    }

    const bootDelay = UI.isMobile ? 1800 : 2600;

    setTimeout(() => {
      bootScreen.style.opacity = "0";

      setTimeout(() => {
        bootScreen.style.display = "none";
        document.body.classList.remove("booting");
        document.body.classList.add("system-live");
        updateRuntimeStatus("SYSTEM ONLINE");
        openWindowById("win-shell");
      }, 420);
    }, bootDelay);
  }

  /* ─────────────────────────────────────────────────────────
     WINDOW HELPERS
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

  function isWorldWindow(win) {
    return !!win && win.classList.contains("world-window");
  }

  function hasOpenWorldWindow() {
    return allWindows.some((win) => isWorldWindow(win) && isVisible(win));
  }

  function getOpenWindows() {
    return allWindows.filter((win) => isVisible(win) || win.dataset.minimized === "1");
  }

  function bringToFront(win) {
    if (!win) return;
    topZ += 1;
    win.style.zIndex = String(topZ);
    lastFocusedWindow = win;
    updateTaskbar();
  }

  function centerWindow(win) {
    if (!win || isWorldWindow(win)) return;

    const topbar = getTopbarHeight();
    const taskbar = getTaskbarHeight();
    const appH = getViewportHeight();

    if (UI.isMobile) {
      win.style.left = "8px";
      win.style.top = `${topbar + 8}px`;
      win.style.width = "calc(100vw - 16px)";
      win.style.height = `${appH - topbar - taskbar - 16}px`;
      return;
    }

    if (win.dataset.hasCentered === "1") return;

    const width = win.offsetWidth || parseInt(win.style.width, 10) || 700;
    const height = win.offsetHeight || parseInt(win.style.height, 10) || 460;

    const availW = window.innerWidth;
    const availH = appH - topbar - taskbar;

    const left = Math.max(90, (availW - width) / 2);
    const top = Math.max(topbar + 10, topbar + (availH - height) / 2);

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
    win.dataset.hasCentered = "1";
  }

  function showWindow(win) {
    if (!win) return;

    win.style.display = "flex";
    win.dataset.minimized = "0";

    centerWindow(win);

    requestAnimationFrame(() => {
      win.classList.add("opening");
      setTimeout(() => win.classList.remove("opening"), 220);
    });

    bringToFront(win);
    updateTaskbar();
    updateRuntimeStatus(`${getWindowTitle(win).toUpperCase()} OPEN`);
  }

  function hideWindow(win) {
    if (!win) return;

    win.style.display = "none";
    win.dataset.minimized = "0";

    if (lastFocusedWindow === win) {
      lastFocusedWindow = null;
    }

    updateTaskbar();
    updateRuntimeStatus("WINDOW CLOSED");
  }

  function minimizeWindow(win) {
    if (!win) return;
    win.dataset.minimized = "1";
    win.style.display = "none";
    updateTaskbar();
    updateRuntimeStatus(`${getWindowTitle(win).toUpperCase()} MINIMIZED`);
  }

  function restoreWindow(win) {
    if (!win) return;
    win.style.display = "flex";
    win.dataset.minimized = "0";
    bringToFront(win);
    updateRuntimeStatus(`${getWindowTitle(win).toUpperCase()} RESTORED`);
  }

  function openWindowById(id) {
    const win = document.getElementById(id);
    if (!win) return;
    showWindow(win);
    closeStartMenu();
  }

  function closeWindowById(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (id === "win-playroom") {
      stopMarioLoop();
      stopCookingTimer();
    }

    hideWindow(win);
  }

  function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (!win || isWorldWindow(win) || UI.isMobile) return;

    const topbar = getTopbarHeight();
    const taskbar = getTaskbarHeight();
    const appH = getViewportHeight();

    if (!maximizedState.has(id)) {
      maximizedState.set(id, {
        top: win.style.top || `${win.offsetTop}px`,
        left: win.style.left || `${win.offsetLeft}px`,
        width: win.style.width || `${win.offsetWidth}px`,
        height: win.style.height || `${win.offsetHeight}px`,
      });

      win.style.top = `${topbar}px`;
      win.style.left = "0px";
      win.style.width = `${window.innerWidth}px`;
      win.style.height = `${appH - topbar - taskbar}px`;
      win.dataset.maximized = "1";
      updateRuntimeStatus(`${getWindowTitle(win).toUpperCase()} MAXIMIZED`);
    } else {
      const prev = maximizedState.get(id);
      win.style.top = prev.top;
      win.style.left = prev.left;
      win.style.width = prev.width;
      win.style.height = prev.height;
      win.dataset.maximized = "0";
      maximizedState.delete(id);
      updateRuntimeStatus(`${getWindowTitle(win).toUpperCase()} RESTORED`);
    }

    bringToFront(win);
  }

  function repositionWindowsAfterResize() {
    const topbar = getTopbarHeight();
    const taskbar = getTaskbarHeight();
    const appH = getViewportHeight();

    allWindows.forEach((win) => {
      if (!isVisible(win)) return;

      if (isWorldWindow(win)) return;

      if (UI.isMobile) {
        win.style.left = "8px";
        win.style.width = "calc(100vw - 16px)";
        win.style.top = `${topbar + 8}px`;
        win.style.height = `${appH - topbar - taskbar - 16}px`;
        return;
      }

      if (win.dataset.maximized === "1") {
        win.style.top = `${topbar}px`;
        win.style.left = "0px";
        win.style.width = `${window.innerWidth}px`;
        win.style.height = `${appH - topbar - taskbar}px`;
        return;
      }

      const rect = win.getBoundingClientRect();

      if (rect.right > window.innerWidth) {
        win.style.left = `${Math.max(0, window.innerWidth - rect.width - 10)}px`;
      }

      if (rect.bottom > appH - taskbar) {
        win.style.top = `${Math.max(topbar + 4, appH - rect.height - taskbar - 10)}px`;
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     TASKBAR
  ───────────────────────────────────────────────────────── */
  function updateTaskbar() {
    if (!taskbarWindows) return;

    taskbarWindows.innerHTML = "";

    getOpenWindows().forEach((win) => {
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
          updateRuntimeStatus(`${getWindowTitle(win).toUpperCase()} ACTIVE`);
        }
      });

      taskbarWindows.appendChild(btn);
    });
  }

  /* ─────────────────────────────────────────────────────────
     START MENU
  ───────────────────────────────────────────────────────── */
  function openStartMenu() {
    if (!startMenu) return;
    startMenu.classList.add("open");
    safeAttr(startMenu, "aria-hidden", "false");
    safeAttr(startButton, "aria-expanded", "true");
    updateRuntimeStatus("START MENU OPEN");
  }

  function closeStartMenu() {
    if (!startMenu) return;
    startMenu.classList.remove("open");
    safeAttr(startMenu, "aria-hidden", "true");
    safeAttr(startButton, "aria-expanded", "false");
  }

  function toggleStartMenu() {
    if (!startMenu) return;
    if (startMenu.classList.contains("open")) {
      closeStartMenu();
    } else {
      openStartMenu();
    }
  }

  startButton?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });

  shutdownButton?.addEventListener("click", () => {
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;color:#00ff66;font-family:'Courier New',monospace;gap:16px;padding:24px;text-align:center;">
        <div style="font-size:30px;letter-spacing:1px;">BLUCINE OS</div>
        <div style="font-size:18px;">It is now safe to turn off your computer.</div>
        <button onclick="location.reload()" style="padding:10px 18px;border:1px solid #00ff66;background:#001c0d;color:#00ff66;cursor:pointer;font-family:inherit;">Restart</button>
      </div>
    `;
  });

  /* ─────────────────────────────────────────────────────────
     GLOBAL CLICK DELEGATION
  ───────────────────────────────────────────────────────── */
  document.addEventListener("click", (e) => {
    const target = e.target.closest(
      "button, a, [data-open], [data-close], [data-minimize], [data-maximize], [data-play-view], [data-lightbox-src]"
    );

    if (!target) {
      if (startMenu?.classList.contains("open") && !startMenu.contains(e.target)) {
        closeStartMenu();
      }
      return;
    }

    if (target.dataset.lightboxSrc) {
      lastLightboxOpener = target;
      openLightbox(target.dataset.lightboxSrc, target.dataset.lightboxCaption || "");
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

    if (startMenu?.classList.contains("open") && !startMenu.contains(target) && target !== startButton) {
      closeStartMenu();
    }
  });

  /* ─────────────────────────────────────────────────────────
     BRING WINDOWS TO FRONT
  ───────────────────────────────────────────────────────── */
  allWindows.forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
    win.addEventListener("touchstart", () => bringToFront(win), { passive: true });
  });

  /* ─────────────────────────────────────────────────────────
     DRAG (desktop only)
  ───────────────────────────────────────────────────────── */
  $$(".xp-window:not(.world-window)").forEach((win) => {
    const handle = $("[data-drag-handle]", win);
    if (!handle) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function dragAllowed() {
      return !UI.isMobile && win.dataset.maximized !== "1";
    }

    function startDrag(clientX, clientY) {
      if (!dragAllowed()) return;

      dragging = true;
      bringToFront(win);

      const rect = win.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
    }

    function moveDrag(clientX, clientY) {
      if (!dragging) return;

      const maxLeft = window.innerWidth - 160;
      const maxTop = getViewportHeight() - 120;

      win.style.left = `${clamp(clientX - offsetX, 0, maxLeft)}px`;
      win.style.top = `${clamp(clientY - offsetY, getTopbarHeight(), maxTop)}px`;
    }

    function endDrag() {
      dragging = false;
    }

    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest(".xp-control")) return;
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", endDrag);

    handle.addEventListener(
      "touchstart",
      (e) => {
        if (!dragAllowed()) return;
        if (e.target.closest(".xp-control")) return;
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!dragAllowed()) return;
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );

    document.addEventListener("touchend", endDrag);
    document.addEventListener("touchcancel", endDrag);
  });

  /* ─────────────────────────────────────────────────────────
     PLAYROOM TABS
  ───────────────────────────────────────────────────────── */
  const playPanels = {
    hub: $("#play-hub"),
    mario: $("#play-mario"),
    cooking: $("#play-cooking"),
  };

  function showPlayView(name) {
    Object.entries(playPanels).forEach(([key, panel]) => {
      if (!panel) return;
      panel.classList.toggle("show", key === name);
    });

    $$("[data-play-view]").forEach((btn) => {
      const isActive = btn.dataset.playView === name;
      btn.classList.toggle("active", isActive);
      btn.classList.toggle("is-active", isActive);

      if (btn.getAttribute("role") === "tab") {
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      }
    });

    if (name === "mario") {
      resetMario();
      startMarioLoop();
      stopCookingTimer();
    } else if (name === "cooking") {
      stopMarioLoop();
      resetCooking();
    } else {
      stopMarioLoop();
      stopCookingTimer();
    }

    updateRuntimeStatus(`PLAYROOM / ${name.toUpperCase()}`);
  }

  /* ─────────────────────────────────────────────────────────
     LIGHTBOX
  ───────────────────────────────────────────────────────── */
  function openLightbox(src, caption = "") {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = src;
    lightboxImage.alt = caption || "Reference image";
    safeText(lightboxCaption, caption);

    lightbox.classList.add("open");
    safeAttr(lightbox, "aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    updateRuntimeStatus("LIGHTBOX OPEN");

    requestAnimationFrame(() => {
      lightboxClose?.focus();
    });
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    safeAttr(lightbox, "aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    setTimeout(() => {
      if (lightboxImage) {
        lightboxImage.src = "";
        lightboxImage.alt = "";
      }
      safeText(lightboxCaption, "");
    }, 180);

    lastLightboxOpener?.focus?.();
    updateRuntimeStatus("LIGHTBOX CLOSED");
  }

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  /* ─────────────────────────────────────────────────────────
     KEYBOARD / GLOBAL ESC
  ───────────────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox?.classList.contains("open")) {
        closeLightbox();
        return;
      }

      if (startMenu?.classList.contains("open")) {
        closeStartMenu();
        return;
      }

      if (lastFocusedWindow && isVisible(lastFocusedWindow) && !isWorldWindow(lastFocusedWindow)) {
        minimizeWindow(lastFocusedWindow);
      }
    }
  });

  /* ─────────────────────────────────────────────────────────
     MARIO MINI GAME
  ───────────────────────────────────────────────────────── */
  const marioStage = $("#mario-stage");
  const marioPlayer = $("#mario-player");
  const marioCoinsDisp = $("#mario-coins");
  const marioScoreDisp = $("#mario-score");
  const marioStatusDisp = $("#mario-status");

  const MARIO_GROUND_BASE = 82;
  const PLAYER_W = 30;
  const PLAYER_H = 46;
  const BRICK_W = 48;
  const BRICK_H = 48;

  const mario = {
    x: 40,
    y: 0,
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

  let brickData = [];

  function marioReady() {
    return !!marioStage && !!marioPlayer;
  }

  function parseBricks() {
    if (!marioStage) return;
    brickData = $$(".mario-brick", marioStage).map((el) => ({
      left: parseFloat(el.style.left),
      bottom: parseFloat(el.style.bottom),
    }));
  }

  function getMarioGroundLevel() {
    const playerLeft = mario.x + 2;
    const playerRight = mario.x + PLAYER_W - 2;
    let ground = 0;

    for (const brick of brickData) {
      const brickTop = brick.bottom + BRICK_H;
      const brickLeft = brick.left;
      const brickRight = brick.left + BRICK_W;

      if (playerRight <= brickLeft || playerLeft >= brickRight) continue;

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

    marioPlayer.style.left = `${mario.x}px`;
    marioPlayer.style.bottom = `${MARIO_GROUND_BASE + mario.y}px`;
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
    mario.won = false;

    safeText(marioCoinsDisp, 0);
    safeText(marioScoreDisp, 0);
    safeText(marioStatusDisp, "READY");

    parseBricks();

    $$(".mario-coin", marioStage).forEach((coin) => {
      coin.dataset.active = "1";
      coin.style.display = "block";
    });

    renderMario();
  }

  function collectMarioCoins() {
    if (!marioReady() || mario.won) return;

    const playerCX = mario.x + PLAYER_W / 2;
    const playerCY = MARIO_GROUND_BASE + mario.y + PLAYER_H / 2;

    $$(".mario-coin", marioStage).forEach((coin) => {
      if (coin.dataset.active !== "1") return;

      const coinCX = parseFloat(coin.style.left) + 11;
      const coinCY = parseFloat(coin.style.bottom) + 11;
      const dist = Math.hypot(playerCX - coinCX, playerCY - coinCY);

      if (dist < 32) {
        coin.dataset.active = "0";
        coin.style.display = "none";
        mario.coins += 1;
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

    mario.vx = 0;
    if (mario.keys.left) mario.vx = -mario.speed;
    if (mario.keys.right) mario.vx = mario.speed;

    mario.x += mario.vx;
    mario.x = clamp(mario.x, 0, stageWidth - PLAYER_W);

    mario.vy -= mario.gravity;
    mario.y += mario.vy;

    const ground = getMarioGroundLevel();
    if (mario.y <= ground) {
      mario.y = ground;
      mario.vy = 0;
    }

    collectMarioCoins();
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

  document.addEventListener("keydown", (e) => {
    if (!playPanels.mario?.classList.contains("show")) return;

    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      mario.keys.left = true;
    }

    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      mario.keys.right = true;
    }

    if ((e.key === " " || e.code === "Space") && mario.vy === 0) {
      mario.vy = mario.jump;
      safeText(marioStatusDisp, "JUMP ↑");
      e.preventDefault();
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      mario.keys.left = false;
    }

    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      mario.keys.right = false;
    }
  });

  function bindDpad() {
    $$(".dpad-btn").forEach((btn) => {
      const key = btn.dataset.marioKey;

      const press = () => {
        if (key === "left") mario.keys.left = true;
        if (key === "right") mario.keys.right = true;

        if (key === "jump" && mario.vy === 0) {
          mario.vy = mario.jump;
          safeText(marioStatusDisp, "JUMP ↑");
        }
      };

      const release = () => {
        if (key === "left") mario.keys.left = false;
        if (key === "right") mario.keys.right = false;
      };

      btn.addEventListener("mousedown", press);
      btn.addEventListener("mouseup", release);
      btn.addEventListener("mouseleave", release);

      btn.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          press();
        },
        { passive: false }
      );

      btn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          release();
        },
        { passive: false }
      );

      btn.addEventListener(
        "touchcancel",
        (e) => {
          e.preventDefault();
          release();
        },
        { passive: false }
      );
    });
  }

  bindDpad();

  /* ─────────────────────────────────────────────────────────
     COOKING MINI GAME
  ───────────────────────────────────────────────────────── */
  const cookTarget = $("#cook-target");
  const cookInstruction = $("#cook-instruction");
  const cookRoundDisp = $("#cook-round");
  const cookTimeDisp = $("#cook-time");
  const cookScoreDisp = $("#cook-score");
  const cookStatusDisp = $("#cook-status");
  const cookRestart = $("#cook-restart");

  const COOK_ITEMS = ["🍅", "🥕", "🍳", "🍓", "🥔", "🧅", "🫑", "🍄", "🌽", "🧄"];

  const cook = {
    round: 1,
    time: 10,
    score: 0,
    current: "🍅",
    timer: null,
  };

  function cookingReady() {
    return !!cookTarget;
  }

  function applyCookState() {
    if (!cookingReady()) return;
    safeText(cookTarget, cook.current);
    safeText(cookRoundDisp, cook.round);
    safeText(cookTimeDisp, cook.time);
    safeText(cookScoreDisp, cook.score);
  }

  function nextCookItem() {
    cook.current = COOK_ITEMS[Math.floor(Math.random() * COOK_ITEMS.length)];
    safeText(cookInstruction, "Clicca l'ingrediente il più possibile!");
    applyCookState();
  }

  function stopCookingTimer() {
    if (cook.timer) {
      clearInterval(cook.timer);
      cook.timer = null;
    }
  }

  function startCookingTimer() {
    stopCookingTimer();
    safeText(cookStatusDisp, "COOKING 🔥");

    cook.timer = setInterval(() => {
      cook.time -= 1;
      safeText(cookTimeDisp, cook.time);

      if (cook.time <= 0) {
        stopCookingTimer();
        safeText(cookStatusDisp, "ROUND END ✓");
        cook.round += 1;
        cook.time = 10;
        nextCookItem();
        startCookingTimer();
      }
    }, 1000);
  }

  function resetCooking() {
    if (!cookingReady()) return;

    stopCookingTimer();
    cook.round = 1;
    cook.time = 10;
    cook.score = 0;
    cook.current = "🍅";

    safeText(cookStatusDisp, "READY");
    safeText(cookInstruction, "Clicca l'ingrediente per cucinare.");
    applyCookState();
  }

  function fireCook() {
    if (!playPanels.cooking?.classList.contains("show")) return;

    if (!cook.timer) startCookingTimer();

    cook.score += 1;
    safeText(cookScoreDisp, cook.score);
    safeText(cookStatusDisp, "GOOD! 👩‍🍳");
  }

  cookTarget?.addEventListener("click", fireCook);
  cookTarget?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fireCook();
    }
  });

  cookRestart?.addEventListener("click", resetCooking);

  /* ─────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────── */
  function init() {
    showPlayView("hub");
    resetCooking();
    if (marioReady()) resetMario();
    updateTaskbar();
    updateRuntimeStatus("BOOT SEQUENCE");
    runBoot();
  }

  init();
});
