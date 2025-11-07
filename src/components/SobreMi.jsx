"use client";
import { motion } from "framer-motion";

export default function SobreMi() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="sobre"
      className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      <motion.h2
        variants={fadeIn}
        className="text-2xl font-semibold mb-6"
      >
        Sobre mí
      </motion.h2>

      <motion.p
        variants={fadeIn}
        className="text-gray-400 max-w-2xl mx-auto leading-relaxed"
      >
        Soy diseñador gráfico con enfoque UX/UI. Trabajo con marcas,
        emprendedores y productos digitales para crear experiencias claras,
        usables y con identidad.  
        <br />
        Me motiva transformar ideas en soluciones visuales simples, funcionales
        y con propósito.
      </motion.p>
    </motion.section>
  );
}
