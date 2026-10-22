"use client";
import { m, type Variants } from "framer-motion";
import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type Props = {
  labels: {
    name: string;
    email: string;
    message: string;
    submit: string;
    thanks1: string;
    thanks2: string;
  };
};

export default function ContactForm({ labels }: Props) {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  if (sent) {
    return (
      <m.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-[#92ff6b]/10 border border-[#92ff6b]/40 text-[#92ff6b] rounded-lg py-8 px-6 max-w-md mx-auto mt-8"
      >
        <p className="text-lg font-medium">
          {labels.thanks1} <br /> {labels.thanks2}
        </p>
      </m.div>
    );
  }

  return (
    <m.form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-lg mx-auto text-left"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <m.input
        variants={fadeIn}
        type="text"
        name="nombre"
        placeholder={labels.name}
        required
        className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:border-[#92ff6b] transition"
      />

      <m.input
        variants={fadeIn}
        type="email"
        name="email"
        placeholder={labels.email}
        required
        className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:border-[#92ff6b] transition"
      />

      <m.textarea
        variants={fadeIn}
        name="mensaje"
        rows={4}
        placeholder={labels.message}
        required
        className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:border-[#92ff6b] transition"
      ></m.textarea>

      <m.div variants={fadeIn} className="flex justify-center">
        <button
          type="submit"
          className="bg-[#92ff6b] text-black font-semibold px-12 py-3 rounded-full hover:scale-105 transition-transform"
        >
          {labels.submit}
        </button>
      </m.div>
    </m.form>
  );
}
