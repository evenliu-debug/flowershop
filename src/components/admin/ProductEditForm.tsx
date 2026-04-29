import { upsertProduct } from "@/actions/admin";

type Cat = { id: string; slug: string; name_en: string };

type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  description_en: string;
  description_zh: string;
  category_id: string | null;
  featured: boolean;
  is_active: boolean;
};

export function ProductEditForm({
  categories,
  product,
}: {
  categories: Cat[];
  product?: Product;
}) {
  return (
    <form
      action={upsertProduct}
      className="max-w-2xl space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Slug</span>
          <input
            name="slug"
            required
            defaultValue={product?.slug}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Name EN</span>
          <input
            name="name_en"
            required
            defaultValue={product?.name_en}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Name ZH</span>
          <input
            name="name_zh"
            required
            defaultValue={product?.name_zh}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Description EN</span>
          <textarea
            name="description_en"
            rows={4}
            defaultValue={product?.description_en}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Description ZH</span>
          <textarea
            name="description_zh"
            rows={4}
            defaultValue={product?.description_zh}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Category</span>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="h-4 w-4 rounded border-slate-300"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        {product ? "Save product" : "Create product"}
      </button>
    </form>
  );
}
