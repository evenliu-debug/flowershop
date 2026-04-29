import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import { ProductCard } from "@/components/product/ProductCard";
import {
  getProductBySlug,
  fetchActiveProducts,
  productTitle,
  productDescription,
  minVariantPrice,
} from "@/lib/data/products";
import { publicProductImageUrl } from "@/lib/storage";

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("ProductDetail");
  const tProd = await getTranslations("Products");
  const title = productTitle(product, locale as "en" | "zh");
  const description = productDescription(product, locale as "en" | "zh");
  const variants = [...(product.product_variants ?? [])].sort((a, b) =>
    a.sku.localeCompare(b.sku)
  );
  const minP = minVariantPrice(variants);

  const imgs = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const gallery = imgs.map((im) => ({
    src: publicProductImageUrl(im.storage_path),
    alt:
      locale === "zh"
        ? im.alt_zh || title
        : im.alt_en || title,
  }));

  const all = await fetchActiveProducts();
  const related = all
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category_id &&
        p.category_id === product.category_id
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <ProductImageGallery images={gallery} />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-lg text-slate-700">
            {tProd("from")}{" "}
            <span className="font-semibold text-slate-900">
              ${minP.toFixed(2)}
            </span>{" "}
            {tProd("usd")}
          </p>
          <div className="mt-6 max-w-none text-slate-600">
            <h2 className="text-base font-semibold text-slate-900">
              {t("description")}
            </h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{description}</p>
          </div>
          <AddToCartSection
            productId={product.id}
            slug={product.slug}
            nameEn={product.name_en}
            nameZh={product.name_zh}
            variants={variants}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-12">
          <h2 className="text-xl font-semibold text-slate-900">{t("related")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                labels={{ from: tProd("from"), usd: tProd("usd") }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
