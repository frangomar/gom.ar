import { getTranslations } from "next-intl/server";
import { RevealGroup, RevealItem } from "./Reveal";
import { BEHANCE_URL } from "@/lib/site";

// Lista estática temporal: reemplaza los iframes de Behance hasta el
// rediseño (los iframes no se indexaban y castigaban el LCP).
const PROYECTOS = [
  {
    key: "quicktradeWeb",
    url: "https://www.behance.net/gallery/194416801/Diseno-Landings-Productos-22",
  },
  {
    key: "quicktradeAguinaldo",
    url: "https://www.behance.net/gallery/179626813/QUICKTRADE-Dolar-MEP-sin-comisiones",
  },
  {
    key: "shantala",
    url: "https://www.behance.net/gallery/180147057/Shantala-SA-Stand-Expo-Presente",
  },
  {
    key: "ayuda3",
    url: "https://www.behance.net/gallery/142606183/AYUDA3-Trabajo-Final-Diseno-y-Com-Visual",
  },
  {
    key: "teaTravel",
    url: "https://www.behance.net/gallery/142604813/Tea-Travel-by-Inti-Zen-Proyecto-Diseno-de-Pack",
  },
] as const;

export default async function Proyectos() {
  const t = await getTranslations("Projects");

  return (
    <RevealGroup
      id="proyectos"
      className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-6 text-center"
      stagger={0.2}
      amount={0.2}
    >
      <RevealItem as="h2" className="text-2xl font-semibold mb-6">
        {t("title")}
      </RevealItem>

      <RevealItem
        as="p"
        className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-10"
      >
        {t("lead")}
      </RevealItem>

      <RevealItem
        stagger={0.1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {PROYECTOS.map((p) => (
          <RevealItem
            key={p.key}
            as="a"
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="block bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#92ff6b]/10 border border-transparent hover:border-[#92ff6b]/30 transition-colors"
          >
            <div className="p-4 text-left">
              <h3 className="text-base font-semibold mb-1">
                {t(`items.${p.key}.title`)}
              </h3>
              <p className="text-gray-400 text-xs">
                {t(`items.${p.key}.description`)}
              </p>
              <span className="inline-block mt-3 text-xs uppercase tracking-wide text-[#92ff6b]">
                {t("viewProject")}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealItem>

      <RevealItem
        as="a"
        href={BEHANCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-10 text-sm uppercase tracking-wide text-[#92ff6b] hover:underline"
      >
        {t("viewAll")}
      </RevealItem>
    </RevealGroup>
  );
}
