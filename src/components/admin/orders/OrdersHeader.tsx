"use client";

import React from "react";
import Link from "next/link";
import { Box, Clock, ShoppingCart } from "lucide-react";

interface OrdersHeaderProps {
  statusFilter: string;
  totalFiltered: number;
}

export function OrdersHeader({ statusFilter, totalFiltered }: OrdersHeaderProps) {
  return (
    <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {statusFilter === "pending" ? "Pending Orders & QC" : "Orders & Fulfillment"}
          </h1>
          {statusFilter === "pending" ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Clock className="h-3 w-3 animate-pulse" />
              Action Required
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground border border-border/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live Feed
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {statusFilter === "pending"
            ? "Orders awaiting merchant approval, QC verification, and courier packaging"
            : "Real-time fulfillment, dispatch logistics, and invoice management"}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/60 text-xs">
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-background text-foreground shadow-2xs transition-all"
          >
            <Box className="h-3.5 w-3.5" />
            <span>Orders ({totalFiltered})</span>
          </Link>
          <Link
            href="/dashboard/orders?tab=carts"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-muted-foreground hover:text-foreground transition-all"
          >
            <ShoppingCart className="h-3.5 w-3.5 text-amber-500" />
            <span>Active Carts</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </Link>
        </div>
      </div>
    </div>
  );
}
