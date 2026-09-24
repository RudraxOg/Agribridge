import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OrganizationSetupForm } from "@/components/onboarding/OrganizationSetupForm";
import { requireLocale } from "@/lib/i18n/locale";
export default async function BuyerOnboardingPage({params}:{params:Promise<{locale:string}>}){const locale=requireLocale((await params).locale);return <OnboardingShell locale={locale} eyebrow="Buyer setup" title="Create your buyer workspace" description="Your verified account will receive only the buyer owner role. Procurement and finance roles are assigned later through invitations."><OrganizationSetupForm locale={locale} intent="buyer"/></OnboardingShell>}
