export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border/60 bg-muted/20 py-3.5">
        <div className="container px-3 sm:px-6 flex gap-2 items-center">
          <div className="h-3 w-12 rounded bg-muted/60" />
          <div className="h-3 w-3 rounded bg-muted/40" />
          <div className="h-3 w-16 rounded bg-muted/60" />
          <div className="h-3 w-3 rounded bg-muted/40" />
          <div className="h-3 w-28 rounded bg-muted/60" />
        </div>
      </div>

      {/* Main Product Stage Skeleton */}
      <div className="container px-3 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left: Gallery Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-muted/70 border border-border/60 shadow-xs" />
            <div className="flex gap-3">
              <div className="h-18 w-18 rounded-xl bg-muted/60 shrink-0" />
              <div className="h-18 w-18 rounded-xl bg-muted/60 shrink-0" />
              <div className="h-18 w-18 rounded-xl bg-muted/60 shrink-0" />
            </div>
            <div className="h-11 rounded-2xl bg-muted/40" />
          </div>

          {/* Right: Buy Box Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-6 w-28 rounded-full bg-muted/60" />
              <div className="h-4 w-32 rounded bg-muted/50" />
            </div>

            <div className="space-y-2">
              <div className="h-9 w-4/5 rounded-xl bg-muted/70" />
              <div className="h-4 w-40 rounded bg-muted/50" />
            </div>

            <div className="h-24 rounded-2xl bg-muted/40 border border-border/60 p-4 space-y-2">
              <div className="h-8 w-36 rounded bg-muted/70" />
              <div className="h-3 w-60 rounded bg-muted/50" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted/50" />
              <div className="h-4 w-5/6 rounded bg-muted/50" />
              <div className="h-4 w-3/4 rounded bg-muted/50" />
            </div>

            {/* Variant pills skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-3 w-32 rounded bg-muted/60" />
              <div className="flex gap-2">
                <div className="h-10 w-28 rounded-xl bg-muted/60" />
                <div className="h-10 w-36 rounded-xl bg-muted/60" />
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <div className="h-12 rounded-xl bg-muted/70" />
              <div className="h-12 rounded-xl bg-muted/80" />
            </div>

            {/* Guarantees strip skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="h-12 rounded-xl bg-muted/40" />
              <div className="h-12 rounded-xl bg-muted/40" />
              <div className="h-12 rounded-xl bg-muted/40" />
            </div>
          </div>
        </div>

        {/* Specs Table Skeleton */}
        <div className="mt-14 pt-10 border-t border-border/70 space-y-4">
          <div className="h-6 w-52 rounded-xl bg-muted/70" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-48 rounded-2xl bg-muted/30" />
            <div className="lg:col-span-5 h-48 rounded-2xl bg-muted/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
