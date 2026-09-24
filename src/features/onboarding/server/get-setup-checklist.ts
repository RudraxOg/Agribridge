import "server-only";

import { getAccessContext } from "@/lib/authorization/access";
import { createClient } from "@/lib/supabase/server";

export type SetupChecklistState = "completed" | "current" | "blocked" | "optional";
export type SetupChecklistItem = { key: string; label: string; state: SetupChecklistState; href?: string; detail: string };
export type SetupChecklist = { role: "fpo" | "buyer" | "logistics"; simulated: boolean; items: SetupChecklistItem[] };

function item(key: string, label: string, done: boolean, href: string, detail: string, allowed = true): SetupChecklistItem {
  return { key, label, state: done ? "completed" : allowed ? "current" : "blocked", href: allowed && !done ? href : undefined, detail };
}

export async function getSetupChecklist(locale: string): Promise<SetupChecklist | null> {
  const access = await getAccessContext();
  if (!access?.organization) return null;
  const prefix = `/${locale}`;
  const role = access.role.startsWith("buyer_") ? "buyer" : access.role.startsWith("logistics_") ? "logistics" : "fpo";

  if (access.isDemo) {
    const fpo = [
      item("organization", "Complete organization profile", true, "", "Demo workspace profile is ready."),
      item("collection-centre", "Add collection centre", true, "", "Gonda collection centre is available in demo data."),
      item("teammate", "Invite first teammate", true, "", "Demo operator membership is active."),
      item("farmer", "Register first farmer", true, `${prefix}/fpo/farmers/new`, "Synthetic farmer records are clearly labelled."),
      item("crop-cycle", "Add first crop cycle", true, `${prefix}/fpo/crop-calendar`, "Seeded crop cycles demonstrate harvest planning."),
      item("stock-lot", "Publish first stock lot", true, `${prefix}/fpo/stock/new`, "Demo lots are available for the walkthrough."),
      item("settlement", "Review settlement flow", false, `${prefix}/settlements/order-1072`, "Open the 50/50 release timeline."),
    ];
    const buyer = [
      item("organization", "Complete buyer organization profile", true, "", "Demo buyer workspace profile is ready."),
      item("preferences", "Set procurement preferences", true, "", "Demo preference filters are applied."),
      item("marketplace", "Explore marketplace", true, `${prefix}/buyer/${access.organization.slug}/marketplace`, "Synthetic lots are clearly marked."),
      item("saved-lot", "Save a crop lot", true, "", "A demo saved lot is available."),
      item("order", "Create first order", true, `${prefix}/buyer/orders`, "A completed demo order is available."),
      item("payment", "Review payment flow", false, `${prefix}/buyer/payments`, "Open the simulated payment timeline."),
    ];
    const logistics = [
      item("organization", "Complete logistics profile", true, "", "Demo logistics workspace profile is ready."),
      item("vehicle", "Add vehicle", true, "", "A demo vehicle is assigned."),
      item("teammate", "Invite driver or dispatcher", true, "", "Demo dispatcher and driver are available."),
      item("service-area", "Configure service area", true, "", "Demo route is configured."),
      item("dispatch", "Review dispatch process", false, `${prefix}/logistics/${access.organization.slug}/dispatch`, "Open the assigned demo shipment."),
    ];
    return { role, simulated: true, items: role === "fpo" ? fpo : role === "buyer" ? buyer : logistics };
  }

  const supabase = await createClient();
  const organizationId = access.organization.id;
  const canInvite = access.permissions.has("members.invite");
  const canWriteFarmers = access.permissions.has("farmers.write");
  const canWriteLots = access.permissions.has("lots.write");
  const [members, centres, farmers, cycles, lots, orders, requests] = await Promise.all([
    supabase.from("organization_members").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "active"),
    supabase.from("collection_centres").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase.from("farmers").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase.from("crop_cycles").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase.from("stock_lots").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "published"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("buyer_organization_id", organizationId),
    supabase.from("buyer_requests").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
  ]);
  const count = (value: { count: number | null }) => (value.count ?? 0) > 0;
  if (role === "buyer") return { role, simulated: false, items: [
    item("organization", "Complete buyer organization profile", true, "", "Organization details are stored."),
    item("preferences", "Set procurement preferences", count(requests), `${prefix}/buyer/${access.organization.slug}/marketplace`, "Preferences are represented by saved procurement requests."),
    item("marketplace", "Explore marketplace", count(requests), `${prefix}/buyer/${access.organization.slug}/marketplace`, "Open available published lots."),
    item("saved-lot", "Save a crop lot", count(requests), `${prefix}/buyer/${access.organization.slug}/marketplace`, "Saved interest is stored as a buyer request."),
    item("order", "Create first order", count(orders), `${prefix}/buyer/${access.organization.slug}/marketplace`, "Orders are tenant-scoped."),
    item("payment", "Review payment flow", false, `${prefix}/buyer/${access.organization.slug}/payments`, "Review the finance-safe payment timeline."),
  ] };
  if (role === "logistics") return { role, simulated: false, items: [
    item("organization", "Complete logistics profile", true, "", "Organization details are stored."),
    item("vehicle", "Add vehicle", false, "", "Vehicle registry is not configured for this tenant yet.", false),
    item("teammate", "Invite driver or dispatcher", count(members), `${prefix}/organizations`, "Membership state is derived from active members.", canInvite),
    item("service-area", "Configure service area", false, "", "Service-area configuration is not configured for this tenant yet.", false),
    item("dispatch", "Review dispatch process", false, `${prefix}/logistics/${access.organization.slug}/dispatch`, "Open dispatch once a shipment is assigned."),
  ] };
  return { role, simulated: false, items: [
    item("organization", "Complete organization profile", true, "", "Organization details are stored."),
    item("collection-centre", "Add collection centre", count(centres), `${prefix}/fpo/${access.organization.slug}/dashboard`, "Collection centres are tenant-scoped."),
    item("teammate", "Invite first teammate", (members.count ?? 0) > 1, `${prefix}/organizations`, "Active membership count is used.", canInvite),
    item("farmer", "Register first farmer", count(farmers), `${prefix}/fpo/farmers/new`, "Farmer count is never exposed to buyers.", canWriteFarmers),
    item("crop-cycle", "Add first crop cycle", count(cycles), `${prefix}/fpo/crop-calendar`, "Crop cycles are tenant-scoped."),
    item("stock-lot", "Publish first stock lot", count(lots), `${prefix}/fpo/stock/new`, "Only published lots count.", canWriteLots),
    item("settlement", "Review settlement flow", false, `${prefix}/fpo/${access.organization.slug}/settlements`, "Review the finance-safe release timeline."),
  ] };
}
