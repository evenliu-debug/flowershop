import { createClient } from "@/lib/supabase/server";
import { CategoryForms } from "@/components/admin/CategoryForms";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
      <CategoryForms categories={categories ?? []} />
    </div>
  );
}
