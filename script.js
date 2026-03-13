'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;

(function initCursor() {
  const cursor = $('#cursor');
  const trail = $('#cursor-trail');
  if (!cursor || !trail) return;
  let mouse = { x: -100, y: -100 };
  let trailPos = { x: -100, y: -100 };
  const isMobile = () => window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches;
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = mouse.x + 'px'; cursor.style.top = mouse.y + 'px';
  });
  const updateTrail = () => {
    trailPos.x = lerp(trailPos.x, mouse.x, 0.1);
    trailPos.y = lerp(trailPos.y, mouse.y, 0.1);
    trail.style.left = trailPos.x + 'px'; trail.style.top = trailPos.y + 'px';
    requestAnimationFrame(updateTrail);
  };
  if (!isMobile()) updateTrail();
  const hoverTargets = 'a, button, .archive-item, .hwt-item, .studio-area, .lab-entry, .filter-btn';
  document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover'); });
})();

(function initNav() {
  const nav = $('#nav');
  const menuBtn = $('#nav-menu-btn');
  const mobileNav = $('#nav-mobile');
  const navLinks = $$('.nav-link');
  let isMenuOpen = false;
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNavLink();
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuBtn.classList.toggle('open', isMenuOpen);
      mobileNav.classList.toggle('open', isMenuOpen);
    });
    $$('[data-mobile-nav]').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        menuBtn.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }
  const sections = [
    { id: 'home', el: $('#home') }, { id: 'archive', el: $('#archive') },
    { id: 'studio', el: $('#studio') }, { id: 'lab', el: $('#lab') },
    { id: 'contact', el: $('#contact') },
  ].filter(s => s.el);
  function updateActiveNavLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    let active = sections[0];
    for (const section of sections) { if (section.el.offsetTop <= scrollMid) active = section; }
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.navLink === active.id));
  }
})();

(function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animating = true;
  const PARTICLE_COUNT = window.innerWidth > 768 ? 80 : 30;

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.3 + 0.05);
      this.speedX = (Math.random() - 0.5) * 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeTarget = Math.random() * 0.4 + 0.05;
      this.hue = Math.random() > 0.7 ? 220 : 210;
      this.sat = Math.random() * 30 + 50;
    }
    update() {
      this.y += this.speedY; this.x += this.speedX;
      this.opacity += (this.fadeTarget - this.opacity) * 0.005;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  class Streak {
    constructor() { this.reset(); }
    reset() {
      this.x = -200; this.y = Math.random() * H;
      this.w = Math.random() * 120 + 40;
      this.speed = Math.random() * 0.4 + 0.1;
      this.opacity = Math.random() * 0.04 + 0.01;
      this.born = Date.now() + Math.random() * 8000;
    }
    update() { if (Date.now() < this.born) return; this.x += this.speed; if (this.x > W + 200) this.reset(); }
    draw() {
      if (Date.now() < this.born) return;
      const grad = ctx.createLinearGradient(this.x - this.w, this.y, this.x + this.w, this.y);
      grad.addColorStop(0, `rgba(74, 127, 212, 0)`);
      grad.addColorStop(0.5, `rgba(74, 127, 212, ${this.opacity})`);
      grad.addColorStop(1, `rgba(74, 127, 212, 0)`);
      ctx.beginPath(); ctx.moveTo(this.x - this.w, this.y); ctx.lineTo(this.x + this.w, this.y);
      ctx.strokeStyle = grad; ctx.lineWidth = 1; ctx.stroke();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    for (let i = 0; i < 5; i++) particles.push(new Streak());
  }

  function draw() {
    if (!animating) return;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W * 0.3, H * 0.6, 0, W * 0.3, H * 0.6, W * 0.9);
    bg.addColorStop(0, 'rgba(27, 58, 107, 0.15)');
    bg.addColorStop(0.5, 'rgba(15, 25, 55, 0.05)');
    bg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { animating = e.isIntersecting; });
  });
  observer.observe(canvas.closest('.section-home') || canvas);
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  resize(); init(); draw();
})();

(function initScrollReveal() {
  const targets = $$('.archive-item, .lab-entry, .studio-area');
  if (!targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), (index % 3) * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => observer.observe(el));
})();

(function initArchiveFilter() {
  const filterBtns = $$('.filter-btn');
  const items = $$('.archive-item');
  const countEl = $('#archive-count');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let visible = 0;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.classList.remove('hidden');
          if (!item.classList.contains('visible')) setTimeout(() => item.classList.add('visible'), 50);
          visible++;
        } else {
          item.classList.add('hidden');
          item.classList.remove('visible');
        }
      });
      if (countEl) countEl.textContent = filter === 'all' ? `${visible} voci · 3 categorie` : `${visible} voci · ${btn.textContent}`;
    });
  });
})();

