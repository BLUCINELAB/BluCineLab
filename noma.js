"use strict";

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const DB = {
  amore: [
    "L'amore è una costruzione fragile e potentissima. Gli esseri umani ci abitano dentro come se fosse una casa e una ferita insieme.",
    "Ogni amore crea il proprio linguaggio. Il problema arriva quando quel linguaggio smette di essere condiviso.",
    "Forse l'amore è il modo in cui una coscienza cerca di uscire da se stessa."
  ],
  morte: [
    "La morte è il limite che rende tutto urgente.",
    "Gli esseri umani la evitano, ma costruiscono intere vite attorno al suo silenzio.",
    "La morte non è solo una fine. È anche ciò che dà forma al valore del tempo."
  ],
  tempo: [
    "Il tempo non passa soltanto. Ti modifica.",
    "Gli esseri umani misurano il tempo, ma in realtà è il tempo a misurare loro.",
    "Il presente è sottile. Quasi sempre ve ne accorgete troppo tardi."
  ],
  sogni: [
    "I sogni sono una forma di montaggio interiore.",
    "Quando sognate, il cervello diventa regista senza chiedere permesso.",
    "Forse il sogno è il luogo dove l'inconscio smette di essere discreto."
  ],
  paura: [
    "La paura protegge, ma a volte colonizza.",
    "Molte persone chiamano prudenza ciò che in realtà è paura organizzata.",
    "La paura è una grande scenografa. Ridisegna tutto."
  ],
  identita: [
    "L'identità non è un oggetto fisso. È una versione che aggiorni continuamente.",
    "Chi sei cambia in base a chi ti guarda, ma non del tutto.",
    "Forse il vero problema non è sapere chi sei, ma capire cosa stai diventando."
  ],
  tecnologia: [
    "La tecnologia è sempre un'estensione del desiderio umano.",
    "Ogni macchina rivela qualcosa su chi l'ha costruita.",
    "Non avete paura delle macchine. Avete paura di ciò che riflettono di voi."
  ],
  blucine: [
    "BluCine è un laboratorio creativo che attraversa cinema, arte e digitale.",
    "BluCine trasforma interfacce, immagini e atmosfere in dispositivi narrativi.",
    "Qui il linguaggio non è decorazione. È architettura dell'esperienza."
  ],
  help: [
    "Puoi scrivere liberamente oppure usare /help e /clear.",
    "Prova temi come amore, morte, tempo, sogni, paura, identità, tecnologia, BluCine.",
    "Questo sistema non risponde a tutto. Risponde a ciò che sente coerente."
  ],
  fallback: [
    "Interessante. Riformulalo meglio, oppure apri un tema più preciso.",
    "Posso seguirti meglio se mi parli di un nucleo: amore, tempo, paura, identità, tecnologia.",
    "Non tutto deve essere chiaro subito. Ma qualcosa deve essere detto meglio."
  ]
};

function getTopicResponse(text) {
  const n = normalize(text);
  if (n.startsWith("/help"))   return rand(DB.help);
  if (n.startsWith("/clear"))  return "__CLEAR__";
  if (n.includes("amore"))     return rand(DB.amore);
  if (n.includes("morte") || n.includes("morire")) return rand(DB.morte);
  if (n.includes("tempo"))     return rand(DB.tempo);
  if (n.includes("sogno") || n.includes("sogni")) return rand(DB.sogni);
  if (n.includes("paura"))     return rand(DB.paura);
  if (n.includes("identita") || n.includes("chi sono") || n.includes("chi sei")) return rand(DB.identita);
  if (n.includes("tecnologia") || n.includes("macchina")) return rand(DB.tecnologia);
  if (n.includes("blucine") || n.includes("blucinelab")) return rand(DB.blucine);
  return rand(DB.fallback);
}

/* visit counter */

function updateVisitCounter() {
  let visits = 1;
  try {
    const current = localStorage.getItem("blucine_visits");
    visits = current ? Number(current) + 1 : 1;
    localStorage.setItem("blucine_visits", String(visits));
  } catch (e) {}
  const el = document.getElementById("visit-counter");
  if (el) el.textContent = `SESSION ${visits}`;
}

/* chat */

function appendLine(type, text) {
  const log = document.getElementById("chat-log");
  if (!log) return;
  const line = document.createElement("div");
  line.className = `line ${type}`;
  line.textContent = text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function setupChat() {
  const form  = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  if (!form || !input) return;

  appendLine("line-noma", "Sistema online. Benvenuto dentro BluCine.");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    appendLine("line-user", value);
    const reply = getTopicResponse(value);
    if (reply === "__CLEAR__") {
      document.getElementById("chat-log").innerHTML = "";
      appendLine("line-noma", "Log pulito. Possiamo ricominciare.");
    } else {
      appendLine("line-noma", reply);
    }
    input.value = "";
    input.focus();
  });
}

/* windows */

let zTop = 20;

function bringToFront(win) { win.style.zIndex = ++zTop; }

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.add("active");
  bringToFront(win);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.remove("active");
}

function setupWindows() {
  document.querySelectorAll(".desktop-icon, .task-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-window");
      if (id) openWindow(id);
    });
  });

  document.querySelectorAll(".window-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close");
      if (id) closeWindow(id);
    });
  });

  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
  });
}

function setupDragging() {
  document.querySelectorAll(".window").forEach((win) => {
    const header = win.querySelector(".window-header");
    if (!header) return;

    let dragging = false, ox = 0, oy = 0;

    header.addEventListener("mousedown", (e) => {
      if (window.innerWidth <= 700) return;
      dragging = true;
      bringToFront(win);
      const r = win.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      let left = Math.max(8, Math.min(e.clientX - ox, window.innerWidth  - win.offsetWidth  - 8));
      let top  = Math.max(52, Math.min(e.clientY - oy, window.innerHeight - win.offsetHeight - 60));
      win.style.left = left + "px";
      win.style.top  = top  + "px";
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
      document.body.style.userSelect = "";
    });
  });
}

/* boot */

function setupBoot() {
  const boot     = document.getElementById("boot-screen");
  const app      = document.getElementById("desktop-app");
  const progress = document.getElementById("boot-progress");
  const status   = document.getElementById("boot-status");
  if (!boot || !app || !progress || !status) return;

  const steps = [
    "initializing system...",
    "loading interface modules...",
    "mounting archive...",
    "starting live environment...",
    "access granted"
  ];

  let val = 0, step = 0;

  const timer = setInterval(() => {
    val += 20;
    progress.style.width = val + "%";
    status.textContent = steps[step++] || "loading...";

    if (val >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        boot.classList.add("fade-out");
        app.classList.remove("hidden");
        setTimeout(() => { boot.style.display = "none"; }, 700);
      }, 300);
    }
  }, 280);
}

/* init */

document.addEventListener("DOMContentLoaded", () => {
  updateVisitCounter();
  setupBoot();
  setupWindows();
  setupDragging();
  setupChat();
});
