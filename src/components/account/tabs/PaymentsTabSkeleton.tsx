"use client";

import React from "react";

export function PaymentsTabSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* ── 1. Top Header Bar Skeleton ── */}
      <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="space-y-1.5">
          <div className="h-5 w-48 rounded-md bg-muted/70" />
          <div className="h-3.5 w-64 rounded bg-muted/40" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-muted/50 shrink-0" />
      </div>

      {/* ── 2. Payment Cards Grid Skeleton ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/40 dark:border-white/10 bg-card p-5 space-y-3.5 shadow-sm"
          >
            {/* Logo + Default badge */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-14 rounded-xl bg-muted/60" />
              <div className="h-5 w-16 rounded-full bg-amber-500/20" />
            </div>

            {/* Account / masked number */}
            <div className="space-y-1.5">
              <div className="h-5 w-36 rounded bg-muted/70" />
              <div className="h-3.5 w-52 rounded bg-muted/40" />
            </div>

            {/* Bottom action bar */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-end">
              <div className="h-6 w-16 rounded-lg bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
