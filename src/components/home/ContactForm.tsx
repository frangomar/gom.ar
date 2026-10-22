"use client";
import { useActionState, useEffect, useRef, startTransition, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { sendContact, type ContactState } from "@/app/actions/contact";

type Props = {
  email: string;
  types: string[];
  labels: { name: string; email: string; type: string; msg: string; send: string; sending: string; ok: string; error: string; limit: string };
};

type Turnstile = { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm({ email, types, labels }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, "idle");
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => { if (state === "ok") track("form_submit"); }, [state]);
  // El token de Turnstile es de un solo uso: tras un intento fallido se pide otro.
  useEffect(() => { if ((state === "error" || state === "limit") && widget.current) window.turnstile?.reset(widget.current); }, [state]);

  // Carga Turnstile recién cuando el form se acerca a la pantalla, fuera del camino del LCP.
  useEffect(() => {
    const el = box.current;
    if (!SITE_KEY || !el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const render = () => { widget.current = window.turnstile!.render(el, { sitekey: SITE_KEY, theme: "dark", appearance: "interaction-only" }); };
      if (window.turnstile) return render();
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }, { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // onSubmit en vez de action={}: React resetea el form tras una action y se perdería el mensaje si falla.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }
  const send = pending ? labels.sending : labels.send;

  if (state === "ok") return <p className="cap" role="status">{labels.ok}</p>;

  return (
    <form onSubmit={onSubmit}>
      <div className="row2">
        <label htmlFor="f-name">{labels.name}<input id="f-name" name="name" autoComplete="name" maxLength={120} required /></label>
        <label htmlFor="f-email">{labels.email}<input id="f-email" name="email" type="email" autoComplete="email" maxLength={200} required /></label>
      </div>
      <label htmlFor="f-type">{labels.type}
        <select id="f-type" name="type">{types.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <label htmlFor="f-msg">{labels.msg}<textarea id="f-msg" name="msg" maxLength={5000} required /></label>
      {/* honeypot: fuera de pantalla y fuera del orden de Tab */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      <div ref={box} />
      <button className="b" type="submit" disabled={pending}>
        <span className="fill" aria-hidden="true" />
        <span className="lbl" aria-hidden="true">{[...send].map((c, i) => <span className="c" style={{ ["--i" as string]: i }} key={i}>{c}</span>)}</span>
        <span className="sr">{send}</span>
      </button>
      <p className="cap" aria-live="polite">
        {state === "error" && <>{labels.error} <a className="u" href={`mailto:${email}`}>{email}</a></>}
        {state === "limit" && labels.limit}
      </p>
    </form>
  );
}
