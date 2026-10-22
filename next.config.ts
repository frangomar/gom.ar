import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./src/i18n/routing";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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

export default withNextIntl(nextConfig);
