import { getTranslations } from "next-intl/server";
import { RevealGroup, RevealItem } from "./Reveal";
import { WHATSAPP_URL } from "@/lib/site";

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <RevealGroup
      id="hero"
      className="flex flex-col items-center justify-center text-center min-h-screen px-6 pt-24"
      stagger={0.2}
    >
      <RevealItem
        as="h1"
        className="text-4xl md:text-6xl font-bold text-[#92ff6b]"
      >
        {t("title")}
      </RevealItem>

      <RevealItem as="p" className="text-gray-400 max-w-xl mx-auto mt-6">
        {t("lead")}
      </RevealItem>

      <RevealItem
        as="a"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        trackEvent="whatsapp_click"
        className="mt-10 bg-[#92ff6b] text-black font-semibold px-8 py-3 rounded-full inline-block shadow-[0_0_0px_#92ff6b] transition-all duration-300"
        whileHover={{
          scale: 1.04,
          boxShadow: "0 0 8px #92ff6b",
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        {t("cta")}
      </RevealItem>
    </RevealGroup>
  );
}
