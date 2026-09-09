export default function GlobalStorefrontLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      {/* Top Header Placeholder */}
      <div className="h-16 border-b border-border/70 bg-card/60 flex items-center justify-between px-6">
        <div className="h-8 w-28 rounded-xl bg-muted/70" />
        <div className="h-10 w-96 rounded-full bg-muted/40 hidden md:block" />
        <div className="flex gap-3">
          <div className="h-9 w-9 rounded-full bg-muted/60" />
          <div className="h-9 w-9 rounded-full bg-muted/60" />
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="container px-3 sm:px-6 py-6 sm:py-8">
        <div className="relative h-64 sm:h-96 w-full rounded-3xl bg-muted/60 border border-border/60 p-6 flex flex-col justify-end space-y-3">
          <div className="h-5 w-32 rounded-full bg-muted/80" />
          <div className="h-10 w-3/4 sm:w-1/2 rounded-2xl bg-muted/90" />
          <div className="h-4 w-1/3 rounded bg-muted/60" />
        </div>
      </div>

      {/* Quick Category Bar Skeleton */}
      <div className="container px-3 sm:px-6 py-4">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="h-14 w-14 rounded-2xl bg-muted/60" />
              <div className="h-3 w-12 rounded bg-muted/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Cards Feed Skeleton */}
      <div className="container px-3 sm:px-6 py-8 space-y-5">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 rounded-xl bg-muted/80" />
          <div className="h-5 w-24 rounded bg-muted/50" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden"
            >
              <div className="aspect-square w-full bg-muted/70" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 rounded bg-muted/60" />
                <div className="h-4 w-full rounded bg-muted/70" />
                <div className="h-3 w-20 rounded bg-muted/40" />
                <div className="pt-3 flex justify-between items-center">
                  <div className="h-5 w-20 rounded bg-muted/80" />
                  <div className="h-8 w-16 rounded-xl bg-muted/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
