import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n/routing";

export async function GET(request:NextRequest,{params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))return NextResponse.redirect(new URL("/en/sign-in",request.url));const code=request.nextUrl.searchParams.get("code");const next=safeRedirectPath(request.nextUrl.searchParams.get("next"),`/${locale}/organizations`);if(!code||(process.env.INTEGRATION_MODE??"mock")==="mock")return NextResponse.redirect(new URL(`/${locale}/sign-in?auth=invalid`,request.url));const supabase=await createClient();const {error}=await supabase.auth.exchangeCodeForSession(code);return NextResponse.redirect(new URL(error?`/${locale}/sign-in?auth=invalid`:next,request.url));}
