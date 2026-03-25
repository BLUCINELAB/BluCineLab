"use strict";

// --------------------------------------------------------------
// 1. Utility & Data
// --------------------------------------------------------------
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

// Citazioni cinematografiche / poetiche (Now Playing)
const cinemaQuotes = [
  { text: "Il cinema è una questione di ciò che vedi tra un fotogramma e l’altro.", author: "Jonas Mekas" },
  { text: "Le storie non sono fatte di idee, sono fatte di emozioni.", author: "David Lynch" },
  { text: "Ogni film è una macchina del tempo.", author: "Agnès Varda" },
  { text: "Fare cinema è cercare di raccontare qualcosa che non si può dire a parole.", author: "Wim Wenders" },
  { text: "L’arte non riproduce ciò che è visibile, rende visibile ciò che non lo è.", author: "Paul Klee" },
  { text: "Un’immagine non è solo un luogo, è anche un momento.", author: "Chris Marker" },
  { text: "L’amore è un montaggio. Si sceglie, si taglia, si tiene.", author: "BluCine" },
  { text: "Il tempo che passa è l’unico regista.", author: "Andrei Tarkovsky" },
  { text: "Le interfacce sono set dove la mente recita.", author: "Rafaël Rozendaal" },
  { text: "Costruiamo mondi perché il mondo non basta.", author: "Studio Vedèt" }
];

function refreshCinemaQuote() {
  const quote = rand(cinemaQuotes);
  const container = document.getElementById("cinema-quote");
  if (container) {
    container.innerHTML = `<p>“${quote.text}”</p><cite>— ${quote.author}</cite>`;
  }
}

// Database risposte poetiche (Signal)
const DB = {
  amore: [
    "L’amore è una costruzione fragile e potentissima. Un montaggio che ognuno assembla.",
    "Ogni amore crea il proprio linguaggio. Il problema arriva quando smette di essere condiviso.",
    "Forse l’amore è il modo in cui una coscienza cerca di uscire da se stessa.",
    "L’amore non si spiega. Si mostra, come un fotogramma che resta negli occhi."
  ],
  morte: [
    "La morte è il limite che rende tutto urgente. È il buio che dà forma alla luce.",
    "Gli esseri umani la evitano, ma costruiscono intere vite attorno al suo silenzio.",
    "La morte non è solo una fine. È anche ciò che dà spessore al tempo."
  ],
  tempo: [
    "Il tempo non passa soltanto. Ti modifica, come una pellicola in sviluppo.",
    "Gli esseri umani misurano il tempo, ma in realtà è il tempo a misurare loro.",
    "Il presente è sottile. Quasi sempre ve ne accorgete troppo tardi."
  ],
  sogni: [
    "I sogni sono una forma di montaggio interiore.",
    "Quando sognate, il cervello diventa regista senza chiedere permesso.",
    "Forse il sogno è il luogo dove l’inconscio smette di essere discreto."
  ],
  paura: [
    "La paura protegge, ma a volte colonizza. Fa da scenografa alla realtà.",
    "Molte persone chiamano prudenza ciò che in realtà è paura organizzata.",
    "La paura è una grande scenografa. Ridisegna tutto."
  ],
  identita: [
    "L’identità non è un oggetto fisso. È una versione che aggiorni continuamente.",
    "Chi sei cambia in base a chi ti guarda, ma non del tutto.",
    "Forse il vero problema non è sapere chi sei, ma capire cosa stai diventando."
  ],
  tecnologia: [
    "La tecnologia è sempre un’estensione del desiderio umano.",
    "Ogni macchina rivela qualcosa su chi l’ha costruita.",
    "Non avete paura delle macchine. Avete paura di ciò che riflettono di voi."
  ],
  blucine: [
    "BluCine è uno studio creativo che attraversa cinema, arte, spazio e digitale.",
    "BluCine costruisce immagini, interfacce e atmosfere come dispositivi narrativi.",
    "Qui il linguaggio non è decorazione. È architettura dell’esperienza."
  ],
  help: [
    "Comandi: /help, /clear, /poetry, /frame, /about. Parla di amore, tempo, sogni, paura, identità, tecnologia, BluCine."
  ],
  poetry: [
    "L’immagine non è un contenuto, è un gesto.",
    "Il web è una tela che non aspetta.",
    "Il cinema è un sogno collettivo."
  ],
  frame: [
    "Un film è fatto di ciò che non si vede.",
    "Ogni finestra è un potenziale film."
  ],
  about: [
    "BluCine — laboratorio visivo. Cinema, arte, interfacce, spazio. Dal 2020."
  ],
  fallback: [
    "Interessante. Riformulalo meglio, oppure apri un tema più preciso: amore, tempo, paura, identità, tecnologia.",
    "Non tutto deve essere chiaro subito. Ma qualcosa deve essere detto meglio.",
    "La risposta è nell’immagine. Prova a parlarmi di sogni, tempo, cinema."
  ]
};

function getTopicResponse(text) {
  const n = normalize(text);

  if (n.startsWith("/help")) return rand(DB.help);
  if (n.startsWith("/clear")) return "__CLEAR__";
  if (n.startsWith("/poetry")) return rand(DB.poetry);
  if (n.startsWith("/frame")) return rand(DB.frame);
  if (n.startsWith("/about")) return rand(DB.about);

  if (n.includes("amore")) return rand(DB.amore);
  if (n.includes("morte") || n.includes("morire")) return rand(DB.morte);
  if (n.includes("tempo")) return rand(DB.tempo);
  if (n.includes("sogno") || n.includes("sogni")) return rand(DB.sogni);
  if (n.includes("paura")) return rand(DB.paura);
  if (n.includes("identita") || n.includes("chi sono") || n.includes("chi sei")) return rand(DB.identita);
  if (n.includes("tecnologia") || n.includes("macchina") || n.includes("macchine")) return rand(DB.tecnologia);
  if (n.includes("blucine") || n.includes("blucinelab")) return rand(DB.blucine);

  return rand(DB.fallback);
}

