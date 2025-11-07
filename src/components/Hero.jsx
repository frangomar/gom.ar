"use client";
import { motion } from "framer-motion";

export default function Hero() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="hero"
      className="flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      <motion.h1
        variants={fadeIn}
        className="text-4xl md:text-6xl font-bold text-[#92ff6b]"
      >
        Francisco Gomar
      </motion.h1>

      <motion.p
        variants={fadeIn}
        className="text-gray-400 max-w-xl mx-auto mt-6"
      >
        Diseñador gráfico y UX/UI. Transformo ideas en experiencias digitales
        centradas en las personas. Pienso lateral, actúo rápido y diseño para
        dejar huella.
      </motion.p>

        <motion.a
        href="https://wa.me/5491130672095"
        target="_blank"
        rel="noopener noreferrer"
        variants={fadeIn}
        className="mt-10 bg-[#92ff6b] text-black font-semibold px-8 py-3 rounded-full inline-block shadow-[0_0_0px_#92ff6b] transition-all duration-300"
        whileHover={{
    scale: 1.04,
    boxShadow: "0 0 8px #92ff6b",
    transition: { duration: 0.3, ease: 'easeOut' },
  }}
        >
        Escribime por WhatsApp
        </motion.a>

    </motion.section>
  );
}
