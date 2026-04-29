"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { CategoryRow } from "@/types/database";
import { cn } from "@/lib/utils";

type Props = {
  categories: CategoryRow[];
  locale: string;
  colors: string[];
  sizes: string[];
};

export function ProductsToolbar({ categories, locale, colors, sizes }: Props) {
  const t = useTranslations("Products");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === "") next.delete(k);
        else next.set(k, v);
      });
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  const label = (c: CategoryRow) =>
    locale === "zh" ? c.name_zh : c.name_en;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">{t("filterCategory")}</span>
          <select
            className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-slate-900 transition-colors duration-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            value={searchParams.get("category") ?? ""}
            onChange={(e) =>
              updateParams({
                category: e.target.value || undefined,
              })
            }
            disabled={pending}
          >
            <option value="">{t("filterAll")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {label(c)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">{t("filterPrice")}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="Min"
              className="w-24 rounded-md border border-slate-300 px-2 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              defaultValue={searchParams.get("min") ?? ""}
              onBlur={(e) =>
                updateParams({
                  min: e.target.value || undefined,
                })
              }
            />
            <span className="text-slate-500">—</span>
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="Max"
              className="w-24 rounded-md border border-slate-300 px-2 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              defaultValue={searchParams.get("max") ?? ""}
              onBlur={(e) =>
                updateParams({
                  max: e.target.value || undefined,
                })
              }
            />
          </div>
        </label>

        {colors.length > 0 && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">{t("filterColor")}</span>
            <select
              className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={searchParams.get("color") ?? ""}
              onChange={(e) =>
                updateParams({ color: e.target.value || undefined })
              }
              disabled={pending}
            >
              <option value="">{t("filterAll")}</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}

        {sizes.length > 0 && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">{t("filterSize")}</span>
            <select
              className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={searchParams.get("size") ?? ""}
              onChange={(e) =>
                updateParams({ size: e.target.value || undefined })
              }
              disabled={pending}
            >
              <option value="">{t("filterAll")}</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="min-w-[200px] rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            defaultValue={searchParams.get("q") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ q: (e.target as HTMLInputElement).value || undefined });
              }
            }}
          />
        </label>
        <button
          type="button"
          className={cn(
            "rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 cursor-pointer",
            pending && "opacity-60"
          )}
          onClick={() =>
            updateParams({
              q: undefined,
              category: undefined,
              min: undefined,
              max: undefined,
              color: undefined,
              size: undefined,
            })
          }
        >
          {t("clearFilters")}
        </button>
      </div>
    </div>
  );
}
