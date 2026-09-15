import { AuthShell } from "@/components/auth/auth-shell";
import { AcceptInviteForm } from "@/components/auth/accept-invite-form";
import { requireLocale } from "@/lib/i18n/locale";
export default async function AcceptInvitePage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{token?:string}>}){const locale=requireLocale((await params).locale);const{token}=await searchParams;return <AuthShell locale={locale} eyebrow="Organization invitation" title="Join a trusted workspace" description="Sign in with the exact invited email. Invitations expire, can be used once, and never grant a platform role."><AcceptInviteForm locale={locale} token={token}/></AuthShell>}