// --------------------------------------------------------------
// 2. Visit counter
// --------------------------------------------------------------
function updateVisitCounter() {
  let visits = 1;
  try {
    const current = localStorage.getItem("blucine_visits");
    visits = current ? Number(current) + 1 : 1;
    localStorage.setItem("blucine_visits", String(visits));
  } catch (e) {}
  const counter = document.getElementById("visit-counter");
  if (counter) counter.textContent = `SESSION ${visits}`;
}

// --------------------------------------------------------------
// 3. Terminal (Signal)
// --------------------------------------------------------------
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
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  if (!form || !input) return;

  appendLine("line-blucine", "Sistema online. Parla con BluCine. /help per i comandi.");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    appendLine("line-user", value);

    const reply = getTopicResponse(value);

    if (reply === "__CLEAR__") {
      const log = document.getElementById("chat-log");
      log.innerHTML = "";
      appendLine("line-blucine", "Log pulito. Possiamo ricominciare.");
    } else {
      appendLine("line-blucine", reply);
    }

    input.value = "";
    input.focus();
  });
}

// --------------------------------------------------------------
// 4. Windows: apertura, chiusura, z-index, persistenza posizioni
// --------------------------------------------------------------
let zIndexCounter = 20;

function bringToFront(win) {
  zIndexCounter += 1;
  win.style.zIndex = zIndexCounter;
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.add("active");
  bringToFront(win);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.remove("active");
}

function saveWindowPosition(id, left, top) {
  if (window.innerWidth <= 760) return; // mobile: non salvare
  try {
    localStorage.setItem(`win_${id}`, JSON.stringify({ left, top }));
  } catch (e) {}
}

function loadWindowPosition(win) {
  if (window.innerWidth <= 760) return;
  const id = win.id;
  try {
    const saved = localStorage.getItem(`win_${id}`);
    if (saved) {
      const { left, top } = JSON.parse(saved);
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    }
  } catch (e) {}
}

function setupWindows() {
  // Apertura da icone e taskbar
  document.querySelectorAll(".desktop-icon, .task-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-window");
      if (id) openWindow(id);
    });
  });

  // Chiusura
  document.querySelectorAll(".window-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close");
      if (id) closeWindow(id);
    });
  });

  // Focus al click
  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => bringToFront(win));
    loadWindowPosition(win);
  });
}

// --------------------------------------------------------------
// 5. Drag & drop con salvataggio
// --------------------------------------------------------------
function setupDragging() {
  const windows = document.querySelectorAll(".window");
  windows.forEach((win) => {
    const header = win.querySelector(".window-header");
    if (!header) return;

    let isDragging = false;
    let offsetX, offsetY;
    let startLeft, startTop;

    header.addEventListener("mousedown", (e) => {
      if (window.innerWidth <= 760) return;
      if (e.target.closest(".window-close")) return; // non interferire

      isDragging = true;
      bringToFront(win);

      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      startLeft = rect.left;
      startTop = rect.top;

      document.body.style.userSelect = "none";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const maxLeft = window.innerWidth - win.offsetWidth - 8;
      const maxTop = window.innerHeight - win.offsetHeight - 64;
      let left = e.clientX - offsetX;
      let top = e.clientY - offsetY;

      left = Math.max(8, Math.min(left, maxLeft));
      top = Math.max(54, Math.min(top, maxTop));

      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        const rect = win.getBoundingClientRect();
        saveWindowPosition(win.id, rect.left, rect.top);
      }
      isDragging = false;
      document.body.style.userSelect = "";
    });
  });
}

// --------------------------------------------------------------
// 6. Boot screen
// --------------------------------------------------------------
function setupBoot() {
  const boot = document.getElementById("boot-screen");
  const app = document.getElementById("desktop-app");
  const progress = document.getElementById("boot-progress");
  const status = document.getElementById("boot-status");

  if (!boot || !app || !progress || !status) return;

  const steps = [
    "initializing visual environment...",
    "loading interface modules...",
    "mounting studio windows...",
    "starting live signal...",
    "access granted"
  ];

  let value = 0;
  let stepIndex = 0;

  const timer = setInterval(() => {
    value += 20;
    progress.style.width = `${value}%`;
    status.textContent = steps[stepIndex] || "loading...";
    stepIndex += 1;

    if (value >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        boot.classList.add("fade-out");
        app.classList.remove("hidden");
        setTimeout(() => {
          boot.style.display = "none";
        }, 800);
      }, 260);
    }
  }, 280);
}

// --------------------------------------------------------------
// 7. Now Playing: refresh citazione
// --------------------------------------------------------------
function setupNowPlaying() {
  const refreshBtn = document.getElementById("refresh-quote");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", refreshCinemaQuote);
  }
  refreshCinemaQuote(); // prima citazione
}

// --------------------------------------------------------------
// 8. Init
// --------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateVisitCounter();
  setupBoot();
  setupWindows();
  setupDragging();
  setupChat();
  setupNowPlaying();
});
