import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-[#92ff6b]">404</h1>
      <p className="text-2xl font-semibold mt-6">{t("title")}</p>
      <p className="text-gray-400 mt-4">{t("description")}</p>
      <Link
        href="/"
        className="mt-10 text-sm uppercase tracking-wide text-[#92ff6b] hover:underline"
      >
        {t("back")}
      </Link>
    </main>
  );
}
