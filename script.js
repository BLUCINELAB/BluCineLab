/* ======================================================
   BLUCINELAB – SCRIPT JS
   Shader hero · fade · scroll reveal · parallax
   ====================================================== */

/* ==============================
   GSAP / ScrollTrigger
   ============================== */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==============================
   SHADER HERO – CAMERA OSCURA
   ============================== */

(function initShader() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uRes;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        float aspect = uRes.x / uRes.y;
        uv.x = (uv.x - 0.5) * aspect + 0.5;

        vec3 baseA = vec3(0.01, 0.03, 0.10);
        vec3 baseB = vec3(0.02, 0.12, 0.25);
        vec3 base = mix(baseA, baseB, uv.y);

        float bands = 0.5 + 0.5 * sin(uv.x * 9.0 + uTime * 0.15);
        vec3 lightColor = vec3(0.0, 0.65, 0.9);
        vec3 color = base + lightColor * bands * 0.35;

        float dist = length(uv - 0.5);
        float vignette = smoothstep(0.8, 0.45, dist);

        float flicker = 0.97 + 0.03 * sin(uTime * 0.6);
        color *= vignette * flicker;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const quad = new THREE.Mesh(geometry, material);
  scene.add(quad);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }

  window.addEventListener("resize", resize);
  resize();

  let start = performance.now();

  function renderFrame(time) {
    uniforms.uTime.value = (time - start) / 1000;
    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderFrame(performance.now());
  } else {
    function animate(now) {
      renderFrame(now);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
})();

/* ==============================
   FADE-IN & HERO ENTRANCE
   ============================== */

(function initIntro() {
  const fadeCover = document.querySelector(".fade-cover");
  const hero = document.querySelector(".hero");

  if (prefersReducedMotion) {
    if (fadeCover) fadeCover.style.opacity = 0;
    if (hero) {
      hero.style.opacity = 1;
      hero.style.transform = "none";
    }
    return;
  }

  if (hero) {
    gsap.set(hero, { opacity: 0, y: 60 });
  }

  if (fadeCover) {
    gsap.to(fadeCover, {
      opacity: 0,
      duration: 2.8,
      ease: "power2.out",
      delay: 0.8,
      onComplete: () => {
        fadeCover.style.pointerEvents = "none";
      },
    });
  }

  if (hero) {
    gsap.to(hero, {
      opacity: 1,
      y: 0,
      duration: 3,
      ease: "power3.out",
      delay: 1.6,
    });
  }
})();

/* ==============================
   SCROLL REVEAL DELLE SEZIONI
   ============================== */

(function initScenesReveal() {
  const scenes = document.querySelectorAll(".scene");
  if (!scenes.length) return;

  if (prefersReducedMotion) {
    scenes.forEach((scene) => {
      scene.classList.add("visible");
      scene.style.opacity = 1;
      scene.style.transform = "none";
    });
    return;
  }

  scenes.forEach((scene) => {
    gsap.fromTo(
      scene,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scene,
          start: "top 82%",
          end: "top 40%",
          toggleActions: "play none none reverse",
        },
        onStart: () => scene.classList.add("visible"),
      }
    );
  });
})();

/* ==============================
   PARALLASSE LEGGERO (IMMAGINI)
   ============================== */

(function initParallax() {
  if (prefersReducedMotion) return;

  // elementi con data-depth (hero image, workspace, etc.)
  const depthEls = document.querySelectorAll("[data-depth]");
  depthEls.forEach((el) => {
    const depth = parseFloat(el.getAttribute("data-depth")) || 0.08;

    gsap.to(el, {
      yPercent: depth * 60,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });
  });
})();

/* ==============================
   REEL ORIZZONTALE (LAVORI)
   ============================== */

(function initReel() {
  if (prefersReducedMotion) return;

  const reel = document.querySelector("[data-reel]");
  if (!reel) return;

  gsap.to(reel, {
    xPercent: -22,
    ease: "none",
    scrollTrigger: {
      trigger: ".scene--works",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.1,
    },
  });
})();

/* ==============================
   MICROINTERAZIONI TIPOGRAFICHE
   ============================== */

(function initTypographyMicro() {
  if (prefersReducedMotion) return;

  // Respiro leggero sui titoli principali
  gsap.utils.toArray("h1, h2").forEach((el) => {
    gsap.to(el, {
      opacity: 0.9,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2.5,
    });
  });
})();

