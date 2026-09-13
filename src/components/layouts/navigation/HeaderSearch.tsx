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
  isMobile = false,
}: HeaderSearchProps) {
  if (isMobile) {
    return (
      <form
        onSubmit={onSubmit}
        className="relative flex w-full items-center"
        role="search"
      >
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search products, brands & categories..."
          aria-label="Search catalog"
          className="h-10 w-full rounded-full border border-border/80 bg-muted/40 pl-10 pr-20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm text-foreground placeholder:text-muted-foreground/80 shadow-xs transition-all focus:border-amber-500 focus:bg-background focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
        />
        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            aria-label="Clear search query"
            className="absolute right-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-150 active:scale-90 cursor-pointer"
          >
            <X className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </form>
    );
  }

  return (
    <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="relative flex w-full items-center"
        role="search"
      >
        <Search className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search 250+ authentic gadgets, laptops & electronics..."
          aria-label="Search catalog"
          className="h-11 w-full rounded-full border border-border/80 bg-muted/40 pl-11 pr-24 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm text-foreground placeholder:text-muted-foreground/70 shadow-xs transition-all duration-200 hover:border-amber-500/40 hover:bg-muted/60 focus:border-amber-500 focus:bg-background focus:ring-4 focus:ring-amber-500/15 focus:outline-none"
        />

        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            aria-label="Clear search query"
            className="absolute right-11 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-150 active:scale-90 cursor-pointer"
          >
            <X className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        )}

        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Search className="h-4 w-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
