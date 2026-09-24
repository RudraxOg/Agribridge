import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OrganizationSetupForm } from "@/components/onboarding/OrganizationSetupForm";
import { requireLocale } from "@/lib/i18n/locale";
export default async function FpoOnboardingPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <OnboardingShell locale={locale} eyebrow="FPO setup" title="Create your FPO workspace" description="Your verified account will receive only the FPO owner role. Operators and finance roles are assigned later through invitations."><OrganizationSetupForm locale={locale} intent="fpo"/></OnboardingShell>}
