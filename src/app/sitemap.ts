import type { MetadataRoute } from "next";
import { publishedLocales } from "@/i18n/routing";
import { languageAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

// Rutas indexables, sin prefijo de idioma.
const PATHS = [""];

const absolute = (path: string) => `${SITE_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    publishedLocales.map((locale) => ({
      url: absolute(`/${locale}${path}`),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([lang, href]) => [
            lang,
            absolute(href),
          ])
        ),
      },
    }))
  );
}
