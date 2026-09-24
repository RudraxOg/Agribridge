"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { GuidedDemoState } from "../types";

const guidedSurfacePattern = /\/(?:onboarding\/(?:welcome|checklist|demo-complete)|fpo(?:\/|$)|buyer(?:\/|$)|logistics(?:\/|$)|shipments(?:\/|$)|settlements(?:\/|$)|calls(?:\/|$)|platform(?:\/|$)|organizations(?:\/|$))/;

function isGuidedSurface(pathname: string) {
  return guidedSurfacePattern.test(pathname);
}

async function requestWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function useDemoProgress() {
  const [state, setState] = useState<GuidedDemoState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const enabled = isGuidedSurface(pathname);
  const refresh = useCallback(async () => {
    try {
      const response = await requestWithTimeout("/api/guided-demo/progress", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load tour progress");
      const nextState = await response.json() as GuidedDemoState;
      startTransition(() => { setState(nextState); setError(null); });
    } catch {
      startTransition(() => setError("Tour progress is unavailable. Check your connection and retry."));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const task = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(task);
  }, [enabled, refresh]);

  const save = useCallback(async (action: string, data: Record<string, unknown> = {}) => {
    try {
      const response = await requestWithTimeout("/api/guided-demo/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...data }) });
      if (!response.ok) throw new Error("Could not save tour progress");
      const result = await response.json();
      await refresh();
      return result;
    } catch {
      // Background progress writes must never crash the guided demo.
      startTransition(() => setError("Tour progress could not be saved. The demo can continue offline."));
      return { ok: false, offline: true };
    }
  }, [refresh]);

  return { state, error, refresh, save };
}
