import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function CompletionCelebration({ href }: { href: string }) {
  return <div className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[var(--surface-muted)] text-[var(--action)]"><CheckCircle2 size={34} aria-hidden /></div><p className="mt-6 text-xs font-black tracking-[.16em] text-[var(--field)] uppercase">Demo complete</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--forest-deep)]">You know the path now.</h2><p className="mx-auto mt-3 max-w-md text-[var(--text-muted)]">You can revisit any step from Help. Your live workspace stays separate from the clearly labelled demo records.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={href} className={buttonVariants({ size: "lg" })}>Open my workspace</Link><span className="inline-flex min-h-12 items-center justify-center gap-2 text-sm font-bold text-[var(--earth)]"><Sparkles size={16} aria-hidden /> Demo records are synthetic</span></div></div>;
}
