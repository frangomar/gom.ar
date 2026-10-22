import {
  BEHANCE_URL,
  CONTACT_EMAIL,
  LINKEDIN_URL,
  SITE_URL,
} from "@/lib/site";

// Solo datos reales y confirmados. No agregar ratings, precios ni clientes.
const address = {
  "@type": "PostalAddress",
  addressLocality: "San Isidro",
  addressRegion: "Buenos Aires",
  addressCountry: "AR",
};

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Francisco Gomar",
      jobTitle:
        "Senior Graphic Designer · UI/UX · Web Design & Development",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      address,
      sameAs: [LINKEDIN_URL, BEHANCE_URL],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Francisco Gomar",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      address,
      sameAs: [LINKEDIN_URL, BEHANCE_URL],
      founder: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escapa "<" para que el JSON no pueda cerrar el <script>.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
