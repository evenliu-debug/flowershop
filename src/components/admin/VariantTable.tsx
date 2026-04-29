"use client";

import { upsertVariant } from "@/actions/admin";

type Variant = {
  id: string;
  sku: string;
  size_label: string | null;
  color_label: string | null;
  price_usd: number;
  stock: number;
};

export function VariantTable({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">Variants</h2>
      <div className="space-y-8">
        {variants.map((v) => (
          <form
            key={v.id}
            action={upsertVariant}
            className="grid gap-3 border-b border-slate-100 pb-6 md:grid-cols-6"
          >
            <input type="hidden" name="product_id" value={productId} />
            <input type="hidden" name="id" value={v.id} />
            <label className="text-sm md:col-span-2">
              SKU
              <input
                name="sku"
                required
                defaultValue={v.sku}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              Size
              <input
                name="size_label"
                defaultValue={v.size_label ?? ""}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              Color
              <input
                name="color_label"
                defaultValue={v.color_label ?? ""}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              Price USD
              <input
                name="price_usd"
                type="number"
                step="0.01"
                required
                defaultValue={v.price_usd}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              Stock
              <input
                name="stock"
                type="number"
                required
                defaultValue={v.stock}
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <div className="flex items-end md:col-span-6">
              <button
                type="submit"
                className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-900"
              >
                Save variant
              </button>
            </div>
          </form>
        ))}

        <form action={upsertVariant} className="grid gap-3 md:grid-cols-6">
          <input type="hidden" name="product_id" value={productId} />
          <p className="font-medium text-slate-700 md:col-span-6">Add variant</p>
          <label className="text-sm md:col-span-2">
            SKU
            <input
              name="sku"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="text-sm">
            Size
            <input name="size_label" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
          </label>
          <label className="text-sm">
            Color
            <input name="color_label" className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
          </label>
          <label className="text-sm">
            Price USD
            <input
              name="price_usd"
              type="number"
              step="0.01"
              required
              defaultValue={0}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
            />
          </label>
          <label className="text-sm">
            Stock
            <input
              name="stock"
              type="number"
              required
              defaultValue={0}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
            />
          </label>
          <div className="flex items-end md:col-span-6">
            <button
              type="submit"
              className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800"
            >
              Add variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
