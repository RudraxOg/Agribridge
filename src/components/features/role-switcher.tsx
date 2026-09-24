import { Building2, ShoppingBasket, UserRound, Truck, Route, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startDemoSession } from "@/features/guided-demo/actions";

const roles = [
  { id: "fpo", title: "FPO Operator", description: "Manage farmers, crop plans, stock, orders and settlements.", icon: Building2, path: "/fpo/awadh-pragati-fpc/dashboard" },
  { id: "buyer", title: "Bulk Buyer", description: "Discover verified lots, compare quality and place bulk orders.", icon: ShoppingBasket, path: "/buyer/lucknow-fresh-mart/marketplace" },
  { id: "assisted", title: "Assisted Farmer", description: "Use the simplified, operator-assisted registration journey.", icon: UserRound, path: "/fpo/farmers/new" },
  { id: "logistics", title: "Dispatcher", description: "Assign vehicles and move shipments through validated states.", icon: Truck, path: "/logistics/gati-demo-logistics/dispatch" },
  { id: "driver", title: "Driver", description: "View only assigned trips and submit constrained position events.", icon: Route, path: "/logistics/gati-demo-logistics/my-trips" },
  { id: "platform", title: "Platform Admin", description: "Review platform health and tightly scoped security events.", icon: Shield, path: "/platform/admin" },
] as const;

export function RoleSwitcher({ locale }: { locale: string }) {
  return <div data-role-switcher data-hydrated="true" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{roles.map((role) => { const Icon = role.icon; return <Card key={role.id} className="flex flex-col p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-md)]"><span className="mb-5 grid size-12 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--forest)]"><Icon aria-hidden size={24} /></span><h2 className="text-xl font-black">{role.title}</h2><p className="mt-2 mb-6 flex-1 text-sm text-[var(--text-muted)]">{role.description}</p><form action={startDemoSession.bind(null, locale, role.id)}><Button type="submit">Continue as {role.title}</Button></form></Card>; })}</div>;
}
