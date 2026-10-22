import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main
      id="main"
      className="flex min-h-svh flex-col justify-center gap-6 px-(--gutter)"
    >
      <h1 className="text-h1 font-bold">{t("title")}</h1>
      <p className="max-w-[60ch] text-gray-text">{t("description")}</p>
      <Link href="/">{t("back")}</Link>
    </main>
  );
}
