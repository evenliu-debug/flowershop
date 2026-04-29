import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations("Home");
  const tProd = await getTranslations("Products");
  const featured = await getFeaturedProducts(6);
  const categories = await getCategories();

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">{t("heroSubtitle")}</p>
          <Link
            href="/products"
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {t("heroCta")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-semibold text-slate-900">{t("categories")}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${encodeURIComponent(c.slug)}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/50"
            >
              {locale === "zh" ? c.name_zh : c.name_en}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">{t("featured")}</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-700 transition-colors duration-200 hover:text-blue-800"
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              locale={locale}
              labels={{ from: tProd("from"), usd: tProd("usd") }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
