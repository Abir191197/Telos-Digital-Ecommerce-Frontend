"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

interface DispatchHeaderProps {
  queueCount: number;
}

export function DispatchHeader({ queueCount }: DispatchHeaderProps) {
  return (
    <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Pending Dispatch Queue
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3 animate-pulse" />
            <span>{queueCount} To Ship</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fulfillment workbench: verify customer phone, pack orders, and hand over parcels to couriers
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Link
          href="/dashboard/orders"
          className="px-3 py-1.5 rounded-xl bg-card admin-card text-xs font-bold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
        >
          <span>All Orders</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
