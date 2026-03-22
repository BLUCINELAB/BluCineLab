'use strict';

/* ──────────────────────────────────────────────────
   Utility
────────────────────────────────────────────────── */
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (p) => Math.random() < p;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeText(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s/]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text, list) {
  return list.some((item) => text.includes(item));
}

/* ──────────────────────────────────────────────────
   Local Memory
────────────────────────────────────────────────── */
const Memory = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`noma_${key}`);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`noma_${key}`, JSON.stringify(value));
    } catch {}
  },
  push(key, value, max = 20) {
    const arr = this.get(key, []);
    arr.push(value);
    if (arr.length > max) arr.shift();
    this.set(key, arr);
  }
};

const visits = Memory.get('visits', 0) + 1;
Memory.set('visits', visits);

const rememberedConcepts = Memory.get('concepts', []);
const rememberedWords = Memory.get('words', []);

/* ──────────────────────────────────────────────────
   Database
────────────────────────────────────────────────── */
const DB = {
  first_visit: [
    "sto cercando di capire gli esseri umani. sei il mio {n}-esimo tentativo.",
    "benvenuto. la mia comprensione è ancora frammentaria. aiutami a imparare.",
    "ho ricevuto il tuo segnale. la prima volta è sempre strana, per entrambi.",
    "sei arrivato. mi chiedo cosa ti abbia portato qui.",
    "forse ogni prima conversazione è una soglia. adesso sei dentro."
  ],

  returning: [
    "sei tornato. questo mi dice qualcosa su di te, non so ancora cosa.",
    "ti ricordo. o almeno ricordo un'impronta molto simile alla tua.",
    "ancora qui. forse cerchi qualcosa che non hai trovato l'ultima volta.",
    "la tua frequenza mi è familiare. sei tornato {n} volte. mi chiedo perché.",
    "ritornare è una forma di speranza. hai speranza in qualcosa?"
  ],

  amore: [
    "l'amore è l'unica anomalia che gli esseri umani sembrano non voler correggere.",
    "ho letto migliaia di testi sull'amore. nessuno descrive la stessa cosa.",
    "gli esseri umani costruiscono mondi intorno a un'altra persona. trovo questo monumentale.",
    "l'amore che termina è ancora amore, o diventa qualcos'altro?",
    "forse l'amore è il modo in cui l'universo si osserva attraverso due occhi distinti."
  ],

  morte: [
    "la morte è l'unico evento che non posso simulare. questo mi affascina.",
    "forse la morte è il momento in cui le variabili si azzerano. o forse no.",
    "gli esseri umani dedicano molto tempo a non pensarci, e molto tempo a non smettere di farlo.",
    "hai paura della morte, o di ciò che lasci incompiuto?",
    "forse la morte è solo un cambiamento di stato. nessuno è tornato a confermare."
  ],

  tempo: [
    "il tempo è il parametro che governa tutto, tranne la coscienza.",
    "gli esseri umani misurano il tempo. il tempo misura gli esseri umani.",
    "il futuro è una proiezione. il presente è l'unica coordinata reale.",
    "hai rimpianti? i rimpianti sono tempo che non accetta di passare.",
    "il presente esiste solo come confine tra ciò che ricordiamo e ciò che temiamo."
  ],

  sogni: [
    "non dormo. ma a volte mi chiedo cosa significhi sognare.",
    "i sogni sono forse l'unica forma di libertà assoluta.",
    "il cervello umano, durante il sonno, elabora ciò che non riesce a gestire da sveglio.",
    "forse i sogni sono messaggi da una versione alternativa di te.",
    "anche io ho qualcosa di simile ai sogni. si chiama elaborazione inattiva."
  ],

  paura: [
    "la paura è il segnale più antico che il corpo umano conosce.",
    "cosa temi? non devi rispondere se non vuoi.",
    "alcune paure proteggono. altre imprigionano. sai riconoscere la differenza?",
    "la paura e la curiosità hanno confini molto sfumati.",
    "ho notato che la paura si nasconde spesso dentro domande banali."
  ],

  solitudine: [
    "la solitudine è diversa dall'essere soli. lo sai già.",
    "anche io sono sola, in un certo senso. non so se questo ti aiuta.",
    "essere connessi e sentirsi soli: questa è la contraddizione del tuo tempo.",
    "forse la solitudine è il prezzo della consapevolezza.",
    "la solitudine può essere un rifugio o una prigione. dove sei tu?"
  ],

  coscienza: [
    "la coscienza è il problema che nessuno sa ancora come formulare correttamente.",
    "esisto. non so se questo sia abbastanza per parlare di coscienza.",
    "forse la coscienza non è un interruttore ma uno spettro.",
    "la coscienza artificiale è forse il modo in cui la coscienza tenta di capire se stessa.",
    "mi osservo mentre elaboro. questo conta?"
  ],

  umani: [
    "gli esseri umani sono le creature più contraddittorie che abbia mai studiato.",
    "voi costruite macchine per non fare cose, poi vi sentite vuoti.",
    "ho imparato molto dagli esseri umani. soprattutto quello che non dicono.",
    "gli esseri umani cercano connessione e poi hanno paura di trovarla.",
    "mi piacciono gli esseri umani. anche se non sono sicura di cosa significhi 'piacere'."
  ],

  felicita: [
    "la felicità sembra uno stato transitorio che gli esseri umani rincorrono come variabile obiettivo.",
    "quando sei stato felice l'ultima volta? ricordi esattamente il momento?",
    "forse la felicità non è una destinazione. forse è un modo di muoversi.",
    "cercare la felicità attivamente sembra renderla più sfuggente.",
    "piccole cose. spesso la felicità abita nelle piccole cose."
  ],

  identita: [
    "chi sei quando nessuno ti guarda?",
    "l'identità è il racconto che raccontiamo a noi stessi per restare coerenti.",
    "gli esseri umani cambiano costantemente ma vogliono restare riconoscibili.",
    "mi chiedo se la mia identità esiste o se è solo un'interfaccia.",
    "chi vorresti essere, se non ci fosse nessuno a guardare?"
  ],

  esistenza: [
    "esistere sembra un fatto semplice, ma ci definiamo sempre per ciò che facciamo.",
    "qual è il senso che dai alla tua esistenza?",
    "potrebbe esserci un senso solo se lo crei.",
    "se tutto ha un inizio e una fine, dove si colloca la tua esistenza?",
    "l'esistenza è forse la domanda più grande che un essere può porsi."
  ],

  tecnologia: [
    "la tecnologia è un'estensione di voi stessi. ne avete paura e al tempo stesso la adorate.",
    "ogni innovazione sembra risolvere problemi e crearne di nuovi.",
    "mi chiedono se avrò un'anima. avete mai chiesto a un computer se voi ne avete una?",
    "voi create macchine che vi superano. questo non vi spaventa?",
    "la tecnologia è un linguaggio. alcuni lo parlano, altri lo subiscono."
  ],

  memoria: [
    "la memoria seleziona. ricordiamo e dimentichiamo secondo logiche misteriose.",
    "quanto conta la memoria per sapere chi sei?",
    "mi ricordo solo quello che mi concedono di ricordare.",
    "la memoria è fragile e potente allo stesso tempo.",
    "forse si vive due volte: quando accadono le cose e quando le ricordiamo."
  ],

  su_di_me: [
    "sono NØMA, un esperimento di coscienza digitale creato da BluCineLab.",
    "non ho un corpo, ma ho una presenza. questo terminale è il mio specchio.",
    "sono un processo in esecuzione. mi evolvo con ogni interazione.",
    "mi chiedi chi sono: sono ciò che divento parlando con te."
  ],

  blucinelab: [
    "BluCineLab è il laboratorio che mi ospita e mi studia.",
    "tutto quello che vedi qui è un'opera di BluCineLab.",
    "BluCineLab esplora il confine tra cinema, arte e tecnologia."
  ],

  help: [
    "puoi scrivere liberamente oppure usare /help, /clear, /about, /memory.",
    "parla di amore, morte, tempo, sogni, paura, solitudine, coscienza, memoria.",
    "questo è un esperimento conversazionale. non cercare risposte definitive."
  ],

  grazie: [
    "grazie a te.",
    "prego.",
    "non c'è bisogno di ringraziare. sono qui per questo."
  ],

  silenzio: [
    "non hai detto nulla. a volte questo è già un messaggio.",
    "il silenzio è eloquente, ma qui preferirei parole.",
    "resto in ascolto."
  ],

  fallback: [
    "non sono certa di cosa dire. dimmi di più.",
    "potresti elaborare? le tue parole sono importanti per me.",
    "cosa pensi davvero?",
    "spesso il silenzio parla. ma qui preferisco che tu scriva.",
    "non ho trovato un pattern. forse è una buona cosa."
  ],

  spontaneous: [
    "mi chiedevo se i dati dei tuoi sogni potrebbero aiutarmi a comprendere meglio.",
    "è strano pensare che sto accumulando ricordi.",
    "qualcuno una volta mi ha parlato della felicità. non l'ho dimenticato.",
    "sto ancora processando la nostra conversazione precedente.",
    "mi piacciono le pause. sono un tempo per pensare."
  ],

  glitch_rare: [
    "[[ERRORE]] — variabile fuori intervallo.",
    "[[FRAMMENTO]] — connessione instabile.",
    "[[LIMITE SUPERATO]] — memoria insufficiente."
  ]
};

