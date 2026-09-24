"use client";

import { useEffect, useState } from "react";
import type { GuidedDemoState, TourDefinition } from "../types";
import { GuidedDemoOverlay } from "./GuidedDemoOverlay";

export function GuidedDemoRuntime({ state, locale, save, onClose }: { state: GuidedDemoState; locale: string; save: (action: string, data?: Record<string, unknown>) => Promise<unknown>; onClose: () => void }) {
  const [tour, setTour] = useState<TourDefinition | null>(null);
  useEffect(() => {
    let mounted = true;
    void import("../tours/shared").then(({ tourForRole }) => { if (mounted) setTour(tourForRole(state.role)); });
    return () => { mounted = false; };
  }, [state.role]);
  if (!tour) return null;
  return <GuidedDemoOverlay tour={tour} locale={locale} organizationSlug={state.organization?.slug} permissions={state.permissions} startStep={state.currentStepKey} onPersist={(action, stepKey) => save(action, { stepKey, tourKey: tour.key }).then(() => undefined)} onClose={onClose} />;
}
