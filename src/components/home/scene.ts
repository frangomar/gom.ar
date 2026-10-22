// Escena 3D de la home. Un solo canvas fijo y un solo contexto WebGL: cada objeto se dibuja en el
// rectángulo de su elemento [data-gl] (scissor), recortado por la card que lo tapa.
// Estética: gelatina translúcida (cáscara brillante + núcleo que brilla) con luz de estudio clara.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import type { FxState } from "./HomeFx";

const UV = 0x7a5cff, RED = 0xff2b4e;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

type View = {
  el: HTMLElement;
  scene: THREE.Scene;
  cam: THREE.PerspectiveCamera;
  pad: [number, number, number, number]; // margen extra del viewport (izq, arriba, der, abajo) en fracción del elemento
  box: [number, number]; // ancho y alto que tiene que entrar en cámara
  clip: () => number; // borde inferior visible (lo tapa la card siguiente)
  tick: (t: number) => void;
  rx: number;
  ry: number;
};

// Estudio de fotografía para los reflejos: softbox grande arriba, rebote frontal y dos tiras de color suaves.
function studio() {
  const sc = new THREE.Scene();
  sc.background = new THREE.Color(0x15151a);
  const panel = (w: number, h: number, color: number, k: number, pos: [number, number, number], rot: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.rotation.set(...rot);
    sc.add(m);
  };
  panel(8, 3, 0xffffff, 3, [0, 5, 1], [Math.PI / 2, 0, 0]);
  panel(6, 4, 0xffffff, 1.4, [-2.5, 1, 5], [0, Math.PI * 0.85, 0]);
  panel(3, 3, 0xffffff, 0.8, [4, 1, 4], [0, -Math.PI * 0.75, 0]);
  panel(0.6, 6, UV, 3, [5, 0, 0], [0, -Math.PI / 2, 0]);
  panel(0.6, 6, RED, 1.4, [-5, 0, 0], [0, Math.PI / 2, 0]);
  panel(10, 10, 0x22222a, 1, [0, -4, 0], [-Math.PI / 2, 0, 0]);
  return sc;
}

// Gelatina: núcleo opaco que brilla adentro + cáscara transparente con barniz.
function jellyMats(color: number, opacity = 0.5) {
  const c = new THREE.Color(color);
  return {
    core: new THREE.MeshStandardMaterial({ color: c.clone().lerp(new THREE.Color(0xffffff), 0.3), emissive: c, emissiveIntensity: 0.45, roughness: 0.55 }),
    shell: new THREE.MeshPhysicalMaterial({ color: c, transparent: true, opacity, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, ior: 1.5, side: THREE.DoubleSide, depthWrite: false }),
  };
}
function jelly(geo: THREE.BufferGeometry, color: number, core = 0.88, coreGeo?: THREE.BufferGeometry) {
  const m = jellyMats(color), g = new THREE.Group();
  const inner = new THREE.Mesh(coreGeo ?? geo, m.core);
  if (!coreGeo) inner.scale.setScalar(core);
  const shell = new THREE.Mesh(geo, m.shell);
  shell.renderOrder = 1;
  g.add(inner, shell);
  return g;
}

function roundedPlane(w: number, h: number, r: number) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, 24), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
  return g;
}
function roundedShape(w: number, h: number, r: number, s = new THREE.Shape() as THREE.Shape | THREE.Path) {
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
const circle = (x: number, y: number, r: number, cw = false) => { const p = new THREE.Path(); p.absarc(x, y, r, 0, Math.PI * 2, cw); return p; };

const M = {
  titanium: new THREE.MeshPhysicalMaterial({ color: 0x9c9ca4, roughness: 0.3, metalness: 1 }),
  alu: new THREE.MeshPhysicalMaterial({ color: 0xc9ccd2, roughness: 0.32, metalness: 0.9 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x0a0a0c, roughness: 0.06, metalness: 0, clearcoat: 1 }),
  deck: new THREE.MeshStandardMaterial({ color: 0x2a2b30, roughness: 0.75 }),
  pad: new THREE.MeshPhysicalMaterial({ color: 0xb8bbc2, roughness: 0.3, metalness: 0.7, clearcoat: 0.5 }),
  steel: new THREE.MeshPhysicalMaterial({ color: 0xd8d8de, roughness: 0.18, metalness: 1 }),
  paper: new THREE.MeshPhysicalMaterial({ color: 0xf2f0ea, roughness: 0.6, sheen: 0.4 }),
  ball: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.15 }),
};

