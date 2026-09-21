"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function InventoryPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: InventoryPaginationProps) {
  if (totalItems <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <div className="text-xs text-muted-foreground font-medium">
        Showing{" "}
        <span className="font-bold text-foreground">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        to{" "}
        <span className="font-bold text-foreground">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-bold text-foreground">{totalItems}</span> items
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="h-9 px-3 rounded-xl border border-border/60 bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((pageNum, idx, arr) => {
              const showEllipsis = idx > 0 && pageNum - arr[idx - 1] > 1;
              return (
                <React.Fragment key={pageNum}>
                  {showEllipsis && (
                    <span className="px-1 text-xs text-muted-foreground">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      currentPage === pageNum
                        ? "bg-amber-500 text-zinc-950 font-black shadow-xs"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {pageNum}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="h-9 px-3 rounded-xl border border-border/60 bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
