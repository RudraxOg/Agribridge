import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
export function DemoCompletionScreen({href}:{href:string}){return <div className="mx-auto max-w-md text-center"><CheckCircle2 className="mx-auto size-14 text-[var(--action)]" aria-hidden/><h2 className="mt-4 text-2xl font-black">You are ready to continue</h2><p className="mt-2 text-[var(--text-muted)]">The guided demo is complete. You can restart it any time from Help.</p><Link className={`${buttonVariants()} mt-6`} href={href}>Open my workspace</Link></div>}
