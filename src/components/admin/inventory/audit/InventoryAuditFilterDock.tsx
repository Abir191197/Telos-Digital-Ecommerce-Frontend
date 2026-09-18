"use client";

import React from "react";
import {
  Search,
  X,
  Table as TableIcon,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryAuditFilterDockProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  actionFilter: "all" | "INCREASE" | "DECREASE";
  setActionFilter: (val: "all" | "INCREASE" | "DECREASE") => void;
  viewMode: "table" | "card";
  setViewMode: (val: "table" | "card") => void;
  totalFilteredCount: number;
}

export function InventoryAuditFilterDock({
  searchQuery,
  setSearchQuery,
  actionFilter,
  setActionFilter,
  viewMode,
  setViewMode,
  totalFilteredCount,
}: InventoryAuditFilterDockProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Bar & View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audit by product, SKU, reason, or admin..."
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

        {/* View Mode Switcher */}
        <div className="hidden sm:flex items-center p-1 rounded-xl bg-muted/40 border border-border/50 shrink-0 self-end sm:self-auto">
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

      {/* Action Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1 flex items-center gap-1">
          <History className="h-3.5 w-3.5" />
          Filter Type:
        </span>

        {/* All Logs */}
        <button
          type="button"
          onClick={() => setActionFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            actionFilter === "all"
              ? "bg-foreground text-background border-foreground shadow-xs"
              : "bg-muted/30 text-muted-foreground border-border/50 hover:text-foreground hover:bg-muted/60"
          )}
        >
          All Entries
        </button>

        {/* Additions (+) */}
        <button
          type="button"
          onClick={() => setActionFilter("INCREASE")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            actionFilter === "INCREASE"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Additions (+)</span>
        </button>

        {/* Reductions (-) */}
        <button
          type="button"
          onClick={() => setActionFilter("DECREASE")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border",
            actionFilter === "DECREASE"
              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
          )}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          <span>Reductions (-)</span>
        </button>

        {/* Showing Count */}
        <div className="ml-auto text-xs font-semibold text-muted-foreground">
          Showing <span className="text-foreground font-bold">{totalFilteredCount}</span> records
        </div>
      </div>
    </div>
  );
}
