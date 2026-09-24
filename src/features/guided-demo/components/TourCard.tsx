import { BarChart3, Box, ShieldCheck, Sprout, Truck, Users, WalletCards } from "lucide-react";
import type { TourStep } from "../types";
import { DemoModeBadge } from "./DemoModeBadge";
import { TourProgressIndicator } from "./TourProgressIndicator";
const icons={field:Sprout,people:Users,box:Box,shield:ShieldCheck,truck:Truck,chart:BarChart3,wallet:WalletCards};
export function TourCard({step,current,total,mode,children}:{step:TourStep;current:number;total:number;mode:"interactive"|"preview";children:React.ReactNode}){const Icon=icons[step.icon];return <section className="w-full rounded-t-3xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-md)] md:max-w-sm md:rounded-2xl" aria-label="Guided demo"><div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--forest)] text-white"><Icon size={21} aria-hidden/></span><DemoModeBadge mode={mode}/></div><h2 className="mt-4 text-xl font-black">{step.title}</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{step.body}</p><div className="mt-5"><TourProgressIndicator current={current} total={total}/></div>{children}</section>}
