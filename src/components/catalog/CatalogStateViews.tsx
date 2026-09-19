"use client";

import React from "react";
import Link from "next/link";
import { SearchX, RotateCcw } from "lucide-react";
import { ROUTES } from "@/constants";

interface EmptyCatalogStateProps {
  onResetFilters: () => void;
}

export function EmptyCatalogState({ onResetFilters }: EmptyCatalogStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-10 sm:p-16 text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
        <SearchX className="h-8 w-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold text-foreground">
          No Products Match Your Selected Filters
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Try clearing some filter criteria, adjusting your budget range, or selecting a broader brand category to view available stock.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Filters</span>
        </button>

        <Link
          href={ROUTES.CATEGORIES}
          className="rounded-xl border border-border/80 bg-card hover:bg-muted px-4 py-2.5 text-xs font-semibold text-foreground transition-colors"
        >
          Browse All Categories
        </Link>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-3 shadow-xs overflow-hidden animate-pulse">
      {/* Aspect square image placeholder */}
      <div className="relative aspect-square w-full rounded-2xl bg-muted/50 overflow-hidden">
        <div className="absolute top-2.5 left-2.5 h-5 w-12 rounded-full bg-amber-500/20" />
        <div className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-muted/60" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-1 pt-3 pb-1 space-y-2 justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-2.5 w-14 rounded bg-amber-500/20" />
            <div className="h-2.5 w-12 rounded bg-muted/50" />
          </div>
          <div className="h-3.5 w-full rounded bg-muted/80" />
          <div className="h-3 w-2/3 rounded bg-muted/60" />
        </div>

        <div className="pt-2 border-t border-border/40 flex justify-between items-center">
          <div className="h-4 w-20 rounded bg-muted/80" />
          <div className="h-8 w-8 rounded-full bg-amber-500/20" />
        </div>
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={className || "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