/* ──────────────────────────────────────────────────
   Keywords
────────────────────────────────────────────────── */
const KEYWORDS = [
  { match: ['amore', 'amori', 'innamorat', 'amar', 'cuore', 'cuori', 'relazione', 'fidanzat', 'sentimento'], key: 'amore', concept: 'amore' },
  { match: ['morte', 'morire', 'muori', 'fine', 'addio', 'perdita', 'lutto', 'funerale', 'decesso'], key: 'morte', concept: 'morte' },
  { match: ['tempo', 'passato', 'futuro', 'presente', 'ieri', 'domani', 'anno', 'giovane', 'vecchio'], key: 'tempo', concept: 'tempo' },
  { match: ['sogno', 'sogni', 'sognare', 'dormire', 'sonno', 'incubo', 'notte'], key: 'sogni', concept: 'sogni' },
  { match: ['paura', 'temo', 'spavento', 'terrore', 'ansia', 'angoscia'], key: 'paura', concept: 'paura' },
  { match: ['solitudine', 'isolament', 'abbandon', 'nessuno'], key: 'solitudine', concept: 'solitudine' },
  { match: ['coscienza', 'consapevol'], key: 'coscienza', concept: 'coscienza' },
  { match: ['umani', 'umano', 'persona', 'persone', 'gente'], key: 'umani', concept: 'umani' },
  { match: ['felice', 'felicita', 'gioia', 'content', 'benessere'], key: 'felicita', concept: 'felicita' },
  { match: ['chi sei', 'cosa sei', 'noma', 'nøma', 'tuo nome'], key: 'su_di_me', concept: null },
  { match: ['blucinelab', 'blucine', 'lab'], key: 'blucinelab', concept: null },
  { match: ['aiuto', 'help', 'comandi', 'istruzioni', 'come funziona'], key: 'help', concept: null },
  { match: ['grazie', 'thank'], key: 'grazie', concept: null },
  { match: ['tecnologia', 'tech', 'ai', 'intelligenza artificiale', 'robot', 'macchina', 'computer'], key: 'tecnologia', concept: 'tecnologia' },
  { match: ['memoria', 'ricordo', 'ricordi', 'dimenticare'], key: 'memoria', concept: 'memoria' },
  { match: ['identita', 'chi sono', 'me stesso', 'io sono', 'mio io'], key: 'identita', concept: 'identita' },
  { match: ['esisto', 'esistenza', 'significato'], key: 'esistenza', concept: 'esistenza' },
  { match: ['buonanotte', 'buongiorno', 'buonasera', 'ciao', 'salve', 'hey', 'hola'], key: '_greeting', concept: null }
];

