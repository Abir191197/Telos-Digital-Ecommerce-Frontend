export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <section className="border-b border-border/60 bg-muted/20 py-10 md:py-14 mb-8">
        <div className="container px-4 flex flex-col items-center text-center space-y-3 max-w-xl mx-auto">
          <div className="h-6 w-36 rounded-full bg-muted/70" />
          <div className="h-10 w-72 rounded-2xl bg-muted/80" />
          <div className="h-4 w-96 rounded bg-muted/50" />
        </div>
      </section>

      {/* Trending Pills Skeleton */}
      <div className="container px-3 sm:px-6 space-y-3 mb-8">
        <div className="h-4 w-40 rounded bg-muted/60" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-full bg-muted/60 shrink-0" />
          ))}
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="container px-3 sm:px-6 mb-8">
        <div className="flex gap-2 pb-3 border-b border-border/60">
          <div className="h-9 w-32 rounded-full bg-muted/80" />
          <div className="h-9 w-28 rounded-full bg-muted/50" />
          <div className="h-9 w-28 rounded-full bg-muted/50" />
          <div className="h-9 w-28 rounded-full bg-muted/50" />
        </div>
      </div>

      {/* Category Cards Grid Skeleton (10 cards) */}
      <div className="container px-3 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-2xs"
            >
              <div className="h-32 sm:h-36 w-full bg-muted/70" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 w-3/4 rounded bg-muted/70" />
                <div className="h-2.5 w-full rounded bg-muted/50" />
                <div className="flex gap-1 pt-1">
                  <div className="h-4 w-12 rounded bg-muted/40" />
                  <div className="h-4 w-14 rounded bg-muted/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
