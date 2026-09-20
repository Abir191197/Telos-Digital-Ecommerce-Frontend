"use client";

import React from "react";

export function AdminBrandsSkeleton() {
  return (
    <div className="w-full space-y-6 pb-20 animate-pulse">
      {/* ── 1. Top Header Skeleton ── */}
      <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 rounded-md bg-amber-500/20" />
            <span className="text-muted-foreground">•</span>
            <div className="h-3.5 w-20 rounded bg-muted/50" />
          </div>
          <div className="h-7 w-48 rounded-lg bg-muted/80" />
        </div>

        <div className="h-10 w-36 rounded-xl bg-amber-500/20" />
      </div>

      {/* ── 2. Search & Filter Bar Skeleton ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="h-10 w-full sm:w-80 rounded-xl bg-muted/40 border border-border/70" />
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="h-9 w-36 rounded-xl bg-muted/40 border border-border/60" />
          <div className="h-9 w-28 rounded-xl bg-muted/40 border border-border/60" />
        </div>
      </div>

      {/* ── 3. Desktop Table Skeleton ── */}
      <div className="hidden md:block rounded-3xl bg-card border border-border/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Tagline / Badge</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  {/* # */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="h-3 w-4 rounded bg-muted/50 mx-auto" />
                  </td>

                  {/* Brand Thumbnail & Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted/60 shrink-0" />
                      <div className="space-y-1.5 flex-1 max-w-xs">
                        <div className="h-3.5 w-3/4 rounded bg-muted/80" />
                        <div className="h-2.5 w-1/2 rounded bg-muted/40" />
                      </div>
                    </div>
                  </td>

                  {/* Tagline / Badge */}
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-24 rounded-md bg-muted/50" />
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="h-5 w-20 rounded-full bg-muted/50 mx-auto" />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-7 w-7 rounded-lg bg-muted/50 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="border-t border-border/40 px-4 py-3 bg-muted/10 flex items-center justify-between">
          <div className="h-3.5 w-36 rounded bg-muted/50" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted/50" />
            <div className="h-8 w-8 rounded-lg bg-muted/60" />
            <div className="h-8 w-8 rounded-lg bg-muted/50" />
          </div>
        </div>
      </div>

      {/* ── 4. Mobile Cards Skeleton ── */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-11 w-11 rounded-xl bg-muted/60 shrink-0" />
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="h-3.5 w-3/4 rounded bg-muted/80" />
                <div className="h-2.5 w-1/2 rounded bg-muted/40" />
              </div>
            </div>
            <div className="h-7 w-7 rounded-lg bg-muted/50 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
