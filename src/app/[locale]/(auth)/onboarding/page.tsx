import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { requireLocale } from "@/lib/i18n/locale";
export default async function OnboardingPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <AuthShell locale={locale} logoSize="large" eyebrow="Organization setup" title="Create your operating workspace" description="Add the minimum details now. Collection centres, buyer delivery sites, or fleet details come next."><OnboardingForm locale={locale}/></AuthShell>}
