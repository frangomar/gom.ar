import { getTranslations } from "next-intl/server";
import { RevealGroup, RevealItem } from "./Reveal";

export default async function SobreMi() {
  const t = await getTranslations("About");

  return (
    <RevealGroup
      id="sobre"
      className="scroll-mt-24 mt-24 max-w-6xl mx-auto px-6 text-center"
      stagger={0.2}
      amount={0.3}
    >
      <RevealItem as="h2" className="text-2xl font-semibold mb-6">
        {t("title")}
      </RevealItem>

      <RevealItem
        as="p"
        className="text-gray-400 max-w-2xl mx-auto leading-relaxed"
      >
        {t("p1")}
        <br />
        {t("p2")}
      </RevealItem>
    </RevealGroup>
  );
}
