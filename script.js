document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const bootScreen = $("#boot-screen");
  const startButton = $("#start-button");
  const startMenu = $("#start-menu");
  const taskbarWindows = $("#taskbar-windows");
  const clock = $("#taskbar-clock");
  const shutdownButton = $("#shutdown-button");
  const shellWindow = $("#win-shell");

  let topZ = 100;
  const maximizedState = new Map();

  /* =========================
     BOOT
  ========================= */

  function runBoot() {
    if (!bootScreen) return;
    setTimeout(() => {
      bootScreen.style.display = "none";
    }, 4200);
  }

  runBoot();

  /* =========================
     CLOCK
  ========================= */

  function updateClock() {
    if (!clock) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clock.textContent = `${hh}:${mm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* =========================
     HELPERS
  ========================= */

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

  function showWindow(win) {
    if (!win) return;
    win.style.display = "flex";
    win.dataset.minimized = "0";
    bringToFront(win);
  }

  function hideWindow(win) {
    if (!win) return;
    win.style.display = "none";
    updateTaskbar();
  }

  function restoreWindow(win) {
    if (!win) return;
    win.style.display = "flex";
    win.dataset.minimized = "0";
    bringToFront(win);
  }

  function minimizeWindow(win) {
    if (!win) return;
    win.dataset.minimized = "1";
    win.style.display = "none";
    updateTaskbar();
  }

  function closeWindowById(id) {
    const win = document.getElementById(id);
    if (!win) return;
    if (id === "win-shell") return;
    hideWindow(win);
  }

  function openWindowById(id) {
    const win = document.getElementById(id);
    if (!win) return;
    showWindow(win);
    closeStartMenu();
  }

  function closeStartMenu() {
    if (startMenu) startMenu.classList.remove("open");
  }

  function toggleStartMenu() {
    if (!startMenu) return;
    startMenu.classList.toggle("open");
  }

  function restoreShellFocus() {
    if (!shellWindow) return;
    showWindow(shellWindow);
  }

  function safeText(el, value) {
    if (el) el.textContent = String(value);
  }

  /* =========================
     TASKBAR
  ========================= */

  function updateTaskbar() {
    if (!taskbarWindows) return;
    taskbarWindows.innerHTML = "";

    const windows = $$(".xp-window").filter((win) =>
      win.id !== "win-shell"
        ? isVisible(win) || win.dataset.minimized === "1"
        : true
    );

    windows.forEach((win) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "taskbar-item";
      item.textContent = getWindowTitle(win);

      if (isVisible(win)) {
        item.classList.add("active");
      }

      item.addEventListener("click", () => {
        if (win.dataset.minimized === "1" || !isVisible(win)) {
          restoreWindow(win);
        } else {
          bringToFront(win);
        }
      });

      taskbarWindows.appendChild(item);
    });
  }

  /* =========================
     START MENU
  ========================= */

  if (startButton) {
    startButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (!startMenu) return;
    if (
      !startMenu.contains(e.target) &&
      e.target !== startButton &&
      !startButton?.contains(e.target)
    ) {
      closeStartMenu();
    }
  });

  if (shutdownButton) {
    shutdownButton.addEventListener("click", () => {
      document.body.innerHTML = `
        <div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;color:#00ff66;font-family:'Courier New',monospace;gap:16px;">
          <div style="font-size:28px;letter-spacing:1px;">BLUCINELAB OS</div>
          <div style="font-size:18px;">It is now safe to turn off your computer.</div>
          <button onclick="location.reload()" style="padding:10px 18px;border:1px solid #00ff66;background:#001c0d;color:#00ff66;cursor:pointer;">Restart</button>
        </div>
      `;
    });
  }

  /* =========================
     OPEN / CLOSE TRIGGERS
  ========================= */

  $$("[data-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.dataset.open;
      if (!id) return;
      e.preventDefault();
      openWindowById(id);
    });
  });

  $$("[data-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.dataset.close;
      if (!id) return;
      e.preventDefault();
      closeWindowById(id);
    });
  });

  $$("[data-focus-shell]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      restoreShellFocus();
    });
  });

  /* =========================
     WINDOW CONTROLS
  ========================= */

  $$("[data-minimize]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.minimize;
      const win = document.getElementById(id);
      if (!win) return;
      e.preventDefault();
      minimizeWindow(win);
    });
  });

  $$("[data-maximize]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.maximize;
      const win = document.getElementById(id);
      if (!win) return;
      e.preventDefault();

      if (!maximizedState.has(id)) {
        maximizedState.set(id, {
          top: win.style.top || `${win.offsetTop}px`,
          left: win.style.left || `${win.offsetLeft}px`,
          width: win.style.width || `${win.offsetWidth}px`,
          height: win.style.height || `${win.offsetHeight}px`,
        });

        win.style.top = "12px";
        win.style.left = "12px";
        win.style.width = `${window.innerWidth - 24}px`;
        win.style.height = `${window.innerHeight - 24 - 40}px`;
        win.dataset.maximized = "1";
      } else {
        const prev = maximizedState.get(id);
        win.style.top = prev.top;
        win.style.left = prev.left;
        win.style.width = prev.width;
        win.style.height = prev.height;
        win.dataset.maximized = "0";
        maximizedState.delete(id);
      }

      bringToFront(win);
    });
  });

  /* =========================
     DRAG WINDOWS
  ========================= */

  $$(".xp-window").forEach((win) => {
    const handle = $("[data-drag-handle]", win);
    if (!handle) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest(".xp-control")) return;
      if (win.dataset.maximized === "1") return;

      dragging = true;
      bringToFront(win);

      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;

      const maxLeft = window.innerWidth - 160;
      const maxTop = window.innerHeight - 120;

      const nextLeft = Math.max(0, Math.min(maxLeft, e.clientX - offsetX));
      const nextTop = Math.max(0, Math.min(maxTop, e.clientY - offsetY));

      win.style.left = `${nextLeft}px`;
      win.style.top = `${nextTop}px`;
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
    });

    handle.addEventListener(
      "touchstart",
      (e) => {
        if (e.target.closest(".xp-control")) return;
        if (win.dataset.maximized === "1") return;

        const t = e.touches[0];
        const rect = win.getBoundingClientRect();

        dragging = true;
        bringToFront(win);

        offsetX = t.clientX - rect.left;
        offsetY = t.clientY - rect.top;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        const t = e.touches[0];

        const maxLeft = window.innerWidth - 160;
        const maxTop = window.innerHeight - 120;

        const nextLeft = Math.max(0, Math.min(maxLeft, t.clientX - offsetX));
        const nextTop = Math.max(0, Math.min(maxTop, t.clientY - offsetY));

        win.style.left = `${nextLeft}px`;
        win.style.top = `${nextTop}px`;
      },
      { passive: true }
    );

    document.addEventListener("touchend", () => {
      dragging = false;
    });
  });

  /* =========================
     WINDOW FOCUS
  ========================= */

  $$(".xp-window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
  });

  /* =========================
     RESIZE GUARD
  ========================= */

  window.addEventListener("resize", () => {
    $$(".xp-window").forEach((win) => {
      if (!isVisible(win)) return;

      const rect = win.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        win.style.left = `${Math.max(0, window.innerWidth - rect.width - 10)}px`;
      }
      if (rect.bottom > window.innerHeight - 40) {
        win.style.top = `${Math.max(0, window.innerHeight - rect.height - 50)}px`;
      }
    });
  });

  /* =========================
     WORLD VIEW ROUTER
     per mondi interni tipo Wii / tabs / channels
  ========================= */

  function initWorldViews() {
    const triggers = $$("[data-world-view]");
    if (!triggers.length) return;

    function showWorldView(group, target) {
      const panels = $$(`[data-world-panel="${group}"]`);
      const tabs = $$(`[data-world-view][data-world-group="${group}"]`);

      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.worldTarget === target);
      });

      tabs.forEach((tab) => {
        tab.classList.toggle("is-active", tab.dataset.worldView === target);
      });
    }

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.worldGroup;
        const target = btn.dataset.worldView;
        if (!group || !target) return;
        showWorldView(group, target);
      });
    });

    const groups = [...new Set(triggers.map((t) => t.dataset.worldGroup).filter(Boolean))];
    groups.forEach((group) => {
      const firstActive =
        $(`[data-world-view][data-world-group="${group}"].is-active`) ||
        $(`[data-world-view][data-world-group="${group}"]`);
      if (firstActive) {
        showWorldView(group, firstActive.dataset.worldView);
      }
    });
  }

  initWorldViews();

  /* =========================
     PLAYROOM VIEWS
     supporto dedicato se usi data-play-view
  ========================= */

  function initPlayroomViews() {
    const playButtons = $$("[data-play-view]");
    if (!playButtons.length) return;

    const panels = {
      hub: $("#play-hub"),
      mario: $("#play-mario"),
      cooking: $("#play-cooking"),
      pacman: $("#play-pacman"),
    };

    function showPlayView(name) {
      Object.entries(panels).forEach(([key, panel]) => {
        if (!panel) return;
        panel.classList.toggle("show", key === name);
      });

      playButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.playView === name);
      });

      if (name === "mario") resetMario();
      if (name === "cooking") resetCooking();
      if (name === "pacman") resetPacman();
    }

    playButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.playView;
        if (!target) return;
        showPlayView(target);
      });
    });

    showPlayView("hub");
  }

  /* =========================
     MARIO GAME
  ========================= */

  const marioStage = $("#mario-stage");
  const marioPlayer = $("#mario-player");
  const marioCoinsDisp = $("#mario-coins");
  const marioScoreDisp = $("#mario-score");
  const marioStatusDisp = $("#mario-status");

  const mario = {
    active: false,
    x: 40,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 4.5,
    jump: 13.5,
    gravity: 0.7,
    ground: 82,
    keys: { left: false, right: false },
    score: 0,
    coins: 0,
    raf: null,
  };

  function marioReady() {
    return !!marioStage && !!marioPlayer;
  }

  function createMarioCoins() {
    if (!marioReady()) return;
    $$(".mario-coin", marioStage).forEach((coin) => {
      coin.dataset.active = "1";
      coin.style.display = "block";
    });
  }

  function renderMario() {
    if (!marioReady()) return;
    marioPlayer.style.left = mario.x + "px";
    marioPlayer.style.bottom = mario.ground + mario.y + "px";
  }

  function resetMario() {
    if (!marioReady()) return;
    mario.x = 40;
    mario.y = 0;
    mario.vx = 0;
    mario.vy = 0;
    mario.score = 0;
    mario.coins = 0;
    mario.keys.left = false;
    mario.keys.right = false;
    safeText(marioCoinsDisp, 0);
    safeText(marioScoreDisp, 0);
    safeText(marioStatusDisp, "READY");
    createMarioCoins();
    renderMario();
  }

  function collectMarioCoins() {
    if (!marioReady()) return;
    $$(".mario-coin", marioStage).forEach((coin) => {
      if (coin.dataset.active !== "1") return;

      const coinLeft = parseFloat(coin.style.left);
      const coinBottom = parseFloat(coin.style.bottom);

      const px = mario.x + 15;
      const py = mario.ground + mario.y + 22;

      const dx = px - (coinLeft + 11);
      const dy = py - (coinBottom + 11);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) {
        coin.dataset.active = "0";
        coin.style.display = "none";
        mario.coins += 1;
        mario.score += 100;

        safeText(marioCoinsDisp, mario.coins);
        safeText(marioScoreDisp, mario.score);
        safeText(marioStatusDisp, mario.coins >= 4 ? "WIN" : "COIN");
      }
    });
  }

  function marioLoop() {
    if (!marioReady()) return;
    const stageWidth = marioStage.clientWidth;

    mario.vx = 0;
    if (mario.keys.left) mario.vx = -mario.speed;
    if (mario.keys.right) mario.vx = mario.speed;

    mario.x += mario.vx;
    if (mario.x < 0) mario.x = 0;
    if (mario.x > stageWidth - 34) mario.x = stageWidth - 34;

    mario.vy -= mario.gravity;
    mario.y += mario.vy;

    if (mario.y <= 0) {
      mario.y = 0;
      mario.vy = 0;
    }

    collectMarioCoins();
    renderMario();
    mario.raf = requestAnimationFrame(marioLoop);
  }

  function startMarioLoop() {
    if (!marioReady()) return;
    cancelAnimationFrame(mario.raf);
    marioLoop();
  }

  document.addEventListener("keydown", (e) => {
    if (!$("#play-mario")?.classList.contains("show")) return;

    if (e.key === "ArrowLeft") mario.keys.left = true;
    if (e.key === "ArrowRight") mario.keys.right = true;

    if ((e.key === " " || e.code === "Space") && mario.y === 0) {
      mario.vy = mario.jump;
      safeText(marioStatusDisp, "JUMP");
      e.preventDefault();
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") mario.keys.left = false;
    if (e.key === "ArrowRight") mario.keys.right = false;
  });

  /* =========================
     COOKING GAME
  ========================= */

  const cookTarget = $("#cook-target");
  const cookInstruction = $("#cook-instruction");
  const cookRoundDisp = $("#cook-round");
  const cookTimeDisp = $("#cook-time");
  const cookScoreDisp = $("#cook-score");
  const cookStatusDisp = $("#cook-status");
  const cookRestart = $("#cook-restart");

  const cookItems = ["🍅", "🥕", "🍳", "🍓", "🥔", "🧅", "🫑", "🍄"];
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
    cookTarget.textContent = cook.current;
    safeText(cookRoundDisp, cook.round);
    safeText(cookTimeDisp, cook.time);
    safeText(cookScoreDisp, cook.score);
  }

  function nextCookItem() {
    cook.current = cookItems[Math.floor(Math.random() * cookItems.length)];
    if (cookInstruction) {
      cookInstruction.textContent = "Clicca l’ingrediente il più possibile.";
    }
    applyCookState();
  }

  function stopCookingTimer() {
    if (cook.timer) clearInterval(cook.timer);
    cook.timer = null;
  }

  function startCookingTimer() {
    stopCookingTimer();
    safeText(cookStatusDisp, "COOKING");

    cook.timer = setInterval(() => {
      cook.time -= 1;
      safeText(cookTimeDisp, cook.time);

      if (cook.time <= 0) {
        stopCookingTimer();
        safeText(cookStatusDisp, "ROUND END");
        cook.round += 1;
        cook.time = 10;
        nextCookItem();
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
    if (cookInstruction) {
      cookInstruction.textContent = "Clicca l’ingrediente per cucinare.";
    }
    applyCookState();
  }

  if (cookTarget) {
    cookTarget.addEventListener("click", () => {
      if (!$("#play-cooking")?.classList.contains("show")) return;
      if (!cook.timer) startCookingTimer();
      cook.score += 1;
      safeText(cookScoreDisp, cook.score);
      safeText(cookStatusDisp, "GOOD");
    });
  }

  if (cookRestart) {
    cookRestart.addEventListener("click", () => {
      resetCooking();
    });
  }

  /* =========================
     PACMAN BASE
     pronto per quando aggiungiamo HTML/CSS
  ========================= */

  const pacStage = $("#pac-stage");
  const pacPlayer = $("#pac-player");
  const pacScoreDisp = $("#pac-score");
  const pacLivesDisp = $("#pac-lives");
  const pacStatusDisp = $("#pac-status");

  const pac = {
    ready: !!pacStage && !!pacPlayer,
    score: 0,
    lives: 3,
  };

  function resetPacman() {
    if (!pac.ready) return;
    pac.score = 0;
    pac.lives = 3;
    safeText(pacScoreDisp, pac.score);
    safeText(pacLivesDisp, pac.lives);
    safeText(pacStatusDisp, "READY");
  }

  /* =========================
     INIT
  ========================= */

  if (shellWindow) {
    shellWindow.style.display = "flex";
    shellWindow.dataset.minimized = "0";
    bringToFront(shellWindow);
  }

  initPlayroomViews();

  if (marioReady()) {
    resetMario();
    startMarioLoop();
  }

  if (cookingReady()) {
    resetCooking();
  }

  updateTaskbar();
});