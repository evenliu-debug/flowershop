"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { submitCheckout } from "@/actions/checkout";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { cn } from "@/lib/utils";

type PaymentMethod = "stripe" | "paypal";

export function CheckoutForm() {
  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [payment, setPayment] = useState<PaymentMethod>("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    email: "",
    phone: "",
  });

  async function placeOrder(pay: PaymentMethod) {
    setError(null);
    setLoading(true);
    try {
      const res = await submitCheckout(locale, {
        lines,
        paymentMethod: pay,
        shipping: {
          fullName: form.fullName,
          line1: form.line1,
          line2: form.line2 || undefined,
          city: form.city,
          state: form.state,
          postal: form.postal,
          country: form.country,
        },
        contact: {
          email: form.email,
          phone: form.phone,
        },
      });
      if (!res.ok) {
        setError(t("errorGeneric"));
        setLoading(false);
        return;
      }
      if (pay === "stripe" && res.stripeUrl) {
        clear();
        window.location.href = res.stripeUrl;
        return;
      }
      if (pay === "paypal") {
        setPaypalOrderId(res.orderId);
        setLoading(false);
        return;
      }
    } catch {
      setError(t("errorGeneric"));
    }
    setLoading(false);
  }

  if (lines.length === 0) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {tCart("empty")}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          placeOrder(payment);
        }}
      >
        <fieldset className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            {t("shippingTitle")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t("fullName")}</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">{t("line1")}</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">{t("line2")}</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t("city")}</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t("state")}</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t("postal")}</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">{t("country")}</span>
              <input
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            {t("contactTitle")}
          </legend>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t("email")}</span>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t("phone")}</span>
            <input
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            {t("paymentTitle")}
          </legend>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="pay"
              checked={payment === "stripe"}
              onChange={() => setPayment("stripe")}
              className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span>{t("payStripe")}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="pay"
              checked={payment === "paypal"}
              onChange={() => setPayment("paypal")}
              className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-600"
            />
            <span>{t("payPayPal")}</span>
          </label>
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {t("feeNote")}
          </p>
        </fieldset>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!paypalOrderId && (
          <button
            type="submit"
            disabled={loading || lines.length === 0}
            className={cn(
              "w-full cursor-pointer rounded-md bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:w-auto sm:px-8",
              (loading || lines.length === 0) && "cursor-not-allowed opacity-60"
            )}
          >
            {loading ? t("processing") : t("submitOrder")}
          </button>
        )}
      </form>

      {paypalOrderId && paypalClientId && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm text-slate-600">{t("payPayPal")}</p>
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency: "USD",
              intent: "capture",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async () => {
                const r = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: paypalOrderId }),
                });
                const j = await r.json();
                if (!r.ok) throw new Error(j.error || "paypal");
                return j.paypalOrderId as string;
              }}
              onApprove={async (data) => {
                await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paypalOrderID: data.orderID,
                    internalOrderId: paypalOrderId,
                  }),
                });
                clear();
                router.push(`/account?order=${paypalOrderId}`);
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {paypalOrderId && !paypalClientId && (
        <p className="text-sm text-amber-800">
          PayPal client ID missing — set NEXT_PUBLIC_PAYPAL_CLIENT_ID for sandbox
          buttons.
        </p>
      )}
    </div>
  );
}
