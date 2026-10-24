"use client";
import { useEffect, useState, type ComponentType } from "react";

// Analytics y Speed Insights se bajan después de `load`: no cuentan para el TBT ni compiten con el primer pintado.
export default function Telemetry() {
  const [els, setEls] = useState<ComponentType[]>([]);
  useEffect(() => {
    const go = () => Promise.all([import("@vercel/analytics/next"), import("@vercel/speed-insights/next")])
      .then(([a, s]) => setEls([a.Analytics, s.SpeedInsights]));
    if (document.readyState === "complete") go(); else addEventListener("load", go, { once: true });
  }, []);
  return <>{els.map((E, i) => <E key={i} />)}</>;
}
