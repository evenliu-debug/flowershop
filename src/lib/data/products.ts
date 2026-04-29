import { createClient } from "@/lib/supabase/server";
import type { ProductWithRelations } from "@/types/database";

type Locale = "en" | "zh";

export type ProductFilter = {
  q?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
};

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function fetchActiveProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (*),
      product_variants (*),
      product_images (*)
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

function matchesFilters(p: ProductWithRelations, f: ProductFilter) {
  if (f.q) {
    const qLower = f.q.toLowerCase();
    const qRaw = f.q.trim();
    const en = p.name_en.toLowerCase().includes(qLower);
    const zh = p.name_zh.includes(qRaw);
    const slug = p.slug.toLowerCase().includes(qLower);
    if (!en && !zh && !slug) return false;
  }
  if (f.categorySlug && p.category?.slug !== f.categorySlug) return false;

  const variants = p.product_variants ?? [];
  if (!variants.length) return false;

  const inPrice = (v: (typeof variants)[0]) => {
    const min = f.minPrice;
    const max = f.maxPrice;
    if (min != null && v.price_usd < min) return false;
    if (max != null && v.price_usd > max) return false;
    return true;
  };

  const inColor = (v: (typeof variants)[0]) => {
    if (!f.color) return true;
    return (v.color_label ?? "").toLowerCase() === f.color.toLowerCase();
  };

  const inSize = (v: (typeof variants)[0]) => {
    if (!f.size) return true;
    return (v.size_label ?? "").toLowerCase() === f.size.toLowerCase();
  };

  return variants.some((v) => inPrice(v) && inColor(v) && inSize(v));
}

export async function listProducts(filters: ProductFilter) {
  const all = await fetchActiveProducts();
  return all.filter((p) => matchesFilters(p, filters));
}

export async function getFeaturedProducts(limit = 6) {
  const all = await fetchActiveProducts();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (*),
      product_variants (*),
      product_images (*)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithRelations | null;
}

export function productTitle(p: ProductWithRelations, locale: Locale) {
  return locale === "zh" ? p.name_zh : p.name_en;
}

export function productDescription(p: ProductWithRelations, locale: Locale) {
  return locale === "zh" ? p.description_zh : p.description_en;
}

export function minVariantPrice(variants: ProductWithRelations["product_variants"]) {
  if (!variants?.length) return 0;
  return Math.min(...variants.map((v) => Number(v.price_usd)));
}

export function collectFilterOptions(products: ProductWithRelations[]) {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  for (const p of products) {
    for (const v of p.product_variants ?? []) {
      if (v.color_label) colors.add(v.color_label);
      if (v.size_label) sizes.add(v.size_label);
    }
  }
  return {
    colors: Array.from(colors).sort(),
    sizes: Array.from(sizes).sort(),
  };
}
