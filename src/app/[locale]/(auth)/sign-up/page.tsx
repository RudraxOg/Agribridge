import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/auth-forms";
import { requireLocale } from "@/lib/i18n/locale";
export default async function SignUpPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <AuthShell locale={locale} eyebrow="Create a workspace" title="Start with a verified account" description="Your account type selects onboarding only. Ownership is created by a validated server transaction after email verification."><SignUpForm locale={locale}/></AuthShell>}
