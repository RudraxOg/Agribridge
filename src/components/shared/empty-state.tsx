import { Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
export function EmptyState({ title, description }: { title: string; description: string }) { return <Card className="grid place-items-center p-10 text-center"><Sprout className="mb-3 text-[var(--field)]" size={36} aria-hidden /><h2 className="text-xl font-extrabold">{title}</h2><p className="mt-2 max-w-md text-[var(--text-muted)]">{description}</p></Card>; }
