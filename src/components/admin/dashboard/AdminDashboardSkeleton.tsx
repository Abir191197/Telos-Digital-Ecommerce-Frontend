"use client";

import React from "react";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6 pb-8 animate-pulse">
      {/* ── 1. Header Bar Skeleton ── */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 rounded-lg bg-muted/70" />
            <div className="h-5 w-14 rounded-md bg-muted/40" />
          </div>
          <div className="h-3.5 w-48 rounded bg-muted/40" />
        </div>
        <div className="h-8 w-24 rounded-xl bg-muted/40" />
      </div>

      {/* ── 2. Action Center Card Skeleton ── */}
      <div className="rounded-2xl bg-card p-4 sm:p-5 border border-border/40 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/15" />
            <div className="space-y-1">
              <div className="h-4 w-28 rounded bg-muted/70" />
              <div className="h-2.5 w-44 rounded bg-muted/40" />
            </div>
          </div>
          <div className="h-4 w-18 rounded-full bg-muted/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted/60 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-muted/70" />
                  <div className="h-2.5 w-32 rounded bg-muted/40" />
                </div>
              </div>
              <div className="h-5 w-7 rounded-lg bg-muted/60" />
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. 4 Essential KPI Cards Skeleton ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-card p-3.5 sm:p-5 lg:p-6 border border-border/40 space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-muted/60" />
              <div className="h-9 w-9 rounded-xl bg-muted/50 shrink-0" />
            </div>
            <div className="space-y-2">
              <div className="h-7 sm:h-8 w-28 rounded-lg bg-muted/80" />
              <div className="h-3 w-20 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. Revenue Chart & Payment Channels Distribution Skeleton ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Revenue Chart Card Skeleton (7 cols) */}
        <div className="xl:col-span-7 rounded-2xl bg-card p-4 sm:p-6 border border-border/40 space-y-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-cyan-500/15" />
                <div className="space-y-1">
                  <div className="h-4 w-36 rounded bg-muted/70" />
                  <div className="h-3 w-28 rounded bg-muted/40" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-28 rounded-xl bg-muted/50" />
                <div className="h-7 w-20 rounded-xl bg-muted/40" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 pb-2 border-b border-border/30">
              <div className="h-3 w-24 rounded bg-muted/40" />
              <div className="h-3.5 w-28 rounded bg-muted/60" />
            </div>

            {/* Chart SVG simulated bars/waves */}
            <div className="h-56 w-full pt-4 flex items-end gap-3 sm:gap-5 px-4 justify-between">
              {[40, 65, 30, 85, 55, 95, 70].map((h, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-t-lg bg-muted/50"
                    style={{ height: `${h}%` }}
                  />
                  <div className="h-2.5 w-6 rounded bg-muted/30" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Payment Channels Split Card Skeleton (5 cols) */}
        <div className="xl:col-span-5 rounded-2xl bg-card p-4 sm:p-5 border border-border/40 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="h-4 w-32 rounded bg-muted/70" />
                <div className="h-4 w-16 rounded bg-emerald-500/15" />
              </div>
              <div className="h-7 w-24 rounded-xl bg-muted/40" />
            </div>

            <div className="flex items-center justify-between pt-3 pb-1">
              <div className="h-3 w-28 rounded bg-muted/40" />
              <div className="h-4 w-20 rounded-full bg-muted/50" />
            </div>

            {/* Split gauge bar */}
            <div className="py-2">
              <div className="h-2.5 w-full rounded-full bg-muted/60" />
            </div>

            {/* Payment methods list */}
            <div className="space-y-2 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-muted/60 shrink-0" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-20 rounded bg-muted/70" />
                      <div className="h-2.5 w-16 rounded bg-muted/40" />
                    </div>
                  </div>
                  <div className="h-4 w-10 rounded bg-muted/60" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-8 w-full rounded-xl bg-muted/30" />
        </div>
      </div>

      {/* ── 5. Live Recent Orders Table & Top Products Skeleton ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Recent Orders Feed Skeleton (7 cols) */}
        <div className="xl:col-span-7 rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-blue-500/15 shrink-0" />
                <div className="space-y-1">
                  <div className="h-4 w-32 rounded bg-muted/70" />
                  <div className="h-2.5 w-44 rounded bg-muted/40" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-24 rounded-xl bg-muted/40" />
                <div className="h-7 w-16 rounded-xl bg-muted/40" />
              </div>
            </div>

            {/* Metric pill strip */}
            <div className="grid grid-cols-3 gap-2 pt-3 pb-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-2 rounded-xl bg-muted/30 border border-border/20 space-y-1">
                  <div className="h-2.5 w-14 rounded bg-muted/40" />
                  <div className="h-4 w-16 rounded bg-muted/70" />
                </div>
              ))}
            </div>

            {/* Table rows */}
            <div className="space-y-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3.5 w-20 rounded bg-muted/70" />
                    <div className="h-3 w-24 rounded bg-muted/40" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3.5 w-16 rounded bg-muted/70" />
                    <div className="h-5 w-16 rounded-full bg-muted/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border/30 flex justify-between items-center">
            <div className="h-3 w-36 rounded bg-muted/40" />
            <div className="h-3 w-24 rounded bg-muted/60" />
          </div>
        </div>

        {/* Right: Top Products Card Skeleton (5 cols) */}
        <div className="xl:col-span-5 rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-orange-500/15" />
                <div className="space-y-1">
                  <div className="h-4 w-32 rounded bg-muted/70" />
                  <div className="h-2.5 w-36 rounded bg-muted/40" />
                </div>
              </div>
              <div className="h-7 w-24 rounded-xl bg-muted/40" />
            </div>

            {/* Product items */}
            <div className="space-y-2.5 pt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-muted/30 border border-border/20 gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-3 w-4 rounded bg-muted/40 shrink-0" />
                    <div className="h-9 w-9 rounded-lg bg-muted/60 shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="h-3.5 w-3/4 rounded bg-muted/70" />
                      <div className="h-2.5 w-1/2 rounded bg-muted/40" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right shrink-0">
                    <div className="h-3.5 w-12 rounded bg-muted/70 ml-auto" />
                    <div className="h-2.5 w-14 rounded bg-muted/40 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-3 w-32 rounded bg-muted/40 mx-auto" />
        </div>
      </div>

      {/* ── 6. Stock Alerts & Live Audit Stream Skeleton ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Inventory Alert List Skeleton (5 cols) */}
        <div className="xl:col-span-5 rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 shrink-0" />
                <div className="space-y-1">
                  <div className="h-4 w-28 rounded bg-muted/70" />
                  <div className="h-2.5 w-40 rounded bg-muted/40" />
                </div>
              </div>
              <div className="h-5 w-20 rounded-full bg-amber-500/15" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 pb-2">
              <div className="p-2 rounded-xl bg-muted/30 border border-border/20 space-y-1">
                <div className="h-2.5 w-20 rounded bg-muted/40" />
                <div className="h-3.5 w-14 rounded bg-muted/70" />
              </div>
              <div className="p-2 rounded-xl bg-muted/30 border border-border/20 space-y-1">
                <div className="h-2.5 w-16 rounded bg-muted/40" />
                <div className="h-3.5 w-12 rounded bg-emerald-500/20" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/20 gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-muted/60 shrink-0" />
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="h-3.5 w-3/4 rounded bg-muted/70" />
                      <div className="h-2.5 w-24 rounded bg-rose-500/20" />
                    </div>
                  </div>
                  <div className="h-7 w-16 rounded-lg bg-muted/60 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border/30 flex justify-between items-center">
            <div className="h-3 w-40 rounded bg-muted/40" />
            <div className="h-3 w-20 rounded bg-muted/60" />
          </div>
        </div>

        {/* Right: Recent Activity Log Skeleton (7 cols) */}
        <div className="xl:col-span-7 rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/15" />
                <div className="space-y-1">
                  <div className="h-4 w-36 rounded bg-muted/70" />
                  <div className="h-2.5 w-32 rounded bg-muted/40" />
                </div>
              </div>
              <div className="h-3 w-20 rounded bg-muted/60" />
            </div>

            <div className="space-y-2.5 pt-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-muted/30 border border-border/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-28 rounded bg-muted/70" />
                      <div className="h-3.5 w-14 rounded bg-muted/50" />
                    </div>
                    <div className="h-2.5 w-12 rounded bg-muted/40" />
                  </div>
                  <div className="h-3 w-4/5 rounded bg-muted/50" />
                  <div className="h-2.5 w-36 rounded bg-muted/40" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-8 w-full rounded-xl bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
