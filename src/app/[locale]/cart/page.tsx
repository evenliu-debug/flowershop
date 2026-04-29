import { getTranslations } from "next-intl/server";
import { CartView } from "@/components/cart/CartView";

export default async function CartPage() {
  const t = await getTranslations("Cart");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
