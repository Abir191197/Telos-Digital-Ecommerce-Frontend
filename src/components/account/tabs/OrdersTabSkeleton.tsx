"use client";

import React from "react";

export function OrdersTabSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* ── 1. Top Header & Segmented Filter Bar Skeleton ── */}
      <div className="flex flex-col items-start gap-3.5 bg-card/95 sm:bg-muted/20 p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/40">
        <div className="hidden sm:block space-y-1.5">
          <div className="h-5 w-32 rounded-md bg-muted/70" />
          <div className="h-3.5 w-56 rounded bg-muted/40" />
        </div>

        {/* 4-col full width segmented filter skeleton */}
        <div className="w-full">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 bg-background/90 dark:bg-muted/60 p-1 sm:p-1.5 rounded-2xl w-full border border-border/50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 rounded-xl bg-muted/50" />
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Compact Order Cards Skeleton List ── */}
      <div className="space-y-4">
        {[1, 2, 3].map((cardIdx) => (
          <div
            key={cardIdx}
            className="rounded-2xl sm:rounded-3xl border border-border/40 dark:border-white/10 bg-card p-3.5 sm:p-5 space-y-3 shadow-sm"
          >
            {/* Header: Order #, Date, Status left; Total right */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 rounded bg-muted/70" />
                <div className="h-3 w-20 rounded bg-muted/40" />
                <div className="h-4 w-16 rounded-full bg-amber-500/20" />
              </div>
              <div className="h-4 w-16 rounded bg-muted/70" />
            </div>

            {/* Items row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl bg-muted/50" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-44 rounded bg-muted/70" />
                  <div className="h-3 w-20 rounded bg-muted/40" />
                </div>
              </div>
              <div className="h-4 w-14 rounded bg-muted/70" />
            </div>

            {/* Bottom bar: Courier left, action buttons right */}
            <div className="pt-2.5 border-t border-border/40 flex items-center justify-between gap-2.5">
              <div className="h-3.5 w-48 rounded bg-muted/50" />
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-16 rounded-lg bg-muted/50" />
                <div className="h-6 w-16 rounded-lg bg-muted/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
