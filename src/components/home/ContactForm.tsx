"use client";
import type { FormEvent } from "react";

type Props = {
  email: string;
  subject: string;
  types: string[];
  labels: { name: string; email: string; type: string; msg: string; send: string; note: string };
};

// shortcut: sin backend todavía (B5: Server Action + Resend); arma el email y lo abre en el programa de correo.
export default function ContactForm({ email, subject, types, labels }: Props) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${f.get("msg")}\n\n${f.get("name")} · ${f.get("email")} · ${f.get("type")}`;
    location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="row2">
        <label htmlFor="f-name">{labels.name}<input id="f-name" name="name" autoComplete="name" required /></label>
        <label htmlFor="f-email">{labels.email}<input id="f-email" name="email" type="email" autoComplete="email" required /></label>
      </div>
      <label htmlFor="f-type">{labels.type}
        <select id="f-type" name="type">{types.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <label htmlFor="f-msg">{labels.msg}<textarea id="f-msg" name="msg" required /></label>
      <button className="b" type="submit">
        <span className="fill" aria-hidden="true" />
        <span className="lbl" aria-hidden="true">{[...labels.send].map((c, i) => <span className="c" style={{ ["--i" as string]: i }} key={i}>{c}</span>)}</span>
        <span className="sr">{labels.send}</span>
      </button>
      <p className="cap">{labels.note}</p>
    </form>
  );
}
