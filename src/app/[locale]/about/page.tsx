import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        {t("title")}
      </h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-slate-600">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
      </div>
    </div>
  );
}
