"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Proyectos() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const proyectosBase = [
    {
      id: 1,
      titulo: "QUICKTRADE - WEB",
      descripcion:
        "Diseño de sitio de productos financieros para Grupo SBS - Quicktrade.",
      link: "https://www.behance.net/embed/project/194416801?ilo0=1",
    },
    {
      id: 2,
      titulo: "QUICKTRADE - AGUINALDO",
      descripcion:
        "Campaña digital: redes, web y mailing para Grupo SBS - Quicktrade.",
      link: "https://www.behance.net/embed/project/179626813?ilo0=1",
    },
    {
      id: 3,
      titulo: "SHANTALA - EXPO PRESENTES",
      descripcion:
        "Diseño de stand 3D + gráfica para exposición en rubro Wellness.",
      link: "https://www.behance.net/embed/project/180147057?ilo0=1",
    },
    {
      id: 4,
      titulo: "AYUDA3 - PROYECTO FINAL",
      descripcion:
        "Manual de supervivencia a la vida adulta. Proyecto colaborativo.",
      link: "https://www.behance.net/embed/project/142606183?ilo0=1",
    },
    {
      id: 5,
      titulo: "TEA TRAVEL - INTIZEN",
      descripcion:
        "Nuevo producto + campaña 360. Proyecto colaborativo.",
      link: "https://www.behance.net/embed/project/142604813?ilo0=1",
    },
  ];

  // Mezcla aleatoria al montar el componente
  const [proyectos, setProyectos] = useState([]);
  useEffect(() => {
    const mezclados = [...proyectosBase].sort(() => Math.random() - 0.5);
    setProyectos(mezclados);
  }, []);

  return (
    <motion.section
      id="proyectos"
      className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      <motion.h2 variants={fadeIn} className="text-2xl font-semibold mb-6">
        Proyectos
      </motion.h2>

      <motion.p
        variants={fadeIn}
        className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-10"
      >
        Algunos proyectos seleccionados que combinan identidad visual, diseño
        UX/UI y una mirada centrada en las personas.
      </motion.p>

      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {proyectos.map((p) => (
          <motion.a
            key={p.id}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeIn}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="block bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#92ff6b]/10 border border-transparent hover:border-[#92ff6b]/30 transition-colors"
          >
            <div className="aspect-video overflow-hidden">
              <iframe
                src={p.link}
                allowFullScreen
                scrolling="no"
                className="w-full h-full border-0"
              ></iframe>
            </div>
            <div className="p-4 text-left">
              <h3 className="text-base font-semibold mb-1">{p.titulo}</h3>
              <p className="text-gray-400 text-xs">{p.descripcion}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>

      <motion.a
        href="https://www.behance.net/franciscogomar"
        target="_blank"
        variants={fadeIn}
        className="inline-block mt-10 text-sm uppercase tracking-wide text-[#92ff6b] hover:underline"
      >
        Ver todos los proyectos en Behance →
      </motion.a>
    </motion.section>
  );
}

