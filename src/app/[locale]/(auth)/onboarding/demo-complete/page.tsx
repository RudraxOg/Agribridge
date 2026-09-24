import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { CompletionCelebration } from "@/components/onboarding/CompletionCelebration";
import { getDemoAccessContext } from "@/features/guided-demo/lib/get-demo-access-context";
import { roleHome } from "@/lib/authorization/permissions";
import { requireLocale } from "@/lib/i18n/locale";

export default async function DemoCompletePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const access = await getDemoAccessContext();
  const href = access ? roleHome(locale, access.role, access.organization?.slug) : `/${locale}/sign-in`;
  return <OnboardingShell locale={locale} eyebrow="Guided demo" title="A calmer way to start." description="The essentials are now mapped to your role and permissions."><CompletionCelebration href={href} /></OnboardingShell>;
}
