"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contacto() {
  const [sent, setSent] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await fetch("https://formsubmit.co/ajax/frangomar8@gmail.com", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      setSent(true);
      e.target.reset();
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <motion.section
      id="contacto"
      className="scroll-mt-24 mt-24 max-w-4xl mx-auto py-24 px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <motion.h2 variants={fadeIn} className="text-2xl font-semibold mb-6">
        Contacto
      </motion.h2>

      <motion.p variants={fadeIn} className="text-gray-400 max-w-md mx-auto mb-10">
        ¿Querés hablar sobre un proyecto, colaboración o simplemente intercambiar
        ideas? Enviame un mensaje y te respondo personalmente.
      </motion.p>

      {!sent ? (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-lg mx-auto text-left"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.input
            variants={fadeIn}
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            required
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:border-[#92ff6b] transition"
          />

          <motion.input
            variants={fadeIn}
            type="email"
            name="email"
            placeholder="Tu email"
            required
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:border-[#92ff6b] transition"
          />

          <motion.textarea
            variants={fadeIn}
            name="mensaje"
            rows="4"
            placeholder="Contame en 2 o 3 líneas qué necesitás"
            required
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:border-[#92ff6b] transition"
          ></motion.textarea>

          <motion.div variants={fadeIn} className="flex justify-center">
            <button
              type="submit"
              className="bg-[#92ff6b] text-black font-semibold px-12 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Enviar mensaje
            </button>
          </motion.div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-[#92ff6b]/10 border border-[#92ff6b]/40 text-[#92ff6b] rounded-lg py-8 px-6 max-w-md mx-auto mt-8"
        >
          <p className="text-lg font-medium">
            Gracias por tu mensaje. <br /> Te voy a responder personalmente en breve.
          </p>
        </motion.div>
      )}

      <motion.p variants={fadeIn} className="text-gray-500 text-sm mt-8 text-center">
        También podés escribirme directo por{" "}
        <a
          href="https://wa.me/5491130672095"
          target="_blank"
          className="text-[#92ff6b] hover:underline"
        >
          WhatsApp
        </a>.
      </motion.p>
    </motion.section>
  );
}
