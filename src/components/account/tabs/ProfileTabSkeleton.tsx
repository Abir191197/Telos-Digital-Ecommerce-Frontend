"use client";

import React from "react";

export function ProfileTabSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl animate-pulse">
      {/* ── 1. Main Profile Info Card Skeleton ── */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-card p-4 sm:p-8 space-y-6 shadow-sm">
        {/* Top bar: Avatar + Name + Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 border-b border-border/40 pb-5 sm:pb-6">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-muted/60 shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-36 sm:w-48 rounded-md bg-muted/70" />
                <div className="h-4 w-20 rounded-full bg-amber-500/20" />
              </div>
              <div className="h-3.5 w-32 rounded bg-muted/40" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-xl bg-muted/50 self-start sm:self-auto shrink-0" />
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 pt-1">
          {/* Full Name field box */}
          <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:p-4 space-y-2.5">
            <div className="h-3 w-20 rounded bg-muted/60" />
            <div className="h-4 w-40 rounded bg-muted/70" />
          </div>

          {/* Phone field box */}
          <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-muted/60" />
              <div className="h-3 w-14 rounded bg-muted/40" />
            </div>
            <div className="h-4 w-32 rounded bg-muted/70" />
          </div>

          {/* Email field box */}
          <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:p-4 space-y-2.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-muted/60" />
              <div className="h-3 w-14 rounded bg-muted/40" />
            </div>
            <div className="h-4 w-52 rounded bg-muted/70" />
            <div className="h-3 w-64 rounded bg-muted/40" />
          </div>
        </div>
      </div>

      {/* ── 2. Password Security Card Skeleton ── */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-card p-4 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/60 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-28 rounded-md bg-muted/70" />
              <div className="h-3 w-44 rounded bg-muted/40" />
            </div>
          </div>
          <div className="h-9 w-36 rounded-xl bg-muted/50 shrink-0" />
        </div>
      </div>

      {/* ── 3. Quick Stats Grid Skeleton ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-2xl border border-border/40 dark:border-white/10 bg-card p-3.5 sm:p-4.5 space-y-2 shadow-sm ${
              i === 3 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <div className="h-2.5 w-20 rounded bg-muted/50" />
            <div className="h-5 w-24 rounded-md bg-muted/70" />
            <div className="h-2.5 w-28 rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