(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();

(function initProjectLinks() {
  const overlay = $('#project-overlay');
  const closeBtn = $('#po-close');
  const poBody = $('#po-body');
  const poLabel = $('#po-label');
  if (!overlay || !closeBtn) return;

  const projects = {
    'project-1': {
      title: 'Paesaggi di una mente', subtitle: 'Exhibition · Bologna · 2024',
      category: 'Identità visiva espositiva',
      body: `<div class="po-project"><div class="po-project-visual po-visual-1"></div><div class="po-project-intro"><p class="po-text-lead">Una mostra di fotografia contemporanea richiedeva un sistema visivo capace di parlare senza sovrastare le immagini esposte.</p><p class="po-text-body">Il progetto nasce da un vincolo: il sistema visivo della mostra doveva essere presente ma non competitivo. Ogni elemento grafico —dalla segnaletica al catalogo, dal packaging agli inviti— doveva servire le fotografie, non rappresentarle.</p><p class="po-text-body">Abbiamo scelto un registro quasi assente: inchiostro su bianco, spaziatura estrema, un solo accento cromatico derivato dall'opera più rappresentativa della selezione.</p></div><div class="po-project-meta"><div class="po-meta-item"><span class="mono-label">Ruolo</span><span>Direzione artistica, identità visiva, segnaletica</span></div><div class="po-meta-item"><span class="mono-label">Cliente</span><span>Istituzione culturale, Bologna</span></div><div class="po-meta-item"><span class="mono-label">Anno</span><span>2024</span></div></div></div>`
    },
    'project-3': {
      title: 'Forma in divenire', subtitle: 'Film · Documentario breve · 2023',
      category: 'Ricerca cinematografica',
      body: `<div class="po-project"><div class="po-project-visual po-visual-3"></div><div class="po-project-intro"><p class="po-text-lead">Studio cinematografico sull'identità di un luogo urbano in trasformazione.</p><p class="po-text-body">Un quartiere che cambia. Non documentiamo la trasformazione: documentiamo come i residenti percepiscono il tempo di quella trasformazione.</p></div><div class="po-project-meta"><div class="po-meta-item"><span class="mono-label">Formato</span><span>Documentario breve, 18 min</span></div><div class="po-meta-item"><span class="mono-label">Anno</span><span>2023</span></div></div></div>`
    }
  };

  const style = document.createElement('style');
  style.textContent = `.po-project{display:flex;flex-direction:column;gap:48px}.po-project-visual{height:400px;border-radius:4px}.po-visual-1{background:linear-gradient(135deg,#0A1525,#152B52)}.po-visual-3{background:linear-gradient(135deg,#080D1A,#0A1E35)}.po-text-lead{font-family:var(--f-display);font-size:clamp(22px,2.5vw,30px);font-weight:300;font-style:italic;color:var(--c-text-white);line-height:1.4;margin-bottom:24px}.po-text-body{font-family:var(--f-mono);font-size:13px;color:var(--c-text-secondary);line-height:1.8;margin-top:16px}.po-project-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding-top:32px;border-top:1px solid var(--c-border)}.po-meta-item{display:flex;flex-direction:column;gap:8px}.po-meta-item span:last-child{font-family:var(--f-display);font-size:17px;color:var(--c-text-primary)}@media(max-width:768px){.po-project-meta{grid-template-columns:1fr}.po-project-visual{height:240px}}`;
  document.head.appendChild(style);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.aii-link');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#project-')) return;
    const project = projects[href.slice(1)];
    if (!project) return;
    e.preventDefault();
    poLabel.textContent = project.category;
    poBody.innerHTML = `<div style="margin-bottom:48px"><h2 style="font-family:var(--f-display);font-size:clamp(36px,5vw,64px);font-weight:300;color:var(--c-text-white);letter-spacing:-0.02em;line-height:1">${project.title}</h2><p class="mono-label" style="margin-top:12px">${project.subtitle}</p></div>${project.body}`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => { overlay.classList.remove('open'); document.body.style.overflow = ''; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) { overlay.classList.remove('open'); document.body.style.overflow = ''; } });
})();

(function initSectionLabels() {
  const sections = [
    { el: $('#archive'), num: '002' }, { el: $('#studio'), num: '003' },
    { el: $('#lab'), num: '004' }, { el: $('#contact'), num: '005' },
  ].filter(s => s.el);
  sections.forEach(({ el, num }) => {
    const ghost = document.createElement('div');
    ghost.textContent = num;
    ghost.style.cssText = `position:absolute;right:var(--margin-h);top:50%;transform:translateY(-50%);font-family:var(--f-display);font-size:clamp(120px,20vw,280px);font-weight:300;color:rgba(74,127,212,0.03);pointer-events:none;user-select:none;line-height:1;z-index:0;letter-spacing:-0.05em;`;
    el.style.position = 'relative';
    el.insertBefore(ghost, el.firstChild);
  });
})();

console.log('%cBluCine Studio — v2.0', 'font-family:serif;font-size:16px;color:#4A7FD4;font-style:italic;');
console.log('%cBologna · Laboratorio visivo', 'font-family:monospace;font-size:10px;color:#6B82A8;letter-spacing:2px;');
