"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useDemoProgress } from "../hooks/useDemoProgress";

const GuidedDemoRuntime = dynamic(() => import("./GuidedDemoRuntime").then((module) => module.GuidedDemoRuntime), { ssr: false, loading: () => null });

type Context = { start: (mode?: "interactive" | "preview") => Promise<void>; restart: () => Promise<void>; active: boolean; loading: boolean };
export const GuidedDemoContext = createContext<Context | null>(null);

async function loadFirstStep(role: string, permissions: string[]) {
  const { eligibleTourSteps } = await import("../lib/tour-eligibility");
  const { tourForRole } = await import("../tours/shared");
  return { tour: tourForRole(role as never), step: eligibleTourSteps(tourForRole(role as never), permissions)[0] };
}

export function GuidedDemoProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const { state, error, refresh, save } = useDemoProgress();
  const [active, setActive] = useState(false);
  const pathname = usePathname();
  const start = useCallback(async (mode: "interactive" | "preview" = "interactive") => {
    if (!state) return;
    const { tour, step } = await loadFirstStep(state.role, state.permissions);
    if (!step) return;
    await save("start", { tourKey: tour.key, stepKey: step.key, mode: state.isDemo ? mode : "preview" });
    setActive(true);
  }, [save, state]);
  const restart = useCallback(async () => {
    if (!state) return;
    const { tour, step } = await loadFirstStep(state.role, state.permissions);
    if (!step) return;
    await save("restart", { tourKey: tour.key, stepKey: step.key });
    setActive(true);
  }, [save, state]);
  const context = useMemo(() => ({ start, restart, active, loading: !state }), [active, restart, start, state]);
  const demoState = state;
  const shouldShow = Boolean(demoState && (active || demoState.active) && !pathname.includes("/onboarding/welcome"));
  return <GuidedDemoContext.Provider value={context}>
    {children}
    {shouldShow && demoState && <GuidedDemoRuntime state={demoState} locale={locale} save={save} onClose={() => { setActive(false); void refresh(); }} />}
    {error && <button type="button" className="fixed right-4 bottom-4 z-[91] min-h-11 rounded-xl bg-white px-3 text-sm font-bold text-[var(--danger)] shadow-[var(--shadow-md)]" onClick={() => void refresh()}>{error} Retry</button>}
  </GuidedDemoContext.Provider>;
}
