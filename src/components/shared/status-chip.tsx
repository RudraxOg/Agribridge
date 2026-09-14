import { CheckCircle2, Clock3, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StatusChip({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const Icon = lower.includes("transit") ? Truck : lower.includes("pending") ? Clock3 : CheckCircle2;
  return <Badge><Icon aria-hidden size={14} />{status.replaceAll("_", " ")}</Badge>;
}
