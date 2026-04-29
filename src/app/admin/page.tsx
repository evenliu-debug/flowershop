import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: pending } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_confirmation");

  const { data: recent } = await supabase
    .from("orders")
    .select("id, created_at, status, total_usd, contact_email")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Orders (all)</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {totalOrders ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Pending confirmation</p>
          <p className="mt-1 text-3xl font-semibold text-amber-700">
            {pending ?? 0}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">
                  Total
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(recent ?? []).map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-xs">
                    <a
                      href={`/admin/orders/${o.id}`}
                      className="text-blue-700 hover:underline"
                    >
                      {o.id.slice(0, 8)}…
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3 text-right">
                    ${Number(o.total_usd).toFixed(2)}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-slate-600">
                    {o.contact_email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
