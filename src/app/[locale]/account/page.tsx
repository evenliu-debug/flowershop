import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountOverview } from "@/components/account/AccountOverview";
type OrderStatusKey =
  | "pending_confirmation"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export default async function AccountPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login?redirect=/${locale}/account`);
  }

  const t = await getTranslations("Account");
  const tStatus = await getTranslations("OrderStatus");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, total_usd")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabel = (s: string) => tStatus(s as OrderStatusKey);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("profileHint")}</p>

      <div className="mt-8">
        <Suspense>
          <AccountOverview email={user.email}>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">
              {t("orders")}
            </h2>
            {!orders?.length ? (
              <p className="mt-4 text-slate-600">{t("noOrders")}</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">
                        {t("orderRef")}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">
                        {t("date")}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-slate-700">
                        {t("status")}
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-700">
                        {t("total")}
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-700">
                        {t("view")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {o.id.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {statusLabel(o.status as OrderStatusKey)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          ${Number(o.total_usd).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/account/orders/${o.id}`}
                            className="font-medium text-blue-700 hover:text-blue-800"
                          >
                            {t("view")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </AccountOverview>
        </Suspense>
      </div>
    </div>
  );
}
