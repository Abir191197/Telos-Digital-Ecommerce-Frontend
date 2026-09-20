"use client";

import React from "react";

export function AccountOverviewSkeleton() {
  return (
    <div className="flex flex-col space-y-6 animate-pulse">
      {/* ── 1. Profile Hero Card Skeleton ── */}
      <div className="order-1 rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-muted/60" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-36 rounded-md bg-muted/70" />
              <div className="h-4 w-24 rounded-full bg-amber-500/20" />
            </div>
            <div className="h-3.5 w-48 rounded bg-muted/40" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-xl bg-muted/50 self-start sm:self-auto shrink-0" />
      </div>

      {/* ── 2. Order Progress Card Skeleton ── */}
      <div className="order-2 lg:order-1 rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 p-5 sm:p-6.5 space-y-5 shadow-sm">
        {/* Top details row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-muted/60 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded-md bg-muted/70" />
              <div className="h-3 w-44 rounded-md bg-muted/40" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-20 rounded-full bg-muted/50" />
            <div className="h-8 w-24 rounded-xl bg-muted/50" />
          </div>
        </div>

        {/* Connected chain steps track */}
        <div className="py-2">
          {/* Desktop horizontal track */}
          <div className="hidden sm:flex items-center justify-between relative px-2">
            <div className="absolute left-6 right-6 top-5 h-0.5 bg-muted/50" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-muted/60 border-2 border-border/60" />
                <div className="h-3 w-16 rounded bg-muted/60" />
                <div className="h-2 w-14 rounded bg-muted/40" />
              </div>
            ))}
          </div>

          {/* Mobile vertical track */}
          <div className="sm:hidden space-y-4 pl-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-muted/60 shrink-0" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="h-3.5 w-24 rounded bg-muted/70" />
                  <div className="h-2.5 w-32 rounded bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom items strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-xl bg-muted/60 border-2 border-background" />
              <div className="h-8 w-8 rounded-xl bg-muted/50 border-2 border-background" />
            </div>
            <div className="h-3 w-40 rounded bg-muted/40" />
          </div>
          <div className="h-4 w-28 rounded bg-muted/50" />
        </div>
      </div>

      {/* ── 3. Bottom 2-Column Grid Skeleton (Address & Payment) ── */}
      <div className="order-3 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Address card skeleton */}
        <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-muted/60" />
              <div className="h-3.5 w-32 rounded bg-muted/70" />
            </div>
            <div className="h-3 w-12 rounded bg-muted/50" />
          </div>
          <div className="space-y-2 py-1">
            <div className="h-4 w-36 rounded bg-muted/70" />
            <div className="h-3 w-48 rounded bg-muted/40" />
            <div className="h-3 w-32 rounded bg-muted/40" />
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-between">
            <div className="h-3 w-24 rounded bg-muted/40" />
            <div className="h-3 w-28 rounded bg-muted/50" />
          </div>
        </div>

        {/* Payment card skeleton */}
        <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-muted/60" />
              <div className="h-3.5 w-32 rounded bg-muted/70" />
            </div>
            <div className="h-3 w-12 rounded bg-muted/50" />
          </div>
          <div className="h-16 rounded-2xl bg-muted/40 border border-border/40" />
          <div className="pt-3 border-t border-border/40 flex justify-between">
            <div className="h-3 w-24 rounded bg-muted/40" />
            <div className="h-3 w-20 rounded bg-muted/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
