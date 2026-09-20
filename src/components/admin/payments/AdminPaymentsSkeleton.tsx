"use client";

import React from "react";

export function AdminPaymentsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── 1. View Header Skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-64 rounded-xl bg-muted/70" />
            <div className="h-5 w-20 rounded-full bg-amber-500/20" />
          </div>
          <div className="h-3.5 w-80 sm:w-96 rounded bg-muted/40" />
        </div>
        <div className="h-8 w-44 rounded-2xl bg-muted/40" />
      </div>

      {/* ── 2. KPI Cards Strip Skeleton (3 Cards) ── */}
      <div className="flex overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-3 gap-3 sm:gap-4 -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="shrink-0 w-[72vw] max-w-[280px] sm:w-auto sm:max-w-none rounded-3xl bg-card p-4 sm:p-5 border border-border/40 sm:border-none space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="h-3.5 w-28 rounded bg-muted/60" />
              <div className="h-9 w-9 rounded-2xl bg-muted/50 shrink-0" />
            </div>
            <div className="space-y-2">
              <div className="h-8 sm:h-9 w-32 rounded-lg bg-muted/80 font-mono" />
              <div className="h-3 w-36 rounded bg-muted/40" />
            </div>
            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-muted/40" />
              <div className="h-4 w-4 rounded bg-muted/30" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Top Filter Dock Skeleton (Desktop & Tablet) ── */}
      <div className="hidden md:flex px-4 py-3 bg-card/90 border rounded-3xl border-border/50 shadow-xs items-center justify-between gap-3">
        {/* Search */}
        <div className="h-10 flex-1 rounded-2xl bg-muted/40" />
        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-44 rounded-2xl bg-muted/40" />
          <div className="h-10 w-44 rounded-2xl bg-muted/40" />
          <div className="h-10 w-40 rounded-2xl bg-muted/40" />
        </div>
      </div>

      {/* ── 4. Desktop Payments Table Skeleton ── */}
      <div className="hidden md:block rounded-3xl bg-card border border-border/40 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="py-3.5 px-4"><div className="h-3 w-28 rounded bg-muted/60" /></th>
                <th className="py-3.5 px-4"><div className="h-3 w-20 rounded bg-muted/60" /></th>
                <th className="py-3.5 px-4"><div className="h-3 w-16 rounded bg-muted/60" /></th>
                <th className="py-3.5 px-4"><div className="h-3 w-16 rounded bg-muted/60" /></th>
                <th className="py-3.5 px-4"><div className="h-3 w-16 rounded bg-muted/60" /></th>
                <th className="py-3.5 px-4"><div className="h-3 w-20 rounded bg-muted/60" /></th>
                <th className="py-3.5 px-4 text-right"><div className="h-3 w-28 ml-auto rounded bg-muted/60" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="hover:bg-muted/10">
                  {/* Order # & TrxID */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <div className="h-3.5 w-24 rounded bg-muted/70 font-mono" />
                    <div className="h-3 w-28 rounded bg-muted/40 font-mono" />
                  </td>
                  {/* Customer */}
                  <td className="py-3.5 px-4 space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-muted/70" />
                    <div className="h-2.5 w-20 rounded bg-muted/40" />
                  </td>
                  {/* Method */}
                  <td className="py-3.5 px-4">
                    <div className="h-6 w-20 rounded-full bg-muted/50" />
                  </td>
                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-16 rounded bg-muted/80 font-mono font-bold" />
                  </td>
                  {/* Date */}
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="h-3.5 w-20 rounded bg-muted/60" />
                    <div className="h-2.5 w-14 rounded bg-muted/40" />
                  </td>
                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <div className="h-6 w-24 rounded-full bg-muted/50" />
                  </td>
                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="h-7 w-16 rounded-xl bg-muted/50" />
                      <div className="h-7 w-7 rounded-xl bg-muted/40" />
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

      {/* ── 5. Mobile Payment Cards Skeleton ── */}
      <div className="block md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-3xl bg-card border border-border/40 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="h-4 w-28 rounded bg-muted/70 font-mono" />
                <div className="h-3 w-20 rounded bg-muted/40" />
              </div>
              <div className="h-6 w-24 rounded-full bg-muted/50" />
            </div>

            <div className="flex items-center justify-between py-2 border-y border-border/40">
              <div className="space-y-1">
                <div className="h-3.5 w-28 rounded bg-muted/70" />
                <div className="h-2.5 w-20 rounded bg-muted/40" />
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-16 rounded bg-muted/80 ml-auto" />
                <div className="h-5 w-16 rounded-full bg-muted/50 ml-auto" />
              </div>
            </div>

            <div className="h-8 w-full rounded-2xl bg-muted/30" />

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="h-8 w-20 rounded-xl bg-muted/50" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 rounded-xl bg-muted/50" />
                <div className="h-8 w-16 rounded-xl bg-muted/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
