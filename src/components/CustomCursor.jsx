"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });

    const handleEnter = () => setHovering(true);
    const handleLeave = () => setHovering(false);

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
  <>
    {/* Círculo verde */}
    <div
      className="fixed top-0 left-0 w-10 h-10 rounded-full bg-[#92ff6b] mix-blend-difference pointer-events-none z-[9999] transition-transform duration-150 ease-out"
      style={{
        transform: `translate(${pos.x - 20}px, ${pos.y - 20}px) scale(${hovering ? 1.6 : 1})`,
      }}
    />
    {/* Cruz blanca */}
    <div
      className="fixed top-0 left-0 w-px h-6 bg-white pointer-events-none z-[10000]"
      style={{
        transform: `translate(${pos.x}px, ${pos.y - 12}px)`,
      }}
    />
    <div
      className="fixed top-0 left-0 h-px w-6 bg-white pointer-events-none z-[10000]"
      style={{
        transform: `translate(${pos.x - 12}px, ${pos.y}px)`,
      }}
    />
  </>
);
}
