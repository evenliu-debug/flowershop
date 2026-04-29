import { NextIntlClientProvider } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";
import Link from "next/link";
import en from "../../../messages/en.json";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Supabase environment variables are not configured. Set
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel
          and redeploy.
        </p>
      </div>
    );
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Could not initialize Supabase on the server. Please retry after
          redeploying.
        </p>
      </div>
    );
  }

  let userId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/en/login?redirect=/admin");
    userId = user.id;
  } catch {
    redirect("/en/login?redirect=/admin");
  }

  try {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId!)
      .maybeSingle();
    if (profile?.role !== "admin") redirect("/en");
  } catch {
    redirect("/en");
  }

  return (
    <NextIntlClientProvider locale="en" messages={en}>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/admin" className="font-semibold text-slate-900">
              Admin
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              <Link href="/admin" className="hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-slate-900">
                Products
              </Link>
              <Link href="/admin/orders" className="hover:text-slate-900">
                Orders
              </Link>
              <Link href="/admin/categories" className="hover:text-slate-900">
                Categories
              </Link>
              <Link href="/en" className="text-blue-700 hover:text-blue-800">
                Storefront
              </Link>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </div>
    </NextIntlClientProvider>
  );
}
