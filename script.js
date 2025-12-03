/* ======================================================
   BLUCINELAB – SCRIPT JS DEFINITIVO v2
   by Taky × Sev7nSword | 2025 (no-audio edition)
   ====================================================== */

/* ==============================
   IMPORT
   ============================== */
// Le librerie vanno incluse PRIMA di questo file in index.html:
// <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
// <script src="https://unpkg.com/gsap@3/dist/gsap.min.js"></script>
// <script src="https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==============================
   SHADER HERO — CAMERA OSCURA
   ============================== */

const canvas = document.getElementById("hero-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
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

      // base blu tungsteno
      vec3 base = mix(vec3(0.01, 0.03, 0.10), vec3(0.02, 0.12, 0.25), uv.y);

      // bande lente di luce cyan
      float bands = 0.5 + 0.5 * sin(uv.x * 9.0 + uTime * 0.15);
      vec3 lightColor = vec3(0.0, 0.65, 0.9);
      vec3 color = base + lightColor * bands * 0.35;

      // vignetta + flicker morbido
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

function animate(now) {
  renderFrame(now);
  requestAnimationFrame(animate);
}

// se l’utente chiede meno motion, render una volta sola
if (prefersReducedMotion) {
  renderFrame(performance.now());
} else {
  requestAnimationFrame(animate);
}

/* ==============================
   FADE-IN CINEMATIC
   ============================== */

const fadeCover = document.querySelector(".fade-cover");
const hero = document.querySelector(".hero");

if (prefersReducedMotion) {
  if (fadeCover) fadeCover.style.opacity = 0;
  if (hero) {
    hero.style.opacity = 1;
    hero.style.transform = "none";
  }
} else {
  gsap.to(".fade-cover", {
    opacity: 0,
    duration: 3.2,
    ease: "power2.out",
    delay: 1,
  });

  gsap.fromTo(
    ".hero",
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 3.2, ease: "power3.out", delay: 2 }
  );
}

/* ==============================
   SCROLL ANIMATIONS
   ============================== */

const scenes = document.querySelectorAll(".scene");

if (prefersReducedMotion) {
  scenes.forEach((section) => {
    section.classList.add("visible");
    section.style.opacity = 1;
    section.style.transform = "none";
  });
} else {
  scenes.forEach((section) => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 25%",
          scrub: false,
        },
        onStart: () => section.classList.add("visible"),
      }
    );
  });
}

/* ==============================
   MICROINTERAZIONI TESTUALI
   ============================== */

if (!prefersReducedMotion) {
  gsap.utils.toArray("h1, h2").forEach((el) => {
    gsap.to(el, {
      opacity: 0.9,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2,
    });
  });
}

// hover morbido sui paragrafi (ok anche con reduced motion)
gsap.utils.toArray("p").forEach((el) => {
  el.style.transition = "color 0.4s ease";
  el.addEventListener("mouseenter", () => {
    el.style.color = "rgba(255,255,255,0.9)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.color = "rgba(220,230,255,0.65)";
  });
});

/* ==============================
   LOG FINALE
   ============================== */

console.log("🎞 BluCineLab cinematic experience ready (no audio, v2).");
