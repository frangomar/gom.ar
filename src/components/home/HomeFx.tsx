"use client";
import { useEffect } from "react";

export type BandCase = { title: string; brand: string; key: string; meta: string };

// Estado compartido con la escena 3D (src/components/home/scene.ts).
export type FxState = {
  hero: number;
  px: number;
  py: number;
  fine: boolean;
  calm: boolean;
  lcp: string;
  onLcp?: () => void;
  cards: { el: HTMLElement; e: number; k: number; d: number }[];
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const EASE = "cubic-bezier(.2,.7,0,1)";

// Letras del rodillo: misma estructura que renderiza el servidor (.m > .c).
function setChars(el: HTMLElement, text: string) {
  el.textContent = "";
  for (const ch of text) {
    const m = document.createElement("span");
    m.className = "m";
    const c = document.createElement("span");
    c.className = "./".includes(ch) ? "c dim" : "c";
    c.textContent = ch;
    m.append(c);
    el.append(m);
  }
}
function rollTo(el: HTMLElement, text: string) {
  const out = [...el.querySelectorAll<HTMLElement>(".c")].map((c, k) =>
    c.animate([{ transform: "none" }, { transform: "translateY(-110%)" }], { duration: 320, delay: k * 18, easing: "cubic-bezier(.6,0,.8,.3)", fill: "forwards" }).finished,
  );
  Promise.all(out).then(() => {
    setChars(el, text);
    el.querySelectorAll<HTMLElement>(".c").forEach((c, k) =>
      c.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { duration: 560, delay: k * 24, easing: EASE, fill: "backwards" }),
    );
  });
}

