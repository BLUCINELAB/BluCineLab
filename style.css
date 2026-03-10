:root{
  --bg:#02060d;
  --panel:rgba(10,15,22,.84);
  --text:#f2eee6;
  --text-soft:rgba(226,219,206,.82);
  --text-dim:rgba(226,219,206,.56);
  --gold:rgba(208,178,122,.40);
  --gold-edge:rgba(248,224,176,.94);
  --max:1280px;
}

*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

html{
  scroll-behavior:smooth;
}

body{
  background:var(--bg);
  font-family:Inter,sans-serif;
  color:var(--text);
  cursor:none;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}

a{
  color:inherit;
  text-decoration:none;
}

img{
  display:block;
  width:100%;
}

.background{
  position:fixed;
  inset:0;
  z-index:-30;
  overflow:hidden;
  background:
    radial-gradient(1200px 800px at 50% 110%, rgba(0,0,0,.80), transparent),
    linear-gradient(180deg,#071018,#030910,#010307);
}

#bgCanvas{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  display:block;
}

.background-noise{
  position:absolute;
  inset:0;
  background:url("https://grainy-gradients.vercel.app/noise.png");
  opacity:.028;
  mix-blend-mode:overlay;
  pointer-events:none;
}

.background-vignette{
  position:absolute;
  inset:0;
  box-shadow: inset 0 0 130px rgba(0,0,0,.38);
  pointer-events:none;
}

.cursor{
  width:6px;
  height:6px;
  background:#fff;
  border-radius:50%;
  position:fixed;
  pointer-events:none;
  z-index:9999;
  transform:translate(-50%,-50%);
  box-shadow:
    0 0 8px rgba(255,255,255,.95),
    0 0 18px rgba(170,220,255,.78),
    0 0 42px rgba(120,190,255,.55);
}

.spark{
  position:fixed;
  width:1.6px;
  height:1.6px;
  background:#fff;
  border-radius:50%;
  pointer-events:none;
  z-index:9998;
  box-shadow:
    0 0 3px rgba(255,255,255,.95),
    0 0 7px rgba(182,214,235,.8),
    0 0 12px rgba(145,185,215,.42);
  animation:sparkFade .95s linear forwards;
}

@keyframes sparkFade{
  0%{opacity:1;transform:translate(0,0) scale(1)}
  100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}
}

.nav{
  position:fixed;
  top:22px;
  right:34px;
  z-index:300;
  display:flex;
  gap:18px;
  padding:12px 14px;
  border-radius:999px;
  background:rgba(7,10,18,.34);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.05);
  box-shadow:
    0 12px 30px rgba(0,0,0,.16),
    inset 0 1px 0 rgba(255,255,255,.04);
}

.nav a{
  color:#fff;
  font-size:11px;
  letter-spacing:.18em;
  text-transform:uppercase;
  position:relative;
}

