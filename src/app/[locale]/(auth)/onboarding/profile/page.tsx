import Link from "next/link";
import { UserRound } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { buttonVariants } from "@/components/ui/button";
import { requireLocale } from "@/lib/i18n/locale";

export default async function ProfileOnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  return <OnboardingShell locale={locale} eyebrow="Step 1 of 3" title="A few details, then you are ready." description="Use a name your teammates and buyers will recognize. You can change it later from Settings."><div className="grid place-items-center py-8 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-[var(--surface-muted)] text-[var(--forest)]"><UserRound aria-hidden /></span><h2 className="mt-5 text-xl font-black">Your profile is ready to complete</h2><p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">For demo access, we keep personal data synthetic and minimal.</p><Link className={`${buttonVariants({ size: "lg" })} mt-6`} href={`/${locale}/onboarding/organization`}>Continue to workspace setup</Link></div></OnboardingShell>;
}
