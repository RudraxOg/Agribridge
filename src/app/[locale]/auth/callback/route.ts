import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n/routing";
import { resolveAuthOnboardingEntry, resolveSignedInEntry } from "@/lib/auth/resolve-signed-in-entry";
import { isSupabaseAuthEnabled, usesLiveWorkspace } from "@/lib/auth/auth-mode";

export async function GET(request:NextRequest,{params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))return NextResponse.redirect(new URL("/en/sign-in",request.url));const code=request.nextUrl.searchParams.get("code");if(!code||!isSupabaseAuthEnabled())return NextResponse.redirect(new URL(`/${locale}/sign-in?auth=invalid`,request.url));const supabase=await createAuthClient();const {error}=await supabase.auth.exchangeCodeForSession(code);if(error)return NextResponse.redirect(new URL(`/${locale}/sign-in?auth=invalid`,request.url));if(!usesLiveWorkspace())return NextResponse.redirect(new URL((await resolveAuthOnboardingEntry(locale))??`/${locale}/sign-in`,request.url));const decision=await resolveSignedInEntry(locale);return NextResponse.redirect(new URL(decision?.href??`/${locale}/sign-in?auth=invalid`,request.url));}
