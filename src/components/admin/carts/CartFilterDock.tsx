"use client";

import React from "react";
import {
  Search,
  X,
  ChevronDown,
  Check,
  Filter,
  ArrowUpDown,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CartFilterDockProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
  setSortBy: (sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc") => void;
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
  openDropdown: "status" | "sort" | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<"status" | "sort" | null>>;
  onResetPage: () => void;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Cart Stages" },
  { id: "active", label: "Active Live Sessions" },
  { id: "abandoned", label: "Abandoned Carts (>2h)" },
  { id: "recovered", label: "Recovered Orders" },
];

const SORT_OPTIONS = [
  { id: "date-desc", label: "Recently Updated" },
  { id: "amount-desc", label: "Highest Cart Value" },
  { id: "amount-asc", label: "Lowest Cart Value" },
  { id: "date-asc", label: "Oldest Activity" },
];

export function CartFilterDock({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  openDropdown,
  setOpenDropdown,
  onResetPage,
}: CartFilterDockProps) {
  return (
    <div className="hidden md:flex sticky top-16 z-20 px-4 py-3 bg-card/90 backdrop-blur-xl border rounded-3xl border-border/50 shadow-xs items-center justify-between gap-3 transition-all">
      {/* Desktop Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by customer name, email, phone, city, or product..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onResetPage();
          }}
          className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60"
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

      {/* Thematic Dropdowns & Switchers */}
      <div className="flex items-center gap-2.5">
        {/* Status Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === "status" ? null : "status");
            }}
            className={cn(
              "flex items-center gap-2 h-10 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none",
              statusFilter !== "all"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-muted/40 border-border/50 text-foreground hover:bg-muted/70"
            )}
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {STATUS_OPTIONS.find((o) => o.id === statusFilter)?.label || "Status"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform duration-200",
                openDropdown === "status" && "rotate-180"
              )}
            />
          </button>

          {openDropdown === "status" && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border/60 bg-popover p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.id);
                    setOpenDropdown(null);
                    onResetPage();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left cursor-pointer",
                    statusFilter === opt.id
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "text-foreground hover:bg-muted/70"
                  )}
                >
                  <span>{opt.label}</span>
                  {statusFilter === opt.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(openDropdown === "sort" ? null : "sort");
            }}
            className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-border/50 bg-muted/40 hover:bg-muted/70 text-xs font-bold text-foreground transition-all cursor-pointer select-none"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {SORT_OPTIONS.find((o) => o.id === sortBy)?.label || "Sort"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform duration-200",
                openDropdown === "sort" && "rotate-180"
              )}
            />
          </button>

          {openDropdown === "sort" && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border/60 bg-popover p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.id as any);
                    setOpenDropdown(null);
                    onResetPage();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left cursor-pointer",
                    sortBy === opt.id
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "text-foreground hover:bg-muted/70"
                  )}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="Table View"
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("card")}
            title="Card View"
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer",
              viewMode === "card"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
