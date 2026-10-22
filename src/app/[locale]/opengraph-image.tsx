import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { publishedLocales, type AppLocale } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "gom.ar";

export function generateStaticParams() {
  return publishedLocales.map((locale) => ({ locale }));
}

// next/og no lee woff2: se pide el TTF a Google Fonts en el build (la imagen es estática).
async function font(weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@${weight}`
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Schibsted Grotesk TTF not found");
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#070708",
          color: "#ededf0",
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", fontSize: 230, fontWeight: 900, letterSpacing: -10, lineHeight: 1 }}>
          gom<span style={{ color: "#7a5cff" }}>.</span>ar
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{t("title")}</div>
          <div style={{ fontSize: 30, fontWeight: 400, color: "#a6a6b0", lineHeight: 1.3, maxWidth: 1000 }}>
            {t("description")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Schibsted Grotesk", data: await font(400), weight: 400 },
        { name: "Schibsted Grotesk", data: await font(700), weight: 700 },
        { name: "Schibsted Grotesk", data: await font(900), weight: 900 },
      ],
    }
  );
}
