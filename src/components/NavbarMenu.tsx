"use client";
import { useState } from "react";

type Props = {
  links: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
};

export default function NavbarMenu({ links, openLabel, closeLabel }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMenuOpen(true)}
        className="text-white text-3xl md:hidden"
        aria-label={openLabel}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-8 z-50">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-6 text-4xl text-white"
            aria-label={closeLabel}
          >
            ✕
          </button>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-xl hover:text-[#8dff5d]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
