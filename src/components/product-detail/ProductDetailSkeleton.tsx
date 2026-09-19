"use client";

import React from "react";

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* 🧭 Breadcrumb Skeleton 🧭 */}
      <nav aria-label="Breadcrumb skeleton" className="border-b border-border/40 bg-muted/10 py-3">
        <div className="container px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-muted/60" />
            <div className="h-3 w-3 rounded bg-muted/40" />
            <div className="h-3 w-14 rounded bg-muted/60" />
            <div className="h-3 w-3 rounded bg-muted/40" />
            <div className="h-3 w-20 rounded bg-muted/60" />
            <div className="h-3 w-3 rounded bg-muted/40" />
            <div className="h-3 w-36 rounded bg-muted/70" />
          </div>
        </div>
      </nav>

      {/* 🌟 Main Product Stage Skeleton 🌟 */}
      <div className="container px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-start">
          {/* Left Column: Media Gallery Skeleton (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-3 lg:sticky lg:top-20">
            {/* Main Stage Image Area */}
            <div className="relative aspect-square w-full rounded-3xl bg-muted/50 border border-border/60 overflow-hidden shadow-xs flex items-center justify-center">
              <div className="h-20 w-20 rounded-2xl bg-muted/80" />
              {/* Floating quick action badges top right */}
              <div className="absolute top-3.5 right-3.5 flex flex-col gap-2">
                <div className="h-9 w-9 rounded-full bg-background/80 border border-border/40" />
                <div className="h-9 w-9 rounded-full bg-background/80 border border-border/40" />
              </div>
            </div>

            {/* Thumbnail selector rail */}
            <div className="flex gap-2 overflow-hidden py-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-muted/50 border border-border/60 shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Buying Hub Skeleton (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-start space-y-4">
            <div className="space-y-4">
              {/* Brand, Badges & SKU Row */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 rounded-full bg-amber-500/10 border border-amber-500/20" />
                  <div className="h-5 w-18 rounded-full bg-rose-500/10" />
                  <div className="h-4 w-20 rounded-md bg-muted/40" />
                </div>
              </div>

              {/* Product Title Skeleton */}
              <div className="space-y-2">
                <div className="h-7 sm:h-8 w-11/12 rounded-xl bg-muted/80" />
                <div className="h-7 sm:h-8 w-3/5 rounded-xl bg-muted/70" />
              </div>

              {/* Ratings & Meta Row */}
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-12 rounded-md bg-amber-500/15" />
                <div className="h-3.5 w-24 rounded bg-muted/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-muted/30" />
                <div className="h-3.5 w-24 rounded bg-muted/50" />
              </div>

              {/* Compact Pricing & Stock Strip */}
              <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-2xs flex items-center justify-between">
                <div className="flex items-baseline gap-2.5">
                  <div className="h-8 sm:h-9 w-32 rounded-xl bg-muted/80" />
                  <div className="h-5 w-20 rounded-lg bg-muted/40" />
                </div>
                <div className="h-6 w-24 rounded-full bg-emerald-500/15" />
              </div>

              {/* Short description skeleton */}
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-muted/50" />
                <div className="h-3.5 w-4/5 rounded bg-muted/50" />
              </div>

              {/* Variant Selector Skeleton */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 rounded bg-muted/60" />
                  <div className="h-3 w-16 rounded bg-muted/40" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 w-24 rounded-xl bg-muted/60 border border-border/70" />
                  <div className="h-8 w-20 rounded-xl bg-muted/40 border border-border/50" />
                  <div className="h-8 w-28 rounded-xl bg-muted/40 border border-border/50" />
                </div>
              </div>

              {/* Quantity & Actions Skeleton */}
              <div className="pt-1 space-y-3">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <div className="h-3 w-14 rounded bg-muted/50" />
                  <div className="h-9 w-24 rounded-xl bg-muted/40 border border-border/60" />
                </div>

                {/* Primary CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="h-11 rounded-2xl bg-amber-500/25" />
                  <div className="h-11 rounded-2xl bg-muted/80" />
                </div>
              </div>

              {/* Delivery & Trust Strip Skeleton */}
              <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-border/40">
                <div className="h-12 rounded-xl bg-card border border-border/50" />
                <div className="h-12 rounded-xl bg-card border border-border/50" />
                <div className="h-12 rounded-xl bg-card border border-border/50" />
              </div>
            </div>
          </div>
        </div>

        {/* 📄 Specifications & Description Skeleton 📄 */}
        <div className="mt-14 pt-10 border-t border-border/70 space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-amber-500/20" />
            <div className="h-7 w-64 rounded-xl bg-muted/70" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Description Lines (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="h-4 w-full rounded bg-muted/50" />
              <div className="h-4 w-11/12 rounded bg-muted/50" />
              <div className="h-4 w-4/5 rounded bg-muted/50" />
              <div className="h-4 w-5/6 rounded bg-muted/50" />
              <div className="h-28 rounded-2xl bg-card/60 border border-border/60 mt-4" />
            </div>

            {/* Spec Attributes Table (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-card p-5 space-y-3">
              <div className="h-4 w-32 rounded bg-muted/60 mb-2" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-border/40">
                  <div className="h-3 w-24 rounded bg-muted/40" />
                  <div className="h-3 w-32 rounded bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ⭐ Reviews Section Skeleton ⭐ */}
        <div className="mt-14 pt-10 border-t border-border/70 space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-amber-500/20" />
            <div className="h-7 w-56 rounded-xl bg-muted/70" />
          </div>
          <div className="h-36 rounded-3xl bg-card border border-border/70" />
        </div>

        {/* 📦 Related Products Skeleton 📦 */}
        <div className="mt-14 pt-10 border-t border-border/70 space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-amber-500/20" />
              <div className="h-6 w-48 rounded-xl bg-muted/70" />
            </div>
            <div className="h-8 w-24 rounded-full bg-muted/40" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden h-72 p-3 space-y-3"
              >
                <div className="aspect-square w-full rounded-xl bg-muted/50" />
                <div className="h-4 w-3/4 rounded bg-muted/60" />
                <div className="h-4 w-1/2 rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
