import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type OrderStatusKey =
  | "pending_confirmation"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export default async function OrderDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login?redirect=/${locale}/account/orders/${id}`);
  }

  const t = await getTranslations("Account");
  const tStatus = await getTranslations("OrderStatus");

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items ( * )
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !order) notFound();

  const items = order.order_items as Array<{
    id: string;
    quantity: number;
    unit_price_usd: number;
    snapshot_name_en: string;
    snapshot_name_zh: string;
    snapshot_sku: string;
    snapshot_size: string | null;
    snapshot_color: string | null;
  }>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/account"
        className="text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        ← {t("orders")}
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        {t("orderRef")} #{id.slice(0, 8)}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {t("status")}:{" "}
        {tStatus(order.status as OrderStatusKey)}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {new Date(order.created_at).toLocaleString()}
      </p>

      <ul className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {items.map((row) => (
          <li key={row.id} className="flex flex-wrap justify-between gap-2 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">
                {locale === "zh" ? row.snapshot_name_zh : row.snapshot_name_en}
              </p>
              <p className="text-sm text-slate-500">
                {row.snapshot_sku}
                {row.snapshot_size || row.snapshot_color
                  ? ` · ${[row.snapshot_size, row.snapshot_color].filter(Boolean).join(" / ")}`
                  : ""}
              </p>
            </div>
            <p className="text-sm text-slate-700">
              × {row.quantity} · $
              {(Number(row.unit_price_usd) * row.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
        <p className="text-lg font-semibold text-slate-900">
          {t("total")}: ${Number(order.total_usd).toFixed(2)} USD
        </p>
      </div>
      {(order.shipping_usd != null || order.tax_usd != null) && (
        <p className="mt-2 text-right text-sm text-slate-600">
          {order.shipping_usd != null && (
            <>Shipping: ${Number(order.shipping_usd).toFixed(2)} </>
          )}
          {order.tax_usd != null && (
            <>Tax: ${Number(order.tax_usd).toFixed(2)}</>
          )}
        </p>
      )}
    </div>
  );
}
