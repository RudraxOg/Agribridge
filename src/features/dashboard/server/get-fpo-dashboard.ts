import "server-only";

import { getAccessContext } from "@/lib/authorization/access";
import { createClient } from "@/lib/supabase/server";

export type DashboardMetricView = { label: string; value: string; note: string; tone: "green" | "gold" | "blue" | "earth" };
export type FpoDashboardView = { status: "ready" | "empty" | "denied"; simulated: boolean; organizationName?: string; metrics: DashboardMetricView[] };

export function buildFpoDashboardMetrics(input: { farmers: number; lots: number; pendingOrders: number; escrowPaise: bigint }): DashboardMetricView[] {
  return [
    { label: "Registered farmers", value: input.farmers.toLocaleString("en-IN"), note: input.farmers ? "Tenant-scoped registry" : "Register your first farmer", tone: "green" },
    { label: "Active stock", value: input.lots.toLocaleString("en-IN"), note: input.lots ? "Published lots" : "No published lots yet", tone: "gold" },
    { label: "Pending orders", value: input.pendingOrders.toLocaleString("en-IN"), note: input.pendingOrders ? "Needs operational review" : "No pending orders", tone: "blue" },
    { label: "Escrow earnings", value: `₹${Number(input.escrowPaise / 100n).toLocaleString("en-IN")}`, note: "Protected-payment simulation", tone: "earth" },
  ];
}

export async function getFpoDashboard(organizationSlug: string): Promise<FpoDashboardView> {
  const access = await getAccessContext(organizationSlug);
  if (!access?.organization || !access.permissions.has("lots.read") || !access.role.startsWith("fpo_")) return { status: "denied", simulated: false, metrics: [] };
  if (access.isDemo) return { status: "ready", simulated: true, organizationName: access.organization.name, metrics: buildFpoDashboardMetrics({ farmers: 1248, lots: 18, pendingOrders: 7, escrowPaise: 9425000n }) };
  const supabase = await createClient();
  const organizationId = access.organization.id;
  const [farmers, lots, orders] = await Promise.all([
    supabase.from("farmers").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase.from("stock_lots").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "published"),
    supabase.from("orders").select("produce_value_paise").eq("organization_id", organizationId).in("status", ["PLACED", "FUNDS_SECURED", "TRUCK_ASSIGNED", "LOADING", "IN_TRANSIT"]),
  ]);
  const liveOrders = (orders.data ?? []) as Array<{ produce_value_paise?: number | string | bigint | null }>;
  const escrowPaise = liveOrders.reduce((total, order) => total + BigInt(order.produce_value_paise ?? 0), 0n);
  const metrics = buildFpoDashboardMetrics({ farmers: farmers.count ?? 0, lots: lots.count ?? 0, pendingOrders: liveOrders.length, escrowPaise });
  return { status: liveOrders.length || farmers.count || lots.count ? "ready" : "empty", simulated: false, organizationName: access.organization.name, metrics };
}
