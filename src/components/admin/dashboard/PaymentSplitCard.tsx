import React from "react";
import { cn } from "@/lib/utils";
import { Smartphone, Banknote, CreditCard, ShieldCheck } from "lucide-react";

interface PaymentMethodStat {
  name: string;
  volume: string;
  pct: number;
  icon: typeof Smartphone;
  color: string;
  barColor: string;
}

const PAYMENT_CHANNELS: PaymentMethodStat[] = [
  {
    name: "bKash MFS",
    volume: "৳290,400",
    pct: 48,
    icon: Smartphone,
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    barColor: "bg-pink-500",
  },
  {
    name: "Cash on Delivery",
    volume: "৳193,600",
    pct: 32,
    icon: Banknote,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    barColor: "bg-amber-500",
  },
  {
    name: "Nagad Wallet",
    volume: "৳72,600",
    pct: 12,
    icon: Smartphone,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    barColor: "bg-orange-500",
  },
  {
    name: "Visa / Mastercard",
    volume: "৳48,400",
    pct: 8,
    icon: CreditCard,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    barColor: "bg-blue-500",
  },
];

export function PaymentSplitCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-4 sm:p-5 border-none admin-card flex flex-col justify-between h-full gap-4">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Payment Channels
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bangladeshi MFS & Card distribution
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            68% Cashless
          </span>
        </div>

        {/* Unified Multi-Segment Strip Gauge */}
        <div className="pt-3 pb-1">
          <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted/70 gap-0.5 p-0.5">
            {PAYMENT_CHANNELS.map((p) => (
              <div
                key={p.name}
                className={cn("h-full rounded-full transition-all duration-300", p.barColor)}
                style={{ width: `${p.pct}%` }}
                title={`${p.name}: ${p.pct}%`}
              />
            ))}
          </div>
        </div>

        {/* Channels List */}
        <div className="space-y-2 pt-2">
          {PAYMENT_CHANNELS.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", p.color)}>
                  <p.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground leading-none">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {p.volume}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-xs text-foreground">
                  {p.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Insight Note */}
      <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>Instant automated settlement via bKash & SSLCommerz.</span>
      </div>
    </div>
  );
}
