import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "@/components/admin/ProductEditForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name_en")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">New product</h1>
      <ProductEditForm categories={categories ?? []} />
    </div>
  );
}
