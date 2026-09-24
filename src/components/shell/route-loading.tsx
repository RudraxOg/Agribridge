type RouteLoadingProps = {
  cards?: number;
  variant?: "dashboard" | "detail" | "list";
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`.trim()} />;
}

export function RouteLoading({
  cards = 6,
  variant = "dashboard",
}: RouteLoadingProps) {
  const content =
    variant === "detail" ? (
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <Skeleton className="aspect-[4/3] rounded-2xl" />
        <div className="grid content-start gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-12 w-44" />
        </div>
      </div>
    ) : variant === "list" ? (
      <div className="mt-7 grid gap-3">
        {Array.from({ length: cards }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    ) : (
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
    );

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8"
      aria-busy="true"
      aria-label="Loading workspace content"
    >
      <div className="loader-kicker">
        <span className="loader-seed" aria-hidden />
        Loading workspace
      </div>
      <Skeleton className="mt-3 h-10 w-3/4 max-w-md rounded-xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      {content}
      <p className="sr-only" role="status" aria-live="polite">
        Loading workspace content
      </p>
    </main>
  );
}
