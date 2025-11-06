import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Head>
        <title>Francisco Gomar | Diseñador UX/UI</title>
        <meta name="description" content="Diseñador gráfico y UX/UI. Transformo ideas en diseño centrado en las personas. Pienso lateral, actúo rápido y diseño para dejar huella." />
        <meta name="keywords" content="Francisco Gomar, diseño UX/UI, diseñador gráfico, portfolio Behance, diseño web, branding, Argentina" />
        <meta name="author" content="Francisco Gomar" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (para compartir en redes) */}
        <meta property="og:title" content="Francisco Gomar | Diseñador UX/UI" />
        <meta property="og:description" content="Diseñador gráfico y UX/UI. Transformo ideas en diseño centrado en las personas. Pienso lateral, actúo rápido y diseño para dejar huella." />
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://gom.ar" />
        <meta property="og:image" content="https://gom.ar/og-image.png" /> {/* Cambiá esto cuando tengas imagen */}

        {/* GEO targeting (opcional) */}
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />

        <link rel="canonical" href="https://gom.ar" />
      </Head>

      <div className="bg-black text-white min-h-screen scroll-smooth">
        <Navbar />

        {/* HERO */}
        <main className="pt-24 px-6 text-center">
          <motion.section
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="text-center space-y-6">
    <h1 className="text-4xl md:text-6xl font-bold text-[#8dff5d]">Francisco Gomar</h1>
    <p className="text-gray-400 max-w-xl mx-auto">
      Diseñador gráfico y UX/UI. Transformo ideas en diseño centrado en las personas. Pienso lateral, actúo rápido y diseño para dejar huella.
    </p>
    <a
      href="https://www.behance.net/franciscogomar"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#8dff5d] text-black font-semibold px-6 py-3 rounded-full inline-block"
   whileHover={{
  scale: 1.1,
  rotate: [0, 5, -5, 3, -3, 0],
  backgroundColor: "#bbff88",
  color: "#000000",
  transition: { duration: 0.6, ease: "easeInOut" },
}}
    >
      Ver portfolio en Behance
    </a>
  </motion.section>

          {/* SECCIÓN SOBRE MÍ */}
          <motion.section
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
     id="sobre" className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-4 justify-center">
            <h2 className="text-2xl font-semibold">Sobre mí</h2>
            <p className="text-gray-400">Soy diseñador gráfico con enfoque UX/UI. Trabajo con marcas, emprendedores y productos digitales para crear experiencias claras, usables y con identidad.</p>
          </motion.section>

          {/* SECCIÓN PROYECTOS */}
<section id="proyectos" className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-4">
  <h2 className="text-2xl font-semibold mb-6">Proyectos</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Proyecto 1 */}
    <motion.div
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }} className="bg-zinc-900 rounded overflow-hidden shadow-md">
      <div className="aspect-video overflow-hidden">
        <iframe
          src="https://www.behance.net/embed/project/194416801?ilo0=1"
          allowFullScreen
          scrolling="no"
          className="w-full h-full border-0"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">PopMeals Rediseño UX</h3>
        <p className="text-gray-400 text-sm">
          UX/UI completo para sistema de pedidos y flujos Cashless + Precompra.
        </p>
      </div>
      </motion.div>

    {/* Proyecto 2 */}
    <motion.div
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}  className="bg-zinc-900 rounded overflow-hidden shadow-md">
      <div className="aspect-video overflow-hidden">
        <iframe
          src="https://www.behance.net/embed/project/179626813?ilo0=1"
          allowFullScreen
          scrolling="no"
          className="w-full h-full border-0"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">UX para ecommerce gourmet</h3>
        <p className="text-gray-400 text-sm">
          Diseño de experiencia y branding para tienda gourmet internacional.
        </p>
      </div>
    </motion.div>

    {/* Proyecto 3 */}
    <motion.div
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }} className="bg-zinc-900 rounded overflow-hidden shadow-md">
      <div className="aspect-video overflow-hidden">
        <iframe
          src="https://www.behance.net/embed/project/180147057?ilo0=1"
          allowFullScreen
          scrolling="no"
          className="w-full h-full border-0"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">Sistema de identidad</h3>
        <p className="text-gray-400 text-sm">
          Sistema visual integral para producto digital y presencia de marca.
        </p>
      </div>
    </motion.div>

    {/* Proyecto 4 */}
    <motion.div
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }} className="bg-zinc-900 rounded overflow-hidden shadow-md">
      <div className="aspect-video overflow-hidden">
        <iframe
          src="https://www.behance.net/embed/project/142606183?ilo0=1"
          allowFullScreen
          scrolling="no"
          className="w-full h-full border-0"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">Aplicación de reservas</h3>
        <p className="text-gray-400 text-sm">
          UX para app de reservas con foco en claridad y accesibilidad.
        </p>
      </div>
    </motion.div>

    {/* Proyecto 5 */}
    <motion.div
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }} className="bg-zinc-900 rounded overflow-hidden shadow-md">
      <div className="aspect-video overflow-hidden">
        <iframe
          src="https://www.behance.net/embed/project/142604813?ilo0=1"
          allowFullScreen
          scrolling="no"
          className="w-full h-full border-0"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">Landing producto wellness</h3>
        <p className="text-gray-400 text-sm">
          Diseño de interfaz y branding para producto de bienestar.
        </p>
      </div>
    </motion.div>
  </div>
</section>

          {/* SECCIÓN CONTACTO */}
          <section id="contacto" className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold">Contacto</h2>
            <p className="text-gray-400">¿Tenés un proyecto? Escribime y te respondo hoy.</p>
            <form
              action="https://formsubmit.co/frangomar8@gmail.com"
              method="POST"
              className="space-y-4"
            >
              <input type="text" name="_honey" style={{ display: "none" }} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://gom.ar/gracias" />
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                required
                className="w-full px-4 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
              />
              <input
                type="email"
                name="email"
                placeholder="Tu email"
                required
                className="w-full px-4 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
              />
              <textarea
                name="mensaje"
                rows="4"
                placeholder="Contame en 2 o 3 líneas qué necesitás"
                required
                className="w-full px-4 py-2 rounded bg-zinc-900 text-white border border-zinc-700"
              ></textarea>
              <button
                type="submit"
                className="bg-[#8dff5d] text-black font-semibold px-16 py-3 rounded-full"
              >
                Enviar mensaje
              </button>
            </form>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="mt-24 py-10 text-center text-sm text-gray-500 border-t border-zinc-800">
          © {new Date().getFullYear()} Francisco Gomar — Hecho con Next.js
        </footer>
      </div>
    </>
  );
}