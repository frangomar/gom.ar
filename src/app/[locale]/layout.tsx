import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { publishedLocales } from "@/i18n/routing";
import MotionProvider from "@/components/MotionProvider";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Solo se generan los idiomas publicados; cualquier otro valor del segmento
// (/en, /pt, /fr, /zh o una URL inexistente) devuelve 404 sin render dinámico.
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

  return (
    <html lang={locale}>
      <body className="antialiased">
        {/* messages={null}: los componentes cliente reciben los textos por
            props, así no se manda el catálogo de mensajes al navegador. */}
        <NextIntlClientProvider messages={null}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        <JsonLd />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
