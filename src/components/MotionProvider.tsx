"use client";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

// Respeta prefers-reduced-motion en todas las animaciones de framer-motion.
// LazyMotion + domAnimation carga solo las features que usan los componentes
// `m` (animaciones, hover, inView), no el bundle completo de motion.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
