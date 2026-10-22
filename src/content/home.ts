import type { PublishedLocale } from "@/i18n/routing";

// Casos de la home, en el orden del brief (Parte D). Solo datos de las fichas: nada inventado.
// shortcut: sin páginas de caso todavía (B4); cada card linkea solo al sitio en vivo.
// "phone" y "notebook": render de Blender como visual del caso (design/3d); "photo": foto de marca; "wall": muro de piezas
export type Media = "phone" | "photo" | "wall" | "notebook";
// objeto renderizado arriba del título, solo en desktop (≥ 1024 px)
export type Obj3D = "paddle" | "golf" | "plate" | "dumbbell" | null;

export type HomeCase = {
  id: string;
  title: [string, string]; // se parte antes del TLD para el rodillo
  brand: string; // color de marca, solo como guiño
  logo?: { src: string; ar: string };
  word?: string; // marca sin logo vectorial
  media: Media;
  img?: string;
  obj: Obj3D;
  live?: string;
  inHero: boolean;
  text: Record<PublishedLocale, { d: string; f: string; live?: string }>;
};

const L = "/home/logos/";
const MEGATLON = { src: L + "megatlon.svg", ar: "4/1" };

export const CASES: HomeCase[] = [
  {
    id: "app",
    title: ["App Megatlon", " · iOS y Android"],
    brand: "#f26b21",
    logo: MEGATLON,
    media: "phone",
    obj: null,
    live: "https://apps.apple.com/ar/app/megatlon/id1531151799",
    inHero: true,
    text: {
      es: { d: "Rediseño UX/UI de la app con los equipos de producto y desarrollo, y planes de entrenamiento generados con IA junto con Amalgama.", f: "Senior UX/UI · Figma · desde 2025", live: "Ver en App Store" },
      en: { d: "UX/UI redesign of the app with the product and engineering teams, plus AI-generated training plans built with Amalgama.", f: "Senior UX/UI · Figma · since 2025", live: "See on the App Store" },
    },
  },
  {
    id: "estacion",
    title: ["laestacionfutbolpadel", ".com.ar"],
    brand: "#4d7cff",
    logo: { src: L + "estacion.png", ar: "206/42" },
    media: "photo",
    img: "/home/estacion-noche.jpg",
    obj: "paddle",
    live: "https://www.laestacionfutbolpadel.com.ar",
    inHero: true,
    text: {
      es: { d: "Una marca nueva que necesitaba vender reservas de canchas desde el primer día. Diseño y desarrollo con código propio.", f: "Diseño y desarrollo · Next.js · 2026", live: "Ver online" },
      en: { d: "A brand-new venue that had to sell court bookings from day one. Designed and built with custom code.", f: "Design and development · Next.js · 2026", live: "See it live" },
    },
  },
  {
    id: "fiter",
    title: ["fiter", ".com/UY"],
    brand: "#ffda00",
    logo: { src: L + "fiter.svg", ar: "495.9/185.7" },
    media: "photo",
    img: "/home/fiter-funcional.jpg",
    obj: "dumbbell",
    live: "https://fiter.com/UY",
    inHero: true,
    text: {
      es: { d: "El sitio de la marca low-cost del grupo para su llegada a Uruguay, construido desde cero.", f: "Diseño y desarrollo · HubSpot CMS · desde 2025", live: "Ver online" },
      en: { d: "The group’s low-cost gym brand, launching in Uruguay with a site built from scratch.", f: "Design and development · HubSpot CMS · since 2025", live: "See it live" },
    },
  },
  {
    id: "dn",
    title: ["drivingnorte", ".com.ar"],
    brand: "#35b46b",
    logo: { src: L + "dn.png", ar: "356/125" },
    media: "photo",
    img: "/home/dn-campo.jpg",
    obj: "golf",
    live: "https://drivingnorte.com.ar",
    inHero: true,
    text: {
      es: { d: "Diseño y desarrollo del sitio de un espacio de golf en Costanera, con horarios y tarifas a la vista.", f: "Diseño y desarrollo · WordPress + Elementor · desde 2025", live: "Ver online" },
      en: { d: "Design and development for a golf venue on the Buenos Aires waterfront, with hours and rates up front.", f: "Design and development · WordPress + Elementor · since 2025", live: "See it live" },
    },
  },
  {
    id: "megatlon",
    title: ["megatlon", ".com"],
    brand: "#f26b21",
    logo: MEGATLON,
    media: "photo",
    img: "/home/megatlon-anelo.jpg",
    obj: "plate",
    live: "https://megatlon.com",
    inHero: true,
    text: {
      es: { d: "Gestión y diseño responsive del sitio de la cadena, que recibe unas 70.000 visitas por mes, y de Megatlon Shop.", f: "Diseño y gestión · WordPress · desde 2025", live: "Ver online" },
      en: { d: "Ongoing design and management of the chain’s website, around 70,000 visits a month, plus Megatlon Shop.", f: "Design and management · WordPress · since 2025", live: "See it live" },
    },
  },
  {
    id: "ig",
    title: ["instagram", ".com/megatlon"],
    brand: "#f26b21",
    logo: MEGATLON,
    media: "wall",
    obj: null,
    live: "https://www.instagram.com/megatlon",
    inHero: false,
    text: {
      es: { d: "Piezas para redes y dirección creativa de campañas como HotMega y Megatlon Festival, en web, email, redes y señalética.", f: "Diseño y dirección creativa · desde 2025", live: "Ver en Instagram" },
      en: { d: "Social pieces and creative direction for campaigns like HotMega and Megatlon Festival, across web, email, social and signage.", f: "Design and creative direction · since 2025", live: "See on Instagram" },
    },
  },
  {
    id: "qt",
    title: ["Landings de", " Quicktrade"],
    brand: "#2f7bff",
    word: "Quicktrade",
    media: "notebook",
    obj: null,
    inHero: true,
    text: {
      es: { d: "UI de la app mobile y landings responsive para explicar productos de inversión a inversores minoristas.", f: "UI Designer · Figma · 2022–2024" },
      en: { d: "Mobile app UI and responsive landing pages that explain investment products to retail investors.", f: "UI Designer · Figma · 2022–2024" },
    },
  },
];

export const caseTitle = (c: HomeCase, locale: PublishedLocale): [string, string] =>
  c.id === "app" && locale === "en" ? ["Megatlon App", " · iOS & Android"] : c.id === "qt" && locale === "en" ? ["Quicktrade", " landing pages"] : c.title;
