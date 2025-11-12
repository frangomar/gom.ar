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
      className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-6 text-center relative h-[120vh]"
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

      <div className="relative w-full h-[70vh] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        {proyectos.map((p) => {
          const randX = Math.random() * 60 - 30;
          const randY = Math.random() * 60 - 30;

          return (
            <motion.a
              key={p.id}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              drag
              dragConstraints={{ top: -200, bottom: 200, left: -200, right: 200 }}
              dragElastic={0.5}
              whileTap={{ scale: 1.05 }}
              initial={{ opacity: 0, x: randX + "%", y: randY + "%" }}
              animate={{ opacity: 1, x: randX + "%", y: randY + "%", transition: { duration: 0.8 } }}
              className="absolute cursor-grab active:cursor-grabbing"
            >
              <div className="w-72 bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                <div className="aspect-video overflow-hidden">
                  <iframe
                    src={p.link}
                    allowFullScreen
                    scrolling="no"
                    className="w-full h-full border-0"
                  ></iframe>
                </div>
                <div className="p-3 text-left">
                  <h3 className="text-base font-semibold mb-1">{p.titulo}</h3>
                  <p className="text-gray-400 text-xs">{p.descripcion}</p>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

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

