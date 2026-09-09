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
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors cursor-pointer text-xs font-semibold select-none">
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

        <label className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors cursor-pointer text-xs font-semibold select-none">
          <span className="flex items-center gap-2 text-rose-600">
            <Zap className="h-3.5 w-3.5 fill-rose-600" />
            Discounted / On Sale
          </span>
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={onToggleOnSale}
            className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
          />
        </label>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Price Range (BDT)</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            ৳{priceBounds.min.toLocaleString()} – ৳{priceBounds.max.toLocaleString()}
          </span>
        </h4>

        {/* Min / Max direct inputs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-muted-foreground">Min (৳)</label>
            <input
              type="number"
              placeholder={priceBounds.min.toString()}
              value={minPrice ?? ""}
              onChange={(e) =>
                onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)
              }
              className="mt-1 h-8 w-full rounded-lg border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Max (৳)</label>
            <input
              type="number"
              placeholder={priceBounds.max.toString()}
              value={maxPrice ?? ""}
              onChange={(e) =>
                onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)
              }
              className="mt-1 h-8 w-full rounded-lg border border-border/80 bg-background px-2.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
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
              className="rounded-md bg-muted/60 hover:bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Brands Checklist */}
      {availableBrands.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Brand
            </h4>
            <span className="text-[10px] text-muted-foreground">
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
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer select-none",
                    isChecked
                      ? "bg-amber-500/10 text-amber-800 font-bold"
                      : "hover:bg-muted/40 text-foreground"
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
      <div className="space-y-2 pt-3 border-t border-border/60">
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
                  "flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                  isSelected
                    ? "bg-amber-500/15 text-amber-800 font-bold"
                    : "hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r ? "fill-amber-400 text-amber-400" : "text-border"
                        )}
                      />
                    ))}
                  </div>
                  <span>{r}★ & above</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
