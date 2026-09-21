"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, X } from "lucide-react";

interface ProductsMobileSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetPage: () => void;
}

export function ProductsMobileSearchBar({
  searchQuery,
  setSearchQuery,
  onResetPage,
}: ProductsMobileSearchBarProps) {
  return (
    <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search title, brand, or SKU..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onResetPage();
          }}
          className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60 border border-border/50"
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
      <Link
        href="/dashboard/products/create"
        className="h-10 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        title="Create New Product"
      >
        <Plus className="h-4 w-4" />
        <span>Add</span>
      </Link>
    </div>
  );
}
