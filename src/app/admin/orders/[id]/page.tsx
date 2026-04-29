import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { OrderAdminForm } from "@/components/admin/OrderAdminForm";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items ( * )
    `
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!order) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Order #{params.id.slice(0, 8)}
      </h1>
      <OrderAdminForm order={order} />
    </div>
  );
}
