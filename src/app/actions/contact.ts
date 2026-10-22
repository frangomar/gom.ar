"use server";
import { CONTACT_EMAIL } from "@/lib/site";

export type ContactState = "idle" | "ok" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

// Envía el formulario de contacto por la API de Resend; sin dependencias, un fetch.
export async function sendContact(_prev: ContactState, f: FormData): Promise<ContactState> {
  if (str(f, "company", 200)) return "ok"; // honeypot: los bots lo completan, la persona no lo ve
  const name = str(f, "name", 120);
  const email = str(f, "email", 200);
  const type = str(f, "type", 80);
  const msg = str(f, "msg", 5000);
  if (!name || !msg || !EMAIL_RE.test(email)) return "error";

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("contact: falta RESEND_API_KEY");
    return "error";
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // shortcut: onboarding@resend.dev solo entrega a la casilla dueña de la cuenta de Resend; con gom.ar verificado, cargar RESEND_FROM.
      from: process.env.RESEND_FROM ?? "gom.ar <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      reply_to: email,
      subject: `Consulta de ${name} · ${type}`,
      text: `${msg}\n\n${name} · ${email} · ${type}`,
    }),
  }).catch(() => null);
  if (!res?.ok) {
    console.error("contact: Resend respondió", res?.status, await res?.text().catch(() => ""));
    return "error";
  }
  return "ok";
}
