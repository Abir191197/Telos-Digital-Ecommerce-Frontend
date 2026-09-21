"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersPaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function OrdersPaginationBar({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className = "",
}: OrdersPaginationBarProps) {
  if (totalCount === 0) return null;

  return (
    <div
      className={`p-3.5 sm:p-4 bg-card/60 backdrop-blur-xs rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${className}`}
    >
      <p className="text-muted-foreground font-medium">
        Showing <strong className="text-foreground font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
        <strong className="text-foreground font-bold">
          {Math.min(currentPage * pageSize, totalCount)}
        </strong>{" "}
        of <strong className="text-foreground font-bold">{totalCount}</strong> orders
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={
            currentPage === 1
              ? "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
              : "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted"
          }
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-foreground text-background shadow-xs font-black"
                : "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-muted/40 text-foreground/80 hover:bg-muted"
            }
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={
            currentPage === totalPages
              ? "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
              : "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted"
          }
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
