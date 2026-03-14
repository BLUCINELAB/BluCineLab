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

  setTimeout(() => {
    if (bootScreen) bootScreen.style.display = "none";
  }, 2900);

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
    return win?.dataset.windowTitle || $(".xp-title-text", win)?.textContent?.trim() || "Window";
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

  /* =========================
     TASKBAR
  ========================= */

  function updateTaskbar() {
    if (!taskbarWindows) return;
    taskbarWindows.innerHTML = "";

    const windows = $$(".xp-window").filter((win) => win.id !== "win-shell" ? isVisible(win) || win.dataset.minimized === "1" : true);

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
    if (!startMenu.contains(e.target) && e.target !== startButton && !startButton?.contains(e.target)) {
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
     OPEN TRIGGERS
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
      if (id === "win-shell") {
        minimizeWindow(win);
      } else {
        minimizeWindow(win);
      }
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

    /* touch basic */
    handle.addEventListener("touchstart", (e) => {
      if (e.target.closest(".xp-control")) return;
      if (win.dataset.maximized === "1") return;

      const t = e.touches[0];
      const rect = win.getBoundingClientRect();

      dragging = true;
      bringToFront(win);

      offsetX = t.clientX - rect.left;
      offsetY = t.clientY - rect.top;
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      const t = e.touches[0];

      const maxLeft = window.innerWidth - 160;
      const maxTop = window.innerHeight - 120;

      const nextLeft = Math.max(0, Math.min(maxLeft, t.clientX - offsetX));
      const nextTop = Math.max(0, Math.min(maxTop, t.clientY - offsetY));

      win.style.left = `${nextLeft}px`;
      win.style.top = `${nextTop}px`;
    }, { passive: true });

    document.addEventListener("touchend", () => {
      dragging = false;
    });
  });

  /* =========================
     FOCUS
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
     INITIAL STATE
  ========================= */

  if (shellWindow) {
    shellWindow.style.display = "flex";
    shellWindow.dataset.minimized = "0";
    bringToFront(shellWindow);
  }

  updateTaskbar();
});