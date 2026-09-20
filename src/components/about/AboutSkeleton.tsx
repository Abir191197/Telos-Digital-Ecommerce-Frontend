"use client";

import React from "react";

export function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* ── Breadcrumb Bar Skeleton ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6 flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-muted/60" />
          <span className="text-border text-xs">/</span>
          <div className="h-3 w-40 rounded bg-muted/80" />
        </div>
      </div>

      {/* ── Operations Metrics Skeleton (4 cards) ── */}
      <section className="border-b border-border/60 bg-muted/20 py-10 sm:py-14">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-card border border-border/70 p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="h-8 w-20 rounded-lg bg-amber-500/20" />
                  <div className="h-4 w-32 rounded bg-muted/80" />
                  <div className="h-3 w-full rounded bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Authorized Brands Grid Skeleton (6 cards) ── */}
      <section className="container px-4 sm:px-6 py-14 sm:py-20 border-b border-border/60">
        <div className="space-y-10">
          <div className="space-y-3 max-w-xl">
            <div className="h-3 w-28 rounded bg-amber-500/20" />
            <div className="h-7 w-72 rounded-lg bg-muted/80" />
            <div className="h-3.5 w-full rounded bg-muted/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="h-5 w-24 rounded bg-muted/80" />
                  <div className="h-4 w-28 rounded bg-muted/60" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-44 rounded bg-muted/60" />
                  <div className="h-3 w-52 rounded bg-emerald-500/20" />
                </div>
                <div className="pt-3 border-t border-border/40 flex justify-between">
                  <div className="h-3 w-28 rounded bg-muted/50" />
                  <div className="h-3 w-16 rounded bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-Stage Protocol Skeleton (5 columns) ── */}
      <section className="container px-4 sm:px-6 py-14 sm:py-20 border-b border-border/60">
        <div className="space-y-10">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="h-3 w-28 rounded bg-amber-500/20 mx-auto" />
            <div className="h-6 w-56 rounded-lg bg-muted/80 mx-auto" />
            <div className="h-3 w-72 rounded bg-muted/50 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/70 bg-card p-5 space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-6 rounded bg-amber-500/20" />
                  <div className="h-4 w-4 rounded bg-muted/50" />
                </div>
                <div className="h-4 w-24 rounded bg-muted/80" />
                <div className="h-3 w-full rounded bg-muted/50" />
                <div className="h-3 w-4/5 rounded bg-muted/50" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Corporate Governance Skeleton (2 columns) ── */}
      <section className="container px-4 sm:px-6 py-14 sm:py-20 border-b border-border/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                <div className="h-10 w-10 rounded-xl bg-muted/60" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 rounded bg-muted/80" />
                  <div className="h-3 w-56 rounded bg-muted/50" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-muted/50" />
                <div className="h-3 w-5/6 rounded bg-muted/50" />
                <div className="h-3 w-4/6 rounded bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
