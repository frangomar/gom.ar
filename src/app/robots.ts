import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Producción permite todo. Los previews de Vercel ya mandan
// X-Robots-Tag: noindex por header, así que no se duplica acá.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
