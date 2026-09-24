"use client";

import { Building2, CirclePlay, TimerReset } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGuidedDemo } from "@/features/guided-demo";
import { roleHome, type RoleKey } from "@/lib/authorization/permissions";
import { RoleJourneyCard } from "./RoleJourneyCard";

export function WelcomeExperience({ locale, role, organizationSlug }: { locale: string; role: RoleKey; organizationSlug?: string }) {
  const router = useRouter();
  const { start, loading } = useGuidedDemo();
  const skip = async () => {
    await fetch("/api/guided-demo/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "skip" }) });
    router.push(roleHome(locale, role, organizationSlug));
  };
  return <div className="grid gap-4 md:grid-cols-3">
    <RoleJourneyCard icon={CirclePlay} title="Explore guided demo" body="Use real role-aware routes and safe synthetic records. Takes about 3 minutes." action={() => void start()} disabled={loading} variant="primary" />
    <RoleJourneyCard icon={Building2} title="Set up my workspace" body="Review the practical checklist for your organization and role." action={() => router.push(`/${locale}/onboarding/checklist`)} />
    <RoleJourneyCard icon={TimerReset} title="I’ll do this later" body="Go to your workspace now. You can restart the tour from Help." action={() => void skip()} />
  </div>;
}
