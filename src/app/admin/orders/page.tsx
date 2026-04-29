import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, total_usd, contact_email, shipping_country")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
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
              <th className="px-4 py-3 text-left font-medium text-slate-700">
                Country
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(orders ?? []).map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-blue-700 hover:underline"
                  >
                    {o.id.slice(0, 8)}…
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">{o.status}</td>
                <td className="px-4 py-3 text-right">
                  ${Number(o.total_usd).toFixed(2)}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3">
                  {o.contact_email}
                </td>
                <td className="px-4 py-3">{o.shipping_country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
