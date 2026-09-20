"use client";

import React from "react";

export function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-pulse">
      {/* Breadcrumb Bar Skeleton */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6 flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-muted/60" />
          <span className="text-border text-xs">/</span>
          <div className="h-3 w-32 rounded bg-muted/80" />
        </div>
      </div>

      {/* 4 Contact Channels Cards */}
      <section className="container px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/70 bg-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-muted/60" />
                <div className="h-4 w-18 rounded-full bg-muted/50" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted/80" />
                <div className="h-5 w-40 rounded bg-amber-500/20" />
                <div className="h-3 w-full rounded bg-muted/50" />
              </div>
              <div className="pt-3 border-t border-border/40 flex justify-between">
                <div className="h-3 w-28 rounded bg-muted/50" />
                <div className="h-3 w-16 rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form Hub Skeleton (Grid 2 cols: Form & Map/Info) */}
      <section className="container px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-7 rounded-3xl border border-border/70 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-muted/80" />
              <div className="h-3.5 w-72 rounded bg-muted/50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-10 rounded-xl bg-muted/50" />
              <div className="h-10 rounded-xl bg-muted/50" />
            </div>
            <div className="h-10 rounded-xl bg-muted/50" />
            <div className="h-28 rounded-xl bg-muted/50" />
            <div className="h-11 w-36 rounded-xl bg-amber-500/20" />
          </div>

          {/* Right: Info Card */}
          <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-muted/80" />
              <div className="h-3.5 w-60 rounded bg-muted/50" />
            </div>
            <div className="h-44 rounded-2xl bg-muted/40" />
            <div className="space-y-3 pt-2">
              <div className="h-3.5 w-full rounded bg-muted/50" />
              <div className="h-3.5 w-4/5 rounded bg-muted/50" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Skeleton */}
      <section className="container px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-2 mb-8">
            <div className="h-3 w-28 rounded bg-amber-500/20 mx-auto" />
            <div className="h-7 w-64 rounded bg-muted/80 mx-auto" />
          </div>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 flex justify-between items-center"
            >
              <div className="h-4 w-3/4 rounded bg-muted/60" />
              <div className="h-4 w-4 rounded bg-muted/50" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
