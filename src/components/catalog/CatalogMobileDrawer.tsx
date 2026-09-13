"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface CatalogMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableBrands: { name: string; count: number }[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  minPrice?: number;
  maxPrice?: number;
  priceBounds: { min: number; max: number };
  onPriceChange: (min?: number, max?: number) => void;
  selectedRating?: number;
  onSelectRating: (rating?: number) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  onSaleOnly: boolean;
  onToggleOnSale: () => void;
  onResetAll: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
}

export function CatalogMobileDrawer({
  isOpen,
  onClose,
  availableBrands,
  selectedBrands,
  onToggleBrand,
  minPrice,
  maxPrice,
  priceBounds,
  onPriceChange,
  selectedRating,
  onSelectRating,
  inStockOnly,
  onToggleInStock,
  onSaleOnly,
  onToggleOnSale,
  onResetAll,
  hasActiveFilters,
  filteredCount,
}: CatalogMobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer panel */}
      <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-background p-5 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Refine Catalog
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <FilterSidebar
          availableBrands={availableBrands}
          selectedBrands={selectedBrands}
          onToggleBrand={onToggleBrand}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceBounds={priceBounds}
          onPriceChange={onPriceChange}
          selectedRating={selectedRating}
          onSelectRating={onSelectRating}
          inStockOnly={inStockOnly}
          onToggleInStock={onToggleInStock}
          onSaleOnly={onSaleOnly}
          onToggleOnSale={onToggleOnSale}
          onResetAll={onResetAll}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="mt-8 pt-4 border-t border-border/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            Apply Filters ({filteredCount} results)
          </button>
        </div>
      </div>
    </div>
  );
}
