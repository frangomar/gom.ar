"use client";
import { motion } from "framer-motion";

export default function Footer() {
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.footer
      className="mt-24 py-10 text-center text-sm text-gray-500 border-t border-zinc-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
    >
      <span className="text-[#92ff6b]">© {new Date().getFullYear()}</span> Francisco Gomar
    </motion.footer>
  );
}
