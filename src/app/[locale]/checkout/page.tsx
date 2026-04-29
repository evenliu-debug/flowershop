import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  const t = await getTranslations("Checkout");

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("feeNote")}</p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
