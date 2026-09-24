import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { dashboardMetrics } from "@/lib/demo-data";
import type { DashboardMetricView } from "@/features/dashboard/server/get-fpo-dashboard";

export function DashboardMetrics({ metrics = dashboardMetrics as DashboardMetricView[] }: { metrics?: DashboardMetricView[] }) {
  return <div data-tour="dashboard-metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric, index) => <Card key={metric.label} data-tour={index === 0 ? "dashboard-total-farmers" : undefined} className={`relative overflow-hidden p-5 ${index === 0 ? "sm:col-span-2 xl:col-span-1" : ""}`}><span className={`absolute inset-y-0 left-0 w-1 ${metric.tone === "gold" ? "bg-[var(--harvest)]" : metric.tone === "blue" ? "bg-[var(--info)]" : metric.tone === "earth" ? "bg-[var(--earth)]" : "bg-[var(--field)]"}`} /><p className="text-sm font-semibold text-[var(--text-muted)]">{metric.label}</p><p className="tabular mt-2 text-3xl font-black tracking-tight">{metric.value}</p><p className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--field)]">{metric.note.startsWith("+") ? <ArrowUpRight aria-hidden size={14} /> : <ArrowDownRight aria-hidden size={14} />}{metric.note}</p></Card>)}</div>;
}
