import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const n = await getTranslations("Nav");

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Even Shop</p>
            <p className="mt-1 text-sm text-slate-600">{t("tagline")}</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm" aria-label="Footer">
            <Link
              href="/products"
              className="text-slate-600 transition-colors duration-200 hover:text-slate-900"
            >
              {n("products")}
            </Link>
            <Link
              href="/about"
              className="text-slate-600 transition-colors duration-200 hover:text-slate-900"
            >
              {n("about")}
            </Link>
            <Link
              href="/contact"
              className="text-slate-600 transition-colors duration-200 hover:text-slate-900"
            >
              {n("contact")}
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500 sm:text-left">
          © {new Date().getFullYear()} Even Shop. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
