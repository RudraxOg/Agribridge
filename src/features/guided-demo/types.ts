import type { RoleKey } from "@/lib/authorization/permissions";

export type TourMode = "interactive" | "preview";
export type TourStatus = "not_started" | "in_progress" | "completed" | "skipped";
export type TourPlacement = "top" | "right" | "bottom" | "left" | "center";
export type TourAction = "next" | "navigate" | "wait-for-user-action";
export type TourStep = {
  /** Stable step identity; never derive this from rendered text. */
  key: string;
  title: string;
  body: string;
  route: (locale: string, organizationSlug?: string) => string;
  anchor?: string;
  permission?: string;
  icon: "field" | "people" | "box" | "shield" | "truck" | "chart" | "wallet";
  placement?: TourPlacement;
  action?: TourAction;
  actionLabel?: string;
  completionRule?: string;
};
export type TourDefinition = { key: string; title: string; steps: TourStep[] };
export type GuidedDemoState = {
  role: RoleKey;
  organization?: { id: string; name: string; slug: string; type: string } | null;
  profile: { displayName: string; preferredLocale: string };
  permissions: string[];
  status: TourStatus;
  currentTourKey?: string | null;
  currentStepKey?: string | null;
  isDemo: boolean;
  active: boolean;
};
