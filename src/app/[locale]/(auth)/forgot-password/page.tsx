import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";
import { requireLocale } from "@/lib/i18n/locale";
export default async function ForgotPasswordPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <AuthShell locale={locale} eyebrow="Account recovery" title="Reset your password" description="For privacy, the response is the same whether or not an account exists."><ForgotPasswordForm locale={locale}/></AuthShell>}
