"use client";

import React from "react";

export function TrackingTabSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Header & Search Bar Skeleton */}
      <div className="border-b border-border/50 pb-4 space-y-3.5">
        <div className="space-y-1.5">
          <div className="h-5 w-44 rounded-md bg-muted/70" />
          <div className="h-3.5 w-72 rounded bg-muted/40" />
        </div>
        <div className="h-11 w-full rounded-2xl bg-muted/50" />
      </div>

      {/* Main Radar Card Skeleton */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-card p-5 sm:p-7 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-muted/70" />
            <div className="h-3 w-56 rounded bg-muted/40" />
          </div>
          <div className="h-10 w-36 rounded-2xl bg-muted/50" />
        </div>

        {/* Milestone chain skeleton */}
        <div className="hidden sm:flex items-center justify-between relative px-2 py-3">
          <div className="absolute left-8 right-8 top-8 h-0.5 bg-muted/50 -z-0" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-muted/60" />
              <div className="h-3 w-20 rounded bg-muted/60" />
              <div className="h-2 w-16 rounded bg-muted/40" />
            </div>
          ))}
        </div>

        {/* Bottom items row */}
        <div className="pt-3 border-t border-border/40 flex justify-between">
          <div className="h-3 w-48 rounded bg-muted/40" />
          <div className="h-3 w-20 rounded bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
