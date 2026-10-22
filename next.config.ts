import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  // Se prende con `npm run analyze`; así no depende de la sintaxis de env del shell.
  enabled: process.env.npm_lifecycle_event === "analyze",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  async redirects() {
    return [
      // Sin proxy: el idioma por defecto se resuelve con un redirect estático.
      {
        source: "/",
        destination: `/${routing.defaultLocale}`,
        statusCode: 301,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
