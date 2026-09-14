import { CircleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
export function ErrorState({ title, description }: { title: string; description: string }) { return <Card role="alert" className="border-[var(--danger)]/30 p-6"><CircleAlert className="mb-3 text-[var(--danger)]" aria-hidden /><h2 className="font-extrabold">{title}</h2><p className="text-[var(--text-muted)]">{description}</p></Card>; }
