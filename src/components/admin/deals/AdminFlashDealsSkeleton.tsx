"use client";

import React from "react";

export function AdminFlashDealsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-16 animate-pulse">
      {/* ── 1. Top Header Banner Skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 rounded-md bg-amber-500/20" />
              <div className="h-4 w-24 rounded-full bg-muted/60" />
            </div>
            <div className="h-7 w-60 rounded-lg bg-muted/80" />
            <div className="h-3.5 w-96 max-w-full rounded bg-muted/50" />
          </div>
        </div>

        <div className="h-9 w-44 rounded-full bg-muted/40 border border-border shrink-0" />
      </div>

      {/* ── 2. KPI Summary Cards Skeleton (3 Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total in Flash Deals */}
        <div className="rounded-3xl border border-amber-500/20 bg-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 rounded bg-muted/60" />
            <div className="h-8 w-8 rounded-xl bg-amber-500/15" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="h-7 w-12 rounded-lg bg-muted/80" />
            <div className="h-3 w-24 rounded bg-muted/40" />
          </div>
          <div className="h-2.5 w-44 rounded bg-muted/40" />
        </div>

        {/* Featured on Homepage */}
        <div className="rounded-3xl border border-orange-500/30 bg-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-36 rounded bg-orange-500/30" />
            <div className="h-5 w-20 rounded-full bg-orange-500/20" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="h-7 w-12 rounded-lg bg-muted/80" />
            <div className="h-3 w-28 rounded bg-muted/40" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted/60" />
        </div>

        {/* Total Catalog Items */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-muted/60" />
            <div className="h-8 w-8 rounded-xl bg-muted/60" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="h-7 w-12 rounded-lg bg-muted/80" />
            <div className="h-3 w-24 rounded bg-muted/40" />
          </div>
          <div className="h-2.5 w-48 rounded bg-muted/40" />
        </div>
      </div>

      {/* ── 3. Toolbar: Search & Filter Tabs Skeleton ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border/80">
          <div className="h-7 w-28 rounded-xl bg-muted/70" />
          <div className="h-7 w-32 rounded-xl bg-muted/50" />
          <div className="h-7 w-36 rounded-xl bg-muted/50" />
          <div className="h-7 w-32 rounded-xl bg-muted/50" />
        </div>

        <div className="h-9 w-full md:w-72 rounded-2xl bg-muted/40 border border-border" />
      </div>

      {/* ── 4. Desktop Table Skeleton ── */}
      <div className="hidden md:block rounded-3xl bg-card border border-border/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[340px]">
          <div className="border-b border-border/60 bg-muted/30 py-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-4 w-4 rounded bg-muted/60" />
              <div className="h-3.5 w-24 rounded bg-muted/70" />
            </div>
            <div className="flex items-center gap-12 pr-6">
              <div className="h-3.5 w-24 rounded bg-muted/50" />
              <div className="h-3.5 w-20 rounded bg-muted/50" />
              <div className="h-3.5 w-14 rounded bg-muted/50" />
              <div className="h-3.5 w-32 rounded bg-muted/50" />
              <div className="h-3.5 w-36 rounded bg-muted/50" />
            </div>
          </div>

          <div className="divide-y divide-border/40">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="py-3.5 px-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
              >
                {/* Checkbox & Product info */}
                <div className="flex items-center gap-3 min-w-[240px] flex-1">
                  <div className="h-4 w-4 rounded bg-muted/50 shrink-0" />
                  <div className="h-11 w-11 rounded-xl bg-muted/60 shrink-0" />
                  <div className="space-y-1.5 flex-1 max-w-sm">
                    <div className="h-3.5 w-4/5 rounded bg-muted/80" />
                    <div className="h-2.5 w-1/3 rounded bg-muted/40" />
                  </div>
                </div>

                {/* Brand & Category */}
                <div className="w-32 space-y-1">
                  <div className="h-3 w-16 rounded bg-muted/60" />
                  <div className="h-4 w-20 rounded-md bg-muted/50" />
                </div>

                {/* Price */}
                <div className="w-24 text-right">
                  <div className="h-4 w-16 rounded bg-muted/80 ml-auto" />
                </div>

                {/* Stock */}
                <div className="w-20 flex justify-center">
                  <div className="h-5 w-12 rounded-full bg-muted/50" />
                </div>

                {/* Toggle Flash Deal */}
                <div className="w-36 flex flex-col items-center gap-1">
                  <div className="h-6 w-11 rounded-full bg-muted/60" />
                  <div className="h-2.5 w-8 rounded bg-muted/40" />
                </div>

                {/* Toggle Homepage Featured */}
                <div className="w-40 flex flex-col items-center gap-1">
                  <div className="h-6 w-11 rounded-full bg-muted/60" />
                  <div className="h-2.5 w-12 rounded bg-muted/40" />
                </div>
              </div>
            ))}
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
              <div className="h-16 w-16 rounded-xl bg-muted/60 shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-3.5 w-full rounded bg-muted/80" />
                <div className="h-2.5 w-24 rounded bg-muted/50" />
                <div className="h-4 w-16 rounded bg-muted/70" />
              </div>
            </div>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="h-6 w-11 rounded-full bg-muted/60" />
              <div className="h-6 w-11 rounded-full bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
