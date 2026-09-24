"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthClient, createClient } from "@/lib/supabase/server";
import { configuredAuthOrigin } from "@/lib/auth/redirects";
import { checkLocalRateLimit, privacyKey } from "@/lib/security/rate-limit";
import { demoAuthCredentials } from "./demo-credentials";
import type { AuthActionState } from "./action-state";
import { resolveAuthOnboardingEntry, resolveSignedInEntry } from "@/lib/auth/resolve-signed-in-entry";
import { isSupabaseAuthEnabled, usesLiveWorkspace } from "@/lib/auth/auth-mode";

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z.string().min(10).max(128);
const localeSchema = z.enum(["en","hi","mr","pa","bn","gu","te","ta","kn","or"]);

async function limited(namespace: string, identifier: string, limit = 5) {
  const requestHeaders = await headers();
  const networkHint = requestHeaders.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const subjectHash=privacyKey([identifier,networkHint]);
  if (usesLiveWorkspace()) {
    try{const supabase=await createClient();const{data,error}=await supabase.rpc("consume_rate_limit",{limit_namespace:namespace,limit_subject_hash:subjectHash,max_hits:limit,window_seconds:600});return{allowed:!error&&data===true,retryAfterSeconds:600,remaining:0};}catch{return{allowed:false,retryAfterSeconds:600,remaining:0};}
  }
  return checkLocalRateLimit(namespace, subjectHash, limit, 10 * 60_000);
}

function authUnavailable(): AuthActionState {
  return { status: "error", message: "Supabase authentication is not enabled in this environment. Use the clearly labelled guided demo, or set AUTH_MODE=supabase." };
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ email: z.string().trim().max(254).min(1), password: z.string().min(1).max(128), locale: localeSchema, next: z.string().optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Check the email and password, then try again." };
  const identifier = parsed.data.email.toLowerCase();
  if ((isSupabaseAuthEnabled() || identifier !== demoAuthCredentials.username) && !emailSchema.safeParse(identifier).success) return { status: "error", message: isSupabaseAuthEnabled() ? "Enter your account email address." : "Enter a valid email address or the demo username." };
  if (!isSupabaseAuthEnabled()) {
    if (identifier !== demoAuthCredentials.username || parsed.data.password !== demoAuthCredentials.password) return { status: "error", message: "We could not sign you in with those details." };
    // The fixed local-only demo identity is not an account credential. Keeping
    // it outside the shared development rate bucket prevents parallel browser
    // projects and repeated guided-demo sessions from locking one another out.
    const store = await cookies();
    const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 };
    store.set("agribridge_demo_auth", "authenticated", cookieOptions);
    store.set("agribridge_demo_role", "fpo", cookieOptions);
    // Mock sign-in always enters the isolated demo onboarding; no live database
    // round trip is needed before the HTTP-only demo cookies take effect.
    redirect(`/${parsed.data.locale}/onboarding/welcome`);
  }
  if (!(await limited("sign-in", identifier)).allowed) return { status: "error", message: "Too many attempts. Wait a few minutes before trying again." };
  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email: identifier, password: parsed.data.password });
  if (error) return { status: "error", message: "Email or password did not match. Check your account details and try again." };
  if (!usesLiveWorkspace()) redirect((await resolveAuthOnboardingEntry(parsed.data.locale)) ?? `/${parsed.data.locale}/sign-in`);
  const decision=await resolveSignedInEntry(parsed.data.locale);
  redirect(decision?.href ?? `/${parsed.data.locale}/onboarding/welcome`);
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({
    accountType: z.enum(["fpo","buyer","logistics"]), displayName: z.string().trim().min(2).max(120),
    organizationName: z.string().trim().min(2).max(180), email: emailSchema, password: passwordSchema, confirmation: z.string(),
    phone: z.string().trim().max(32).optional(), preferredLocale: localeSchema.optional(), consent: z.literal("on"), locale: localeSchema,
  }).refine((value)=>value.password===value.confirmation,{message:"Passwords do not match."}).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Complete every required field, confirm your password, and use at least 10 characters." };
  if (!(await limited("sign-up", parsed.data.email, 3)).allowed) return { status: "error", message: "Too many sign-up attempts. Please wait before trying again." };
  if (!isSupabaseAuthEnabled()) return authUnavailable();
  const origin = configuredAuthOrigin();
  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email, password: parsed.data.password,
    options: { emailRedirectTo: `${origin}/${parsed.data.locale}/auth/callback`, data: { display_name: parsed.data.displayName, signup_intent: parsed.data.accountType, preferred_locale: parsed.data.preferredLocale ?? parsed.data.locale, organization_name: parsed.data.organizationName, phone: parsed.data.phone || undefined } },
  });
  if (error) return { status: "error", message: "If this address can be registered, we will send verification instructions." };
  redirect(`/${parsed.data.locale}/verify-email?email=${encodeURIComponent(parsed.data.email)}&intent=${parsed.data.accountType}`);
}

export async function forgotPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ email: emailSchema, locale: localeSchema }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };
  const outcome = { status: "success", message: "If an account exists, password reset instructions will arrive shortly." } as const;
  if (!(await limited("password-recovery", parsed.data.email, 3)).allowed) return outcome;
  if (!isSupabaseAuthEnabled()) return outcome;
  const origin = configuredAuthOrigin();
  const supabase = await createAuthClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/reset-password` });
  return outcome;
}

export async function resendVerificationAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ email: emailSchema, locale: localeSchema }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Enter the email address used to sign up." };
  const outcome = { status: "success", message: "If verification is still required, a fresh email will arrive shortly." } as const;
  if (!(await limited("verification-resend",parsed.data.email,2)).allowed) return outcome;
  if (!isSupabaseAuthEnabled()) return outcome;
  const origin=configuredAuthOrigin();
  const supabase=await createAuthClient();
  await supabase.auth.resend({ type:"signup", email:parsed.data.email, options:{ emailRedirectTo:`${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/onboarding` } });
  return outcome;
}

export async function resetPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ password: passwordSchema, confirmation: z.string(), locale: localeSchema }).refine((data) => data.password === data.confirmation).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Passwords must match and contain at least 10 characters." };
  if (!isSupabaseAuthEnabled()) return authUnavailable();
  const supabase = await createAuthClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: "This recovery link is invalid or expired. Request a new one." };
  await supabase.auth.signOut({ scope: "others" });
  redirect(`/${parsed.data.locale}/sign-in?reset=complete`);
}
