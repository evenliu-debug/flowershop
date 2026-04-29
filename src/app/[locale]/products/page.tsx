import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductsToolbar } from "@/components/product/ProductsToolbar";
import {
  listProducts,
  getCategories,
  fetchActiveProducts,
  collectFilterOptions,
} from "@/lib/data/products";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { locale } = params;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category =
    typeof searchParams.category === "string" ? searchParams.category : undefined;
  const minPrice = searchParams.min ? Number(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? Number(searchParams.max) : undefined;
  const color =
    typeof searchParams.color === "string" ? searchParams.color : undefined;
  const size =
    typeof searchParams.size === "string" ? searchParams.size : undefined;

  const t = await getTranslations("Products");
  const categories = await getCategories();
  const allForOpts = await fetchActiveProducts();
  const { colors, sizes } = collectFilterOptions(allForOpts);

  const products = await listProducts({
    q,
    categorySlug: category,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    color,
    size,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>

      <div className="mt-8">
        <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-slate-100" />}>
          <ProductsToolbar
            categories={categories}
            locale={locale}
            colors={colors}
            sizes={sizes}
          />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-center text-slate-600">{t("noResults")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              locale={locale}
              labels={{ from: t("from"), usd: t("usd") }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
