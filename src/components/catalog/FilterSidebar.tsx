"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Star, RotateCcw, Zap, DollarSign } from "lucide-react";

interface FilterSidebarProps {
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
}

export function FilterSidebar({
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
}: FilterSidebarProps) {
  return (
    <aside className="w-full space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Quick Stock & Sale Toggles */}
      <div className="space-y-2.5">
        <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-all cursor-pointer text-xs font-semibold select-none shadow-2xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onToggleInStock}
            className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-all cursor-pointer text-xs font-semibold select-none shadow-2xs">
          <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            Discounted / On Sale
          </span>
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={onToggleOnSale}
            className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
          />
        </label>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Price Range (BDT)</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            ৳{priceBounds.min.toLocaleString()} – ৳{priceBounds.max.toLocaleString()}
          </span>
        </h4>

        {/* Min / Max direct inputs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-muted-foreground font-medium">Min (৳)</label>
            <input
              type="number"
              placeholder={priceBounds.min.toString()}
              value={minPrice ?? ""}
              onChange={(e) =>
                onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)
              }
              className="mt-1 h-8 w-full rounded-xl bg-background px-2.5 text-xs font-semibold text-foreground shadow-2xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground font-medium">Max (৳)</label>
            <input
              type="number"
              placeholder={priceBounds.max.toString()}
              value={maxPrice ?? ""}
              onChange={(e) =>
                onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)
              }
              className="mt-1 h-8 w-full rounded-xl bg-background px-2.5 text-xs font-semibold text-foreground shadow-2xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick price presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: "< ৳15k", max: 15000 },
            { label: "< ৳35k", max: 35000 },
            { label: "৳50k+", min: 50000 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPriceChange(preset.min, preset.max)}
              className="rounded-lg bg-card hover:bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Brands Checklist */}
      {availableBrands.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-border/40">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Brand
            </h4>
            <span className="text-[10px] text-muted-foreground font-semibold">
              {availableBrands.length} brands
            </span>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
            {availableBrands.map(({ name, count }) => {
              const isChecked = selectedBrands.includes(name);
              return (
                <label
                  key={name}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer select-none",
                    isChecked
                      ? "bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleBrand(name)}
                      className="h-3.5 w-3.5 rounded accent-amber-500 cursor-pointer"
                    />
                    <span className="truncate">{name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold shrink-0 ml-1">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Minimum Customer Rating */}
      <div className="space-y-2 pt-3 border-t border-border/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => {
            const isSelected = selectedRating === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onSelectRating(isSelected ? undefined : r)}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer",
                  isSelected
                    ? "bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold shadow-2xs"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span>{r}★ & above</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-amber-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
