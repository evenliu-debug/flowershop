export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type UserRole = "customer" | "admin";

export type CategoryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  slug: string;
  category_id: string | null;
  name_en: string;
  name_zh: string;
  description_en: string;
  description_zh: string;
  is_active: boolean;
  featured: boolean;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  sku: string;
  size_label: string | null;
  color_label: string | null;
  price_usd: number;
  stock: number;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_en: string;
  alt_zh: string;
  sort_order: number;
};

export type ProductWithRelations = ProductRow & {
  category: CategoryRow | null;
  product_variants: ProductVariantRow[];
  product_images: ProductImageRow[];
};
