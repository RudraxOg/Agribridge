"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, ShoppingBasket, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roles = [
  { id: "fpo", title: "FPO Operator", description: "Manage farmers, crop plans, stock, orders and settlements.", icon: Building2, path: "/fpo/overview" },
  { id: "buyer", title: "Bulk Buyer", description: "Discover verified lots, compare quality and place bulk orders.", icon: ShoppingBasket, path: "/buyer/marketplace" },
  { id: "assisted", title: "Assisted Farmer", description: "Use the simplified, operator-assisted registration journey.", icon: UserRound, path: "/fpo/farmers/new" },
] as const;

export function RoleSwitcher({ locale }: { locale: string }) {
  const [loading, setLoading] = useState<string>(); const router = useRouter(); const root = useRef<HTMLDivElement>(null);
  useEffect(() => { root.current?.setAttribute("data-hydrated", "true"); }, []);
  async function choose(role: (typeof roles)[number]) { setLoading(role.id); const response = await fetch("/api/demo-session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ role: role.id }) }); if (!response.ok) { toast.error("Could not start the demo. Try again."); setLoading(undefined); return; } router.push(`/${locale}${role.path}`); router.refresh(); }
  return <div ref={root} data-role-switcher className="grid gap-4 md:grid-cols-3">{roles.map((role) => { const Icon = role.icon; return <Card key={role.id} className="flex flex-col p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-md)]"><span className="mb-5 grid size-12 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--forest)]"><Icon aria-hidden size={24} /></span><h2 className="text-xl font-black">{role.title}</h2><p className="mt-2 mb-6 flex-1 text-sm text-[var(--text-muted)]">{role.description}</p><Button onClick={() => choose(role)} disabled={!!loading}>{loading === role.id && <Loader2 className="animate-spin" aria-hidden size={18} />}Continue as {role.title}</Button></Card>; })}</div>;
}