// iPhone: cuerpo de titanio, frente de vidrio, pantalla, isla, cámaras y botones
function iphone(map: THREE.Texture, w = 0.72, h = 1.52) {
  const d = 0.085, g = new THREE.Group();
  g.add(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 8, 0.115), M.titanium));
  const front = new THREE.Mesh(roundedPlane(w - 0.012, h - 0.012, 0.108), M.glass); front.position.z = d / 2 + 0.0008; g.add(front);
  const scr = new THREE.Mesh(roundedPlane(w - 0.05, h - 0.05, 0.09), new THREE.MeshBasicMaterial({ map, toneMapped: false })); scr.position.z = d / 2 + 0.0016; g.add(scr);
  const isl = new THREE.Mesh(roundedPlane(0.2, 0.058, 0.029), new THREE.MeshBasicMaterial({ color: 0x000000 })); isl.position.set(0, h / 2 - 0.075, d / 2 + 0.0024); g.add(isl);
  const bump = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.32, 0.03, 4, 0.07), M.titanium); bump.position.set(-w / 2 + 0.2, h / 2 - 0.2, -d / 2 - 0.012); g.add(bump);
  for (const [x, y] of [[-0.07, 0.07], [-0.07, -0.07], [0.07, 0]]) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.03, 32), M.glass);
    l.rotation.x = Math.PI / 2; l.position.set(-w / 2 + 0.2 + x, h / 2 - 0.2 + y, -d / 2 - 0.03); g.add(l);
  }
  for (const [side, y, len] of [[-1, 0.3, 0.16], [-1, 0.12, 0.12], [1, 0.2, 0.22]]) {
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.012, len, 0.03, 2, 0.005), M.titanium); b.position.set(side * (w / 2 + 0.004), y, 0); g.add(b);
  }
  return g;
}
// MacBook plateada: base, teclado, trackpad y tapa con pantalla
function macbook(map: THREE.Texture) {
  const W = 3, D = 2.06, H = 0.07, g = new THREE.Group();
  g.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.03), M.alu));
  const kb = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.95), M.deck); kb.rotation.x = -Math.PI / 2; kb.position.set(0, H / 2 + 0.001, -0.35); g.add(kb);
  const tp = new THREE.Mesh(roundedPlane(1.15, 0.72, 0.05), M.pad); tp.rotation.x = -Math.PI / 2; tp.position.set(0, H / 2 + 0.001, 0.52); g.add(tp);
  const pivot = new THREE.Group(); pivot.position.set(0, H / 2, -D / 2 + 0.02); g.add(pivot);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(W, 1.98, 0.045, 6, 0.03), M.alu); lid.position.y = 0.99; pivot.add(lid);
  const bez = new THREE.Mesh(roundedPlane(W - 0.05, 1.93, 0.05), M.glass); bez.position.set(0, 0.99, 0.0235); pivot.add(bez);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.17, 1.78), new THREE.MeshBasicMaterial({ map, toneMapped: false })); scr.position.set(0, 0.975, 0.0245); pivot.add(scr);
  g.userData.pivot = pivot;
  return g;
}
// Disco olímpico de 20 kg (torno): goma en gelatina naranja, centro de acero, "20 KG" en relieve
function plate(font: Font | null) {
  const g = new THREE.Group();
  const rubber = [[0.38, -0.12], [0.9, -0.12], [0.97, -0.1], [1, -0.05], [1, 0.05], [0.97, 0.1], [0.9, 0.12], [0.38, 0.12]].map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(rubber, 96);
  g.add(jelly(geo, 0xf26b21, 0.94));
  const hub = [[0.125, -0.16], [0.125, 0.16], [0.3, 0.17], [0.38, 0.13], [0.38, -0.13], [0.3, -0.17]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry([...hub, hub[0]], 96), M.steel));
  if (font) {
    const mk = (s: string, y: number) => {
      const t = new THREE.Mesh(new TextGeometry(s, { font, size: 0.17, depth: 0.03, curveSegments: 8 }), M.paper);
      t.geometry.computeBoundingBox(); const bb = t.geometry.boundingBox!;
      t.geometry.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, 0);
      t.rotation.x = -Math.PI / 2; t.position.set(0, 0.121, y); g.add(t);
    };
    mk("20", -0.62); mk("KG", 0.64);
  }
  g.rotation.x = Math.PI / 2; // de frente a la cámara
  const holder = new THREE.Group(); holder.add(g);
  return holder;
}
// Pelota de golf: hoyuelos tallados en la geometría
function golfBall() {
  const geo = new THREE.IcosahedronGeometry(1, 40), p = geo.attributes.position, n = 340, v = new THREE.Vector3();
  const dimples: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
    dimples.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
  }
  const R = 0.105;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    let best = 9;
    for (const d of dimples) { const dd = v.distanceToSquared(d); if (dd < best) best = dd; }
    const dist = Math.sqrt(best), dent = dist < R ? 0.022 * (1 - (dist / R) ** 2) : 0;
    v.multiplyScalar(1 - dent); p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, M.ball);
}
// Paleta de pádel: cabeza perforada en gelatina azul, puño blanco
function paddle() {
  const head = new THREE.Shape(); head.absellipse(0, 0.45, 0.5, 0.56, 0, Math.PI * 2, false, 0);
  for (let x = -0.36; x <= 0.37; x += 0.12) for (let y = 0.08; y <= 0.86; y += 0.12) {
    if ((x / 0.4) ** 2 + ((y - 0.45) / 0.46) ** 2 < 1) head.holes.push(circle(x, y, 0.034, true));
  }
  const throat = new THREE.Shape();
  throat.moveTo(-0.3, -0.04); throat.quadraticCurveTo(-0.08, -0.12, -0.08, -0.32); throat.lineTo(0.08, -0.32); throat.quadraticCurveTo(0.08, -0.12, 0.3, -0.04); throat.lineTo(-0.3, -0.04);
  const opts = { depth: 0.09, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 4, curveSegments: 48 };
  const geo = new THREE.ExtrudeGeometry([head, throat], opts); geo.translate(0, 0, -0.045);
  const core = new THREE.ExtrudeGeometry([head, throat], { ...opts, depth: 0.06, bevelEnabled: false }); core.translate(0, 0, -0.03);
  const g = new THREE.Group();
  g.add(jelly(geo, 0x4d7cff, 1, core));
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.55, 32), M.paper); grip.position.y = -0.58; g.add(grip);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 32), jellyMats(0x4d7cff, 0.8).shell); cap.position.y = -0.87; g.add(cap);
  g.position.y = -0.2;
  const holder = new THREE.Group(); holder.add(g);
  return holder;
}
// Logo de Instagram en gelatina: marco redondeado, lente y punto
function igLogo() {
  const frame = roundedShape(1.6, 1.6, 0.46) as THREE.Shape; frame.holes.push(roundedShape(1.24, 1.24, 0.3, new THREE.Path()) as THREE.Path);
  const lens = new THREE.Shape(); lens.absarc(0, 0, 0.38, 0, Math.PI * 2, false); lens.holes.push(circle(0, 0, 0.25, true));
  const dot = new THREE.Shape(); dot.absarc(0.4, 0.4, 0.085, 0, Math.PI * 2, false);
  const opts = { depth: 0.16, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 6, curveSegments: 48 };
  const geo = new THREE.ExtrudeGeometry([frame, lens, dot], opts); geo.translate(0, 0, -0.08);
  const core = new THREE.ExtrudeGeometry([frame, lens, dot], { ...opts, depth: 0.1, bevelEnabled: false }); core.translate(0, 0, -0.05);
  return jelly(geo, 0xe23d8f, 1, core);
}
// Fajo de billetes de fantasía (no reproduce un billete real): papel verde, faja de papel
function cash() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 232; const x = c.getContext("2d")!;
  x.fillStyle = "#cfe5c4"; x.fillRect(0, 0, 512, 232);
  x.strokeStyle = "#3d7a4c"; x.lineWidth = 6; x.strokeRect(14, 14, 484, 204); x.lineWidth = 2; x.strokeRect(26, 26, 460, 180);
  x.fillStyle = "#3d7a4c"; x.beginPath(); x.ellipse(256, 116, 62, 74, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#cfe5c4"; x.font = "900 96px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("$", 256, 120);
  x.fillStyle = "#3d7a4c"; x.font = "800 40px sans-serif"; x.fillText("100", 70, 56); x.fillText("100", 442, 180);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const top = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.55, sheen: 0.3 }), side = new THREE.MeshPhysicalMaterial({ color: 0xb9d4ad, roughness: 0.7 });
  const g = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.022, 1), [side, side, top, side, side, side]);
    b.position.set((Math.random() - 0.5) * 0.04, i * 0.024, (Math.random() - 0.5) * 0.04); b.rotation.y = (Math.random() - 0.5) * 0.03; g.add(b);
  }
  const band = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.33, 1.04, 2, 0.02), jellyMats(UV, 0.85).shell); band.position.y = 0.13; g.add(band);
  return g;
}

