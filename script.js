/* ======================================================
   BLUCINELAB – SCRIPT JS DEFINITIVO
   by Taky × Sev7nSword | 2025
   ====================================================== */

/* ==============================
   IMPORT
   ============================== */
// Carica librerie globali da CDN nel tuo HTML:
// <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
// <script src="https://unpkg.com/gsap@3/dist/gsap.min.js"></script>
// <script src="https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

/* ==============================
   SHADER HERO — CAMERA OSCURA
   ============================== */

const canvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const geometry = new THREE.PlaneGeometry(2, 2);
const uniforms = {
  uTime: { value: 0 },
  uAudio: { value: 0.4 },
  uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
};

// GLSL shader: luce viva, bande lente, flicker, vignettatura
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
    uniform float uAudio;
    uniform vec2 uRes;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float aspect = uRes.x / uRes.y;
      uv.x = (uv.x - 0.5) * aspect + 0.5;

      // base blu tungsteno
      vec3 base = mix(vec3(0.01, 0.03, 0.10), vec3(0.02, 0.12, 0.25), uv.y);

      // bande verticali di luce
      float bands = 0.5 + 0.5 * sin(uv.x * 9.0 + uTime * 0.15);
      vec3 lightColor = vec3(0.0, 0.65, 0.9);
      vec3 color = base + lightColor * bands * (0.25 + uAudio * 0.45);

      // vignette + flicker
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
window.addEventListener('resize', resize);
resize();

let start = performance.now();
function animate() {
  uniforms.uTime.value = (performance.now() - start) / 1000;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

/* ==============================
   CINEMATIC FADE IN
   ============================== */

gsap.to(".fade-cover", {
  opacity: 0,
  duration: 4,
  ease: "power2.out",
  delay: 1,
});

gsap.to(".hero", {
  opacity: 1,
  y: 0,
  duration: 3.5,
  ease: "power3.out",
  delay: 2,
});

/* ==============================
   AUDIO AMBIENT + REATTIVO
   ============================== */

const audio = document.getElementById("ambient");
audio.volume = 0.6;

window.addEventListener("click", async () => {
  try {
    await audio.play();
  } catch (e) {
    console.log("Audio interaction required.");
  }
}, { once: true });

const ctx = new (window.AudioContext || window.webkitAudioContext)();
const src = ctx.createMediaElementSource(audio);
const analyser = ctx.createAnalyser();
src.connect(analyser);
analyser.connect(ctx.destination);
analyser.fftSize = 256;
const data = new Uint8Array(analyser.frequencyBinCount);

function analyseAudio() {
  analyser.getByteFrequencyData(data);
  let avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
  uniforms.uAudio.value = avg * 1.5;
  requestAnimationFrame(analyseAudio);
}
analyseAudio();

/* ==============================
   SCROLLTRIGGER – FADE TRA SEZIONI
   ============================== */

document.querySelectorAll(".scene").forEach((section, i) => {
  gsap.fromTo(
    section,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: false,
      },
    }
  );
});

/* ==============================
   MICROINTERAZIONI – RESPIRO TIPO
   ============================== */

gsap.utils.toArray("h2, h1").forEach((el) => {
  gsap.to(el, {
    opacity: 0.92,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: Math.random() * 2,
  });
});

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
   THE END — REGIA COMPLETATA
   ============================== */
console.log("🎞 BluCineLab cinematic experience ready.");
