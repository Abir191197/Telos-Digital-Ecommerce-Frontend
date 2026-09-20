"use client";

import React from "react";

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      {/* ── Breadcrumb Skeleton ── */}
      <div className="border-b border-border/50 bg-muted/20 py-3.5">
        <div className="container flex items-center gap-2">
          <div className="h-3 w-12 rounded bg-muted/60" />
          <span className="text-muted-foreground/30 text-xs">/</span>
          <div className="h-3 w-24 rounded bg-muted/80" />
        </div>
      </div>

      {/* ── Main Container ── */}
      <main className="container py-6 sm:py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/60">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 sm:h-9 w-44 rounded-xl bg-muted/80" />
              <div className="h-6 w-16 rounded-full bg-amber-500/15" />
            </div>
            <div className="h-3.5 w-72 sm:w-96 rounded bg-muted/50" />
          </div>
          <div className="h-9 w-24 rounded-xl bg-muted/50 self-start sm:self-auto" />
        </div>

        {/* Content Grid (Table + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Line Items Table Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="overflow-hidden rounded-3xl bg-card border border-border/70 shadow-xs dark:shadow-none">
              {/* Header row */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border/60">
                <div className="col-span-5 h-3 w-28 rounded bg-muted/60" />
                <div className="col-span-2 flex justify-end pr-2">
                  <div className="h-3 w-16 rounded bg-muted/60" />
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="h-3 w-16 rounded bg-muted/60" />
                </div>
                <div className="col-span-2 flex justify-end">
                  <div className="h-3 w-12 rounded bg-muted/60" />
                </div>
              </div>

              {/* Skeleton Line Items */}
              <div className="divide-y divide-border/60">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:py-3.5 sm:px-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 items-stretch lg:items-center"
                  >
                    {/* Thumbnail + info */}
                    <div className="w-full lg:col-span-5 flex items-center gap-3 sm:gap-3.5">
                      <div className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-xl bg-muted/60" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-4/5 rounded bg-muted/80" />
                        <div className="h-3 w-24 rounded bg-emerald-500/20" />
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <div className="h-7.5 w-7.5 rounded-lg bg-muted/60" />
                          <div className="h-7.5 w-7.5 rounded-lg bg-muted/60" />
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="hidden lg:flex w-full lg:col-span-2 flex-col items-end justify-center pr-2 space-y-1">
                      <div className="h-4 w-16 rounded bg-muted/80" />
                      <div className="h-3 w-12 rounded bg-muted/40" />
                    </div>

                    {/* Quantity Stepper */}
                    <div className="lg:col-span-3 flex lg:justify-center items-center">
                      <div className="h-8 w-24 rounded-xl bg-muted/60" />
                    </div>

                    {/* Total */}
                    <div className="lg:col-span-2 flex lg:justify-end items-center">
                      <div className="h-5 w-20 rounded bg-muted/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping button */}
            <div className="h-4 w-32 rounded bg-muted/50" />
          </div>

          {/* Right Column: Summary Card Skeleton */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
              <div className="h-5 w-40 rounded bg-muted/80 pb-1" />

              {/* Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <div className="h-3.5 w-24 rounded bg-muted/60" />
                  <div className="h-3.5 w-16 rounded bg-muted/80" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3.5 w-28 rounded bg-muted/60" />
                  <div className="h-3.5 w-12 rounded bg-emerald-500/20" />
                </div>
                <div className="pt-3 border-t border-border/60 flex justify-between items-baseline">
                  <div className="h-4 w-28 rounded bg-muted/80" />
                  <div className="h-7 w-24 rounded bg-muted/90" />
                </div>
              </div>

              {/* Promo code link */}
              <div className="pt-2 border-t border-border/50">
                <div className="h-3.5 w-32 rounded bg-amber-500/20" />
              </div>

              {/* Checkout CTA */}
              <div className="space-y-3 pt-2">
                <div className="h-12 sm:h-14 w-full rounded-2xl bg-amber-500/30" />
                <div className="h-3 w-40 mx-auto rounded bg-muted/40" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
