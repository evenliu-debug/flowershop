"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function updateOrderAdmin(input: {
  orderId: string;
  status?: string;
  shippingUsd?: number | null;
  taxUsd?: number | null;
}) {
  const supabase = await assertAdmin();
  const payload: Record<string, unknown> = {};
  if (input.status) payload.status = input.status;
  if (input.shippingUsd !== undefined) payload.shipping_usd = input.shippingUsd;
  if (input.taxUsd !== undefined) payload.tax_usd = input.taxUsd;

  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", input.orderId);

  if (error) throw error;

  const { data: order } = await supabase
    .from("orders")
    .select("subtotal_usd, shipping_usd, tax_usd")
    .eq("id", input.orderId)
    .single();
  if (order) {
    const sub = Number(order.subtotal_usd ?? 0);
    const ship = Number(order.shipping_usd ?? 0);
    const tax = Number(order.tax_usd ?? 0);
    await supabase
      .from("orders")
      .update({ total_usd: sub + ship + tax })
      .eq("id", input.orderId);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateOrderFromForm(formData: FormData) {
  await updateOrderAdmin({
    orderId: String(formData.get("order_id")),
    status: String(formData.get("status") ?? ""),
    shippingUsd:
      formData.get("shipping_usd") === ""
        ? null
        : Number(formData.get("shipping_usd")),
    taxUsd:
      formData.get("tax_usd") === ""
        ? null
        : Number(formData.get("tax_usd")),
  });
}

export async function deleteCategory(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/categories");
}

export async function deleteCategoryForm(formData: FormData) {
  await deleteCategory(String(formData.get("id")));
}

export async function upsertCategory(formData: FormData) {
  const supabase = await assertAdmin();
  const id = formData.get("id") as string | null;
  const slug = String(formData.get("slug") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_zh = String(formData.get("name_zh") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  if (!slug || !name_en || !name_zh) throw new Error("Invalid");

  if (id) {
    await supabase
      .from("categories")
      .update({ slug, name_en, name_zh, sort_order })
      .eq("id", id);
  } else {
    await supabase.from("categories").insert({
      slug,
      name_en,
      name_zh,
      sort_order,
    });
  }
  revalidatePath("/admin/categories");
}

export async function upsertProduct(formData: FormData) {
  const supabase = await assertAdmin();
  const id = formData.get("id") as string | null;
  const slug = String(formData.get("slug") ?? "").trim();
  const name_en = String(formData.get("name_en") ?? "").trim();
  const name_zh = String(formData.get("name_zh") ?? "").trim();
  const description_en = String(formData.get("description_en") ?? "");
  const description_zh = String(formData.get("description_zh") ?? "");
  const category_id = String(formData.get("category_id") ?? "") || null;
  const featured = formData.get("featured") === "on";
  const is_active = formData.get("is_active") === "on";

  const row = {
    slug,
    name_en,
    name_zh,
    description_en,
    description_zh,
    category_id,
    featured,
    is_active,
  };

  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("id")
    .single();
  if (error) throw error;
  revalidatePath("/admin/products");
  redirect(`/admin/products/${data.id}`);
}

export async function upsertVariant(formData: FormData) {
  const supabase = await assertAdmin();
  const product_id = String(formData.get("product_id"));
  const id = formData.get("id") as string | null;
  const sku = String(formData.get("sku") ?? "").trim();
  const size_label = String(formData.get("size_label") ?? "") || null;
  const color_label = String(formData.get("color_label") ?? "") || null;
  const price_usd = Number(formData.get("price_usd"));
  const stock = Number(formData.get("stock"));

  const row = {
    product_id,
    sku,
    size_label,
    color_label,
    price_usd,
    stock,
  };

  if (id) {
    const { error } = await supabase
      .from("product_variants")
      .update(row)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("product_variants").insert(row);
    if (error) throw error;
  }
  revalidatePath("/admin/products");
}

export async function uploadProductImage(formData: FormData) {
  const supabase = await assertAdmin();
  const product_id = String(formData.get("product_id"));
  const file = formData.get("file") as File | null;
  if (!file?.size) throw new Error("No file");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `uploads/${product_id}/${crypto.randomUUID()}.${ext}`;

  const buf = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from("product-images")
    .upload(path, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (upErr) throw upErr;

  const { error } = await supabase.from("product_images").insert({
    product_id,
    storage_path: path,
    alt_en: String(formData.get("alt_en") ?? ""),
    alt_zh: String(formData.get("alt_zh") ?? ""),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw error;
  revalidatePath("/admin/products");
}
