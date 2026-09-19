"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaymentPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function PaymentPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
}: PaymentPaginationProps) {
  if (totalItems === 0) return null;

  const start = Math.max(1, (currentPage - 1) * pageSize + 1);
  const end = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];

    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="p-4 sm:p-5 bg-card rounded-3xl border-none flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
      <p className="text-muted-foreground font-medium text-center sm:text-left">
        Showing <strong className="text-foreground font-bold">{start}</strong> to{" "}
        <strong className="text-foreground font-bold">{end}</strong> of{" "}
        <strong className="text-foreground font-bold">{totalItems}</strong> payments
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={
              currentPage <= 1
                ? "h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                : "h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted transition-colors"
            }
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={"ellipsis-" + idx}
                  className="h-8 w-8 flex items-center justify-center text-muted-foreground font-bold"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={
                  isActive
                    ? "h-8 w-8 rounded-xl text-xs font-black transition-all cursor-pointer bg-amber-500 text-zinc-950 shadow-xs"
                    : "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-muted/40 text-foreground/80 hover:bg-muted"
                }
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={
              currentPage >= totalPages
                ? "h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                : "h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted transition-colors"
            }
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
