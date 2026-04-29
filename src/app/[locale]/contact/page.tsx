import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg text-slate-600">{t("intro")}</p>
      <dl className="mt-10 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <dt className="text-sm font-medium text-slate-500">{t("emailLabel")}</dt>
          <dd className="mt-1 text-slate-900">
            <a
              href="mailto:sales@example.com"
              className="text-blue-700 underline-offset-2 hover:underline"
            >
              sales@example.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">{t("hoursLabel")}</dt>
          <dd className="mt-1 text-slate-900">{t("hoursValue")}</dd>
        </div>
      </dl>
    </div>
  );
}
