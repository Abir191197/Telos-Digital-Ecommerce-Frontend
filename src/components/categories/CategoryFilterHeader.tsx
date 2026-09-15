"use client";

import React from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORY_GROUPS, fadeInUp } from "./categoryConfig";

interface CategoryFilterHeaderProps {
  selectedGroup: string;
  searchQuery: string;
  filteredCount: number;
  totalCount: number;
  onGroupChange: (groupId: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onResetFilters: () => void;
}

export function CategoryFilterHeader({
  selectedGroup,
  searchQuery,
  filteredCount,
  totalCount,
  onGroupChange,
  onSearchChange,
  onClearSearch,
  onResetFilters,
}: CategoryFilterHeaderProps) {
  return (
    <m.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      aria-label="Category Filters"
      className="container px-3 sm:px-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        {/* Group Filter Pills */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto">
          {CATEGORY_GROUPS.map((group) => {
            const isActive = selectedGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => onGroupChange(group.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs",
                  isActive
                    ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                    : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        {/* Instant Category Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search categories..."
            className="w-full rounded-2xl bg-card pl-4 pr-9 py-2 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.3)] focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1"
              aria-label="Clear category search"
            >
              ✕
            </button>
          ) : (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-xs pointer-events-none">
              🔍
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredCount}</strong> of{" "}
          {totalCount} categories
        </span>
        {(selectedGroup !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </m.section>
  );
}
