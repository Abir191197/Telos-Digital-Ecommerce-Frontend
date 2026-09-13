"use client";

import React from "react";

export function PaymentsTab() {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-base font-bold text-foreground">
          Saved Payment Methods (Bangladesh)
        </h3>
        <p className="text-xs text-muted-foreground">
          Convenient 1-tap checkout with mobile financial services & local cards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* bKash Wallet Pass */}
        <div className="rounded-3xl border border-pink-500/20 dark:border-pink-500/30 bg-gradient-to-br from-card via-card to-pink-500/[0.04] dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-pink-500/[0.08] p-5 space-y-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-pink-500/[0.03] hover:to-pink-500/[0.1] hover:shadow-[0_14px_35px_-6px_rgba(236,72,153,0.15)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-500/15 border border-pink-500/20 px-2.5 py-1 rounded-xl shadow-2xs">
              bKash Wallet
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">
              Linked
            </span>
          </div>
          <p className="text-base font-mono font-black text-foreground tracking-tight">
            017***-**678
          </p>
          <p className="text-xs text-muted-foreground">
            Used for instant refunds & automatic promo codes across Bangladesh.
          </p>
        </div>

        {/* Cash on Delivery Pass */}
        <div className="rounded-3xl border border-amber-500/20 dark:border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/[0.04] dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-amber-500/[0.08] p-5 space-y-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.03] hover:to-amber-500/[0.1] hover:shadow-[0_14px_35px_-6px_rgba(245,158,11,0.15)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 rounded-xl shadow-2xs">
              Cash on Delivery
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
              Active
            </span>
          </div>
          <p className="text-base font-bold text-foreground tracking-tight">
            Standard BD Parcel Option
          </p>
          <p className="text-xs text-muted-foreground">
            Pay upon parcel inspection with Steadfast or Pathao courier rider.
          </p>
        </div>
      </div>
    </div>
  );
}
