"use client";

import React from "react";

export function AdminReportsOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── 1. Top Header Skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-64 rounded-lg bg-muted/80" />
            <div className="h-5 w-24 rounded-full bg-amber-500/20" />
          </div>
          <div className="h-3.5 w-96 max-w-full rounded bg-muted/50" />
        </div>

        <div className="h-8 w-52 rounded-xl bg-card border border-border/50" />
      </div>

      {/* ── 2. 5 Report Overview Navigation Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-card border border-border/50 p-6 flex flex-col justify-between space-y-6 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-11 w-11 rounded-2xl bg-muted/60 shrink-0" />
                <div className="h-5 w-24 rounded-full bg-muted/40" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-5 w-36 rounded-lg bg-muted/80" />
                <div className="h-3 w-full rounded bg-muted/50" />
                <div className="h-3 w-4/5 rounded bg-muted/40" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="h-4 w-28 rounded bg-muted/60" />
              <div className="h-4 w-4 rounded bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
