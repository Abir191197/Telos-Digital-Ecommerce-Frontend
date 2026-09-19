"use client";

import React from "react";

export function BrandDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16 animate-pulse">
      {/* ── Breadcrumb Skeleton ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3 mb-6">
        <div className="container px-3 sm:px-6 flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-muted/60" />
          <span className="text-border text-xs">/</span>
          <div className="h-3 w-12 rounded bg-muted/60" />
          <span className="text-border text-xs">/</span>
          <div className="h-3 w-20 rounded bg-muted/80" />
        </div>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {/* ── Compact Brand Header Skeleton ── */}
        <section className="container px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-44 rounded-xl bg-muted/80" />
                <div className="h-5 w-24 rounded-full bg-amber-500/15" />
                <div className="h-5 w-28 rounded-full bg-emerald-500/15" />
              </div>
              <div className="h-3.5 w-72 sm:w-96 max-w-full rounded bg-muted/50 mt-2" />
            </div>

            <div className="h-7 w-24 rounded-full bg-muted/40 self-start sm:self-auto" />
          </div>
        </section>

        {/* ── Products Grid Skeleton ── */}
        <section className="container px-3 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden"
              >
                <div className="aspect-square w-full bg-muted/60" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 w-16 rounded bg-muted/60" />
                  <div className="h-4 w-full rounded bg-muted/70" />
                  <div className="h-3 w-20 rounded bg-muted/50" />
                  <div className="pt-2 flex items-center justify-between">
                    <div className="h-5 w-20 rounded bg-amber-500/20" />
                    <div className="h-8 w-8 rounded-xl bg-muted/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
