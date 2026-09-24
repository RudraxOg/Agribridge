import { CloudRain, Wheat } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/shared/status-chip";

export default function CropCalendarPage() {
  const weeks = ["14–20 Sep", "21–27 Sep", "28 Sep–4 Oct", "5–11 Oct"];
  const rows = [["Kufri potato · 86 farmers", 1, "Harvest", Wheat], ["Pusa 1509 paddy · 142 farmers", 2, "Harvest", Wheat], ["Tomato · 38 farmers", 0, "Rain watch", CloudRain]] as const;
  return <><PageHeader eyebrow="Planning window" title="Crop calendar" description="Harvest readiness across farmer clusters. Weather signals are guidance, not guarantees."/><Card data-tour="crop-calendar" className="overflow-hidden"><div className="overflow-x-auto"><div className="min-w-[740px]"><div className="grid grid-cols-[190px_repeat(4,1fr)] bg-[var(--surface-muted)] text-sm font-bold"><div className="p-4">Crop cluster</div>{weeks.map((week) => <div className="border-l border-[var(--border)] p-4" key={week}>{week}</div>)}</div>{rows.map(([name, index, label, Icon]) => <div key={name} className="grid grid-cols-[190px_repeat(4,1fr)] border-t border-[var(--border)]"><div className="p-4 text-sm font-bold">{name}</div>{weeks.map((_, weekIndex) => <div key={weekIndex} className="min-h-20 border-l border-[var(--border)] p-2">{weekIndex === index && <div className="flex h-full items-center gap-2 rounded-lg bg-[var(--surface-muted)] p-2 text-xs font-bold"><Icon size={17} className="text-[var(--field)]"/>{label}</div>}</div>)}</div>)}</div></div></Card><div className="mt-5 flex gap-3"><StatusChip status="86 harvests due"/><StatusChip status="12 dates pending"/></div></>;
}
