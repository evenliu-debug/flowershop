import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name_en, name_zh, is_active, featured")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          New product
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">
                Slug
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">
                Name (EN)
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">
                Active
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">
                Featured
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(products ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-blue-700 hover:underline"
                  >
                    {p.slug}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.name_en}</td>
                <td className="px-4 py-3">{p.is_active ? "yes" : "no"}</td>
                <td className="px-4 py-3">{p.featured ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
