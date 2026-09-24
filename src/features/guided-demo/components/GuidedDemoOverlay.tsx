"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { eligibleTourSteps } from "../lib/tour-eligibility";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useTourAnchor } from "../hooks/useTourAnchor";
import type { TourDefinition } from "../types";
import { TourCard } from "./TourCard";
import { TourControls } from "./TourControls";
import { TourStepFallback } from "./TourStepFallback";

type Props = { tour: TourDefinition; locale: string; organizationSlug?: string; permissions: string[]; startStep?: string | null; onPersist: (action: "update" | "skip" | "complete" | "exit", stepKey?: string) => Promise<void>; onClose: () => void };

export function GuidedDemoOverlay({ tour, locale, organizationSlug, permissions, startStep, onPersist, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const steps = useMemo(() => eligibleTourSteps(tour, permissions), [permissions, tour]);
  const [index, setIndex] = useState(() => Math.max(0, steps.findIndex((step) => step.key === startStep)));
  const [missing, setMissing] = useState(false);
  const step = steps[index] ?? steps[0];
  const element = useTourAnchor(step?.anchor);
  const lastPersistedStep = useRef<string | null>(null);
  const persist = useCallback(async (action: "update" | "skip" | "complete" | "exit", stepKey?: string) => {
    try {
      await onPersist(action, stepKey);
    } catch {
      // Background progress writes must never crash the guided demo.
    }
  }, [onPersist]);

  useEffect(() => {
    if (!step) return;
    const route = step.route(locale, organizationSlug);
    if (pathname !== route) router.push(route);
    if (lastPersistedStep.current !== step.key) {
      lastPersistedStep.current = step.key;
      void persist("update", step.key);
    }
  }, [locale, organizationSlug, pathname, persist, router, step]);
  useEffect(() => {
    const task = window.setTimeout(() => setMissing(!element), 900);
    if (element) {
      element.setAttribute("data-tour-active", "true");
      element.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
    }
    return () => { window.clearTimeout(task); element?.removeAttribute("data-tour-active"); };
  }, [element, reducedMotion, step]);
  const next = useCallback(async () => {
    if (!step) return;
    if (index >= steps.length - 1) { await persist("complete", step.key); onClose(); return; }
    setIndex((value) => value + 1);
  }, [index, onClose, persist, step, steps.length]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { void persist("exit", step?.key); onClose(); }
      if (event.key === "ArrowLeft" && index > 0) setIndex((value) => value - 1);
      if (event.key === "ArrowRight") void next();
      if (event.key === "Tab" && cardRef.current) {
        const focusable = cardRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], input, select, textarea");
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, next, onClose, persist, step]);
  if (!step) return null;
  const box = element?.getBoundingClientRect();
  return <div className="fixed inset-0 z-[90]" aria-live="polite" aria-label={`Guided demo: ${step.title}`}>
    <div className="absolute inset-0 bg-[rgb(13_53_32_/_62%)] backdrop-blur-[2px]" />
    {box && <div aria-hidden className="pointer-events-none absolute rounded-2xl ring-4 ring-[var(--harvest)] shadow-[0_0_0_9999px_rgb(13_53_32_/_42%)]" style={{ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 }} />}
    <div className="fixed inset-x-0 bottom-0 p-2 sm:p-4 md:inset-x-auto md:right-6 md:bottom-6 md:w-[25rem]" ref={cardRef} role="dialog" aria-modal="true">
      <TourCard step={step} current={index + 1} total={steps.length} mode="interactive">
        {missing && <TourStepFallback onRetry={() => setMissing(false)} />}
        <TourControls isFirst={index === 0} isLast={index === steps.length - 1} onBack={() => setIndex((value) => Math.max(0, value - 1))} onNext={() => void next()} onSkip={() => { void persist("skip", step.key); onClose(); }} onExit={() => { void persist("exit", step.key); onClose(); }} />
      </TourCard>
    </div>
  </div>;
}
