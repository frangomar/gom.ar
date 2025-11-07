'use client';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/95 text-white"> 
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-[#8dff5d]">Gom.ar</h1>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-3xl md:hidden"
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <nav className="hidden md:flex space-x-8 text-sm">
          <a href="#sobre" className="hover:text-[#8dff5d]">Sobre mí</a>
          <a href="#proyectos" className="hover:text-[#8dff5d]">Proyectos</a>
          <a href="#contacto" className="hover:text-[#8dff5d]">Contacto</a>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-8 z-50">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-6 text-4xl text-white"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
          <a href="#sobre" onClick={() => setMenuOpen(false)} className="text-xl hover:text-[#8dff5d]">Sobre mí</a>
          <a href="#proyectos" onClick={() => setMenuOpen(false)} className="text-xl hover:text-[#8dff5d]">Proyectos</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)} className="text-xl hover:text-[#8dff5d]">Contacto</a>
        </div>
      )}
    </header>
  );
}
