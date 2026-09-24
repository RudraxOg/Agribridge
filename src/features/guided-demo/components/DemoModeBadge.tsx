import { Sparkles } from "lucide-react";
export function DemoModeBadge({mode="interactive"}:{mode?:"interactive"|"preview"}){return <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-black text-[var(--forest)]"><Sparkles size={13} aria-hidden/>Demo mode · {mode}</span>}