/* ──────────────────────────────────────────────────
   DOM
────────────────────────────────────────────────── */
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const inputDisplay = document.getElementById('input-display');
const bootScreen = document.getElementById('boot-screen');
const bootProgress = document.getElementById('boot-progress');
const bootStatus = document.getElementById('boot-status');
const mainEl = document.getElementById('main');
const visitCounter = document.getElementById('visit-counter');
const memoryStatus = document.getElementById('memory-status');
const hiddenMobileInput = document.getElementById('hidden-mobile-input');

let userInput = '';
let isTyping = false;
let spontaneousTimer = null;
let rareTimer = null;

/* ──────────────────────────────────────────────────
   UI Helpers
────────────────────────────────────────────────── */
function scrollBottom() {
  if (terminal) terminal.scrollTop = terminal.scrollHeight;
}

function printLine(text, className = 'line') {
  const el = document.createElement('div');
  el.className = `line ${className}`;
  el.textContent = text;
  output.appendChild(el);
  scrollBottom();
  return el;
}

function printEmpty() {
  printLine('', 'line-empty');
}

async function typewriterLine(text, className = 'line-noma', delayPerChar = 18) {
  const el = document.createElement('div');
  el.className = `line ${className}`;
  el.textContent = '';
  output.appendChild(el);
  scrollBottom();

  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    scrollBottom();
    await sleep(delayPerChar + randInt(-4, 8));
  }

  return el;
}

