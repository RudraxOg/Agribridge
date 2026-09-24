"use client";

import { useEffect, useState } from "react";

export function useTourAnchor(anchor?: string) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const task = window.setTimeout(() => setElement(anchor ? document.querySelector<HTMLElement>(`[data-tour="${anchor}"]`) : null), 0);
    if (!anchor) return () => window.clearTimeout(task);
    const observer = new MutationObserver(() => {
      const target = document.querySelector<HTMLElement>(`[data-tour="${anchor}"]`);
      setElement((current) => current === target ? current : target);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.clearTimeout(task); observer.disconnect(); };
  }, [anchor]);
  return element;
}
