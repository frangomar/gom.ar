import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Schibsted_Grotesk } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { publishedLocales } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Variable 400–900, un solo archivo por subset.
const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-schibsted",
});

// Solo se generan los idiomas publicados; cualquier otro valor del segmento
// (/pt, /fr, /zh o una URL inexistente) devuelve 404 sin render dinámico.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLocales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "Francisco Gomar", url: SITE_URL }],
  creator: "Francisco Gomar",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(publishedLocales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Layout");

  return (
    <html lang={locale} className={schibsted.variable}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {t("skip")}
        </a>
        {/* messages={null}: los componentes cliente reciben los textos por
            props, así no se manda el catálogo de mensajes al navegador. */}
        <NextIntlClientProvider messages={null}>{children}</NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
