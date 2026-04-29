import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { ProductWithRelations } from "@/types/database";
import {
  minVariantPrice,
  productTitle,
} from "@/lib/data/products";
import { publicProductImageUrl } from "@/lib/storage";
import type { Locale } from "next-intl";

type Props = {
  product: ProductWithRelations;
  locale: Locale;
  labels: { from: string; usd: string };
};

export function ProductCard({ product, locale, labels }: Props) {
  const title = productTitle(product, locale as "en" | "zh");
  const minPrice = minVariantPrice(product.product_variants ?? []);
  const imgs = product.product_images ?? [];
  const sorted = [...imgs].sort((a, b) => a.sort_order - b.sort_order);
  const first = sorted[0];
  const src = first
    ? publicProductImageUrl(first.storage_path)
    : "/placeholder-product.svg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        <Image
          src={src}
          alt={locale === "zh" ? first?.alt_zh || title : first?.alt_en || title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transform-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={src.startsWith("http")}
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/products/${product.slug}`}
          className="font-medium text-slate-900 transition-colors duration-200 hover:text-blue-700"
        >
          {title}
        </Link>
        <p className="mt-2 text-sm text-slate-600">
          {labels.from}{" "}
          <span className="font-semibold text-slate-900">
            ${minPrice.toFixed(2)}
          </span>{" "}
          {labels.usd}
        </p>
      </div>
    </article>
  );
}
