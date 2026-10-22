import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Proyectos from "@/components/Proyectos";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

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

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen scroll-smooth">
      <Navbar />

      <main className="bg-[radial-gradient(circle_at_30%_20%,#111_0%,#000_80%)]">
        <Hero />
        <SobreMi />
        <Proyectos />
        <Contacto />
        <Footer />
      </main>
    </div>
  );
}
