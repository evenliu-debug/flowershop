"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createBrowserSupabase();
    const origin = window.location.origin;
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/en/account`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">{t("registerTitle")}</h1>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">{t("email")}</span>
        <input
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">{t("password")}</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={6}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-md bg-blue-700 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? "…" : t("submitRegister")}
      </button>
      <p className="text-center text-sm text-slate-600">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-blue-700 hover:text-blue-800">
          {t("loginTitle")}
        </Link>
      </p>
    </form>
  );
}
