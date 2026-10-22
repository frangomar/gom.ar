import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Arquitectura completa: todos los idiomas que el sitio va a soportar.
  locales: ["es", "en", "pt", "fr", "zh"],
  defaultLocale: "es",
  localePrefix: "always",
  // El idioma sale solo de la URL. No hay proxy: "/" redirige a "/es"
  // desde next.config.ts y el sitio queda 100 % estático.
  localeDetection: false,
  // Los hreflang se generan con la Metadata API, solo para publishedLocales.
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

// Idiomas con contenido real. Solo estos se generan en el build, aparecen en
// el sitemap y en hreflang; el resto devuelve 404. Sumar acá cuando
// messages/<locale>.json tenga el contenido traducido.
export const publishedLocales = ["es"] as const satisfies readonly AppLocale[];

export type PublishedLocale = (typeof publishedLocales)[number];

export const ogLocales: Record<AppLocale, string> = {
  es: "es_AR",
  en: "en_US",
  pt: "pt_BR",
  fr: "fr_FR",
  zh: "zh_CN",
};
