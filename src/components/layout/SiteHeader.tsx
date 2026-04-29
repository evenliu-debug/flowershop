"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const count = lines.reduce((a, l) => a + l.quantity, 0);
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "en" ? "zh" : "en";
  const otherLabel = locale === "en" ? "中文" : "EN";

  const linkClass =
    "text-slate-600 transition-colors duration-200 hover:text-slate-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900 transition-opacity duration-200 hover:opacity-80"
        >
          Even Shop
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main"
        >
          <Link href="/" className={linkClass}>
            {t("home")}
          </Link>
          <Link href="/products" className={linkClass}>
            {t("products")}
          </Link>
          <Link href="/about" className={linkClass}>
            {t("about")}
          </Link>
          <Link href="/contact" className={linkClass}>
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={pathname}
            locale={otherLocale}
            className={cn(
              linkClass,
              "rounded-md border border-slate-200 px-2 py-1 text-sm font-medium"
            )}
            prefetch={false}
          >
            {otherLabel}
          </Link>

          <Link
            href="/cart"
            className={cn(
              linkClass,
              "relative inline-flex cursor-pointer items-center gap-1 rounded-md p-2"
            )}
            aria-label={t("cart")}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className={cn(
              linkClass,
              "inline-flex cursor-pointer items-center rounded-md p-2"
            )}
            aria-label={t("account")}
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            type="button"
            className="inline-flex cursor-pointer rounded-md p-2 text-slate-600 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/" className={linkClass} onClick={() => setOpen(false)}>
              {t("home")}
            </Link>
            <Link
              href="/products"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t("products")}
            </Link>
            <Link
              href="/about"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t("contact")}
            </Link>
            <Link
              href="/login"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {t("login")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