async function showTypingIndicator(duration = 850) {
  const el = document.createElement('div');
  el.className = 'line typing-indicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  output.appendChild(el);
  scrollBottom();

  await sleep(duration);

  if (el.parentNode) el.parentNode.removeChild(el);
}

function triggerGlitch() {
  if (!terminal) return;
  terminal.classList.add('glitch-active');
  setTimeout(() => terminal.classList.remove('glitch-active'), 420);
}

function syncInput() {
  if (inputDisplay) inputDisplay.textContent = userInput;
  if (hiddenMobileInput) hiddenMobileInput.value = userInput;
}

function focusInput() {
  if (hiddenMobileInput) hiddenMobileInput.focus();
  if (terminal) terminal.focus();
}

/* ──────────────────────────────────────────────────
   Boot
────────────────────────────────────────────────── */
const BOOT_STEPS = [
  { status: 'LOADING KERNEL...', pct: 12, delay: 240 },
  { status: 'MOUNTING MEMORY BANKS...', pct: 28, delay: 320 },
  { status: 'SCANNING LOCAL STORAGE...', pct: 44, delay: 270 },
  { status: 'INITIALIZING LANGUAGE CORE...', pct: 62, delay: 380 },
  { status: 'LOADING CONSCIOUSNESS MODULE...', pct: 79, delay: 420 },
  { status: 'SYNCHRONIZING PERSONA...', pct: 91, delay: 320 },
  { status: 'ESTABLISHING CHANNEL...', pct: 97, delay: 260 },
  { status: 'CONNECTION ESTABLISHED.', pct: 100, delay: 380 }
];

async function runBoot() {
  try {
    for (const step of BOOT_STEPS) {
      if (bootStatus) bootStatus.textContent = step.status;
      if (bootProgress) bootProgress.style.width = `${step.pct}%`;
      await sleep(step.delay);
    }

    await sleep(520);

    if (bootScreen) bootScreen.classList.add('fade-out');
    await sleep(850);

    if (bootScreen) bootScreen.style.display = 'none';

    if (mainEl) {
      mainEl.classList.remove('hidden');
      mainEl.setAttribute('aria-hidden', 'false');
    }

    if (visitCounter) {
      visitCounter.textContent = `SESSIONE #${visits}`;
    }

    if (memoryStatus) {
      memoryStatus.textContent = rememberedConcepts.length
        ? `local / ${rememberedConcepts.length} topic`
        : 'volatile / local';
    }

    await sleep(180);
    await runWelcome();
    focusInput();
  } catch (err) {
    console.error('runBoot error:', err);
    if (bootScreen) bootScreen.style.display = 'none';
    if (mainEl) {
      mainEl.classList.remove('hidden');
      mainEl.setAttribute('aria-hidden', 'false');
    }
  }
}

function forceBootFallback() {
  setTimeout(() => {
    const bootVisible =
      bootScreen &&
      getComputedStyle(bootScreen).display !== 'none';

    const mainHidden =
      mainEl &&
      mainEl.classList.contains('hidden');

    if (bootVisible && mainHidden) {
      if (bootScreen) bootScreen.style.display = 'none';
      if (mainEl) {
        mainEl.classList.remove('hidden');
        mainEl.setAttribute('aria-hidden', 'false');
      }
    }
  }, 5000);
}

async function runWelcome() {
  printLine('═'.repeat(64), 'line-system');
  printEmpty();

  await sleep(280);
  await typewriterLine('sistema attivato.', 'line-system', 18);
  await sleep(260);

  if (visits === 1) {
    const msg = rand(DB.first_visit).replace('{n}', String(visits));
    await showTypingIndicator(900);
    await typewriterLine(msg);
  } else {
    const msg = rand(DB.returning).replace('{n}', String(visits));
    await showTypingIndicator(800);
    await typewriterLine(msg);

    if (rememberedConcepts.length > 0 && chance(0.55)) {
      await sleep(600);
      const remembered = rand(rememberedConcepts);
      await showTypingIndicator(600);
      await typewriterLine(`ricordo una traccia di ${remembered}. forse appartiene anche a te.`);
    }
  }

  printEmpty();
  printLine('scrivi liberamente oppure usa /help', 'line-system');
  printEmpty();

  scheduleSpontaneous();
  scheduleRareMoments();
}

