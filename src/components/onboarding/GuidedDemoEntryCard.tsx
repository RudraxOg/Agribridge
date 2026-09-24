"use client";
import { PlayCircle } from "lucide-react";
import { useGuidedDemo } from "@/features/guided-demo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function GuidedDemoEntryCard(){const {start,loading}=useGuidedDemo();return <Card className="p-5"><div className="flex items-center gap-3"><PlayCircle className="text-[var(--field)]" aria-hidden/><div><h2 className="font-black">Explore guided demo</h2><p className="text-sm text-[var(--text-muted)]">A three-minute tour using your role’s real workspace.</p></div></div><Button className="mt-4" disabled={loading} onClick={()=>void start()}>Explore guided demo</Button></Card>}
