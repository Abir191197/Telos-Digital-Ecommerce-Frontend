"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  AlertTriangle,
  AlertOctagon,
  Boxes,
  Check,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StockFilterType = "all" | "under_5" | "under_10" | "out_of_stock" | "custom";
export type SortOptionType =
  | "stock-asc"
  | "stock-desc"
  | "price-asc"
  | "price-desc"
  | "name";

interface InventoryFilterDockProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  stockFilter: StockFilterType;
  setStockFilter: (val: StockFilterType) => void;
  customThreshold: string;
  setCustomThreshold: (val: string) => void;
  sortBy: SortOptionType;
  setSortBy: (val: SortOptionType) => void;
  viewMode: "table" | "card";
  setViewMode: (val: "table" | "card") => void;
  totalFilteredCount: number;
}

const SORT_OPTIONS: { label: string; value: SortOptionType }[] = [
  { label: "Stock: Low to High", value: "stock-asc" },
  { label: "Stock: High to Low", value: "stock-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Product Name (A-Z)", value: "name" },
];

export function InventoryFilterDock({
  searchQuery,
  setSearchQuery,
  stockFilter,
  setStockFilter,
  customThreshold,
  setCustomThreshold,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalFilteredCount,
}: InventoryFilterDockProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSortOpen]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Stock: Low to High";

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Row: Search input + View Mode + Total pill */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-9 text-xs font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60 border border-border/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right controls: Sort Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden md:inline">{currentSortLabel}</span>
              <span className="md:hidden">Sort</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isSortOpen && "rotate-180")} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                  Sort Items By
                </div>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer",
                      sortBy === opt.value
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle: Table vs. Cards */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-muted/40 border border-border/50">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                viewMode === "card"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Stock Filter Pills + Custom Threshold Input */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1 flex items-center gap-1">
          <Boxes className="h-3.5 w-3.5" />
          Filter Stock:
        </span>

        {/* All Stock */}
        <button
          type="button"
          onClick={() => setStockFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            stockFilter === "all"
              ? "bg-foreground text-background border-foreground shadow-xs"
              : "bg-muted/30 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted/60"
          )}
        >
          All Stock
        </button>

        {/* Under 5 */}
        <button
          type="button"
          onClick={() => setStockFilter("under_5")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            stockFilter === "under_5"
              ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-xs"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
          )}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Under 5 Units</span>
        </button>

        {/* Under 10 */}
        <button
          type="button"
          onClick={() => setStockFilter("under_10")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            stockFilter === "under_10"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
          )}
        >
          <span>Under 10 Units</span>
        </button>

        {/* Out of Stock */}
        <button
          type="button"
          onClick={() => setStockFilter("out_of_stock")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            stockFilter === "out_of_stock"
              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
          )}
        >
          <AlertOctagon className="h-3.5 w-3.5" />
          <span>Out of Stock (0)</span>
        </button>

        {/* Custom Threshold Toggle & Input */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStockFilter("custom")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
              stockFilter === "custom"
                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/20"
            )}
          >
            <Hash className="h-3.5 w-3.5" />
            <span>Custom Limit</span>
          </button>

          {stockFilter === "custom" && (
            <div className="flex items-center gap-1 animate-in fade-in-50 duration-200">
              <span className="text-xs font-mono font-bold text-muted-foreground">≤</span>
              <input
                type="number"
                min="0"
                max="99999"
                placeholder="e.g. 15"
                value={customThreshold}
                onChange={(e) => setCustomThreshold(e.target.value)}
                className="h-8 w-20 rounded-xl bg-background border border-purple-500/50 px-2 text-center text-xs font-mono font-bold text-foreground focus:ring-1.5 focus:ring-purple-500 focus:outline-none shadow-xs"
                title="Filter products with stock less than or equal to this number"
              />
              <span className="text-[11px] text-muted-foreground font-medium">units</span>
            </div>
          )}
        </div>

        {/* Filter Count Badge */}
        <div className="ml-auto text-xs font-semibold text-muted-foreground">
          Showing <span className="text-foreground font-bold">{totalFilteredCount}</span> items
        </div>
      </div>
    </div>
  );
}