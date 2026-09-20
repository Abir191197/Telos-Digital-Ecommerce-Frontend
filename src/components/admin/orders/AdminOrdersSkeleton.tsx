"use client";

import React from "react";

export function AdminOrdersSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6 min-h-[calc(100dvh-4rem)] animate-pulse">
      {/* ── 1. Mobile Search Bar Skeleton ── */}
      <div className="md:hidden -mx-4 -mt-4 px-4 py-2.5 bg-background/95 border-b border-border/60">
        <div className="h-10 w-full rounded-xl bg-muted/40" />
      </div>

      {/* ── 2. Top Header Title & Actions Strip Skeleton (Desktop) ── */}
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-52 rounded-xl bg-muted/70" />
            <div className="h-5 w-16 rounded-full bg-amber-500/20" />
          </div>
          <div className="h-3.5 w-72 rounded bg-muted/40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-32 rounded-xl bg-muted/40" />
          <div className="h-9 w-28 rounded-xl bg-muted/40" />
        </div>
      </div>

      {/* ── 3. 4 KPI Cards Skeleton ── */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full rounded-2xl bg-card p-4 sm:p-5 border border-border/40 space-y-3.5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-muted/60" />
              <div className="h-9 w-9 rounded-xl bg-muted/50 shrink-0" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-28 rounded-lg bg-muted/80" />
              <div className="h-3 w-20 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. Filter Dock Skeleton (Search Bar & Status Tabs) ── */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-card/90 border rounded-2xl border-border/50 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Desktop search bar */}
        <div className="h-10 flex-1 hidden md:block rounded-xl bg-muted/40" />

        {/* Status pill tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {[18, 16, 20, 16, 18].map((w, idx) => (
            <div
              key={idx}
              className="h-8 rounded-xl bg-muted/50 shrink-0"
              style={{ width: `${w * 4}px` }}
            />
          ))}
          {/* View toggle */}
          <div className="h-8 w-18 rounded-xl bg-muted/40 shrink-0 ml-1 hidden sm:block" />
        </div>
      </div>

      {/* ── 5. Orders Table Skeleton (Desktop) ── */}
      <div className="hidden sm:flex rounded-2xl bg-card border border-border/40 overflow-hidden flex-col shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground border-b border-border/20">
                <th className="py-3 px-4"><div className="h-3 w-20 rounded bg-muted/60" /></th>
                <th className="py-3 px-4"><div className="h-3 w-24 rounded bg-muted/60" /></th>
                <th className="py-3 px-4"><div className="h-3 w-20 rounded bg-muted/60" /></th>
                <th className="py-3 px-4"><div className="h-3 w-24 rounded bg-muted/60" /></th>
                <th className="py-3 px-4 text-right"><div className="h-3 w-18 ml-auto rounded bg-muted/60" /></th>
                <th className="py-3 px-4"><div className="h-3 w-16 rounded bg-muted/60" /></th>
                <th className="py-3 px-4"><div className="h-3 w-16 rounded bg-muted/60" /></th>
                <th className="py-3 px-4 text-right"><div className="h-3 w-14 ml-auto rounded bg-muted/60" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="hover:bg-muted/10">
                  {/* Order ID & Date */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-muted/70 font-mono" />
                    <div className="h-2.5 w-16 rounded bg-muted/40" />
                  </td>
                  {/* Customer Details */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-muted/70" />
                    <div className="h-2.5 w-20 rounded bg-muted/40" />
                  </td>
                  {/* Destination */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <div className="h-3.5 w-16 rounded bg-muted/70" />
                    <div className="h-2.5 w-24 rounded bg-muted/40" />
                  </td>
                  {/* Items Summary with thumbnails */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-7 w-7 rounded-md bg-muted/60 shrink-0" />
                      <div className="h-7 w-7 rounded-md bg-muted/60 shrink-0" />
                      <div className="h-4 w-12 rounded bg-muted/40" />
                    </div>
                  </td>
                  {/* Total */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-4 w-16 rounded bg-muted/80 ml-auto" />
                  </td>
                  {/* Payment */}
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="h-3 w-12 rounded bg-muted/60" />
                    <div className="h-2.5 w-10 rounded bg-muted/40" />
                  </td>
                  {/* Status badge */}
                  <td className="py-3.5 px-4">
                    <div className="h-6 w-20 rounded-full bg-muted/50" />
                  </td>
                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="h-7 w-7 rounded-lg bg-muted/50" />
                      <div className="h-7 w-7 rounded-lg bg-muted/50" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination Footer Skeleton */}
        <div className="p-3.5 sm:p-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="h-3 w-40 rounded bg-muted/40" />
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-16 rounded-xl bg-muted/40" />
            <div className="h-8 w-8 rounded-xl bg-muted/60" />
            <div className="h-8 w-8 rounded-xl bg-muted/40" />
            <div className="h-8 w-16 rounded-xl bg-muted/40" />
          </div>
        </div>
      </div>

      {/* ── 6. Orders Card Grid Skeleton (Mobile / Card View) ── */}
      <div className="grid sm:hidden grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-card p-4 border border-border/40 space-y-3.5 shadow-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/30">
              <div className="space-y-1">
                <div className="h-4 w-28 rounded bg-muted/70 font-mono" />
                <div className="h-2.5 w-20 rounded bg-muted/40" />
              </div>
              <div className="h-6 w-20 rounded-full bg-muted/50" />
            </div>

            <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
              <div className="h-3.5 w-32 rounded bg-muted/70" />
              <div className="h-2.5 w-24 rounded bg-muted/40" />
              <div className="h-2.5 w-40 rounded bg-muted/40" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <div className="h-9 w-9 rounded-lg bg-muted/60" />
                <div className="h-9 w-9 rounded-lg bg-muted/60" />
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-20 rounded bg-muted/80 ml-auto" />
                <div className="h-2.5 w-14 rounded bg-muted/40 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
