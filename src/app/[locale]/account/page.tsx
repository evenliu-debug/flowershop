import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
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
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {locale === "zh" ? "Supabase 未配置" : "Supabase not configured"}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {locale === "zh"
            ? "请在 Vercel 的环境变量中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY，然后重新部署。"
            : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel environment variables, then redeploy."}
        </p>
      </div>
    );
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-slate-600">
          {locale === "zh"
            ? "无法初始化 Supabase，请检查环境变量或稍后重试。"
            : "Could not initialize Supabase. Please check env vars or try again later."}
        </p>
      </div>
    );
  }

  let userId: string | null = null;
  let userEmail: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect(`/${locale}/login?redirect=/${locale}/account`);
    }
    userId = user.id;
    userEmail = user.email ?? null;
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-slate-600">
          {locale === "zh"
            ? "Supabase 认证服务不可用。请稍后再试（也可能是数据库表尚未初始化）。"
            : "Auth service is unavailable. Please try again later (tables may not be initialized yet)."}
        </p>
      </div>
    );
  }

  const t = await getTranslations("Account");
  const tStatus = await getTranslations("OrderStatus");

  let orders: Array<{
    id: string;
    created_at: string;
    status: string;
    total_usd: number;
  }> = [];
  try {
    const { data } = await supabase
      .from("orders")
      .select("id, created_at, status, total_usd")
      .eq("user_id", userId!)
      .order("created_at", { ascending: false });
    orders = data ?? [];
  } catch {
    // If schema isn't applied yet, orders query will fail — show account shell anyway.
    orders = [];
  }

  const statusLabel = (s: string) => tStatus(s as OrderStatusKey);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("profileHint")}</p>

      <div className="mt-8">
        <Suspense>
          <AccountOverview email={userEmail}>
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
