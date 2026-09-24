import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OrganizationSetupForm } from "@/components/onboarding/OrganizationSetupForm";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OrganizationOnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  return <OnboardingShell locale={locale} eyebrow="Step 2 of 3" title="Create your working space." description="Your organization controls access to records, teammates and demo data."><OrganizationSetupForm locale={locale} /></OnboardingShell>;
}
