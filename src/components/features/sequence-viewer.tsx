"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SequenceViewer({ crop = "potato" }: { crop?: "potato" | "tomato" }) {
  const [frame, setFrame] = useState(1);
  const drag = useRef<{ x: number; frame: number } | null>(null);
  const move = (delta: number) => setFrame((current) => ((current - 1 + delta + 12) % 12) + 1);
  return <div><div className="relative aspect-[3/2] touch-pan-y overflow-hidden bg-[var(--surface-muted)]" onPointerDown={(event) => { drag.current = { x: event.clientX, frame }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (!drag.current) return; const delta = Math.round((drag.current.x - event.clientX) / 24); setFrame(((drag.current.frame - 1 + delta + 120) % 12) + 1); }} onPointerUp={() => { drag.current = null; }}>
    <Image priority src={`/generated/360/${crop}/frame-${String(frame).padStart(2, "0")}.svg`} alt={`${crop} crate multi-angle demo, frame ${frame} of 12`} fill sizes="(max-width: 1024px) 100vw, 50vw" draggable={false} className="select-none object-cover" />
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--forest-deep)]/85 px-3 py-2 text-xs font-bold whitespace-nowrap text-white"><MoveHorizontal aria-hidden size={16} />Drag or swipe · {frame}/12</div>
  </div><div className="flex items-center justify-between gap-3 border-t border-[var(--border)] p-4"><Button type="button" variant="secondary" onClick={() => move(-1)} aria-label="Previous viewing angle"><ChevronLeft aria-hidden />Previous</Button><p className="hidden text-center text-xs font-semibold text-[var(--text-muted)] sm:block">Synthetic multi-angle demo—not evidence of the actual lot</p><Button type="button" variant="secondary" onClick={() => move(1)} aria-label="Next viewing angle">Next<ChevronRight aria-hidden /></Button></div></div>;
}
