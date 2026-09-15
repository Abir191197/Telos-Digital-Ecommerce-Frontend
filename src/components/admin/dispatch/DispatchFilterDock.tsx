import React from "react";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface DispatchFilterDockProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  courierFilter: string;
  setCourierFilter: (courier: string) => void;
  zoneFilter: string;
  setZoneFilter: (zone: string) => void;
  viewMode: "card" | "table";
  setViewMode: (mode: "card" | "table") => void;
  onResetPage: () => void;
}

export function DispatchFilterDock({
  searchQuery,
  setSearchQuery,
  courierFilter,
  setCourierFilter,
  zoneFilter,
  setZoneFilter,
  viewMode,
  setViewMode,
  onResetPage,
}: DispatchFilterDockProps) {
  return (
    <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-4 py-2.5 sm:py-3 bg-background/95 sm:bg-card/90 backdrop-blur-xl border-y sm:border sm:rounded-2xl border-border/50 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.4)] space-y-2 transition-all">
      {/* Row 1: Search Bar (Desktop only, mobile has top pinned bar) */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search order #, customer name, phone, city..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onResetPage();
          }}
          className="h-9 sm:h-10 w-full rounded-xl bg-muted/30 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-foreground/20 focus:outline-none transition-all placeholder:text-muted-foreground/60"
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

      {/* Row 2: Status Pills, Zone Selector & View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Courier Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full scrollbar-none">
          {[
            { id: "all", label: "All Queue" },
            { id: "unassigned", label: "Needs Courier" },
            { id: "assigned", label: "Courier Assigned" },
            { id: "steadfast", label: "Steadfast" },
            { id: "pathao", label: "Pathao" },
          ].map((pill) => {
            const isSelected = courierFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setCourierFilter(pill.id);
                  onResetPage();
                }}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs",
                  isSelected
                    ? "bg-foreground text-background shadow-xs font-black"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Zone selector & Desktop View Mode Switcher */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Zone Selector Pill */}
          <div className="flex items-center rounded-xl bg-muted/40 p-0.5 border border-border/40 text-xs">
            {[
              { id: "all", label: "All Zones" },
              { id: "inside-dhaka", label: "Inside" },
              { id: "outside-dhaka", label: "Outside" },
            ].map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  setZoneFilter(z.id);
                  onResetPage();
                }}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px]",
                  zoneFilter === z.id
                    ? "bg-card text-foreground shadow-xs font-black"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {z.label}
              </button>
            ))}
          </div>

          {/* Table / Card View Mode Switcher */}
          <div className="flex items-center rounded-lg bg-muted/40 p-0.5 border border-border/40">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px]",
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
                "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px]",
                viewMode === "card"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Card View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
