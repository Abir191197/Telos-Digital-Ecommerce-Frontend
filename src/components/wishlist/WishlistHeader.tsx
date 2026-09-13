"use client";

import React from "react";
import { Heart, LayoutGrid, List, Trash2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistHeaderProps {
  itemCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onClearWishlist: () => void;
  inStockCount: number;
  allMoved: boolean;
  onMoveAllToCart: () => void;
}

export function WishlistHeader({
  itemCount,
  viewMode,
  onViewModeChange,
  onClearWishlist,
  inStockCount,
  allMoved,
  onMoveAllToCart,
}: WishlistHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
          <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
          <span>Saved Tech Favorites</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
          My Wishlist ({itemCount})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Live Bangladesh pricing, authentic manufacturer distributor warranty, and real-time inventory.
        </p>
      </div>

      {/* Action Buttons & View Toggle */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
        {/* Grid vs List View Toggle Pill */}
        <div className="flex items-center rounded-xl bg-muted/50 p-1 border border-border/70 shadow-2xs">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer",
              viewMode === "list"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearWishlist}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 px-3 sm:px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Clear All</span>
          </button>

          <button
            type="button"
            disabled={inStockCount === 0}
            onClick={onMoveAllToCart}
            className={cn(
              "inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap",
              inStockCount === 0
                ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                : allMoved
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/25"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{allMoved ? "Added!" : "Add All to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
