"use client";

import React from "react";

export function AdminInventoryAuditSkeleton() {
  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-pulse">
      {/* ── 1. Top Header Banner Skeleton ── */}
      <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500/50" />
              <div className="h-3 w-36 rounded bg-amber-500/20" />
            </div>
            <div className="h-7 w-64 rounded-lg bg-muted/80" />
            <div className="h-3.5 w-96 max-w-full rounded bg-muted/50" />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-10 w-32 rounded-xl bg-muted/40 border border-border/40" />
            <div className="h-10 w-24 rounded-xl bg-muted/40 border border-border/40" />
            <div className="h-10 w-28 rounded-xl bg-muted/40 border border-border/40" />
          </div>
        </div>
      </div>

      {/* ── 2. 4 Audit KPI Cards Skeleton ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-card p-3.5 sm:p-5 border border-border/40 space-y-3 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-muted/60" />
              <div className="h-8 w-8 rounded-xl bg-muted/50 shrink-0" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 sm:h-7 w-20 rounded-lg bg-muted/80" />
              <div className="h-2.5 w-24 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Audit Filter Dock Skeleton ── */}
      <div className="rounded-2xl bg-card border border-border/50 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="h-9 w-full sm:w-80 rounded-xl bg-muted/40 border border-border/40" />
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="h-9 w-52 rounded-xl bg-muted/40 border border-border/30" />
          <div className="h-9 w-20 rounded-xl bg-muted/40 border border-border/30" />
        </div>
      </div>

      {/* ── 4. Desktop Audit Table Skeleton ── */}
      <div className="hidden md:block rounded-3xl bg-card border border-border/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[340px]">
          <div className="border-b border-border/60 bg-muted/30 py-3.5 px-5 flex items-center justify-between">
            <div className="h-3.5 w-20 rounded bg-muted/60" />
            <div className="h-3.5 w-32 rounded bg-muted/60" />
            <div className="h-3.5 w-20 rounded bg-muted/60" />
            <div className="h-3.5 w-24 rounded bg-muted/60" />
            <div className="h-3.5 w-32 rounded bg-muted/60" />
            <div className="h-3.5 w-20 rounded bg-muted/60" />
          </div>

          <div className="divide-y divide-border/40">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="py-3.5 px-5 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
              >
                {/* Timestamp */}
                <div className="w-28 space-y-1">
                  <div className="h-3.5 w-20 rounded bg-muted/70" />
                  <div className="h-2.5 w-14 rounded bg-muted/40" />
                </div>

                {/* Product details */}
                <div className="flex items-center gap-3 min-w-[220px] flex-1">
                  <div className="h-11 w-11 rounded-xl bg-muted/60 shrink-0" />
                  <div className="space-y-1.5 flex-1 max-w-xs">
                    <div className="h-3.5 w-4/5 rounded bg-muted/80" />
                    <div className="h-2.5 w-2/5 rounded bg-muted/40" />
                  </div>
                </div>

                {/* Adjustment badge */}
                <div className="w-28 flex justify-center">
                  <div className="h-5 w-20 rounded-full bg-muted/60" />
                </div>

                {/* Stock shift */}
                <div className="w-28 flex items-center justify-center gap-1.5">
                  <div className="h-3.5 w-6 rounded bg-muted/50" />
                  <div className="h-3 w-3 rounded bg-muted/40" />
                  <div className="h-3.5 w-6 rounded bg-muted/70" />
                </div>

                {/* Reason & note */}
                <div className="w-44 space-y-1">
                  <div className="h-3.5 w-24 rounded bg-muted/70" />
                  <div className="h-2.5 w-36 rounded bg-muted/40" />
                </div>

                {/* Performed by */}
                <div className="w-24 text-right">
                  <div className="h-4 w-20 rounded-full bg-muted/50 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Footer Skeleton */}
        <div className="border-t border-border/40 px-5 py-3 bg-muted/10 flex items-center justify-between">
          <div className="h-3.5 w-36 rounded bg-muted/50" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted/50" />
            <div className="h-8 w-8 rounded-lg bg-muted/60" />
            <div className="h-8 w-8 rounded-lg bg-muted/50" />
          </div>
        </div>
      </div>

      {/* ── 5. Mobile Cards Skeleton ── */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-card border border-border/50 p-3.5 space-y-3 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 rounded-xl bg-muted/60 shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-3.5 w-full rounded bg-muted/80" />
                <div className="h-2.5 w-24 rounded bg-muted/50" />
              </div>
            </div>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-muted/50" />
              <div className="h-3.5 w-24 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