.nav a::after{
  content:"";
  position:absolute;
  bottom:-5px;
  left:0;
  width:100%;
  height:1px;
  background:linear-gradient(90deg,#9ed0ff,transparent);
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .22s ease;
}

.nav a:hover::after,
.nav a.is-active::after{
  transform:scaleX(1);
}

.title{
  font-family:Oswald,sans-serif;
  letter-spacing:.08em;
  text-transform:uppercase;
}

.title span{
  display:block;
  flex:0 0 auto;
  background:
    linear-gradient(
      120deg,
      #7f95a8 0%,
      #dfe6ec 18%,
      #f6f8fa 30%,
      #c4cdd5 46%,
      #f5f7f8 62%,
      #b2bcc5 78%,
      #7d93a6 100%
    );
  -webkit-background-clip:text;
  color:transparent;
  transition:filter .16s ease, transform .16s ease, text-shadow .16s ease;
}

.title-wave span{
  --wave-strength:0;
  filter:brightness(calc(1 + (var(--wave-strength) * 0.18)));
  text-shadow:
    0 0 calc(4px + (var(--wave-strength) * 10px)) rgba(198,210,220,calc(0.10 + (var(--wave-strength) * 0.22))),
    0 0 calc(10px + (var(--wave-strength) * 18px)) rgba(164,182,198,calc(0.04 + (var(--wave-strength) * 0.14)));
  transform:translateY(calc(var(--wave-strength) * -1.2px));
}

.hero-eyebrow{
  font-size:11px;
  letter-spacing:.2em;
  text-transform:uppercase;
  color:var(--text-dim);
  margin-bottom:22px;
  text-align:center;
}

.home-title-dock{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:220;
  pointer-events:none;
  opacity:0;
  transform:translateY(-10px);
  transition:opacity .32s ease, transform .32s ease;
}

.home-title-dock.is-visible{
  opacity:1;
  transform:translateY(0);
}

.home-title-dock-inner{
  max-width:var(--max);
  margin:auto;
  padding:14px 24px 0;
}

.dock-wordmark{
  font-family:Oswald,sans-serif;
  font-size:clamp(1.3rem,2vw,1.85rem);
  line-height:1;
  letter-spacing:.14em;
  text-transform:uppercase;
  white-space:nowrap;
  background:
    linear-gradient(
      120deg,
      #7f95a8 0%,
      #dfe6ec 18%,
      #f6f8fa 30%,
      #c4cdd5 46%,
      #f5f7f8 62%,
      #b2bcc5 78%,
      #7d93a6 100%
    );
  -webkit-background-clip:text;
  color:transparent;
}

.home-hero{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0 24px;
  overflow:hidden;
}

.home-hero-inner{
  width:min(96vw, 1680px);
  margin:auto;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
}

.home-title-wrap{
  width:min(100%, 1800px);
  overflow:visible;
  display:flex;
  justify-content:center;
}

.home-title{
  display:inline-flex;
  flex-wrap:nowrap;
  white-space:nowrap;
  width:max-content;
  max-width:none;
  overflow:visible;
  font-size:clamp(7rem, 20vw, 23rem);
  line-height:.76;
  letter-spacing:.01em;
  margin:0 auto;
  padding-right:.08em;
}

.hero-chips{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:16px;
  margin-top:40px;
  max-width:1180px;
}

.button-chip,
.panel-button{
  position:relative;
  overflow:hidden;
  border:1px solid rgba(239,207,148,.60);
  background:
    linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01)),
    var(--panel);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.10),
    inset 0 -1px 0 rgba(0,0,0,.26),
    0 14px 32px rgba(0,0,0,.18),
    0 0 0 1px rgba(239,207,148,.08);
  transition:transform .16s ease, border-color .2s ease, box-shadow .2s ease;
}

.button-chip::before,
.panel-button::before{
  content:"";
  position:absolute;
  inset:0;
  background:
    linear-gradient(
      112deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,.04) 18%,
      rgba(255,243,215,.16) 30%,
      rgba(255,255,255,.03) 42%,
      rgba(255,255,255,0) 58%
    );
  transform:translateX(-130%);
  transition:transform .95s ease;
  pointer-events:none;
}

.button-chip:hover::before,
.panel-button:hover::before{
  transform:translateX(130%);
}

.button-chip:hover,
.panel-button:hover{
  border-color:var(--gold-edge);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.12),
    inset 0 -1px 0 rgba(0,0,0,.24),
    0 18px 38px rgba(0,0,0,.22),
    0 0 20px rgba(240,212,155,.10);
}

.button-chip:active,
.panel-button:active{
  transform:translateY(2px) scale(.992);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,.28),
    inset 0 1px 0 rgba(255,255,255,.05),
    0 6px 14px rgba(0,0,0,.16),
    0 0 0 1px rgba(239,207,148,.08);
}

.button-chip{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:5px;
  padding:13px 18px 12px;
  min-height:58px;
  min-width:188px;
  border-radius:999px;
}

.chip-title{
  font-size:10px;
  letter-spacing:.18em;
  text-transform:uppercase;
  line-height:1;
}

.chip-meta{
  font-size:.69rem;
  letter-spacing:.01em;
  text-transform:none;
  color:rgba(232,224,211,.78);
  line-height:1.15;
  white-space:nowrap;
}

.hero-statement,
.manifesto-block,
.featured-card,
.cluster-card,
.project-card,
.archive-panel{
  border-radius:18px;
}

