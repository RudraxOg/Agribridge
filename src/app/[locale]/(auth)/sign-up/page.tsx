import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/auth-forms";
import { requireLocale } from "@/lib/i18n/locale";
import { isSupabaseAuthEnabled } from "@/lib/auth/auth-mode";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function SignUpPage({params}:{params:Promise<{locale:string}>}){
  const locale=requireLocale((await params).locale);
  if(!isSupabaseAuthEnabled())return <AuthShell locale={locale} eyebrow="Guided prototype" title="Explore a working view first" description="Account registration is available only in the Supabase authentication environment. This environment keeps every workflow safely simulated.">
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5" aria-labelledby="demo-entry-title">
      <span className="grid size-12 place-items-center rounded-xl bg-[var(--forest)] text-white"><Compass aria-hidden size={22}/></span>
      <h2 id="demo-entry-title" className="mt-4 text-xl font-black">Choose a demo workspace</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Try the FPO, buyer, logistics, driver, or platform view. Demo activity never creates a real account or changes Supabase records.</p>
      <Link href={`/${locale}/demo-role`} className={`${buttonVariants()} mt-5 w-full`}>Explore the guided demo <ArrowRight aria-hidden size={18}/></Link>
    </section>
    <p className="mt-5 text-center text-sm text-[var(--text-muted)]">Already have an account in the authentication environment? <Link className="font-bold text-[var(--forest)]" href={`/${locale}/sign-in`}>Sign in</Link></p>
  </AuthShell>;
  return <AuthShell locale={locale} eyebrow="Create a workspace" title="Start with a verified account" description="Your account type selects onboarding only. Ownership is created by a validated server transaction after email verification."><SignUpForm locale={locale}/></AuthShell>;
}
