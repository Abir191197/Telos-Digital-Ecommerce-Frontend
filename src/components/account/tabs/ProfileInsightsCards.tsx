"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import type { Order } from "@/types/order.types";

interface ProfileInsightsCardsProps {
  orders: Order[];
}

export function ProfileInsightsCards({ orders }: ProfileInsightsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
      <div className="rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-3.5 sm:p-4.5 space-y-1 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Total Orders
        </span>
        <p className="text-lg sm:text-xl font-black text-foreground">
          {orders.length} Orders
        </p>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground">Across Bangladesh</p>
      </div>

      <div className="rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-3.5 sm:p-4.5 space-y-1 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Delivery Zone
        </span>
        <p className="text-lg sm:text-xl font-black text-foreground">Inside Dhaka</p>
        <p className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-bold">
          Next-Day RedX
        </p>
      </div>

      <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-3.5 sm:p-4.5 space-y-1 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Account Security
        </span>
        <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Protected</span>
        </p>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground">SSL Encrypted 256-bit</p>
      </div>
    </div>
  );
}