.hero-statement,
.manifesto-block,
.archive-panel{
  padding:24px;
}

.hero-statement{
  width:min(860px, 100%);
  margin:34px auto 0;
  text-align:center;
}

.main-shell{
  width:min(1200px, calc(100% - 40px));
  margin:auto;
}

.section{
  padding-top:100px;
  opacity:0;
  transform:translateY(40px);
  transition:opacity .95s ease, transform .95s ease;
}

.section.is-visible{
  opacity:1;
  transform:none;
}

.section-head{
  margin-bottom:26px;
}

.section-kicker,
.panel-label,
.card-kicker{
  margin-bottom:12px;
  font-size:10px;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--text-dim);
}

.section-head h2,
.manifesto-block h2,
.cluster-card h3,
.project-body h3,
.featured-body h3{
  font-family:Oswald,sans-serif;
  font-weight:300;
  letter-spacing:.08em;
  color:#efe4cd;
  text-transform:uppercase;
}

.section-head h2,
.manifesto-block h2{
  font-size:clamp(1.9rem,3.2vw,2.8rem);
}

.section-head p,
.hero-statement p,
.manifesto-block p,
.cluster-card p,
.project-body p,
.featured-body p,
.archive-panel p{
  line-height:1.72;
  color:var(--text-soft);
  font-size:.88rem;
}

.manifesto-section{
  padding-top:30px;
}

.manifesto-block{
  max-width:980px;
  margin:0 auto;
}

.manifesto-layout{
  display:grid;
  grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);
  gap:34px;
  align-items:center;
}

.manifesto-block h2{
  font-size:clamp(1.65rem,2.5vw,2.2rem);
  line-height:1.16;
}

.featured-grid{
  display:grid;
  grid-template-columns:1.35fr .85fr;
  gap:22px;
}

.featured-media,
.project-media{
  overflow:hidden;
}

.featured-media img{
  height:340px;
  object-fit:cover;
}

.project-media img{
  height:280px;
  object-fit:cover;
}

.featured-body,
.project-body{
  padding:22px;
}

.cluster-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:22px;
}

.cluster-card{
  padding:22px 20px 20px;
  min-height:200px;
}

.projects-rail{
  display:grid;
  grid-auto-flow:column;
  grid-auto-columns:minmax(300px,360px);
  gap:22px;
  overflow-x:auto;
  padding-bottom:8px;
  scroll-snap-type:x proximity;
  -webkit-overflow-scrolling:touch;
}

.projects-rail .project-card{
  scroll-snap-align:start;
}

.projects-rail::-webkit-scrollbar{
  height:8px;
}

.projects-rail::-webkit-scrollbar-thumb{
  background:rgba(248,224,176,.25);
  border-radius:999px;
}

.bottom-space{
  height:110px;
}

@media (max-width:1100px){
  .manifesto-layout,
  .featured-grid{
    grid-template-columns:1fr;
  }

  .cluster-grid{
    grid-template-columns:repeat(2,1fr);
  }
}

@media (max-width:820px){
  body{
    cursor:auto;
  }

  .cursor,
  .spark{
    display:none;
  }

  .nav{
    top:12px;
    right:12px;
    left:12px;
    justify-content:center;
    gap:12px;
    padding:10px 12px;
    flex-wrap:wrap;
  }

  .main-shell{
    width:calc(100% - 20px);
  }

  .home-hero{
    padding-left:10px;
    padding-right:10px;
  }

  .home-title{
    font-size:clamp(4.2rem,18vw,7rem);
    line-height:.82;
    padding-right:.12em;
  }

  .button-chip{
    min-width:160px;
    padding:12px 14px 11px;
  }

  .hero-chips{
    gap:10px;
  }

  .cluster-grid{
    grid-template-columns:1fr;
  }

  .featured-media img{
    height:240px;
  }

  .home-title-dock{
    display:none;
  }

  .hero-statement{
    width:100%;
    margin-top:24px;
    padding:20px;
  }

  .manifesto-block{
    padding:22px 18px;
  }

  .section{
    padding-top:72px;
  }
}