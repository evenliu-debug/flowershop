/** Public URL for Supabase Storage object in bucket `product-images` */
export function publicProductImageUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "/placeholder-product.svg";
  if (storagePath.startsWith("http")) return storagePath;
  return `${base}/storage/v1/object/public/product-images/${storagePath}`;
}
