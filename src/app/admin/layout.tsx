import { NextIntlClientProvider } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import en from "../../../messages/en.json";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/en/login?redirect=/admin");
  }
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
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
