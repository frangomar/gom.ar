// Pasa los renders de design/3d/out a public/3d en AVIF + WebP y escribe src/content/3d.json.
// Uso: node design/3d/export.mjs   (después de build.py --seq 25 y --only glyphs,wordmark)
// Presupuesto: still ≤ 120 KB (AVIF 2x) y secuencia ≤ 600 KB (AVIF) por objeto; falla si se pasa.
import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "design/3d/out", PUB = "public/3d";
const SMALL = ["paddle", "plate", "golf", "dumbbell"], BIG = ["phone", "notebook"];
const kb = (f) => statSync(f).size / 1024;
const report = [];

async function save(src, dst, width, q = 50) {
  const img = sharp(src).resize({ width });
  await img.clone().avif({ quality: q, effort: 6 }).toFile(dst + ".avif");
  await img.clone().webp({ quality: q + 22, alphaQuality: 80, effort: 6 }).toFile(dst + ".webp");
  return kb(dst + ".avif");
}

async function object(name, still2x, frameW, q) {
  const dir = join(PUB, name);
  mkdirSync(dir, { recursive: true });
  const frames = readdirSync(join(OUT, name)).filter((f) => /^f\d+\.png$/.test(f)).sort();
  // el still es el cuadro del medio (0°); si hay still.png es ese mismo cuadro renderizado a más resolución (build.py --mid)
  const mid = existsSync(join(OUT, name, "still.png")) ? join(OUT, name, "still.png") : join(OUT, name, frames[(frames.length - 1) / 2]);
  const still = await save(mid, join(dir, "still@2x"), still2x, q);
  await save(mid, join(dir, "still"), still2x / 2, q);
  let seq = 0;
  for (const [i, f] of frames.entries()) seq += await save(join(OUT, name, f), join(dir, `f${String(i).padStart(2, "0")}`), frameW, q - 6);
  report.push({ name, still2x: still.toFixed(1), seq: seq.toFixed(1), frames: frames.length });
  if (still > 120 || seq > 600) throw new Error(`${name} fuera de presupuesto: still ${still.toFixed(1)} KB, secuencia ${seq.toFixed(1)} KB`);
  return frames.length;
}

const meta = { frames: {}, glyphs: {} };
for (const n of SMALL) meta.frames[n] = await object(n, 480, 480, 66);
for (const n of BIG) meta.frames[n] = await object(n, 1600, 800, 46);

// número del hero: un archivo por carácter, 2x y 1x
const g = JSON.parse(readFileSync(join(OUT, "glyphs/glyphs.json"), "utf8"));
mkdirSync(join(PUB, "num"), { recursive: true });
let num = 0;
for (const [n, w] of Object.entries(g.w)) {
  num += await save(join(OUT, "glyphs", n + ".png"), join(PUB, "num", n + "@2x"), w, 55);
  await save(join(OUT, "glyphs", n + ".png"), join(PUB, "num", n), Math.round(w / 2), 55);
}
meta.glyphs = { h: g.h, w: g.w, pad: 0.06 / 1.12 }; // pad de cada lado, en fracción del alto (ver glyphs() en build.py)
report.push({ name: "num (13 caracteres)", still2x: num.toFixed(1) });

mkdirSync(join(PUB, "wordmark"), { recursive: true });
report.push({ name: "wordmark", still2x: (await save(join(OUT, "wordmark.png"), join(PUB, "wordmark/still@2x"), 1600, 50)).toFixed(1) });
await save(join(OUT, "wordmark.png"), join(PUB, "wordmark/still"), 800, 50);

writeFileSync("src/content/3d.json", JSON.stringify(meta, null, 2) + "\n");
console.table(report);
