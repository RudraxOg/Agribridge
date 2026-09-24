import { Sprout } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function Loading() {
  return (
    <main
      id="main-content"
      className="grid min-h-dvh place-items-center bg-[var(--canvas)] p-6"
      aria-busy="true"
    >
      <div
        className="w-full max-w-xs text-center"
        role="status"
        aria-live="polite"
      >
        <BrandLogo className="mx-auto w-48" />
        <div className="relative mx-auto mt-8 grid size-16 place-items-center rounded-3xl border border-[var(--border)] bg-white text-[var(--field)] shadow-[var(--shadow-md)]">
          <Sprout aria-hidden size={28} />
          <span className="loader-orbit" aria-hidden />
        </div>
        <p className="mt-5 font-black text-[var(--forest-deep)]">
          Preparing AgriBridge
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Setting up your workspace…
        </p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
          <div className="loading-track h-full w-2/5 rounded-full bg-[var(--harvest)]" />
        </div>
      </div>
    </main>
  );
}
