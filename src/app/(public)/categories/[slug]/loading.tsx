import { CatalogGridSkeleton } from "@/components/catalog";

export default function CategoryLoading() {
  return (
    <div className="container px-3 sm:px-6 py-10 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-xl bg-muted/70 animate-pulse" />
        <div className="h-4 w-96 rounded-lg bg-muted/50 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="h-96 rounded-2xl border border-border/60 bg-card/60 p-5 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="lg:col-span-9 space-y-5">
          <div className="h-10 rounded-xl bg-muted/40 animate-pulse" />
          <CatalogGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
