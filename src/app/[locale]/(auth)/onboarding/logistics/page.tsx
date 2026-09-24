import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OrganizationSetupForm } from "@/components/onboarding/OrganizationSetupForm";
import { requireLocale } from "@/lib/i18n/locale";
export default async function LogisticsOnboardingPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <OnboardingShell locale={locale} eyebrow="Logistics setup" title="Create your logistics workspace" description="Your verified account will receive only the logistics owner role. Dispatchers and drivers are assigned later through invitations."><OrganizationSetupForm locale={locale} intent="logistics"/></OnboardingShell>}
