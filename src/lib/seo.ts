import type { Metadata } from "next";
import {
  ogLocales,
  publishedLocales,
  routing,
  type AppLocale,
} from "@/i18n/routing";

type PageMetadataInput = {
  locale: AppLocale;
  // Ruta sin prefijo de idioma, empezando con "/" ("" para la home).
  path: string;
  title: string;
  description: string;
  siteName: string;
};

export function localizedPath(locale: AppLocale, path: string) {
  return `/${locale}${path}`;
}

// hreflang solo con los idiomas publicados + x-default al idioma por defecto.
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(
      publishedLocales.map((l) => [l, localizedPath(l, path)])
    ),
    "x-default": localizedPath(routing.defaultLocale, path),
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
}: PageMetadataInput): Metadata {
  const url = localizedPath(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName,
      locale: ogLocales[locale],
      alternateLocale: publishedLocales
        .filter((l) => l !== locale)
        .map((l) => ogLocales[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
