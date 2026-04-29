"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartLine } from "@/store/cart";
import Stripe from "stripe";

export type CheckoutInput = {
  lines: CartLine[];
  paymentMethod: "stripe" | "paypal";
  shipping: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
  };
};

export type CheckoutResult =
  | { ok: true; orderId: string; stripeUrl?: string }
  | { ok: false; error: string };

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
  });
}

function appOrigin() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/**
 * Validates cart lines against Supabase, creates order (pending_confirmation),
 * optionally returns Stripe Checkout URL (test mode) or order id for PayPal.
 */
export async function submitCheckout(
  locale: string,
  input: CheckoutInput
): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  if (!input.lines.length) return { ok: false, error: "empty" };

  let subtotal = 0;
  const resolved: Array<{
    line: CartLine;
    unitPrice: number;
    names: { en: string; zh: string };
    sku: string;
    size: string | null;
    color: string | null;
  }> = [];

  for (const line of input.lines) {
    const { data: variant, error: ve } = await supabase
      .from("product_variants")
      .select(
        "id, sku, price_usd, stock, size_label, color_label, product_id"
      )
      .eq("id", line.variantId)
      .single();

    if (ve || !variant) return { ok: false, error: "variant" };

    const { data: product } = await supabase
      .from("products")
      .select("id, is_active, name_en, name_zh")
      .eq("id", variant.product_id)
      .single();

    if (!product?.is_active) return { ok: false, error: "inactive" };
    if (variant.stock < line.quantity) return { ok: false, error: "stock" };

    const unitPrice = Number(variant.price_usd);
    subtotal += unitPrice * line.quantity;
    resolved.push({
      line,
      unitPrice,
      names: { en: product.name_en, zh: product.name_zh },
      sku: variant.sku,
      size: variant.size_label,
      color: variant.color_label,
    });
  }

  const { data: order, error: oe } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending_confirmation",
      currency: "usd",
      subtotal_usd: subtotal,
      total_usd: subtotal,
      shipping_usd: null,
      tax_usd: null,
      payment_provider: input.paymentMethod,
      shipping_name: input.shipping.fullName,
      shipping_line1: input.shipping.line1,
      shipping_line2: input.shipping.line2 ?? null,
      shipping_city: input.shipping.city,
      shipping_state: input.shipping.state,
      shipping_postal: input.shipping.postal,
      shipping_country: input.shipping.country,
      contact_email: input.contact.email,
      contact_phone: input.contact.phone,
    })
    .select("id")
    .single();

  if (oe || !order) return { ok: false, error: "order" };

  for (const r of resolved) {
    const { error: ie } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: r.line.productId,
      variant_id: r.line.variantId,
      quantity: r.line.quantity,
      unit_price_usd: r.unitPrice,
      snapshot_name_en: r.names.en,
      snapshot_name_zh: r.names.zh,
      snapshot_sku: r.sku,
      snapshot_size: r.size,
      snapshot_color: r.color,
    });
    if (ie) return { ok: false, error: "items" };
  }

  await supabase
    .from("user_profiles")
    .update({
      shipping_line1: input.shipping.line1,
      shipping_line2: input.shipping.line2 ?? null,
      shipping_city: input.shipping.city,
      shipping_state: input.shipping.state,
      shipping_postal: input.shipping.postal,
      shipping_country: input.shipping.country,
      phone: input.contact.phone,
      full_name: input.shipping.fullName,
    })
    .eq("id", user.id);

  if (input.paymentMethod === "paypal") {
    return { ok: true, orderId: order.id };
  }

  try {
    const stripe = getStripe();
    const origin = appOrigin();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.contact.email,
      line_items: resolved.map((r) => ({
        quantity: r.line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(r.unitPrice * 100),
          product_data: {
            name:
              locale === "zh"
                ? r.names.zh.slice(0, 120)
                : r.names.en.slice(0, 120),
            metadata: {
              sku: r.sku,
            },
          },
        },
      })),
      success_url: `${origin}/${locale}/account?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout?cancelled=1`,
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    });

    if (session.url) {
      await supabase
        .from("orders")
        .update({ payment_intent_id: session.id })
        .eq("id", order.id);
      return { ok: true, orderId: order.id, stripeUrl: session.url };
    }
  } catch (e) {
    console.error(e);
    return { ok: false, error: "stripe" };
  }

  return { ok: false, error: "stripe" };
}
