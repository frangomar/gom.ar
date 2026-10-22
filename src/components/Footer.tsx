import { getTranslations } from "next-intl/server";
import { RevealGroup } from "./Reveal";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <RevealGroup
      as="footer"
      fadeY={10}
      className="mt-24 py-10 text-center text-sm text-gray-500 border-t border-zinc-800"
    >
      <span className="text-[#92ff6b]">© {new Date().getFullYear()}</span>{" "}
      {t("name")}
    </RevealGroup>
  );
}