function contactShadow(w: number, d: number) {
  const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d")!;
  const gr = x.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, "rgba(0,0,0,.6)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function start(G: FxState) {
  const canvas = document.createElement("canvas");
  canvas.className = "gl3d";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  let r: THREE.WebGLRenderer;
  try {
    r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    canvas.remove();
    return () => {};
  }
  r.setPixelRatio(Math.min(devicePixelRatio, G.fine ? 2 : 1.5));
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.15;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.setClearColor(0x000000, 0);
  const env = new THREE.PMREMGenerator(r).fromScene(studio(), 0.03).texture;
  const loader = new THREE.TextureLoader();
  const tex = (url: string, setup?: (t: THREE.Texture) => void) => { const t = loader.load(url); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; setup?.(t); return t; };
  const views: View[] = [];
  const nav = 64;

  function view(el: HTMLElement, opts: Partial<View> & Pick<View, "tick" | "box">) {
    const scene = new THREE.Scene();
    scene.environment = env;
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2, 5, 6);
    const fill = new THREE.HemisphereLight(0xffffff, 0x1a1a24, 0.5);
    const rim = new THREE.PointLight(UV, 25, 0, 1.6); rim.position.set(4, -1, 3);
    scene.add(key, fill, rim);
    const v: View = { el, scene, cam: new THREE.PerspectiveCamera(26, 1, 0.1, 200), pad: [0, 0, 0, 0], clip: () => innerHeight, rx: 0, ry: 0, ...opts };
    views.push(v);
    return v;
  }
  // El objeto mira al puntero (puntero fino) o se balancea solo
  function follow(v: View, t: number, ax = 0.35, ay = 0.22) {
    const live = G.fine && !G.calm;
    v.ry = lerp(v.ry, live ? G.px * ax : Math.sin(t * 0.6) * ax * 0.5, 0.06);
    v.rx = lerp(v.rx, live ? G.py * ay : Math.cos(t * 0.45) * ay * 0.4, 0.06);
  }
  const cardOf = (el: HTMLElement) => G.cards.find((c) => c.el.contains(el));
  const nextTop = (el: HTMLElement) => {
    const i = G.cards.findIndex((c) => c.el.contains(el));
    const n = G.cards[i + 1]?.el ?? document.querySelector(".end");
    return n ? n.getBoundingClientRect().top : innerHeight;
  };

  let font: Font | null = null;
  const ready = new TTFLoader().loadAsync("/home/sg-900.woff").then((j) => (font = new Font(j))).catch(() => null);
  const text3d = (str: string, size: number, depth: number) => {
    const o = { font: font!, size, depth, curveSegments: 14 };
    const shell = new TextGeometry(str, { ...o, bevelEnabled: true, bevelThickness: size * 0.06, bevelSize: size * 0.045, bevelSegments: 6 });
    const core = new TextGeometry(str, { ...o, depth: depth * 0.7, bevelEnabled: false });
    core.translate(0, 0, depth * 0.15);
    return { shell, core };
  };

  // ---- número del hero ----
  const numEl = document.querySelector<HTMLElement>("[data-gl=num]");
  if (numEl) ready.then(() => {
    if (!font) return;
    const grp = new THREE.Group(), v = view(numEl, {
      pad: [0.08, 0.35, 0.08, 0.35],
      box: [1, 1],
      clip: () => (G.cards[0] ? G.cards[0].el.getBoundingClientRect().top : innerHeight),
      tick: (t) => {
        follow(v, t, 0.55, 0.3);
        const p = ease(G.hero);
        grp.rotation.set(v.rx + p * 1.1, v.ry - 0.12 + p * 0.4, 0);
        grp.position.set(0, Math.sin(t * 0.9) * 0.03 + p * 0.6, -p * 4);
      },
    });
    v.scene.add(grp);
    let built = "";
    const build = () => {
      if (built === G.lcp) return;
      built = G.lcp;
      grp.clear();
      const a = text3d(G.lcp, 1, 0.42), s = text3d("s", 0.42, 0.2);
      const n = jelly(a.shell, UV, 1, a.core);
      a.shell.computeBoundingBox();
      const u = jelly(s.shell, RED, 1, s.core); u.position.set(a.shell.boundingBox!.max.x + 0.08, 0, 0.05);
      const inner = new THREE.Group(); inner.add(n, u);
      const box = new THREE.Box3().setFromObject(inner), size = box.getSize(new THREE.Vector3());
      inner.position.sub(box.getCenter(new THREE.Vector3()));
      grp.add(inner);
      v.box = [size.x * 1.08, size.y * 1.6];
      numEl.classList.add("gl");
    };
    G.onLcp = build;
    build();
  });

  // ---- objetos de cada card ----
  document.querySelectorAll<HTMLElement>("[data-gl]").forEach((el) => {
    const kind = el.dataset.gl, card = cardOf(el);
    if (!card) return;
    const rig = new THREE.Group();
    const clip = () => nextTop(el);
    if (kind === "phones") {
      const ph = ["phone-01", "phone-04", "phone-03"].map((n) => iphone(tex(`/home/${n}.png`)));
      ph.forEach((p) => rig.add(p));
      const sh = contactShadow(3.2, 1.1); sh.position.y = -0.9; rig.add(sh);
      const v = view(el, { box: [2.6, 1.75], pad: [0.06, 0.06, 0.06, 0.06], clip, tick: (t) => {
        follow(v, t, 0.35, 0.2);
        const a = ease(card.e), k = card.k;
        ph.forEach((p, i) => {
          const side = i - 1;
          p.position.set(lerp(side * 0.25, side * 0.86, a), Math.sin(t * 0.8 + i) * 0.02 + (i === 1 ? 0.04 : -0.02), lerp(-i * 0.3, i === 1 ? 0.22 : 0, a));
          p.rotation.set(0, lerp(-0.9, side * -0.12, a), lerp(side * 0.1, 0, a));
        });
        rig.rotation.set(lerp(0.55, 0, a) + v.rx * a + k * 0.25, lerp(-1.1, 0, a) + v.ry * a - k * 0.7, 0);
        rig.position.y = lerp(-0.5, 0, a) + k * 0.25;
      } });
      v.scene.add(rig);
    } else if (kind === "mac") {
      const land = tex("/home/qt-landing-01.jpg", (t) => { t.repeat.set(1, 0.247); t.offset.y = 1 - 0.247; });
      const mob = tex("/home/qt-mobile-long.jpg", (t) => { t.repeat.set(1, 0.26); t.offset.y = 1 - 0.26; });
      const mac = macbook(land), ip = iphone(mob, 0.62, 1.31), bills = cash();
      mac.position.set(-0.35, -0.75, 0); ip.position.set(1.55, -0.1, 0.9); ip.rotation.y = -0.25;
      bills.scale.setScalar(0.62); bills.position.set(-1.55, -0.78, 1.15); bills.rotation.y = 0.5;
      const sh = contactShadow(4.6, 2.8); sh.position.y = -0.79; rig.add(mac, ip, bills, sh);
      const v = view(el, { box: [4.8, 3.1], pad: [0.06, 0.06, 0.06, 0.06], clip, tick: (t) => {
        follow(v, t, 0.3, 0.18);
        const a = ease(card.e), k = card.k, u = clamp(card.d * 0.5 + k * 0.6);
        land.offset.y = (1 - 0.247) * (1 - u); mob.offset.y = (1 - 0.26) * (1 - u);
        mac.userData.pivot.rotation.x = lerp(1.5, -0.16, ease(clamp(card.e * 1.25)));
        bills.rotation.y = 0.5 + Math.sin(t * 0.7) * 0.08;
        rig.rotation.set(lerp(0.6, 0.18, a) + v.rx * a + k * 0.2, lerp(-0.9, -0.15, a) + v.ry * a - k * 0.6, 0);
        rig.position.y = lerp(-0.6, 0, a);
      } });
      v.scene.add(rig);
    } else if (kind === "paddle" || kind === "golf" || kind === "plate" || kind === "ig") {
      ready.then(() => {
        const obj = kind === "paddle" ? paddle() : kind === "golf" ? golfBall() : kind === "plate" ? plate(font) : igLogo();
        rig.add(obj);
        const size = kind === "paddle" ? [1.3, 1.9] : kind === "golf" ? [2.3, 2.3] : kind === "plate" ? [2.3, 2.3] : [1.9, 1.9];
        const v = view(el, { box: size as [number, number], clip, tick: (t) => {
          follow(v, t, 0.45, 0.3);
          const a = ease(card.e), spin = card.d * 1.2 + card.k * 0.8;
          rig.rotation.set(lerp(0.9, 0.15, a) + v.rx, lerp(-1.6, -0.35, a) + v.ry + spin + (kind === "golf" ? t * 0.25 : 0), kind === "paddle" ? -0.35 + Math.sin(t * 0.8) * 0.06 : 0);
          rig.position.y = Math.sin(t * 1.1) * 0.06 + lerp(-0.4, 0, a);
          rig.scale.setScalar(lerp(0.6, 1, a));
        } });
        v.scene.add(rig);
      });
    }
  });

  // ---- wordmark del footer ----
  const wmEl = document.querySelector<HTMLElement>("[data-gl=wordmark]");
  if (wmEl) ready.then(() => {
    if (!font) return;
    const grp = new THREE.Group();
    let x = 0;
    for (const [str, color] of [["gom", 0xdcd6ff], [".", RED], ["ar", 0xdcd6ff]] as const) {
      const g = text3d(str, 1, 0.38);
      g.shell.computeBoundingBox();
      const bb = g.shell.boundingBox!, m = jelly(g.shell, color, 1, g.core);
      m.position.x = x - bb.min.x; x += bb.max.x - bb.min.x + 0.04; grp.add(m);
    }
    const box = new THREE.Box3().setFromObject(grp); grp.position.sub(box.getCenter(new THREE.Vector3()));
    const holder = new THREE.Group(); holder.add(grp);
    const v = view(wmEl, { box: [box.getSize(new THREE.Vector3()).x * 1.14, 1.5], tick: (t) => {
      follow(v, t, 0.45, 0.25);
      holder.rotation.set(v.rx, v.ry, 0);
      holder.position.y = Math.sin(t * 0.7) * 0.03;
    } });
    v.scene.add(holder);
    wmEl.classList.add("gl");
  });

  // ---- render: un solo contexto, un recorte por objeto ----
  const clock = new THREE.Clock();
  let raf = 0;
  const resize = () => r.setSize(innerWidth, innerHeight, false);
  addEventListener("resize", resize);
  resize();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime(), W = innerWidth, H = innerHeight;
    r.setScissorTest(false);
    r.clear();
    r.setScissorTest(true);
    for (const v of views) {
      const b = v.el.getBoundingClientRect();
      const x = b.left - b.width * v.pad[0], y = b.top - b.height * v.pad[1];
      const w = b.width * (1 + v.pad[0] + v.pad[2]), h = b.height * (1 + v.pad[1] + v.pad[3]);
      const top = Math.max(y, nav * 0), bottom = Math.min(y + h, H, v.clip());
      if (bottom <= top || x > W || x + w < 0 || w < 2 || h < 2) continue;
      v.tick(t);
      v.cam.aspect = w / h;
      const vf = 2 * Math.tan(THREE.MathUtils.degToRad(v.cam.fov / 2));
      v.cam.position.z = Math.max(v.box[1] / vf, v.box[0] / (vf * v.cam.aspect)) * 1.12;
      v.cam.updateProjectionMatrix();
      r.setViewport(x, H - y - h, w, h);
      r.setScissor(Math.max(0, x), H - bottom, Math.min(w, W - Math.max(0, x)), bottom - top);
      r.render(v.scene, v.cam);
    }
  };
  loop();
  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    r.dispose();
    canvas.remove();
  };
}
