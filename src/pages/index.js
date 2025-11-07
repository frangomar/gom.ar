import Head from "next/head";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Proyectos from "@/components/Proyectos";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Francisco Gomar | Diseñador UX/UI</title>
        <meta
          name="description"
          content="Diseñador gráfico y UX/UI. Transformo ideas en diseño centrado en las personas. Pienso lateral, actúo rápido y diseño para dejar huella."
        />
        <meta
          name="keywords"
          content="Francisco Gomar, diseño UX/UI, diseñador gráfico, portfolio Behance, diseño web, branding, Argentina"
        />
        <meta name="author" content="Francisco Gomar" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Francisco Gomar | Diseñador UX/UI"
        />
        <meta
          property="og:description"
          content="Diseñador gráfico y UX/UI. Transformo ideas en diseño centrado en las personas. Pienso lateral, actúo rápido y diseño para dejar huella."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gom.ar" />
        <meta property="og:image" content="https://gom.ar/og-image.png" />

        {/* GEO targeting */}
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />

        <link rel="canonical" href="https://gom.ar" />
      </Head>

      <div className="bg-black text-white min-h-screen scroll-smooth">
        <Navbar />
        <CustomCursor />

        <main className="bg-[radial-gradient(circle_at_30%_20%,#111_0%,#000_80%)]">
          <Hero />
          <SobreMi />
          <Proyectos />
          <Contacto />
          <Footer />
        </main>
      </div>
    </>
  );
}