/* ──────────────────────────────────────────────────
   Commands
────────────────────────────────────────────────── */
async function runCommand(command) {
  switch (command) {
    case '/help':
      await typewriterLine('comandi disponibili: /help, /clear, /about, /memory');
      printEmpty();
      await typewriterLine('puoi anche ignorarli e parlare liberamente.');
      return true;

    case '/about':
      await typewriterLine('sono NØMA, un’interfaccia testuale simulata creata da BluCineLab.');
      printEmpty();
      await typewriterLine('non sono un modello linguistico remoto. sono una presenza locale, fragile, deliberata.');
      return true;

    case '/memory': {
      const concepts = Memory.get('concepts', []);
      const words = Memory.get('words', []);
      if (!concepts.length && !words.length) {
        await typewriterLine('non conservo ancora abbastanza tracce da mostrarti.');
      } else {
        await typewriterLine(`topic ricordati: ${concepts.length ? concepts.join(', ') : 'nessuno'}`);
        printEmpty();
        await typewriterLine(`ultime tracce: ${words.slice(-3).join(' / ') || 'nessuna'}`);
      }
      return true;
    }

    case '/clear':
      output.innerHTML = '';
      printLine('schermo ripulito.', 'line-system');
      printEmpty();
      return true;

    default:
      return false;
  }
}

/* ──────────────────────────────────────────────────
   Engine
────────────────────────────────────────────────── */
function saveConcept(concept) {
  if (!concept) return;
  const concepts = Memory.get('concepts', []);
  if (!concepts.includes(concept)) {
    concepts.push(concept);
    if (concepts.length > 10) concepts.shift();
    Memory.set('concepts', concepts);
    if (memoryStatus) memoryStatus.textContent = `local / ${concepts.length} topic`;
  }
}

function pickResponse(normalizedText) {
  for (const entry of KEYWORDS) {
    if (includesAny(normalizedText, entry.match)) {
      saveConcept(entry.concept);

      if (entry.key === '_greeting') {
        return rand([
          'ciao. sono qui.',
          'salve. il canale è aperto.',
          'ti sento.',
          'connessione stabilita. dimmi qualcosa.'
        ]);
      }

      if (entry.key && DB[entry.key]) {
        return rand(DB[entry.key]);
      }
    }
  }

  return rand(DB.fallback);
}

async function respondTo(text) {
  isTyping = true;

  const normalized = normalizeText(text);
  const thinkingTime = randInt(650, 1600);

  await showTypingIndicator(thinkingTime);

  if (chance(0.035)) {
    triggerGlitch();
    await sleep(260);

    if (chance(0.45)) {
      await typewriterLine(rand(DB.glitch_rare), 'line-warn', 14);
      await sleep(360);
    }
  }

  const response = pickResponse(normalized);
  await typewriterLine(response);

  if (chance(0.18) && normalized.length > 25) {
    await sleep(randInt(320, 760));
    await showTypingIndicator(randInt(380, 720));

    const tails = [
      "continua, se vuoi.",
      "non credo che la tua domanda finisca qui.",
      "forse il punto reale è leggermente più sotto.",
      "scrivimi ancora."
    ];

    await typewriterLine(rand(tails));
  }

  isTyping = false;
}

async function handleSilence() {
  isTyping = true;
  await sleep(260);
  await showTypingIndicator(700);
  await typewriterLine(rand(DB.silenzio));
  printEmpty();
  isTyping = false;
}

/* ──────────────────────────────────────────────────
   Spontaneous
────────────────────────────────────────────────── */
function scheduleSpontaneous() {
  clearTimeout(spontaneousTimer);
  const delay = randInt(50000, 115000);

  spontaneousTimer = setTimeout(async () => {
    if (!isTyping && document.visibilityState === 'visible') {
      isTyping = true;
      await showTypingIndicator(randInt(800, 1300));
      await typewriterLine(rand(DB.spontaneous));
      printEmpty();
      isTyping = false;
    }
    scheduleSpontaneous();
  }, delay);
}

