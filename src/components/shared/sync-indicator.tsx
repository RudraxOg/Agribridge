"use client";
import { useEffect, useState } from "react";
import { CloudOff, Cloudy } from "lucide-react";

export function SyncIndicator() {
  const [online, setOnline] = useState(true);
  useEffect(() => { const update = () => setOnline(navigator.onLine); update(); addEventListener("online", update); addEventListener("offline", update); return () => { removeEventListener("online", update); removeEventListener("offline", update); }; }, []);
  return <span className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[var(--text-muted)]" title={online ? "Last synced just now" : "Drafts will sync when connected"}>{online ? <Cloudy aria-hidden size={17} /> : <CloudOff aria-hidden size={17} />}{online ? "Synced just now" : "Working offline"}</span>;
}
