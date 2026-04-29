import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { VariantTable } from "@/components/admin/VariantTable";
import { ImageUploadForm } from "@/components/admin/ImageUploadForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!product) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name_en")
    .order("sort_order");

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", params.id);

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", params.id)
    .order("sort_order");

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-slate-900">Edit product</h1>
      <ProductEditForm
        categories={categories ?? []}
        product={product}
      />
      <VariantTable productId={product.id} variants={variants ?? []} />
      <ImageUploadForm productId={product.id} images={images ?? []} />
    </div>
  );
}
