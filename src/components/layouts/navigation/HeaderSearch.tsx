"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderSearchProps {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isMobile?: boolean;
}

export function HeaderSearch({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
}: HeaderSearchProps) {

  return (
    <div className="flex flex-1 justify-center max-w-[210px] xs:max-w-[260px] sm:max-w-md md:max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="relative flex w-full items-center"
        role="search"
      >
        <Search className="absolute left-2.5 md:left-3.5 h-3.5 w-3.5 md:h-4.5 md:w-4.5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search products..."
          aria-label="Search catalog"
          className="h-8 md:h-11 w-full rounded-full border border-border/80 bg-muted/40 pl-8 md:pl-11 pr-7 md:pr-10 text-[11px] md:text-sm placeholder:text-[11px] md:placeholder:text-sm text-foreground placeholder:text-muted-foreground/70 shadow-xs transition-all duration-200 hover:border-amber-500/40 hover:bg-muted/60 focus:border-amber-500 focus:bg-background focus:ring-1.5 md:focus:ring-4 focus:ring-amber-500/15 focus:outline-none"
        />

        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            aria-label="Clear search query"
            className="absolute right-2 md:right-3 flex h-4.5 w-4.5 md:h-6 md:w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-150 active:scale-90 cursor-pointer"
          >
            <X className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2.5]" />
          </button>
        )}
      </form>
    </div>
  );
}
