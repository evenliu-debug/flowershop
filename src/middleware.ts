import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

async function refreshSessionOnResponse(
  request: NextRequest,
  response: NextResponse
) {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const needsAuth =
    /^\/(en|zh)\/checkout/.test(path) || /^\/(en|zh)\/account/.test(path);
  const authLocale = path.match(/^\/(en|zh)\//)?.[1];
  if (needsAuth && !user && authLocale) {
    const locale = authLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/en/login", request.url);
      loginUrl.searchParams.set("redirect", "/admin");
      return NextResponse.redirect(loginUrl);
    }
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api")) {
    const res = NextResponse.next({ request });
    return refreshSessionOnResponse(request, res);
  }

  if (path.startsWith("/admin")) {
    const res = NextResponse.next({ request });
    return refreshSessionOnResponse(request, res);
  }

  const intlResponse = intlMiddleware(request);
  return refreshSessionOnResponse(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
