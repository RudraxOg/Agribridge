import { completeOrganizationSetupAction } from "@/features/auth/onboarding-actions";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { SetupChecklistCard } from "@/components/onboarding/SetupChecklistCard";
import { buttonVariants } from "@/components/ui/button";
import { getSetupChecklist } from "@/features/onboarding/server/get-setup-checklist";
import { requireLocale } from "@/lib/i18n/locale";

export default async function OnboardingChecklistPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const checklist = await getSetupChecklist(locale);
  if (!checklist) return <OnboardingShell locale={locale} eyebrow="Workspace required" title="Choose an organization first." description="Your setup checklist is always scoped to an authorized organization."><div /></OnboardingShell>;
  return <OnboardingShell locale={locale} eyebrow="Step 3 of 3" title="Set up one thing at a time." description={checklist.simulated ? "Demo items are visibly simulated and never modify a real organization." : "Checklist completion is calculated from records in your authorized workspace."}><SetupChecklistCard items={checklist.items} /><form action={completeOrganizationSetupAction.bind(null, locale)}><button className={`${buttonVariants({ size: "lg" })} mt-6 w-full`} type="submit">Continue to guided demo</button></form></OnboardingShell>;
}
