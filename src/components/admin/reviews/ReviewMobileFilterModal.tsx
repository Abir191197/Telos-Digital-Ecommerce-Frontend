"use client";

import React from "react";
import { X, SlidersHorizontal, ChevronDown, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  ratingFilter: string;
  setRatingFilter: (r: string) => void;
  sortBy: "date-desc" | "date-asc" | "rating-desc" | "rating-asc";
  setSortBy: (sort: "date-desc" | "date-asc" | "rating-desc" | "rating-asc") => void;
  totalResults: number;
  openDropdown: "status" | "rating" | "sort" | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<"status" | "rating" | "sort" | null>>;
  onReset: () => void;
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

export function ReviewMobileFilterModal({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  sortBy,
  setSortBy,
  totalResults,
  openDropdown,
  setOpenDropdown,
  onReset,
}: ReviewMobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in duration-200 md:hidden">
      <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground tracking-tight">Review Filters</h3>
              <p className="text-[11px] text-muted-foreground">Filter by status, rating, or sort order</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dropdown Cards */}
        <div className="space-y-4 text-xs">
          {/* 1. Status */}
          <div className="relative" data-thematic-dropdown>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Review Status
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
              className={cn(
                "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                openDropdown === "status"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                  : statusFilter !== "all"
                  ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/70 text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  STAT
                </span>
                <span className="text-xs font-bold truncate">
                  {STATUS_OPTIONS.find((s) => s.id === statusFilter)?.label || "All"}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  openDropdown === "status" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "status" && (
              <div className="mt-1.5 w-full rounded-2xl border border-border/80 bg-card p-2 shadow-lg space-y-1 animate-in fade-in duration-150">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status.id);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      statusFilter === status.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{status.label}</span>
                    {statusFilter === status.id && (
                      <Check className="h-4 w-4 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Rating */}
          <div className="relative" data-thematic-dropdown>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Star Rating
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "rating" ? null : "rating")}
              className={cn(
                "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                openDropdown === "rating"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                  : ratingFilter !== "all"
                  ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/70 text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  STAR
                </span>
                <span className="text-xs font-bold truncate">
                  {ratingFilter === "all" ? "All Stars" : `${ratingFilter} Stars`}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  openDropdown === "rating" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "rating" && (
              <div className="mt-1.5 w-full rounded-2xl border border-border/80 bg-card p-2 shadow-lg space-y-1 animate-in fade-in duration-150">
                {RATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRatingFilter(opt.id);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      ratingFilter === opt.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {ratingFilter === opt.id && (
                      <Check className="h-4 w-4 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Sort */}
          <div className="relative" data-thematic-dropdown>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Sort Order
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              className={cn(
                "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                openDropdown === "sort"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                  : sortBy !== "date-desc"
                  ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/70 text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  SORT
                </span>
                <span className="text-xs font-bold truncate">
                  {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  openDropdown === "sort" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "sort" && (
              <div className="mt-1.5 w-full rounded-2xl border border-border/80 bg-card p-2 shadow-lg space-y-1 animate-in fade-in duration-150">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.id as any);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      sortBy === opt.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && (
                      <Check className="h-4 w-4 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-border/60 bg-card/95 backdrop-blur-xl flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          className="flex-1 h-11 rounded-2xl border border-border/80 text-foreground font-bold text-xs hover:bg-muted/60 transition-colors cursor-pointer"
        >
          Reset All
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Apply</span>
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-950/15 text-[11px] font-mono">
            {totalResults}
          </span>
        </button>
      </div>
    </div>
  );
}