export default function HomeFx({ band }: { band: BandCase[] }) {
  useEffect(() => {
    const doc = document.documentElement;
    const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;
    const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];
    const ac = new AbortController(), on = { signal: ac.signal, passive: true } as const;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const observers: IntersectionObserver[] = [];
    doc.classList.add("js");

    const cards = $$(".card");
    const G: FxState = { hero: 0, px: 0, py: 0, fine, calm, lcp: "0,00", cards: cards.map((el) => ({ el, e: 0, k: 0, d: 0 })) };

    // ---- tiempo real de carga (LCP) ----
    const tflat = $("#tflat"), tsr = $("#tsr");
    const po = new PerformanceObserver((l) => {
      const ms = l.getEntries().at(-1)!.startTime;
      G.lcp = (ms / 1000).toLocaleString(doc.lang === "en" ? "en-US" : "es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      tflat.textContent = G.lcp;
      tsr.textContent = (tsr.dataset.tpl ?? "").replace("{s}", G.lcp);
      G.onLcp?.();
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });

    // ---- scroll: hero que se disuelve, mazo de cards, scrollbar que cambia de color ----
    const end = $(".end"), hmain = $("#hmain"), bandEl = $("#band"), bio = $("#bio"), bioWords = $$("#bio .bw");
    let litNow = -1;
    const RED = [255, 43, 78], UV = [122, 92, 255];
    let raf = 0;
    function frame() {
      raf = 0;
      const vh = innerHeight, top = parseFloat(getComputedStyle(doc).getPropertyValue("--top")) || 84;
      const p = clamp(scrollY / (vh * 0.45));
      G.hero = p;
      if (!calm) {
        hmain.style.transform = `translateY(${-p * 9}vh) scale(${1 - p * 0.07})`;
        hmain.style.opacity = String(1 - p);
        bandEl.style.opacity = String(1 - p * 1.3);
      }
      G.cards.forEach((c, i) => {
        const r = c.el.getBoundingClientRect(), next = (cards[i + 1] ?? end).getBoundingClientRect().top;
        const gap = vh * 0.28;
        c.e = clamp((vh - r.top) / (vh - top)); // entrando: 0 abajo, 1 fija
        c.d = clamp((top + r.height + gap - next) / Math.max(1, top + r.height + gap - vh)); // tiempo sola en pantalla
        c.k = clamp((vh - next) / (vh - top)); // la tapa la siguiente
        c.el.style.setProperty("--cov", calm ? "0" : c.k.toFixed(3));
        c.el.style.setProperty("--ent", c.e.toFixed(3));
        c.el.querySelectorAll<HTMLElement>(".wall .col").forEach((col) => col.style.setProperty("--y", `${(c.e + c.d + c.k - 1.2) * 18 * Number(col.dataset.dir)}%`));
      });
      // bio: las palabras se encienden en orden mientras el párrafo cruza la pantalla
      const br = bio.getBoundingClientRect(), bp = clamp((vh * 0.85 - br.top) / (vh * 0.4 + br.height));
      const lit = calm ? bioWords.length : Math.round(bp * bioWords.length);
      if (lit !== litNow) { litNow = lit; bioWords.forEach((w, i) => w.classList.toggle("on", i < lit)); }
      const t = clamp(scrollY / Math.max(1, doc.scrollHeight - vh)), f = (1 - Math.cos(t * Math.PI * 4)) / 2;
      doc.style.setProperty("--sb", `rgb(${UV.map((v, i) => Math.round(v + (RED[i] - v) * f * 0.6)).join(",")})`);
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", queue, on);
    addEventListener("resize", queue, on);
    frame();
    addEventListener("pointermove", (e) => { G.px = (e.clientX / innerWidth) * 2 - 1; G.py = (e.clientY / innerHeight) * 2 - 1; }, on);

    // ---- botones: relleno desde donde entra el cursor, imán y rebote ----
    $$(".b").forEach((b) => {
      b.addEventListener("pointerenter", (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--x", `${e.clientX - r.left}px`);
        b.style.setProperty("--y", `${e.clientY - r.top}px`);
        b.style.setProperty("--d", `${Math.hypot(r.width, r.height) * 2.2}px`);
      }, on);
      if (fine && !calm) {
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          b.style.setProperty("--mx", `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
          b.style.setProperty("--my", `${(e.clientY - r.top - r.height / 2) * 0.38}px`);
        }, on);
        b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); }, on);
      }
      b.addEventListener("pointerdown", () => { b.classList.remove("burst"); void b.offsetWidth; b.classList.add("burst"); }, on);
    });
    const face = $("#face");
    if (fine && !calm) {
      face.addEventListener("pointermove", (e) => {
        const r = face.getBoundingClientRect();
        face.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
        face.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 16}deg`);
      }, on);
      face.addEventListener("pointerleave", () => { face.style.setProperty("--rx", "0deg"); face.style.setProperty("--ry", "0deg"); }, on);
    }

    // ---- el dominio de cada caso entra en el ancho del texto ----
    const fitDom = () => $$(".card .dom").forEach((h) => {
      h.style.fontSize = "";
      const widest = Math.max(...[...h.querySelectorAll<HTMLElement>(".roll")].map((r) => r.scrollWidth)), avail = h.clientWidth;
      if (widest > avail) h.style.fontSize = `${(parseFloat(getComputedStyle(h).fontSize) * avail) / widest * 0.97}px`;
    });
    const domain = $(".band .domain .roll"), meta = $("#meta"), logos = $$("#logos li");
    const fitBand = () => {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;font-weight:780;letter-spacing:-.035em;font-size:100px;white-space:nowrap";
      document.body.append(probe);
      const w = Math.max(...band.map((c) => ((probe.textContent = c.title), probe.offsetWidth)));
      probe.remove();
      bandEl.style.setProperty("--bfs", `${Math.min(44, (bandEl.firstElementChild!.clientWidth * 100) / w)}px`);
    };
    document.fonts.ready.then(() => { fitDom(); fitBand(); });
    addEventListener("resize", () => { fitDom(); fitBand(); }, on);

    // ---- textos que entran al verse ----
    const go = (els: HTMLElement[], step: number) => els.forEach((c, k) =>
      c.animate([{ transform: "translateY(115%)" }, { transform: "none" }], { duration: 700, delay: k * step, easing: EASE, fill: "forwards" }));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (calm) return;
      go([...e.target.querySelectorAll<HTMLElement>(".c")], 22);
    }), { threshold: 0.3 });
    $$(".roll-in").forEach((el) => io.observe(el));
    observers.push(io);

    // ---- servicios: el ítem del centro de la pantalla manda el visual ----
    const items = $$(".svc-item"), vis = $$(".vis .v");
    const sio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      items.forEach((it) => it.classList.toggle("on", it === e.target));
      vis.forEach((v, i) => v.classList.toggle("on", i === Number((e.target as HTMLElement).dataset.v)));
    }), { rootMargin: "-45% 0px -45% 0px" });
    items.forEach((it) => sio.observe(it));
    observers.push(sio);

    // ---- franja del hero: rota entre marcas con el rodillo; se pausa con el botón o al salir del hero ----
    let h = 0, playing = true;
    const pz = $<HTMLButtonElement>("[data-pause]"), pauseLabel = pz.getAttribute("aria-label")!;
    pz.addEventListener("click", () => {
      playing = !playing;
      pz.setAttribute("aria-label", playing ? pauseLabel : pz.dataset.play!);
      pz.setAttribute("aria-pressed", String(!playing));
    }, { signal: ac.signal });
    if (!calm) timers.push(window.setInterval(() => {
      if (!playing || scrollY > innerHeight * 0.3 || document.hidden) return;
      h = (h + 1) % band.length;
      const c = band[h];
      bandEl.style.setProperty("--brand", c.brand);
      logos.forEach((li) => li.classList.toggle("on", li.dataset.k === c.key));
      meta.textContent = c.meta;
      rollTo(domain, c.title);
    }, 3200));

    // ---- WhatsApp flotante: fuera del hero, de las cards y del contacto ----
    const fab = $(".fab"), contact = $(".contact"), deck = $("#casos");
    addEventListener("scroll", () => {
      const d = deck.getBoundingClientRect(), mid = innerHeight * 0.5;
      fab.classList.toggle("show", scrollY > innerHeight * 0.8 && contact.getBoundingClientRect().top > innerHeight * 0.9 && !(d.top < mid && d.bottom > mid));
    }, on);

    // ---- 3D: se carga después de que la página terminó de cargar, en un chunk aparte ----
    let stop: (() => void) | undefined, dead = false;
    const boot = () => import("./scene").then((m) => { if (!dead) stop = m.start(G); }).catch(() => {});
    const later = () => ("requestIdleCallback" in window ? requestIdleCallback(boot, { timeout: 1500 }) : setTimeout(boot, 300));
    if (document.readyState === "complete") later(); else addEventListener("load", later, { once: true, signal: ac.signal });

    return () => {
      dead = true;
      ac.abort();
      po.disconnect();
      observers.forEach((o) => o.disconnect());
      timers.forEach(clearInterval);
      cancelAnimationFrame(raf);
      stop?.();
    };
  }, [band]);
  return null;
}
