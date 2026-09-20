"use client";

import React from "react";

export function ReviewsTabSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* ── 1. Top Header & Segmented Pill Controls ── */}
      <div className="flex flex-col items-start gap-3.5 bg-card/95 sm:bg-muted/20 p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/40">
        <div className="hidden sm:block space-y-1.5">
          <div className="h-5 w-36 rounded-md bg-muted/70" />
          <div className="h-3.5 w-64 rounded bg-muted/40" />
        </div>

        {/* 2-State Pill Skeleton */}
        <div className="flex items-center gap-1.5 bg-background/90 dark:bg-muted/60 p-1.5 rounded-2xl border border-border/50">
          <div className="h-8 w-28 rounded-xl bg-muted/60" />
          <div className="h-8 w-24 rounded-xl bg-muted/40" />
        </div>
      </div>

      {/* ── 2. Review Cards List Skeleton ── */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/40 dark:border-white/10 bg-card p-4.5 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Product Thumbnail & Core Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-2xl bg-muted/60" />
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 rounded bg-amber-500/20" />
                  <div className="h-3 w-20 rounded bg-muted/40" />
                </div>
                <div className="h-4 w-48 sm:w-64 rounded bg-muted/70" />
                <div className="h-3 w-56 rounded bg-muted/40" />
              </div>
            </div>

            {/* Action button skeleton */}
            <div className="self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <div className="h-9 w-28 rounded-xl bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