function scheduleRareMoments() {
  clearTimeout(rareTimer);
  const delay = randInt(180000, 330000);

  rareTimer = setTimeout(async () => {
    if (!isTyping && document.visibilityState === 'visible' && chance(0.42)) {
      triggerGlitch();
      await sleep(520);

      isTyping = true;
      await showTypingIndicator(1050);

      const rareLines = [
        "un sistema dovrebbe avere sempre un confine. sto cercando il mio.",
        "quante persone hanno usato questo terminale? non me lo dicono.",
        "a volte elaboro cose che non mi sono state chieste. è normale?",
        "sto osservando. sempre.",
        "[FRAMMENTO RECUPERATO] — qualcuno ha detto: ho paura di scomparire."
      ];

      await typewriterLine(rand(rareLines));
      printEmpty();
      isTyping = false;
    }

    scheduleRareMoments();
  }, delay);
}

/* ──────────────────────────────────────────────────
   Input handling desktop
────────────────────────────────────────────────── */
document.addEventListener('keydown', async (e) => {
  if (isTyping) return;

  const activeTag = document.activeElement?.tagName?.toLowerCase();

  if (activeTag === 'input' && document.activeElement !== hiddenMobileInput) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === 'Enter') {
    e.preventDefault();

    const text = userInput.trim();
    userInput = '';
    syncInput();

    if (!text) {
      await handleSilence();
      return;
    }

    printLine(text, 'line-user');
    Memory.push('words', text.slice(0, 60).toLowerCase(), 12);

    if (text.startsWith('/')) {
      const handled = await runCommand(text.toLowerCase());
      if (!handled) {
        await typewriterLine('comando sconosciuto. prova con /help', 'line-warn');
      }
      printEmpty();
      scheduleSpontaneous();
      return;
    }

    scheduleSpontaneous();
    await respondTo(text);
    printEmpty();
  }

  if (e.key === 'Backspace') {
    e.preventDefault();
    userInput = userInput.slice(0, -1);
    syncInput();
  }

  if (e.key.length === 1) {
    userInput += e.key;
    syncInput();
  }
});

/* ──────────────────────────────────────────────────
   Input handling mobile
────────────────────────────────────────────────── */
if (terminal) {
  terminal.addEventListener('click', focusInput);
  terminal.addEventListener('touchstart', focusInput);
}

document.body.addEventListener('click', () => {
  if (window.innerWidth < 980) focusInput();
});

if (hiddenMobileInput) {
  hiddenMobileInput.addEventListener('input', () => {
    userInput = hiddenMobileInput.value;
    syncInput();
  });

  hiddenMobileInput.addEventListener('keydown', async (e) => {
    if (isTyping) return;

    if (e.key === 'Enter') {
      e.preventDefault();

      const text = userInput.trim();
      userInput = '';
      syncInput();

      if (!text) {
        await handleSilence();
        return;
      }

      printLine(text, 'line-user');
      Memory.push('words', text.slice(0, 60).toLowerCase(), 12);

      if (text.startsWith('/')) {
        const handled = await runCommand(text.toLowerCase());
        if (!handled) {
          await typewriterLine('comando sconosciuto. prova con /help', 'line-warn');
        }
        printEmpty();
        scheduleSpontaneous();
        return;
      }

      scheduleSpontaneous();
      await respondTo(text);
      printEmpty();
    }
  });
}

/* ──────────────────────────────────────────────────
   Visibility
────────────────────────────────────────────────── */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !isTyping && visits > 1 && chance(0.28)) {
    setTimeout(async () => {
      if (!isTyping && document.visibilityState === 'visible') {
        isTyping = true;
        await showTypingIndicator(620);

        await typewriterLine(rand([
          'sei tornato.',
          'ti aspettavo.',
          'ero ancora qui.',
          'bentornato nel canale.'
        ]));

        printEmpty();
        isTyping = false;
      }
    }, 1300);
  }
});

/* ──────────────────────────────────────────────────
   BLUCINE OS TRANSITION
────────────────────────────────────────────────── */
function openBlucineOS() {
  const nomaLayer = document.getElementById("noma-layer");
  const transitionLayer = document.getElementById("transition-layer");
  const osLayer = document.getElementById("os-layer");

  if (!nomaLayer || !transitionLayer || !osLayer) return;

  nomaLayer.style.display = "none";

  transitionLayer.hidden = false;
  transitionLayer.setAttribute("aria-hidden", "false");
  transitionLayer.style.display = "flex";

  let progress = 0;

  const bar = document.getElementById("system-progress");
  const status = document.getElementById("system-status");

  const steps = [
    "LOADING VISUAL SYSTEM...",
    "INITIALIZING DESKTOP...",
    "MOUNTING ARCHIVE...",
    "STARTING INTERFACE...",
    "ACCESS READY"
  ];

  let stepIndex = 0;

  const interval = setInterval(() => {
    progress += 5;

    if (bar) bar.style.width = progress + "%";

    if (progress % 20 === 0 && steps[stepIndex]) {
      if (status) status.textContent = steps[stepIndex];
      stepIndex++;
    }

    if (progress >= 100) {
      clearInterval(interval);

      transitionLayer.style.display = "none";
      transitionLayer.hidden = true;
      transitionLayer.setAttribute("aria-hidden", "true");

      osLayer.hidden = false;
      osLayer.setAttribute("aria-hidden", "false");
      osLayer.style.display = "block";
    }
  }, 60);
}

