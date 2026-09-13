"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  totalProducts,
  startIndex,
  itemsPerPage,
  onPageChange,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  // Thematic pagination range generator with ellipsis
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined = undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if (typeof i === "number" && i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (typeof i === "number" && i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    if (typeof i === "number") l = i;
  }

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40">
      <p className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
        Showing <strong className="text-foreground">{startIndex + 1}</strong>–
        <strong className="text-foreground">
          {Math.min(startIndex + itemsPerPage, totalProducts)}
        </strong>{" "}
        of <strong className="text-foreground">{totalProducts}</strong> products
      </p>

      <nav aria-label="Catalog Pagination" className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className={cn(
            "inline-flex h-9 sm:h-10 items-center justify-center gap-1 rounded-2xl px-3 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 shadow-2xs",
            currentPage === 1
              ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
              : "bg-card text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {rangeWithDots.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-9 w-9 items-center justify-center text-xs font-bold text-muted-foreground select-none"
                >
                  •••
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs",
                  isCurrent
                    ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30"
                    : "bg-card text-muted-foreground hover:bg-amber-500/10 hover:text-foreground"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className={cn(
            "inline-flex h-9 sm:h-10 items-center justify-center gap-1 rounded-2xl px-3 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 shadow-2xs",
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
              : "bg-card text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
          )}
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
