"use client";

import React from "react";

export function FlashDealCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl bg-card border border-border/50 p-3 shadow-xs animate-pulse">
      {/* Product Image Thumbnail */}
      <div className="relative aspect-square w-full rounded-2xl bg-muted/50 overflow-hidden">
        <div className="absolute top-2.5 left-2.5 h-5 w-12 rounded-full bg-amber-500/20" />
        <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-muted/60" />
      </div>

      {/* Product Info */}
      <div className="pt-3 pb-1 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-2.5 w-14 rounded bg-amber-500/20" />
            <div className="h-2.5 w-12 rounded bg-muted/50" />
          </div>
          <div className="h-3.5 w-full rounded bg-muted/80" />
          <div className="h-3 w-2/3 rounded bg-muted/60" />
        </div>

        <div className="space-y-2 pt-2 border-t border-border/40">
          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-muted/40" />
          {/* Price and Cart button */}
          <div className="flex items-center justify-between pt-1">
            <div className="h-4 w-16 rounded bg-muted/80" />
            <div className="h-8 w-18 rounded-xl bg-amber-500/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlashDealsSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* ── Breadcrumb Bar Skeleton ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6 flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-muted/60" />
          <span className="text-border text-xs">/</span>
          <div className="h-3 w-18 rounded bg-muted/80" />
        </div>
      </div>

      {/* ── Compact Header Bar Skeleton with Countdown Pill ── */}
      <section className="container px-3 sm:px-6 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-500/15" />
              <div className="h-7 w-36 rounded-xl bg-muted/80" />
              <div className="h-5 w-16 rounded-full bg-amber-500/20" />
            </div>
            <div className="h-3.5 w-64 sm:w-80 rounded bg-muted/50 mt-2" />
          </div>

          {/* Countdown Pill Skeleton */}
          <div className="h-8 w-44 rounded-full bg-card border border-border/70 self-start sm:self-auto" />
        </div>
      </section>

      {/* ── Flash Deals Grid Skeleton (10 cards matching FlashDealCard) ── */}
      <section className="container px-3 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-5 w-48 rounded bg-muted/80" />
            <div className="h-3 w-36 rounded bg-muted/50 mt-1.5" />
          </div>
          <div className="h-8 w-28 rounded-full bg-muted/60" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <FlashDealCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