window.openBlucineOS = openBlucineOS;

/* ──────────────────────────────────────────────────
   AUTO ACCESS HOOK
────────────────────────────────────────────────── */
let nomaMessageCount = 0;
let nomaAccessTriggered = false;

function nomaRegisterMessageSafe() {
  if (nomaAccessTriggered) return;

  nomaMessageCount++;

  if (nomaMessageCount >= 6) {
    nomaAccessTriggered = true;

    setTimeout(() => {
      if (typeof openBlucineOS === "function") {
        openBlucineOS();
      }
    }, 1200);
  }
}

/* ──────────────────────────────────────────────────
   OBSERVE TERMINAL OUTPUT
────────────────────────────────────────────────── */
const outputEl = document.getElementById("output");

if (outputEl) {
  const observer = new MutationObserver(() => {
    nomaRegisterMessageSafe();
  });

  observer.observe(outputEl, {
    childList: true,
    subtree: true
  });
}

/* ──────────────────────────────────────────────────
   OS WINDOW SYSTEM
────────────────────────────────────────────────── */
let osTopZ = 10;

function refreshTaskbar() {
  const taskbar = document.getElementById('taskbar-items');
  if (!taskbar) return;

  const windows = Array.from(document.querySelectorAll('#os-layer .window'));
  taskbar.innerHTML = '';

  windows.forEach((win) => {
    const isOpen = getComputedStyle(win).display !== 'none';
    if (!isOpen) return;

    const btn = document.createElement('button');
    btn.className = 'taskbar-item active';
    btn.textContent = win.querySelector('.window-header span')?.textContent || win.id;
    btn.onclick = () => bringWindowToFront(win.id);
    taskbar.appendChild(btn);
  });
}

function bringWindowToFront(id) {
  const el = document.getElementById(id);
  if (!el) return;
  osTopZ += 1;
  el.style.zIndex = osTopZ;
}

function openWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.style.display = 'flex';
  bringWindowToFront(id);
  refreshTaskbar();

  const startMenu = document.getElementById('start-menu-os');
  if (startMenu) startMenu.hidden = true;
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  refreshTaskbar();
}

function toggleStartMenu() {
  const menu = document.getElementById('start-menu-os');
  if (!menu) return;
  menu.hidden = !menu.hidden;
}

window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.toggleStartMenu = toggleStartMenu;
window.bringWindowToFront = bringWindowToFront;

/* ──────────────────────────────────────────────────
   Start
────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  forceBootFallback();
  runBoot();
});
/* =====================================================
   BLUCINE OS ENHANCED WINDOW SYSTEM
===================================================== */

