"use client";
import { useState } from "react";
import { CheckCircle2, Snowflake, Star, Truck } from "lucide-react";
import { logisticsQuotes } from "@/lib/demo-data";
import { formatINR } from "@/lib/format/currency";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
export function LogisticsQuotes(){const [selected,setSelected]=useState("eicher");return <div className="grid gap-4">{logisticsQuotes.map(q=><Card key={q.id} className={`grid gap-4 p-5 md:grid-cols-[1.2fr_repeat(3,.8fr)_auto] md:items-center ${selected===q.id?"border-[var(--field)] ring-2 ring-[var(--field)]/15":""}`}><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[var(--surface-muted)] text-[var(--forest)]">{q.refrigerated?<Snowflake/>:<Truck/>}</span><div><h2 className="font-black">{q.vehicle}</h2><p className="text-sm text-[var(--text-muted)]">{q.capacity} · {q.available} available</p></div></div><div className="text-sm"><span className="text-[var(--text-muted)]">Freight</span><p className="tabular font-black">{formatINR(q.freightPaise)}</p></div><div className="text-sm"><span className="text-[var(--text-muted)]">Pickup</span><p className="font-bold">{q.pickup}</p></div><div className="text-sm"><span className="text-[var(--text-muted)]">Rating & cover</span><p className="flex items-center gap-1 font-bold"><Star className="fill-[var(--harvest)] text-[var(--harvest)]" size={15}/>{q.rating} · insured</p></div><Button variant={selected===q.id?"primary":"secondary"} onClick={()=>{setSelected(q.id);toast.success(`${q.vehicle} selected`)}}>{selected===q.id&&<CheckCircle2 size={17}/>}Select</Button></Card>)}</div>}
