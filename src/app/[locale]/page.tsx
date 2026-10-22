import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import TrackedLink from "@/components/TrackedLink";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // El layout ya validó el locale contra publishedLocales.
  const locale = (await params).locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return pageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    siteName: t("siteName"),
  });
}

// shortcut: página mínima del Bloque 1, la reemplaza la home del Bloque 3.
export default async function Home({ params }: Props) {
  const locale = (await params).locale as AppLocale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main
      id="main"
      className="flex min-h-svh flex-col justify-end gap-8 bg-link px-(--gutter) py-16 text-paper"
    >
      <p className="text-h3 font-extrabold">
        gom<span className="text-paper-dim">.</span>ar
      </p>
      <h1 className="max-w-[18ch] text-h1 font-bold">{t("h1")}</h1>
      <p className="max-w-[60ch] text-lead">{t("lead")}</p>
      <p className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <TrackedLink
          event="whatsapp_click"
          href={WHATSAPP_URL}
          className="bg-paper px-6 py-3 font-semibold text-link no-underline"
        >
          {t("whatsapp")}
        </TrackedLink>
        <TrackedLink
          event="email_click"
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-paper"
        >
          {t("email")}
        </TrackedLink>
      </p>
      <JsonLd />
    </main>
  );
}
