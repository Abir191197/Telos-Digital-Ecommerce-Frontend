"use client";

import React from "react";

export function TermsSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 animate-pulse">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-muted/60" />
            <span className="text-border text-xs">/</span>
            <div className="h-3 w-40 rounded bg-muted/80" />
          </div>
          <div className="h-3 w-32 rounded bg-muted/50 hidden sm:block" />
        </div>
      </div>



      {/* Document Stream */}
      <div className="container px-4 sm:px-6 max-w-5xl mx-auto pt-10 sm:pt-14 space-y-8">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted/60" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-20 rounded bg-amber-500/20" />
                  <div className="h-4 w-64 rounded bg-muted/80" />
                </div>
              </div>
              <div className="h-4 w-24 rounded bg-muted/50" />
            </div>
            <div className="h-3 w-3/4 rounded bg-muted/50" />
            <div className="space-y-3 pt-2">
              <div className="h-20 rounded-xl bg-muted/20" />
              <div className="h-20 rounded-xl bg-muted/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
