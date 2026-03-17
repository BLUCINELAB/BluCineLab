"use strict";

(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const body = document.body;
  const boot = $("#boot");
  const bootBar = $("#boot-bar");
  const bootStatus = $("#boot-status");
  const skipBoot = $("#skipBoot");
  const shell = $("#shell");
  const clock = $("#clock");
  const menuToggle = $("#menuToggle");
  const menuPanel = $("#menuPanel");
  const dockStart = $("#dockStart");
  const dockWindows = $("#dockWindows");
  const cycleScene = $("#cycleScene");
  const sceneLabel = $("#sceneLabel");
  const desktop = $("#desktop");

  const windows = $$(".window");
  const sceneButtons = $$('[data-scene]');
  const openers = $$('[data-open]');
  const closeButtons = $$('[data-close]');
  const minimizeButtons = $$('[data-minimize]');
  const wallpaperPanels = $$('[data-scene-panel]');

  const scenes = ["hybrid", "amber", "mono", "meadow"];
  const sceneNames = {
    hybrid: "Scene / Hybrid",
    amber: "Scene / Amber",
    mono: "Scene / Mono",
    meadow: "Scene / Meadow"
  };

  let highestZ = 30;
  let currentScene = "hybrid";
  let bootDone = false;

  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    if (clock) clock.textContent = `${hh}:${mm}`;
  }

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    body.classList.remove("is-booting");
    shell.setAttribute("aria-hidden", "false");
    boot.style.opacity = "0";
    boot.style.pointerEvents = "none";
    setTimeout(() => {
      if (boot) boot.remove();
    }, 420);
  }

  function runBoot() {
    const steps = [
      "Mounting archive...",
      "Indexing windows...",
      "Rendering desktop...",
      "Activating shell..."
    ];

    let step = 0;
    let progress = 0;

    const timer = setInterval(() => {
      progress += 4;
      if (bootBar) bootBar.style.width = `${Math.min(progress, 100)}%`;
      if (bootStatus && progress % 24 === 0 && step < steps.length) {
        bootStatus.textContent = steps[step];
        step += 1;
      }
      if (progress >= 100) {
        clearInterval(timer);
        finishBoot();
      }
    }, 55);

    skipBoot?.addEventListener("click", () => {
      clearInterval(timer);
      if (bootBar) bootBar.style.width = "100%";
      if (bootStatus) bootStatus.textContent = "Shell ready.";
      finishBoot();
    }, { once: true });
  }

  function updateDock() {
    dockWindows.innerHTML = "";
    windows.forEach((win) => {
      if (!win.classList.contains("is-open")) return;
      const title = win.dataset.title || win.id;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "dock__chip";
      chip.textContent = title;
      chip.dataset.target = win.id;
      if (Number(win.style.zIndex || 0) === highestZ) {
        chip.classList.add("is-active");
      }
      chip.addEventListener("click", () => openWindow(win.id));
      dockWindows.appendChild(chip);
    });
  }

  function focusWindow(win) {
    highestZ += 1;
    win.style.zIndex = String(highestZ);
    updateDock();
  }

  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add("is-open");
    focusWindow(win);
  }

  function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.remove("is-open");
    updateDock();
  }

  function toggleMenu(force) {
    const isHidden = menuPanel.hasAttribute("hidden");
    const shouldOpen = typeof force === "boolean" ? force : isHidden;
    menuPanel.toggleAttribute("hidden", !shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  }

  function setScene(scene) {
    if (!scenes.includes(scene)) return;
    currentScene = scene;
    body.dataset.scene = scene;
    wallpaperPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.scenePanel === scene);
    });
    if (sceneLabel) sceneLabel.textContent = sceneNames[scene] || "Scene";
  }

  function cycleScenes() {
    const currentIndex = scenes.indexOf(currentScene);
    const next = scenes[(currentIndex + 1) % scenes.length];
    setScene(next);
  }

  function setupWindows() {
    windows.forEach((win, index) => {
      win.style.zIndex = String(10 + index);
      const bar = $(".window__bar", win);
      win.addEventListener("mousedown", () => focusWindow(win));

      if (window.matchMedia("(max-width: 980px)").matches) return;

      let dragging = false;
      let startX = 0;
      let startY = 0;
      let offsetX = 0;
      let offsetY = 0;

      const onMove = (event) => {
        if (!dragging) return;
        const nextX = offsetX + (event.clientX - startX);
        const nextY = offsetY + (event.clientY - startY);
        const clampedX = Math.max(12, Math.min(nextX, window.innerWidth - win.offsetWidth - 12));
        const clampedY = Math.max(58, Math.min(nextY, window.innerHeight - win.offsetHeight - 68));
        win.style.left = `${clampedX}px`;
        win.style.top = `${clampedY}px`;
      };

      const onUp = () => {
        dragging = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      bar?.addEventListener("mousedown", (event) => {
        if (event.target.closest("button")) return;
        focusWindow(win);
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        offsetX = win.offsetLeft;
        offsetY = win.offsetTop;
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    });
  }

  openers.forEach((button) => {
    button.addEventListener("click", () => {
      openWindow(button.dataset.open);
      toggleMenu(false);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const win = button.closest(".window");
      if (win) closeWindow(win.id);
    });
  });

  minimizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const win = button.closest(".window");
      if (win) closeWindow(win.id);
    });
  });

  sceneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setScene(button.dataset.scene);
      toggleMenu(false);
    });
  });

  menuToggle?.addEventListener("click", () => toggleMenu());
  dockStart?.addEventListener("click", () => toggleMenu());
  cycleScene?.addEventListener("click", cycleScenes);

  document.addEventListener("click", (event) => {
    if (!menuPanel.contains(event.target) && !menuToggle.contains(event.target) && !dockStart.contains(event.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleMenu(false);
    }
  });

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 980px)").matches) return;
    windows.forEach((win) => {
      win.style.left = "";
      win.style.top = "";
    });
  });

  updateClock();
  setInterval(updateClock, 15000);
  setScene("hybrid");
  setupWindows();
  updateDock();
  runBoot();
})();
