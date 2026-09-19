"use client";

import React from "react";
import { CatalogGridSkeleton } from "@/components/catalog";

export function CategoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16 animate-pulse">
      {/* ── Breadcrumb Navigation Skeleton ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-muted/60" />
            <div className="h-3 w-3 rounded bg-muted/40" />
            <div className="h-3 w-16 rounded bg-muted/60" />
            <div className="h-3 w-3 rounded bg-muted/40" />
            <div className="h-3 w-28 rounded bg-muted/70" />
          </div>
        </div>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {/* ── 1. Thematic Hero Header Banner Skeleton (sm+) ── */}
        <section className="hidden sm:block container px-3 sm:px-6 pt-4">
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] bg-card border border-border/60 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Info Skeleton */}
              <div className="lg:col-span-6 space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-6 w-32 rounded-full bg-amber-500/15 border border-amber-500/20" />
                  <div className="h-6 w-28 rounded-full bg-muted/50" />
                  <div className="h-6 w-32 rounded-full bg-emerald-500/10" />
                </div>
                {/* Title */}
                <div className="h-9 sm:h-11 w-64 rounded-2xl bg-muted/80" />
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3.5 w-full rounded bg-muted/50" />
                  <div className="h-3.5 w-4/5 rounded bg-muted/50" />
                </div>
                {/* Micro guarantees */}
                <div className="pt-3 border-t border-border/40 flex gap-4">
                  <div className="h-3 w-28 rounded bg-muted/40" />
                  <div className="h-3 w-28 rounded bg-muted/40" />
                  <div className="h-3 w-28 rounded bg-muted/40" />
                </div>
              </div>

              {/* Right Column: Hero Cover Image Placeholder */}
              <div className="lg:col-span-6 h-56 lg:h-64 rounded-2xl bg-muted/40" />
            </div>
          </div>
        </section>

        {/* ── 2. Embedded Catalog Section Skeleton (Sidebar + Product Grid) ── */}
        <section className="container px-3 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Filter Sidebar Skeleton */}
            <div className="hidden lg:block lg:col-span-3 space-y-4">
              <div className="h-[480px] rounded-3xl border border-border/60 bg-card p-5 space-y-4">
                <div className="h-5 w-24 rounded bg-muted/70" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-32 rounded bg-muted/60" />
                  <div className="h-8 w-full rounded-xl bg-muted/40" />
                </div>
                <div className="space-y-2 pt-4 border-t border-border/40">
                  <div className="h-4 w-24 rounded bg-muted/60" />
                  <div className="h-10 w-full rounded-xl bg-muted/40" />
                </div>
                <div className="space-y-2 pt-4 border-t border-border/40">
                  <div className="h-4 w-28 rounded bg-muted/60" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 rounded bg-muted/30" />
                    <div className="h-4 w-32 rounded bg-muted/30" />
                    <div className="h-4 w-40 rounded bg-muted/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Grid Skeleton */}
            <div className="lg:col-span-9 space-y-5">
              {/* Header bar */}
              <div className="h-11 rounded-2xl bg-card border border-border/60 p-3 flex justify-between items-center">
                <div className="h-4 w-28 rounded bg-muted/60" />
                <div className="h-7 w-32 rounded-xl bg-muted/50" />
              </div>
              <CatalogGridSkeleton count={8} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
