"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";

interface ActiveFiltersBarProps {
  selectedBrands: string[];
  onRemoveBrand: (brand: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onClearPrice: () => void;
  selectedRating?: number;
  onClearRating: () => void;
  inStockOnly: boolean;
  onClearInStock: () => void;
  onSaleOnly: boolean;
  onClearOnSale: () => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  onClearAll: () => void;
  totalFilteredCount: number;
}

export function ActiveFiltersBar({
  selectedBrands,
  onRemoveBrand,
  minPrice,
  maxPrice,
  onClearPrice,
  selectedRating,
  onClearRating,
  inStockOnly,
  onClearInStock,
  onSaleOnly,
  onClearOnSale,
  searchQuery,
  onClearSearch,
  onClearAll,
  totalFilteredCount,
}: ActiveFiltersBarProps) {
  const hasFilters =
    selectedBrands.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    selectedRating !== undefined ||
    inStockOnly ||
    onSaleOnly ||
    !!searchQuery;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 px-3.5 rounded-2xl border border-border/70 bg-card/60 text-xs">
      <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
        Active ({totalFilteredCount} matching):
      </span>

      {/* Search Query Chip */}
      {searchQuery && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          Query: &ldquo;{searchQuery}&rdquo;
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      )}

      {/* Brands Chips */}
      {selectedBrands.map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground"
        >
          {b}
          <button
            type="button"
            onClick={() => onRemoveBrand(b)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Price Chip */}
      {(minPrice !== undefined || maxPrice !== undefined) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
          {minPrice !== undefined && maxPrice !== undefined
            ? `৳${minPrice.toLocaleString()} - ৳${maxPrice.toLocaleString()}`
            : minPrice !== undefined
            ? `Above ৳${minPrice.toLocaleString()}`
            : `Under ৳${maxPrice?.toLocaleString()}`}
          <button
            type="button"
            onClick={onClearPrice}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Rating Chip */}
      {selectedRating && (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
          {selectedRating}★ & above
          <button
            type="button"
            onClick={onClearRating}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* In Stock Chip */}
      {inStockOnly && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          In Stock
          <button
            type="button"
            onClick={onClearInStock}
            className="hover:text-emerald-900 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* On Sale Chip */}
      {onSaleOnly && (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
          On Sale
          <button
            type="button"
            onClick={onClearOnSale}
            className="hover:text-rose-900 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Clear All CTA */}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
}
