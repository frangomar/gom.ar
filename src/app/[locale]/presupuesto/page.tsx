import type { Metadata } from "next";
import { preconnect } from "react-dom";
import CarrotPlayPropuesta from "@/components/CarrotPlayPropuesta";

// Propuesta privada para un cliente: fuera del sitemap y sin indexar.
export const metadata: Metadata = {
  title: "CarrotPlay · Propuesta de diseño",
  robots: { index: false, follow: false },
};

export default function Presupuesto() {
  preconnect("https://api.fontshare.com");

  return (
    <>
      {/* Satoshi es la tipografía de esta propuesta; React la sube al <head>. */}
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,700,701,900&display=swap"
        precedence="default"
      />
      <CarrotPlayPropuesta />
    </>
  );
}
