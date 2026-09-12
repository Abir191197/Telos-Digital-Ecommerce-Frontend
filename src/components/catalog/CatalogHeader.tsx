"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GridViewMode } from "@/types/catalog.types";

interface CatalogHeaderProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest") => void;
  viewMode: GridViewMode;
  onViewModeChange: (mode: GridViewMode) => void;
  onOpenMobileFilters: () => void;
  hasActiveFilters: boolean;
}

export function CatalogHeader({
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  hasActiveFilters,
}: CatalogHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
      {/* Left: Product Count */}
      <div className="flex items-center gap-3">
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
          Showing <strong className="text-foreground font-black">{totalCount}</strong> verified products
        </p>
      </div>

      {/* Right: Mobile Filter & Sort & Grid Mode */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
        {/* Mobile Filter Sheet Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className={cn(
            "lg:hidden inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs",
            hasActiveFilters
              ? "bg-amber-500 text-zinc-950 shadow-amber-500/20"
              : "bg-card text-foreground hover:bg-muted"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white">
              •
            </span>
          )}
        </button>

        {/* Sort select */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(
                e.target.value as "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest"
              )
            }
            aria-label="Sort products"
            className="h-9 rounded-xl bg-card px-3 text-xs font-semibold text-foreground shadow-xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated (★)</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* View Mode Toggle Buttons (Desktop only) */}
        <div className="hidden sm:flex items-center rounded-xl bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => onViewModeChange("grid-3")}
            aria-label="3 Column Grid"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer",
              viewMode === "grid-3"
                ? "bg-amber-500 text-zinc-950 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid-4")}
            aria-label="4 Column Grid"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer",
              viewMode === "grid-4"
                ? "bg-amber-500 text-zinc-950 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
