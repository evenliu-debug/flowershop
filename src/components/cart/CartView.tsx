"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link as LocalLink } from "@/i18n/routing";
import { useCart } from "@/store/cart";
import { Trash2 } from "lucide-react";
export function CartView() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const removeLine = useCart((s) => s.removeLine);

  const subtotal = lines.reduce(
    (sum, l) => sum + l.priceUsd * l.quantity,
    0
  );

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 py-16 text-center">
        <p className="text-slate-600">{t("empty")}</p>
        <LocalLink
          href="/products"
          className="mt-4 inline-block text-sm font-medium text-blue-700 transition-colors duration-200 hover:text-blue-800"
        >
          {t("continue")}
        </LocalLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {lines.map((line) => {
          const title = locale === "zh" ? line.titleZh : line.titleEn;
          return (
            <li
              key={line.variantId}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <Image
                    src="/placeholder-product.svg"
                    alt=""
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div>
                  <LocalLink
                    href={`/products/${line.slug}`}
                    className="font-medium text-slate-900 transition-colors duration-200 hover:text-blue-700"
                  >
                    {title}
                  </LocalLink>
                  <p className="text-sm text-slate-500">
                    {line.sku}
                    {line.sizeLabel || line.colorLabel
                      ? ` · ${[line.sizeLabel, line.colorLabel].filter(Boolean).join(" / ")}`
                      : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    ${line.priceUsd.toFixed(2)} × {line.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:justify-end">
                <label className="sr-only" htmlFor={`qty-${line.variantId}`}>
                  {t("qty")}
                </label>
                <input
                  id={`qty-${line.variantId}`}
                  type="number"
                  min={1}
                  className="w-16 rounded-md border border-slate-300 px-2 py-1 text-center text-sm"
                  value={line.quantity}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n)) setQty(line.variantId, n);
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeLine(line.variantId)}
                  className="inline-flex cursor-pointer rounded-md p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-red-600"
                  aria-label={t("remove")}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col items-end gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          {t("subtotal")}:{" "}
          <span className="text-lg font-semibold text-slate-900">
            ${subtotal.toFixed(2)} USD
          </span>
        </p>
        <p className="text-xs text-slate-500">{t("lineNote")}</p>
        <LocalLink
          href="/checkout"
          className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {t("checkout")}
        </LocalLink>
      </div>
    </div>
  );
}
