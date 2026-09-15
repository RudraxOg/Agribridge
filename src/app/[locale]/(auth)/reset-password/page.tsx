import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/auth-forms";
import { requireLocale } from "@/lib/i18n/locale";
export default async function ResetPasswordPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <AuthShell locale={locale} eyebrow="Secure recovery" title="Choose a new password" description="The recovery session must be valid. Other active sessions are signed out after the change."><ResetPasswordForm locale={locale}/></AuthShell>}
