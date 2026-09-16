"use client";

import React from "react";
import { CreditCard, Clock, ShieldCheck } from "lucide-react";

interface PaymentKpiStripProps {
  totalCount: number;
  pendingCount: number;
  pendingAmount: number;
  verifiedAmount: number;
}

export function PaymentKpiStrip({
  totalCount,
  pendingCount,
  pendingAmount,
  verifiedAmount,
}: PaymentKpiStripProps) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
      {/* 1. Total Logged Transactions */}
      <div className="shrink-0 w-[72vw] max-w-[280px] snap-start sm:w-auto sm:max-w-none sm:h-full p-4 rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Logged
          </p>
          <p className="text-2xl font-black text-foreground mt-1 font-mono">
            {totalCount}
          </p>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <CreditCard className="h-5 w-5" />
        </div>
      </div>

      {/* 2. Pending Verification */}
      <div className="shrink-0 w-[72vw] max-w-[280px] snap-start sm:w-auto sm:max-w-none sm:h-full p-4 rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pending Verification
          </p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
            {pendingCount}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (৳{pendingAmount.toLocaleString()})
            </span>
          </p>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      {/* 3. Verified Settlement */}
      <div className="shrink-0 w-[72vw] max-w-[280px] snap-start sm:w-auto sm:max-w-none sm:h-full p-4 rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Verified Settlement
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            ৳{verifiedAmount.toLocaleString()}
          </p>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
