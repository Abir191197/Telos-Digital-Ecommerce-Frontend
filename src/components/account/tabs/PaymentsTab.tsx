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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-600 bg-pink-500/10 px-2 py-0.5 rounded-md">
              bKash Wallet
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              Linked
            </span>
          </div>
          <p className="text-xs font-mono font-bold text-foreground">
            017***-**678
          </p>
          <p className="text-[11px] text-muted-foreground">
            Used for instant refunds & automatic promo codes
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
              Cash on Delivery
            </span>
            <span className="text-[10px] font-bold text-amber-600">
              Active
            </span>
          </div>
          <p className="text-xs font-bold text-foreground">
            Standard BD Parcel Option
          </p>
          <p className="text-[11px] text-muted-foreground">
            Pay upon parcel inspection with courier agent
          </p>
        </div>
      </div>
    </div>
  );
}
