import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/auth-forms";
import { requireLocale } from "@/lib/i18n/locale";
import { isSupabaseAuthEnabled } from "@/lib/auth/auth-mode";

export default async function SignInPage({ params,searchParams }:{ params:Promise<{locale:string}>; searchParams:Promise<{next?:string;reset?:string}> }) { const locale=requireLocale((await params).locale); const query=await searchParams;const hi=locale==="hi"; return <AuthShell locale={locale} eyebrow={hi?"फिर से स्वागत है":"Welcome back"} title={hi?"अपने कार्यस्थल में साइन इन करें":"Sign in to your workspace"} description={hi?"अपने सत्यापित कार्य खाते का उपयोग करें। पहुँच सक्रिय संगठन सदस्यता और अनुमतियों पर निर्भर है।":"Use your verified work account. Access depends on your active organization membership and permissions."}>{query.reset==="complete"&&<p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">Password updated. Sign in with the new password.</p>}<SignInForm locale={locale} next={query.next} demoMode={!isSupabaseAuthEnabled()}/></AuthShell>; }
