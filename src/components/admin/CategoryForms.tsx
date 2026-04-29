import { upsertCategory, deleteCategoryForm } from "@/actions/admin";

type Cat = {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  sort_order: number;
};

export function CategoryForms({ categories }: { categories: Cat[] }) {
  return (
    <div className="space-y-10">
      {categories.map((c) => (
        <div
          key={c.id}
          className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <form action={upsertCategory} className="flex flex-wrap gap-3">
            <input type="hidden" name="id" value={c.id} />
            <label className="text-sm">
              Slug
              <input
                name="slug"
                defaultValue={c.slug}
                required
                className="mt-1 block rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              EN
              <input
                name="name_en"
                defaultValue={c.name_en}
                required
                className="mt-1 block rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              ZH
              <input
                name="name_zh"
                defaultValue={c.name_zh}
                required
                className="mt-1 block rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <label className="text-sm">
              Sort
              <input
                name="sort_order"
                type="number"
                defaultValue={c.sort_order}
                className="mt-1 block w-20 rounded-md border border-slate-300 px-2 py-1"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-blue-700 px-3 py-1.5 text-sm text-white hover:bg-blue-800"
            >
              Save
            </button>
          </form>
          <form action={deleteCategoryForm}>
            <input type="hidden" name="id" value={c.id} />
            <button
              type="submit"
              className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      ))}

      <form
        action={upsertCategory}
        className="max-w-xl space-y-3 rounded-lg border border-dashed border-slate-300 bg-white p-4"
      >
        <p className="font-medium text-slate-900">New category</p>
        <label className="block text-sm">
          Slug
          <input name="slug" required className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="block text-sm">
          EN
          <input name="name_en" required className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="block text-sm">
          ZH
          <input name="name_zh" required className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" />
        </label>
        <label className="block text-sm">
          Sort
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Create
        </button>
      </form>
    </div>
  );
}
