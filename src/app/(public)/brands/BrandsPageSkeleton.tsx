"use client";

export function BrandsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* ── Compact Header & Breadcrumb Skeleton ── */}
      <div className="border-b border-border/40 bg-muted/20 py-3 mb-6">
        <div className="container px-3 sm:px-6 flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-muted/60" />
          <span className="text-border text-xs">/</span>
          <div className="h-3 w-14 rounded bg-muted/80" />
        </div>
      </div>

      <div className="space-y-12 sm:space-y-16 lg:space-y-20">
        {/* ── Page Header Bar Skeleton (Title, Count & Search) ── */}
        <section className="container px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-44 rounded-xl bg-muted/80" />
                <div className="h-5 w-8 rounded-full bg-amber-500/20" />
              </div>
              <div className="h-3.5 w-72 sm:w-96 max-w-full rounded bg-muted/50 mt-2" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="h-9 w-full sm:w-72 rounded-full bg-card border border-border/60" />
          </div>
        </section>

        {/* ── Brands Grid Skeleton (12 cards matching 185px-205px brand cards) ── */}
        <section className="container px-3 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-between p-4 sm:p-5 h-[185px] sm:h-[205px] rounded-3xl bg-card border border-border/50 shadow-xs">
                {/* Logo Capsule Skeleton */}
                <div className="flex h-16 w-full items-center justify-center">
                  <div className="h-9 w-24 rounded-xl bg-muted/60" />
                </div>

                {/* Brand Info & Button Row Skeleton */}
                <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-auto">
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="h-4 w-20 rounded bg-muted/80" />
                    <div className="h-2.5 w-16 rounded bg-muted/50" />
                  </div>
                  <div className="h-7 w-7 rounded-full bg-muted/50 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Brand Showcases Skeleton (3 Sections: Apple, Samsung, Xiaomi) ── */}
        <div className="space-y-12 sm:space-y-16">
          {[0, 1, 2].map((sectionIdx) => (
            <section key={sectionIdx} className="container px-3 sm:px-6 space-y-6 sm:space-y-7">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-amber-500/15" />
                    <div className="space-y-1">
                      <div className="h-4 w-44 rounded bg-muted/80" />
                      <div className="h-2.5 w-60 rounded bg-muted/50" />
                    </div>
                  </div>
                  <div className="h-4 w-24 rounded bg-muted/50 hidden sm:block" />
                </div>

                {/* Skeleton: 1 Brand Card (1 Col) + 3 Product Columns (3 stacked mini cards each) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
                  {/* Brand Showcase Card Skeleton */}
                  <div className="lg:col-span-1 flex flex-col justify-between p-6 rounded-2xl bg-muted/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.55),0_2px_10px_-2px_rgba(0,0,0,0.4)]">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-24 rounded-full bg-amber-500/15 mb-4" />
                      <div className="h-14 w-32 rounded-xl bg-muted/60 my-3" />
                      <div className="h-5 w-24 rounded bg-muted/80 mt-2" />
                      <div className="h-3.5 w-36 rounded bg-muted/50 mt-1.5" />
                    </div>
                    <div className="mt-6 pt-4 border-t border-border/40">
                      <div className="h-9 w-full rounded-xl bg-muted/70" />
                    </div>
                  </div>

                  {/* 3 Product Columns Skeleton (3 cards per column) */}
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                    {[0, 1, 2].map((colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-3.5 justify-between">
                        {[0, 1, 2].map((cardIndex) => (
                          <div
                            key={cardIndex}
                            className="rounded-2xl bg-card p-3 flex items-center gap-3.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.55),0_2px_10px_-2px_rgba(0,0,0,0.4)]">
                            <div className="h-20 w-20 shrink-0 rounded-xl bg-muted/50" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3.5 w-full rounded bg-muted/80" />
                              <div className="h-2.5 w-20 rounded bg-muted/60" />
                              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                <div className="h-4 w-16 rounded bg-muted/80" />
                                <div className="h-7 w-12 rounded-lg bg-muted/60" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
      </div>
    </div>
  );
}
