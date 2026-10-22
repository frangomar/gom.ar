import { getTranslations } from "next-intl/server";
import { RevealGroup, RevealItem } from "./Reveal";
import ContactForm from "./ContactForm";
import TrackedLink from "./TrackedLink";
import { WHATSAPP_URL } from "@/lib/site";

export default async function Contacto() {
  const t = await getTranslations("Contact");

  return (
    <RevealGroup
      id="contacto"
      className="scroll-mt-24 mt-24 max-w-4xl mx-auto py-24 px-6 text-center"
      stagger={0.15}
      amount={0.3}
    >
      <RevealItem as="h2" className="text-2xl font-semibold mb-6">
        {t("title")}
      </RevealItem>

      <RevealItem as="p" className="text-gray-400 max-w-md mx-auto mb-10">
        {t("lead")}
      </RevealItem>

      <ContactForm
        labels={{
          name: t("name"),
          email: t("email"),
          message: t("message"),
          submit: t("submit"),
          thanks1: t("thanks1"),
          thanks2: t("thanks2"),
        }}
      />

      <RevealItem as="p" className="text-gray-500 text-sm mt-8 text-center">
        {t("alsoWhatsapp")}{" "}
        <TrackedLink
          event="whatsapp_click"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#92ff6b] hover:underline"
        >
          {t("whatsapp")}
        </TrackedLink>
        .
      </RevealItem>
    </RevealGroup>
  );
}