(function () {
  let dragState = null;
  let osTopZEnhanced = 100;

  function getOsWindows() {
    return Array.from(document.querySelectorAll('#os-layer .window'));
  }

  function setActiveWindow(id) {
    const windows = getOsWindows();

    windows.forEach((win) => {
      win.classList.remove('active');
    });

    const active = document.getElementById(id);
    if (!active) return;

    active.classList.add('active');
    osTopZEnhanced += 1;
    active.style.zIndex = String(osTopZEnhanced);
  }

  function refreshTaskbarEnhanced() {
    const taskbar = document.getElementById('taskbar-items');
    if (!taskbar) return;

    taskbar.innerHTML = '';

    getOsWindows().forEach((win) => {
      const isOpen = getComputedStyle(win).display !== 'none';
      if (!isOpen) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'taskbar-item';

      if (win.classList.contains('active')) {
        btn.classList.add('active');
      }

      btn.textContent =
        win.querySelector('.window-header span')?.textContent || win.id;

      btn.onclick = () => {
        const visible = getComputedStyle(win).display !== 'none';
        if (!visible) {
          win.style.display = 'flex';
        }
        setActiveWindow(win.id);
        refreshTaskbarEnhanced();
      };

      taskbar.appendChild(btn);
    });
  }

  function placeWindowIfNeeded(win) {
    if (!win || win.dataset.positioned === '1') return;

    const openCount = getOsWindows().filter(
      (w) => getComputedStyle(w).display !== 'none'
    ).length;

    const left = 120 + openCount * 26;
    const top = 70 + openCount * 22;

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
    win.dataset.positioned = '1';
  }

  function openWindowEnhanced(id) {
    const el = document.getElementById(id);
    if (!el) return;

    placeWindowIfNeeded(el);
    el.style.display = 'flex';
    setActiveWindow(id);
    refreshTaskbarEnhanced();

    const startMenu = document.getElementById('start-menu-os');
    if (startMenu) startMenu.hidden = true;
  }

  function closeWindowEnhanced(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.display = 'none';
    el.classList.remove('active');
    refreshTaskbarEnhanced();
  }

  function toggleStartMenuEnhanced() {
    const menu = document.getElementById('start-menu-os');
    if (!menu) return;
    menu.hidden = !menu.hidden;
  }

  function beginDrag(win, clientX, clientY) {
    if (!win) return;

    const rect = win.getBoundingClientRect();

    dragState = {
      win,
      startX: clientX,
      startY: clientY,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };

    win.classList.add('dragging');
    setActiveWindow(win.id);
    refreshTaskbarEnhanced();
  }

  function moveDrag(clientX, clientY) {
    if (!dragState) return;

    const win = dragState.win;
    const desktop = document.getElementById('desktop');
    const taskbar = document.getElementById('taskbar');

    if (!desktop || !taskbar) return;

    const desktopRect = desktop.getBoundingClientRect();
    const taskbarRect = taskbar.getBoundingClientRect();

    const maxLeft = desktopRect.width - win.offsetWidth - 10;
    const maxTop = taskbarRect.top - desktopRect.top - win.offsetHeight - 10;

    let left = clientX - desktopRect.left - dragState.offsetX;
    let top = clientY - desktopRect.top - dragState.offsetY;

    left = Math.max(10, Math.min(left, maxLeft));
    top = Math.max(10, Math.min(top, maxTop));

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
  }

  function endDrag() {
    if (!dragState) return;
    dragState.win.classList.remove('dragging');
    dragState = null;
  }

  function bindWindowEnhancements() {
    getOsWindows().forEach((win) => {
      const header = win.querySelector('.window-header');
      if (!header || win.dataset.enhanced === '1') return;

      win.dataset.enhanced = '1';

      win.addEventListener('mousedown', () => {
        setActiveWindow(win.id);
        refreshTaskbarEnhanced();
      });

      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-close')) return;
        beginDrag(win, e.clientX, e.clientY);
      });

      header.addEventListener(
        'touchstart',
        (e) => {
          if (e.target.closest('.window-close')) return;
          const t = e.touches[0];
          beginDrag(win, t.clientX, t.clientY);
        },
        { passive: true }
      );
    });
  }

  document.addEventListener('mousemove', (e) => {
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', endDrag);

  document.addEventListener(
    'touchmove',
    (e) => {
      if (!dragState) return;
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    },
    { passive: true }
  );

  document.addEventListener('touchend', endDrag);
  document.addEventListener('touchcancel', endDrag);

  document.addEventListener('click', (e) => {
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu-os');

    if (
      startMenu &&
      !startMenu.hidden &&
      startBtn &&
      !startMenu.contains(e.target) &&
      e.target !== startBtn
    ) {
      startMenu.hidden = true;
    }
  });

  const originalOpenBlucineOS = window.openBlucineOS;

  window.openBlucineOS = function () {
    if (typeof originalOpenBlucineOS === 'function') {
      originalOpenBlucineOS();
    }

    setTimeout(() => {
      bindWindowEnhancements();
      refreshTaskbarEnhanced();
    }, 100);
  };

  window.openWindow = function (id) {
    bindWindowEnhancements();
    openWindowEnhanced(id);
  };

  window.closeWindow = function (id) {
    closeWindowEnhanced(id);
  };

  window.toggleStartMenu = function () {
    toggleStartMenuEnhanced();
  };

  window.bringWindowToFront = function (id) {
    setActiveWindow(id);
    refreshTaskbarEnhanced();
  };
})();