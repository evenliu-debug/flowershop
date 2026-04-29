"use client";

import { updateOrderFromForm } from "@/actions/admin";

type Order = {
  id: string;
  status: string;
  subtotal_usd: number;
  shipping_usd: number | null;
  tax_usd: number | null;
  total_usd: number;
  contact_email: string | null;
  shipping_name: string | null;
  shipping_line1: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price_usd: number;
    snapshot_name_en: string;
    snapshot_sku: string;
  }>;
};

export function OrderAdminForm({ order }: { order: Order }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        action={updateOrderFromForm}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="order_id" value={order.id} />
        <h2 className="font-semibold text-slate-900">Update order</h2>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Status</span>
          <select
            name="status"
            defaultValue={order.status}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="pending_confirmation">pending_confirmation</option>
            <option value="confirmed">confirmed</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Shipping USD</span>
          <input
            name="shipping_usd"
            type="number"
            step="0.01"
            defaultValue={order.shipping_usd ?? ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Tax USD</span>
          <input
            name="tax_usd"
            type="number"
            step="0.01"
            defaultValue={order.tax_usd ?? ""}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Save
        </button>
      </form>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Summary</h2>
        <p className="text-sm text-slate-600">Email: {order.contact_email}</p>
        <p className="text-sm text-slate-600">
          Ship to: {order.shipping_name}, {order.shipping_line1}, {order.shipping_city},{" "}
          {order.shipping_country}
        </p>
        <p className="text-sm">
          Subtotal: ${Number(order.subtotal_usd).toFixed(2)}
        </p>
        <p className="text-sm">Total: ${Number(order.total_usd).toFixed(2)}</p>
        <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-200 pt-4">
          {order.order_items.map((i) => (
            <li key={i.id} className="flex justify-between py-2 text-sm">
              <span>
                {i.snapshot_name_en} × {i.quantity}
              </span>
              <span>${(Number(i.unit_price_usd) * i.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
