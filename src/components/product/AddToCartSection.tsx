"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCart } from "@/store/cart";
import type { ProductVariantRow } from "@/types/database";
import { Link } from "@/i18n/routing";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  variants: ProductVariantRow[];
};

export function AddToCartSection({
  productId,
  slug,
  nameEn,
  nameZh,
  variants,
}: Props) {
  const t = useTranslations("ProductDetail");
  const tCart = useTranslations("Cart");
  const addLine = useCart((s) => s.addLine);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const v = variants.find((x) => x.id === variantId) ?? variants[0];
  const canBuy = v && v.stock > 0;

  return (
    <div className="mt-6 space-y-4">
      {variants.length > 1 && (
        <label className="block text-sm font-medium text-slate-700">
          {t("selectVariant")}
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="mt-2 w-full cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            {variants.map((x) => (
              <option key={x.id} value={x.id}>
                {[
                  x.size_label,
                  x.color_label,
                  `$${Number(x.price_usd).toFixed(2)}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canBuy || !v}
          onClick={() => {
            if (!v) return;
            addLine({
              variantId: v.id,
              productId,
              slug,
              sku: v.sku,
              priceUsd: Number(v.price_usd),
              titleEn: nameEn,
              titleZh: nameZh,
              sizeLabel: v.size_label,
              colorLabel: v.color_label,
              quantity: 1,
            });
          }}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
            (!canBuy || !v) && "cursor-not-allowed opacity-50"
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {t("addToCart")}
        </button>
        <Link
          href="/cart"
          className="text-sm font-medium text-blue-700 transition-colors duration-200 hover:text-blue-800"
        >
          {tCart("title")} →
        </Link>
      </div>
      {v && v.stock <= 0 && (
        <p className="text-sm text-amber-800">{t("outOfStock")}</p>
      )}
      {v && (
        <p className="text-sm text-slate-600">
          {t("sku")}: <span className="font-mono text-slate-900">{v.sku}</span>
        </p>
      )}
    </div>
  );
}
