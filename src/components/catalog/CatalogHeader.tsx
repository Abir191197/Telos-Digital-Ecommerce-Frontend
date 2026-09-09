"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, Grid3X3, List } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
      {/* Left: Count & Mobile Filter Trigger */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
          Showing <strong className="text-foreground">{totalCount}</strong> verified products
        </p>

        {/* Mobile Filter Sheet Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className={cn(
            "lg:hidden inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
            hasActiveFilters
              ? "border-amber-500 bg-amber-500/10 text-amber-700 shadow-xs"
              : "border-border/80 bg-card text-foreground hover:bg-muted"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
              •
            </span>
          )}
        </button>
      </div>

      {/* Right: Sort Dropdown & Desktop Grid View Toggle */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5">
        {/* Sort select */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground hidden xs:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(
                e.target.value as "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest"
              )
            }
            aria-label="Sort products"
            className="h-9 rounded-xl border border-border/80 bg-card px-3 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated (★)</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* View Mode Toggle Buttons (Desktop only) */}
        <div className="hidden sm:flex items-center rounded-xl border border-border/80 bg-card p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => onViewModeChange("grid-3")}
            aria-label="3 Column Grid"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer",
              viewMode === "grid-3"
                ? "bg-amber-500 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid-4")}
            aria-label="4 Column Grid"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer",
              viewMode === "grid-4"
                ? "bg-amber-500 text-white shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
