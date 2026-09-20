"use client";

import React from "react";

export function ProfitReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── 1. Report Header Bar Skeleton ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-64 rounded-lg bg-muted/80" />
            <div className="h-5 w-28 rounded-full bg-emerald-500/20" />
          </div>
          <div className="h-3.5 w-96 max-w-full rounded bg-muted/50" />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-9 w-32 rounded-xl bg-card border border-border/60" />
          <div className="h-9 w-48 rounded-xl bg-card border border-border/60" />
          <div className="h-9 w-28 rounded-xl bg-card border border-border/60" />
        </div>
      </div>

      {/* ── 2. 4 Profit KPI Cards Skeleton ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-card p-4.5 border border-border/40 space-y-3 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="h-3 w-28 rounded bg-muted/60" />
              <div className="h-8 w-8 rounded-xl bg-muted/50 shrink-0" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 sm:h-7 w-24 rounded-lg bg-muted/80" />
              <div className="h-2.5 w-32 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Desktop Profit Table Skeleton ── */}
      <div className="rounded-2xl bg-card border border-border/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[360px]">
          <div className="border-b border-border/40 bg-muted/40 py-3.5 px-4 flex items-center justify-between">
            <div className="h-3.5 w-28 rounded bg-muted/60" />
            <div className="flex items-center gap-10 pr-4">
              <div className="h-3.5 w-24 rounded bg-muted/50" />
              <div className="h-3.5 w-16 rounded bg-muted/50" />
              <div className="h-3.5 w-20 rounded bg-muted/50" />
              <div className="h-3.5 w-20 rounded bg-muted/50" />
              <div className="h-3.5 w-20 rounded bg-muted/50" />
              <div className="h-3.5 w-16 rounded bg-muted/50" />
              <div className="h-3.5 w-20 rounded bg-muted/50" />
            </div>
          </div>

          <div className="divide-y divide-border/20">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="py-3.5 px-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
              >
                {/* Order ID & Date */}
                <div className="w-28 space-y-1">
                  <div className="h-3.5 w-20 rounded bg-muted/80" />
                  <div className="h-2.5 w-16 rounded bg-muted/40" />
                </div>

                {/* Customer Details */}
                <div className="w-36 space-y-1">
                  <div className="h-3.5 w-28 rounded bg-muted/70" />
                  <div className="h-2.5 w-20 rounded bg-muted/40" />
                </div>

                {/* Items Sold */}
                <div className="w-16 text-center">
                  <div className="h-3.5 w-6 rounded bg-muted/60 mx-auto" />
                </div>

                {/* Order Revenue */}
                <div className="w-24 text-right">
                  <div className="h-3.5 w-16 rounded bg-muted/70 ml-auto" />
                </div>

                {/* Product Cost */}
                <div className="w-24 text-right">
                  <div className="h-3.5 w-14 rounded bg-muted/50 ml-auto" />
                </div>

                {/* Gross Profit */}
                <div className="w-24 text-right">
                  <div className="h-4 w-18 rounded bg-emerald-500/20 ml-auto" />
                </div>

                {/* Margin % */}
                <div className="w-16 flex justify-center">
                  <div className="h-5 w-12 rounded-full bg-muted/50" />
                </div>

                {/* Order Status */}
                <div className="w-20 flex justify-center">
                  <div className="h-5 w-16 rounded-full bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Footer Skeleton */}
        <div className="border-t border-border/40 px-4 py-3 bg-muted/10 flex items-center justify-between">
          <div className="h-3.5 w-36 rounded bg-muted/50" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted/50" />
            <div className="h-8 w-8 rounded-lg bg-muted/60" />
            <div className="h-8 w-8 rounded-lg bg-muted/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
