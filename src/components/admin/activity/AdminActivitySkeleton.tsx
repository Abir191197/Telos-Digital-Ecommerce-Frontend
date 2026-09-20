"use client";

import React from "react";

export function AdminActivitySkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-6 animate-pulse">
      {/* ── 1. Mobile Header Skeleton ── */}
      <div className="sm:hidden flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-amber-500/10" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 rounded bg-muted/80" />
            <div className="h-2.5 w-36 rounded bg-muted/50" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-8 w-8 rounded-xl bg-muted/40" />
          <div className="h-8 w-8 rounded-xl bg-muted/40" />
        </div>
      </div>

      {/* Mobile Search Bar Skeleton */}
      <div className="sm:hidden">
        <div className="h-10 w-full rounded-2xl bg-muted/40" />
      </div>

      {/* ── 2. Desktop Header Banner Skeleton ── */}
      <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4.5 w-24 rounded-md bg-amber-500/10" />
            <div className="h-3 w-3 rounded-full bg-muted/40" />
            <div className="h-3.5 w-44 rounded bg-muted/50" />
          </div>
          <div className="h-7 sm:h-8 w-64 rounded-lg bg-muted/80" />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-24 rounded-xl bg-muted/40" />
        </div>
      </div>

      {/* ── 3. 3 KPI Metric Cards Skeleton (ActivityKpiStrip) ── */}
      <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="shrink-0 w-[72vw] max-w-[280px] sm:w-auto sm:max-w-none rounded-3xl bg-card p-4 sm:p-5 border border-border/40 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="h-3 w-28 rounded bg-muted/60" />
              <div className="h-9 w-9 rounded-2xl bg-muted/50 shrink-0" />
            </div>

            <div className="space-y-1.5 my-auto">
              <div className="h-7 sm:h-8 w-20 rounded-lg bg-muted/80" />
              <div className="h-3 w-40 rounded bg-muted/40" />
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
              <div className="h-4.5 w-20 rounded-full bg-muted/40" />
              <div className="h-3.5 w-3.5 rounded bg-muted/30" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. Desktop Filter Dock Skeleton ── */}
      <div className="hidden md:flex px-4 py-3 bg-card/90 border rounded-3xl border-border/50 items-center justify-between gap-3">
        <div className="h-10 flex-1 rounded-xl bg-muted/40" />
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-36 rounded-xl bg-muted/40 border border-border/50" />
          <div className="h-10 w-32 rounded-xl bg-muted/40 border border-border/50" />
          <div className="h-10 w-36 rounded-xl bg-muted/40 border border-border/50" />
          <div className="h-10 w-20 rounded-xl bg-muted/50 p-1" />
        </div>
      </div>

      {/* ── 5. Desktop Activity Table Skeleton ── */}
      <div className="hidden md:block rounded-3xl bg-card border-none overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <div className="border-b border-border/50 bg-muted/20 py-3.5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="h-3.5 w-24 rounded bg-muted/60" />
              <div className="h-3.5 w-28 rounded bg-muted/60" />
              <div className="h-3.5 w-20 rounded bg-muted/60" />
              <div className="h-3.5 w-44 rounded bg-muted/60" />
            </div>
            <div className="flex items-center gap-12 pr-4">
              <div className="h-3.5 w-20 rounded bg-muted/60" />
              <div className="h-3.5 w-24 rounded bg-muted/60" />
            </div>
          </div>

          <div className="divide-y divide-border/40">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="py-3.5 px-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-12">
                  <div className="flex items-center gap-2 w-44">
                    <div className="h-3.5 w-3.5 rounded bg-muted/40" />
                    <div className="h-3.5 w-24 rounded bg-muted/60" />
                  </div>
                  <div className="flex items-center gap-2 w-48">
                    <div className="h-7 w-7 rounded-xl bg-muted/50 shrink-0" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-24 rounded bg-muted/70" />
                      <div className="h-2.5 w-16 rounded bg-muted/40" />
                    </div>
                  </div>
                  <div className="w-36">
                    <div className="h-5 w-24 rounded-full bg-muted/50" />
                  </div>
                  <div className="space-y-1 min-w-[200px]">
                    <div className="h-3.5 w-48 rounded bg-muted/70" />
                    <div className="h-2.5 w-36 rounded bg-muted/40" />
                  </div>
                </div>

                <div className="flex items-center gap-12 pr-4">
                  <div className="w-32">
                    <div className="h-5 w-20 rounded-full bg-muted/50" />
                  </div>
                  <div className="w-44 text-right flex flex-col items-end gap-1">
                    <div className="h-3.5 w-20 rounded bg-muted/70" />
                    <div className="h-2.5 w-14 rounded bg-muted/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer Pagination Skeleton */}
          <div className="py-3.5 px-4 border-t border-border/40 flex items-center justify-between bg-muted/10">
            <div className="h-3.5 w-40 rounded bg-muted/50" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-muted/40" />
              <div className="h-8 w-8 rounded-lg bg-muted/40" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. Mobile Cards Skeleton (fallback for small screens) ── */}
      <div className="md:hidden space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-card p-4 border border-border/40 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-muted/50" />
                <div className="space-y-1">
                  <div className="h-3.5 w-24 rounded bg-muted/70" />
                  <div className="h-2.5 w-16 rounded bg-muted/40" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-muted/50" />
            </div>
            <div className="space-y-1">
              <div className="h-3.5 w-44 rounded bg-muted/70" />
              <div className="h-2.5 w-32 rounded bg-muted/40" />
            </div>
            <div className="pt-2 border-t border-border/30 flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-muted/40" />
              <div className="h-3 w-20 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
