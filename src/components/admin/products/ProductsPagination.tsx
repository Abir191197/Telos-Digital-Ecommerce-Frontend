"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  paginatedCount: number;
  viewMode: "table" | "card";
  onPageChange: (page: number) => void;
}

export function ProductsPagination({
  currentPage,
  totalPages,
  totalFiltered,
  paginatedCount,
  viewMode,
  onPageChange,
}: ProductsPaginationProps) {
  return (
    <>
      {/* Desktop Pagination Strip */}
      {viewMode === "table" && (
        <div className="hidden md:flex p-4 border border-border/40 bg-card rounded-2xl items-center justify-between text-xs text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{paginatedCount}</strong> of{" "}
            <strong className="text-foreground">{totalFiltered}</strong> products
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="p-2 rounded-xl border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono font-bold text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="p-2 rounded-xl border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Pagination */}
      <div
        className={cn(
          "p-4 border border-border/60 bg-card rounded-2xl flex items-center justify-between text-xs text-muted-foreground",
          viewMode === "table" && "md:hidden"
        )}
      >
        <p>
          Page <strong className="text-foreground">{currentPage}</strong> of{" "}
          <strong className="text-foreground">{totalPages}</strong>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="px-3 py-1.5 rounded-lg border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed font-semibold"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="px-3 py-1.5 rounded-lg border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
