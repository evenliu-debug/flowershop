"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useCart } from "@/store/cart";

export function AccountOverview({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    if (searchParams.get("order")) {
      clear();
    }
  }, [searchParams, clear]);

  async function logout() {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          {email && (
            <>
              <span className="font-medium text-slate-900">{email}</span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => logout()}
          className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50"
        >
          {t("logout")}
        </button>
      </div>
      {children}
    </div>
  );
}
