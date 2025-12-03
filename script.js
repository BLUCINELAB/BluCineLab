// ===============================
// BLUCINELAB – Cinematic Frontend
// Author: Sev7nSword (Creative Coding Mentor)
// ===============================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { gsap } from "https://unpkg.com/gsap@3/dist/gsap.min.js";
import { ScrollTrigger } from "https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js";

gsap.registerPlugin(ScrollTrigger);

// ----------
// SETUP SCENE
// ----------

// Canvas & Renderer
const canvas = document.getElementById("hero-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Plane geometry + shader uniforms
const geometry = new THREE.PlaneGeometry(2, 2);
const uniforms = {
  uTime: { value: 0 },
  uAudio: { value: 0.5 },
  uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
};

// ----------
// SHADER MATERIAL (Darkroom Light)
// ----------
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

      // base blu profondo (tono notturno)
      vec3 base = mix(vec3(0.01, 0.03, 0.10), vec3(0.02, 0.10, 0.25), uv.y);

      // bande verticali da pellicola
      float bands = 0.5 + 0.5 * sin(uv.x * 8.0 + uTime * 0.15);

      // accenti di luce ciano-tungsteno (respiro)
      vec3 light = vec3(0.0, 0.6, 0.9);
      vec3 color = base + light * bands * (0.15 + uAudio * 0.35);

      // vignettatura e flicker
      float dist = length(uv - 0.5);
      float vig = smoothstep(0.8, 0.45, dist);
      float flick = 0.95 + 0.05 * sin(uTime * 0.4);

      // fade finale verso tungsteno caldo
      float fade = smoothstep(120.0, 0.0, uTime); // dopo 2 minuti vira al caldo
      vec3 warm = mix(color, vec3(0.9, 0.55, 0.3), fade * 0.2);

      gl_FragColor = vec4(warm * vig * flick, 1.0);
    }
  `,
});

// Add to scene
const quad = new THREE.Mesh(geometry, material);
scene.add(quad);

// ----------
// RESPONSIVE
// ----------
function resize() {
  const w = window.innerWidth,
    h = window.innerHeight;
  renderer.setSize(w, h, false);
  uniforms.uRes.value.set(w, h);
}
window.addEventListener("resize", resize);
resize();

// ----------
// ANIMATION LOOP
// ----------
let start = performance.now();
function animate() {
  uniforms.uTime.value = (performance.now() - start) / 1000;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// ----------
// CINEMATIC INTRO & FADE
// ----------
gsap.to(".fade-cover", {
  opacity: 0,
  duration: 3.5,
  ease: "power2.out",
  delay: 1,
});

gsap.to(".hero", {
  opacity: 1,
  y: 0,
  duration: 2.8,
  ease: "power3.out",
  delay: 2,
});

// fade finale: simula fine pellicola
setTimeout(() => {
  gsap.to(".hero", { opacity: 0.2, duration: 4, ease: "sine.inOut" });
}, 90000); // 90 secondi

// ----------
// SCROLLTRIGGER: dissolvenze filmiche
// ----------
document.querySelectorAll("section").forEach((section) => {
  gsap.fromTo(
    section,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

// ----------
// AUDIO REACTIVE SYSTEM
// ----------
const audio = document.getElementById("ambient");
audio.volume = 0.6;

// Policy fix — attiva su click
window.addEventListener(
  "click",
  async () => {
    try {
      await audio.play();
    } catch (e) {}
  },
  { once: true }
);

// Analisi audio
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const src = ctx.createMediaElementSource(audio);
const analyser = ctx.createAnalyser();
src.connect(analyser);
analyser.connect(ctx.destination);
analyser.fftSize = 256;
const data = new Uint8Array(analyser.frequencyBinCount);

function analyse() {
  analyser.getByteFrequencyData(data);
  const avg = data.reduce((a, b) => a + b) / data.length / 255;
  uniforms.uAudio.value = avg;
  requestAnimationFrame(analyse);
}
analyse();

// ----------
// MICRO INTERAZIONI
// ----------
const hint = document.querySelector(".scroll-hint");
if (hint) {
  gsap.to(hint, {
    opacity: 0.3,
    y: 5,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
}
