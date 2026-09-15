import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const locales = ["en", "hi", "mr", "pa", "bn", "gu", "te", "ta", "kn", "or"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) return NextResponse.next();
  if (locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) return updateSession(request);
  const saved = request.cookies.get("agribridge_locale")?.value;
  const locale = saved && locales.includes(saved) ? saved : "en";
  return NextResponse.redirect(new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url));
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js).*)"] };
