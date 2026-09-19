"use client";

import React from "react";

export function CategoriesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* ── Hero Banner Skeleton (Desktop/Tablet) ── */}
      <section className="hidden sm:block border-b border-border/40 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent py-10 md:py-14 mb-6 sm:mb-8">
        <div className="container px-4 flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
          {/* Badge */}
          <div className="h-6 w-36 rounded-full bg-amber-500/15 border border-amber-500/20" />
          {/* Headline */}
          <div className="h-10 sm:h-12 w-80 max-w-full rounded-2xl bg-muted/80" />
          {/* Subtitle */}
          <div className="h-4 w-96 max-w-full rounded-lg bg-muted/50" />
          {/* Trust Guarantees Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="h-7 w-40 rounded-full bg-card border border-border/50" />
            <div className="h-7 w-48 rounded-full bg-card border border-border/50" />
            <div className="h-7 w-44 rounded-full bg-card border border-border/50" />
          </div>
        </div>
      </section>

      {/* ── Search & Filter Tabs Header Skeleton ── */}
      <div className="container px-3 sm:px-6 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
          {/* Filter Pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-9 w-16 rounded-full bg-amber-500/20" />
            <div className="h-9 w-28 rounded-full bg-muted/50" />
            <div className="h-9 w-24 rounded-full bg-muted/50" />
            <div className="h-9 w-28 rounded-full bg-muted/50" />
            <div className="h-9 w-24 rounded-full bg-muted/50" />
          </div>

          {/* Search Box */}
          <div className="h-10 w-full md:w-72 rounded-2xl bg-card border border-border/60" />
        </div>
      </div>

      {/* ── Category Cards Grid Skeleton (10 cards matching CategoryCardItem) ── */}
      <div className="container px-3 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between overflow-hidden rounded-3xl bg-card border border-border/60 shadow-xs h-72 sm:h-80"
            >
              {/* Image banner placeholder with top-left icon badge */}
              <div className="relative h-32 sm:h-38 w-full bg-muted/50">
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-background/80" />
              </div>

              {/* Card body: title, subcategory pills, footer */}
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted/80" />
                  <div className="h-3 w-1/2 rounded bg-muted/50" />
                  <div className="flex gap-1 pt-1">
                    <div className="h-5 w-14 rounded-full bg-muted/40" />
                    <div className="h-5 w-16 rounded-full bg-muted/40" />
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex justify-between items-center">
                  <div className="h-3 w-16 rounded bg-muted/40" />
                  <div className="h-6 w-6 rounded-full bg-muted/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
