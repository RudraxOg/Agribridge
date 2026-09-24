import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "hi", "mr", "pa", "bn", "gu", "te", "ta", "kn", "or"];
const sessionRoutePrefixes = [
  "/organizations",
  "/fpo",
  "/buyer",
  "/platform",
  "/settings",
  "/notifications",
  "/shipments",
  "/settlements",
  "/calls",
  "/onboarding",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) return NextResponse.next();
  const locale = locales.find((value) => pathname === `/${value}` || pathname.startsWith(`/${value}/`));
  if (locale) {
    const hasLiveSupabaseWorkspace = process.env.INTEGRATION_MODE === "live" && Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    );
    const localPath = pathname.slice(`/${locale}`.length) || "/";
    const needsSession = sessionRoutePrefixes.some(
      (prefix) => localPath === prefix || localPath.startsWith(`${prefix}/`),
    );
    if (hasLiveSupabaseWorkspace && needsSession) {
      const { updateSession } = await import("@/lib/supabase/proxy");
      return updateSession(request);
    }
    return NextResponse.next();
  }
  const saved = request.cookies.get("agribridge_locale")?.value;
  const fallbackLocale = saved && locales.includes(saved) ? saved : "en";
  return NextResponse.redirect(new URL(`/${fallbackLocale}${pathname === "/" ? "" : pathname}`, request.url));
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js).*)"] };
