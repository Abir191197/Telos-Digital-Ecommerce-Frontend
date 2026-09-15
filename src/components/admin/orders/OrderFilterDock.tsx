import React from "react";
import { Search, X, List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderFilterDockProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  orderCounts: {
    all: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
  onResetPage: () => void;
}

export function OrderFilterDock({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  orderCounts,
  viewMode,
  setViewMode,
  onResetPage,
}: OrderFilterDockProps) {
  return (
    <div className="sticky top-16 z-20 px-3 sm:px-4 py-2.5 sm:py-3 bg-card/90 backdrop-blur-xl border rounded-2xl border-border/50 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 transition-all">
      {/* Desktop Search */}
      <div className="relative flex-1 hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search order #, customer name, phone, city, or courier..."
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

      {/* Status Filter Segmented Carousel & View Toggle */}
      <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
        {/* Horizontal Status Filter Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: `All (${orderCounts.all})` },
            { id: "pending", label: `Pending (${orderCounts.pending})` },
            { id: "processing", label: `QC (${orderCounts.processing})` },
            { id: "shipped", label: `In Transit (${orderCounts.shipped})` },
            { id: "delivered", label: `Delivered (${orderCounts.delivered})` },
            { id: "cancelled", label: `Cancelled (${orderCounts.cancelled})` },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  onResetPage();
                }}
                className={cn(
                  "h-8 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95",
                  isSelected
                    ? "bg-amber-500 text-zinc-950 font-black shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Desktop Only View Mode Switcher */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-muted/70 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
              viewMode === "table"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Table View"
          >
            <List className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
              viewMode === "card"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Card Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>
    </div>
  );
}
