import React from "react";
import { cn } from "@/lib/utils";

interface PaymentMethodStat {
  name: string;
  pct: number;
  color: string;
}

const PAYMENT_METHODS: PaymentMethodStat[] = [
  { name: "bKash Digital", pct: 48, color: "bg-primary" },
  { name: "Cash on Delivery", pct: 32, color: "bg-slate-400 dark:bg-slate-500" },
  { name: "Nagad MFS", pct: 12, color: "bg-amber-500" },
  { name: "Cards / SSL", pct: 8, color: "bg-blue-500" },
];

export function PaymentSplitCard() {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Payment Channels</h3>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground">
            68% Cashless
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Distribution by total sales</p>

        {/* Breakdown bars */}
        <div className="space-y-3 pt-3">
          {PAYMENT_METHODS.map((p) => (
            <div key={p.name} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{p.name}</span>
                <span className="font-mono text-muted-foreground">{p.pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-300", p.color)}
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 border border-border/60 p-2.5 text-xs text-muted-foreground">
        bKash & Nagad instant payouts settled daily.
      </div>
    </div>
  );
}
