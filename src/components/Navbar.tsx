import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import NavbarMenu from "./NavbarMenu";

export default async function Navbar() {
  const t = await getTranslations("Nav");
  const links = [
    { href: "#sobre", label: t("about") },
    { href: "#proyectos", label: t("projects") },
    { href: "#contacto", label: t("contact") },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/95 text-white">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold text-[#8dff5d]">
          {t("brand")}
        </Link>
        <NavbarMenu
          links={links}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
        />
        <nav className="hidden md:flex space-x-8 text-sm">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#8dff5d]">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
