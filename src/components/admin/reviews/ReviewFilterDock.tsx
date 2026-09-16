"use client";

import React from "react";
import {
  Search,
  X,
  ChevronDown,
  Check,
  ArrowUpDown,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFilterDockProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  ratingFilter: string;
  setRatingFilter: (rating: string) => void;
  sortBy: "date-desc" | "date-asc" | "rating-desc" | "rating-asc";
  setSortBy: (sort: "date-desc" | "date-asc" | "rating-desc" | "rating-asc") => void;
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
  openDropdown: "status" | "rating" | "sort" | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<"status" | "rating" | "sort" | null>>;
  onResetPage: () => void;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Review Statuses" },
  { id: "published", label: "Public on Storefront" },
  { id: "hidden", label: "Hidden from Storefront" },
  { id: "flagged", label: "Flagged for Audit" },
];

const RATING_OPTIONS = [
  { id: "all", label: "All Star Ratings" },
  { id: "5", label: "5 Stars Only" },
  { id: "4", label: "4 Stars Only" },
  { id: "3", label: "3 Stars Only" },
  { id: "2", label: "2 Stars Only" },
  { id: "1", label: "1 Star Only" },
];

const SORT_OPTIONS = [
  { id: "date-desc", label: "Newest Reviews" },
  { id: "date-asc", label: "Oldest Reviews" },
  { id: "rating-desc", label: "Rating: Highest First" },
  { id: "rating-asc", label: "Rating: Lowest First" },
];

export function ReviewFilterDock({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  openDropdown,
  setOpenDropdown,
  onResetPage,
}: ReviewFilterDockProps) {
  return (
    <div className="hidden md:flex sticky top-16 z-20 px-4 py-3 bg-card/90 backdrop-blur-xl border rounded-3xl border-border/50 shadow-xs items-center justify-between gap-3 transition-all">
      {/* Desktop Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by customer, product, or review text..."
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

      {/* Thematic Dropdowns & View Mode Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Status Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
            aria-label="Filter reviews by status"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "status"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : statusFilter !== "all"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Status:</span>
            <span className="max-w-[110px] truncate">
              {STATUS_OPTIONS.find((s) => s.id === statusFilter)?.label.split(" ")[0] || "All"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "status" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "status" && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Filter By Status
              </div>
              <div className="py-1 space-y-0.5">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status.id);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      statusFilter === status.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{status.label}</span>
                    {statusFilter === status.id && (
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "rating" ? null : "rating")}
            aria-label="Filter reviews by rating"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "rating"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : ratingFilter !== "all"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Rating:</span>
            <span className="max-w-[110px] truncate">
              {ratingFilter === "all" ? "All Stars" : `${ratingFilter} Stars`}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "rating" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "rating" && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Filter By Star Rating
              </div>
              <div className="py-1 space-y-0.5">
                {RATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRatingFilter(opt.id);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      ratingFilter === opt.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{opt.label}</span>
                    {ratingFilter === opt.id && (
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
            aria-label="Sort reviews"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "sort"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : sortBy !== "date-desc"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="max-w-[100px] truncate">
              {SORT_OPTIONS.find((s) => s.id === sortBy)?.label.split(":")[0] || "Sort"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "sort" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "sort" && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Sort Reviews
              </div>
              <div className="py-1 space-y-0.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.id as any);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      sortBy === opt.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && (
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Mode Switcher (Desktop Table vs Card Grid) */}
        <div className="flex items-center rounded-2xl bg-muted/40 p-1 border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Table View"
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={cn(
              "h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              viewMode === "card"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Card Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Cards</span>
          </button>
        </div>
      </div>
    </div>
  );
}
