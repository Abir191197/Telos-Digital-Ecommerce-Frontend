"use client";

import React from "react";

export function WishlistTabSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* ── 1. Top Header Bar Skeleton ── */}
      <div className="hidden sm:flex items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-32 rounded-md bg-muted/70" />
            <div className="h-4 w-8 rounded-full bg-amber-500/20" />
          </div>
          <div className="h-3.5 w-64 rounded bg-muted/40" />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-8 w-24 rounded-xl bg-muted/50" />
          <div className="h-5 w-16 rounded bg-muted/40" />
        </div>
      </div>

      {/* ── 2. List Items Skeleton ── */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/40 dark:border-white/10 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-sm"
          >
            {/* Thumbnail + Details */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="h-18 w-18 sm:h-20 sm:w-20 shrink-0 rounded-2xl bg-muted/60" />
              <div className="space-y-2 min-w-0 flex-1">
                <div className="h-4 w-44 sm:w-60 rounded bg-muted/70" />
                <div className="h-3 w-28 rounded bg-muted/40" />
                <div className="h-4 w-20 rounded bg-amber-500/20" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <div className="h-9 w-28 rounded-xl bg-muted/60" />
              <div className="h-9 w-9 rounded-xl bg-muted/50" />
              <div className="h-9 w-9 rounded-xl bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
