"use client";

import React from "react";

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse pb-24">
      <main className="container py-6 sm:py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Address & Payment Skeletons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Address Card Skeleton */}
            <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/15" />
                  <div className="h-5 w-36 rounded-md bg-muted/80" />
                  <div className="h-5 w-14 rounded-md bg-muted/50" />
                </div>
                <div className="h-8 w-20 rounded-xl bg-muted/60" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 rounded bg-muted/80" />
                  <div className="h-3 w-28 rounded bg-muted/50" />
                </div>
                <div className="h-3.5 w-3/4 rounded bg-muted/60" />
                <div className="h-3.5 w-1/2 rounded bg-muted/40" />
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="h-10 w-full rounded-xl bg-muted/40" />
              </div>
            </div>

            {/* Payment Method Skeleton */}
            <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3.5">
                <div className="h-7 w-7 rounded-lg bg-amber-500/15" />
                <div className="h-5 w-40 rounded-md bg-muted/80" />
              </div>
              <div className="space-y-2.5 pt-1">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="h-14 w-full rounded-2xl border border-border/60 bg-muted/30"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                <div className="space-y-1">
                  <div className="h-5 w-32 rounded bg-muted/80" />
                  <div className="h-3 w-20 rounded bg-muted/50" />
                </div>
                <div className="h-4 w-18 rounded bg-muted/50" />
              </div>

              {/* Items preview skeleton */}
              <div className="space-y-3 pt-1">
                {[1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-muted/60 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-4/5 rounded bg-muted/80" />
                      <div className="h-3 w-1/3 rounded bg-muted/50" />
                    </div>
                    <div className="h-4 w-16 rounded bg-muted/80" />
                  </div>
                ))}
              </div>

              {/* Promo code toggle */}
              <div className="pt-2 border-t border-border/50">
                <div className="h-3.5 w-32 rounded bg-amber-500/20" />
              </div>

              {/* Price rows */}
              <div className="space-y-2.5 border-t border-border/60 pt-3">
                <div className="flex justify-between">
                  <div className="h-3.5 w-16 rounded bg-muted/60" />
                  <div className="h-3.5 w-20 rounded bg-muted/80" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3.5 w-20 rounded bg-muted/60" />
                  <div className="h-3.5 w-14 rounded bg-emerald-500/20" />
                </div>
                <div className="pt-3 border-t border-border/60 flex justify-between items-baseline">
                  <div className="h-4 w-24 rounded bg-muted/80" />
                  <div className="h-7 w-24 rounded bg-muted/90" />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <div className="h-13 w-full rounded-2xl bg-amber-500/30" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
