import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export function TourStepFallback({onRetry}:{onRetry:()=>void}){return <p className="mt-4 rounded-xl bg-[var(--warm-sand,#f5ebdd)] p-3 text-sm text-[var(--earth)]">This part of the demo is not available on this page yet. You can continue safely. <Button variant="ghost" className="ml-1 min-h-9 px-2" onClick={onRetry}><RefreshCw size={15} aria-hidden/>Retry</Button></p>}
