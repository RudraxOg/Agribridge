"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { configuredAuthOrigin, safeRedirectPath } from "@/lib/auth/redirects";
import { checkLocalRateLimit, privacyKey } from "@/lib/security/rate-limit";

export type AuthActionState = { status: "idle" | "error" | "success"; message: string };
export const initialAuthState: AuthActionState = { status: "idle", message: "" };

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z.string().min(10).max(128);
const localeSchema = z.enum(["en","hi","mr","pa","bn","gu","te","ta","kn","or"]);

async function limited(namespace: string, identifier: string, limit = 5) {
  const requestHeaders = await headers();
  const networkHint = requestHeaders.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const subjectHash=privacyKey([identifier,networkHint]);
  if((process.env.INTEGRATION_MODE??"mock")!=="mock"){
    try{const supabase=await createClient();const{data,error}=await supabase.rpc("consume_rate_limit",{limit_namespace:namespace,limit_subject_hash:subjectHash,max_hits:limit,window_seconds:600});return{allowed:!error&&data===true,retryAfterSeconds:600,remaining:0};}catch{return{allowed:false,retryAfterSeconds:600,remaining:0};}
  }
  return checkLocalRateLimit(namespace, subjectHash, limit, 10 * 60_000);
}

function authUnavailable(): AuthActionState {
  return { status: "error", message: "Live authentication is not configured. Use the clearly labelled guided demo, or add Supabase credentials." };
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ email: emailSchema, password: z.string().min(1).max(128), locale: localeSchema, next: z.string().optional() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Check the email and password, then try again." };
  if (!(await limited("sign-in", parsed.data.email)).allowed) return { status: "error", message: "Too many attempts. Wait a few minutes before trying again." };
  if ((process.env.INTEGRATION_MODE ?? "mock") === "mock") return authUnavailable();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { status: "error", message: "We could not sign you in with those details." };
  redirect(safeRedirectPath(parsed.data.next, `/${parsed.data.locale}/organizations`));
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({
    accountType: z.enum(["fpo","buyer","logistics"]), displayName: z.string().trim().min(2).max(120),
    organizationName: z.string().trim().min(2).max(180), email: emailSchema, password: passwordSchema,
    consent: z.literal("on"), locale: localeSchema,
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Complete every required field and use a password of at least 10 characters." };
  if (!(await limited("sign-up", parsed.data.email, 3)).allowed) return { status: "error", message: "Too many sign-up attempts. Please wait before trying again." };
  if ((process.env.INTEGRATION_MODE ?? "mock") === "mock") return authUnavailable();
  const origin = configuredAuthOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email, password: parsed.data.password,
    options: { emailRedirectTo: `${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/onboarding`, data: { display_name: parsed.data.displayName, onboarding_type: parsed.data.accountType, organization_name: parsed.data.organizationName } },
  });
  if (error) return { status: "error", message: "If this address can be registered, we will send verification instructions." };
  redirect(`/${parsed.data.locale}/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function forgotPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ email: emailSchema, locale: localeSchema }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };
  const outcome = { status: "success", message: "If an account exists, password reset instructions will arrive shortly." } as const;
  if (!(await limited("password-recovery", parsed.data.email, 3)).allowed) return outcome;
  if ((process.env.INTEGRATION_MODE ?? "mock") === "mock") return outcome;
  const origin = configuredAuthOrigin();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/reset-password` });
  return outcome;
}

export async function resendVerificationAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ email: emailSchema, locale: localeSchema }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Enter the email address used to sign up." };
  const outcome = { status: "success", message: "If verification is still required, a fresh email will arrive shortly." } as const;
  if (!(await limited("verification-resend",parsed.data.email,2)).allowed) return outcome;
  if ((process.env.INTEGRATION_MODE ?? "mock") === "mock") return outcome;
  const origin=configuredAuthOrigin();
  const supabase=await createClient();
  await supabase.auth.resend({ type:"signup", email:parsed.data.email, options:{ emailRedirectTo:`${origin}/${parsed.data.locale}/auth/callback?next=/${parsed.data.locale}/onboarding` } });
  return outcome;
}

export async function resetPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = z.object({ password: passwordSchema, confirmation: z.string(), locale: localeSchema }).refine((data) => data.password === data.confirmation).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Passwords must match and contain at least 10 characters." };
  if ((process.env.INTEGRATION_MODE ?? "mock") === "mock") return authUnavailable();
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: "This recovery link is invalid or expired. Request a new one." };
  await supabase.auth.signOut({ scope: "others" });
  redirect(`/${parsed.data.locale}/sign-in?reset=complete`);
}
