"use client";

import dynamic from "next/dynamic";

export const TrackingMap = dynamic(
  () => import("./tracking-map").then((module) => module.TrackingMap),
  { ssr: false, loading: () => <div className="h-[360px] animate-pulse rounded-2xl bg-[var(--surface-muted)]" aria-label="Loading route map" /> },
);
