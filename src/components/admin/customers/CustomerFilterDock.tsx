"use client";

import React from "react";
import { Search, X, SlidersHorizontal, LayoutGrid, Table as TableIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerFilterDockProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  totalResults: number;
  onReset: () => void;
}

export function CustomerFilterDock({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
  onReset,
}: CustomerFilterDockProps) {
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Suspended", value: "suspended" },
  ];

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || sortBy !== "createdAt-desc";

  return (
    <div className="rounded-3xl bg-card p-3 sm:p-4 border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, TC ID, city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-9 rounded-2xl bg-muted/40 border border-border/60 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-muted/40 border border-border/60">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStatusChange(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  statusFilter === opt.value
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort customers"
            className="h-9 px-3 rounded-2xl bg-muted/40 border border-border/60 text-xs font-bold text-foreground focus:outline-none focus:border-amber-500/80 cursor-pointer"
          >
            <option value="createdAt-desc">Newest Joined</option>
            <option value="createdAt-asc">Oldest Joined</option>
            <option value="name-asc">Name (A - Z)</option>
            <option value="name-desc">Name (Z - A)</option>
          </select>

          {/* Table / Grid Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-muted/40 border border-border/60">
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={cn(
                "p-1.5 rounded-xl transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-card text-amber-500 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-1.5 rounded-xl transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-card text-amber-500 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 h-9 px-3 rounded-2xl bg-muted/30 text-muted-foreground hover:text-foreground text-xs font-semibold border border-border/60 hover:border-border transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Counter Pill */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
        <span>
          Showing <strong className="text-foreground font-bold">{totalResults}</strong> customer{totalResults === 1 ? "" : "s"}
        </span>
        {statusFilter !== "all" && (
          <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">
            Filter: {statusFilter} accounts
          </span>
        )}
      </div>
    </div>
  );
}
