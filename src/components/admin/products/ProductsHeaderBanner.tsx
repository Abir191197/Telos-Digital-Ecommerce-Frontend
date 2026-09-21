"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export function ProductsHeaderBanner() {
  return (
    <div className="hidden sm:block relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
              Catalog &amp; Warehouse
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Manage Products
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Live stock balances, catalog health, valuation, and SKU control.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
          <Link
            href="/dashboard/products/create"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Product</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
