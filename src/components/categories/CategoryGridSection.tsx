"use client";

import React, { RefObject } from "react";
import { Tag, Loader2, CheckCircle2 } from "lucide-react";
import type { Category } from "@/types/ecommerce.types";
import { CategoryCardItem } from "./CategoryCardItem";
import { INITIAL_BATCH_SIZE } from "./categoryConfig";

interface CategoryGridSectionProps {
  gridSectionRef: RefObject<HTMLElement | null>;
  displayedCategories: Category[];
  totalFilteredCount: number;
  isLoadingMore: boolean;
  hasMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onClearFilters: () => void;
}

export function CategoryGridSection({
  gridSectionRef,
  displayedCategories,
  totalFilteredCount,
  isLoadingMore,
  hasMore,
  sentinelRef,
  onClearFilters,
}: CategoryGridSectionProps) {
  return (
    <section
      ref={gridSectionRef}
      aria-label="All Categories Grid"
      className="container px-3 sm:px-6 scroll-mt-20"
    >
      {displayedCategories.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] max-w-md mx-auto space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto">
            <Tag className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No categories matched
          </h3>
          <p className="text-xs text-muted-foreground">
            Try searching another term or clear active filters to see all
            available categories.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs shadow-xs transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
          {displayedCategories.map((cat, idx) => (
            <CategoryCardItem key={cat.id} category={cat} index={idx} />
          ))}
        </div>
      )}

      {/* Loading Skeleton Preview while fetching next batch */}
      {isLoadingMore && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-3xl bg-muted/40 border border-border/40 overflow-hidden h-64 flex flex-col justify-between p-4"
            >
              <div className="h-32 rounded-2xl bg-muted/70 w-full" />
              <div className="space-y-2 mt-3">
                <div className="h-4 bg-muted/70 rounded-md w-3/4" />
                <div className="h-3 bg-muted/50 rounded-md w-1/3" />
              </div>
              <div className="h-8 rounded-xl bg-muted/60 mt-3" />
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel & Status */}
      <div
        ref={sentinelRef}
        className="mt-8 flex flex-col items-center justify-center text-center"
      >
        {hasMore ? (
          <div className="flex items-center gap-2 py-3 px-5 rounded-full bg-card border border-border/70 shadow-xs text-xs font-semibold text-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading next categories...</span>
          </div>
        ) : totalFilteredCount > INITIAL_BATCH_SIZE ? (
          <div className="flex items-center gap-1.5 py-4 text-xs font-medium text-muted-foreground/80">
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
            <span>All {totalFilteredCount} categories loaded</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
