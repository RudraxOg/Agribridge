"use client";

import dynamic from "next/dynamic";

export const LazySequenceViewer = dynamic(
  () => import("./sequence-viewer").then((module) => module.SequenceViewer),
  { ssr: false, loading: () => <div className="aspect-[3/2] animate-pulse bg-[var(--surface-muted)]" aria-label="Loading multi-angle preview" /> },
);
