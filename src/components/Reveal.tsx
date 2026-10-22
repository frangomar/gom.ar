"use client";
import { m, type HTMLMotionProps, type Variants } from "framer-motion";
import { track } from "@vercel/analytics";
import type { ReactNode } from "react";

// Wrapper cliente mínimo para las animaciones de entrada existentes. Permite
// que las secciones sean Server Components y solo esto viaje como JS.

type Tag = "section" | "div" | "footer" | "h1" | "h2" | "p" | "a";

export type TrackEvent = "whatsapp_click" | "email_click";

const fade = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
});

const staggerVariants = (staggerChildren: number): Variants => ({
  visible: { transition: { staggerChildren } },
});

type BaseProps = Omit<HTMLMotionProps<"a">, "children" | "variants"> & {
  as?: Tag;
  children?: ReactNode;
};

type RevealGroupProps = BaseProps & {
  // Escalona la entrada de los hijos (RevealItem)...
  stagger?: number;
  // ...o anima el propio contenedor con un fade de este desplazamiento.
  fadeY?: number;
  amount?: number;
};

export function RevealGroup({
  as = "section",
  stagger,
  fadeY,
  amount,
  children,
  ...props
}: RevealGroupProps) {
  const Component = m[as] as typeof m.a;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={amount === undefined ? { once: true } : { once: true, amount }}
      variants={fadeY !== undefined ? fade(fadeY) : staggerVariants(stagger ?? 0)}
      {...props}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = BaseProps & {
  // Si se define, el ítem escalona a sus hijos en vez de hacer fade.
  stagger?: number;
  trackEvent?: TrackEvent;
};

export function RevealItem({
  as = "div",
  stagger,
  trackEvent,
  onClick,
  children,
  ...props
}: RevealItemProps) {
  const Component = m[as] as typeof m.a;
  return (
    <Component
      variants={stagger !== undefined ? staggerVariants(stagger) : fade(20)}
      onClick={(e) => {
        if (trackEvent) track(trackEvent);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
