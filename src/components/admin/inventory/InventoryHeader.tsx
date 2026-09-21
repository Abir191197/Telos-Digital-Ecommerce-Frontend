"use client";

import React from "react";
import Link from "next/link";
import {
  RefreshCw,
  History,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryHeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
  onExportCSV: () => void;
}

export function InventoryHeader({
  isFetching,
  onRefresh,
  onExportCSV,
}: InventoryHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
              Warehouse &amp; Logistics
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
            Stock &amp; Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Super Admin real-time stock balances, custom threshold watchlist, and low-inventory alarms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh stock balances"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 text-muted-foreground",
                isFetching && "animate-spin text-amber-500"
              )}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/dashboard/inventory/audit"
            className="h-10 px-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            title="View Stock Audit Trail"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Trail</span>
          </Link>

          <button
            type="button"
            onClick={onExportCSV}
            className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            title="Export filtered stock list to CSV"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
