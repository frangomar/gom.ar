"use server";
import { headers } from "next/headers";
import { CONTACT_EMAIL } from "@/lib/site";

export type ContactState = "idle" | "ok" | "error" | "limit";

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
// Saca caracteres de control (incluidos saltos de línea en campos de una línea) y recorta.
const clean = (v: FormDataEntryValue | null, max: number, multiline = false) =>
  String(v ?? "")
    .replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, max);

// shortcut: límite en memoria por instancia serverless, no global; si hay abuso real, pasar a Upstash/Vercel KV o una regla del Firewall de Vercel.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // evita que el mapa crezca sin techo
  return recent.length > MAX_PER_WINDOW;
}

async function humanCheck(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("contact: falta TURNSTILE_SECRET_KEY, se envía sin verificar");
    return true;
  }
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => null)) as { success?: boolean } | null;
  return data?.success === true;
}

// Envía el formulario de contacto por la API de Resend; sin dependencias, un fetch.
export async function sendContact(_prev: ContactState, f: FormData): Promise<ContactState> {
  if (clean(f.get("company"), 200)) return "ok"; // honeypot: los bots lo completan, la persona no lo ve
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return "limit";

  const name = clean(f.get("name"), 120);
  const email = clean(f.get("email"), 200);
  const type = clean(f.get("type"), 80);
  const msg = clean(f.get("msg"), 5000, true);
  if (!name || !msg || !EMAIL_RE.test(email)) return "error";
  if (!(await humanCheck(clean(f.get("cf-turnstile-response"), 2048), ip))) return "error";

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("contact: falta RESEND_API_KEY");
    return "error";
  }
  // Va como texto plano (sin HTML), así nada de lo que escriban se ejecuta en el cliente de correo.
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // shortcut: onboarding@resend.dev solo entrega a la casilla dueña de la cuenta de Resend; con gom.ar verificado, cargar RESEND_FROM.
      from: process.env.RESEND_FROM ?? "gom.ar <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      reply_to: email,
      subject: `Consulta de ${name} · ${type}`,
      text: `${msg}\n\n${name} · ${email} · ${type}\nIP: ${ip}`,
    }),
  }).catch(() => null);
  if (!res?.ok) {
    console.error("contact: Resend respondió", res?.status, await res?.text().catch(() => ""));
    return "error";
  }
  return "ok";
}
