"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Smartphone, Banknote, CreditCard, ShieldCheck } from "lucide-react";
import { useGetPaymentChannelsQuery } from "@/services/api/dashboard/dashboardApi";
import {
  DashboardDateFilter,
  DateFilterValue,
} from "./DashboardDateFilter";

const CHANNEL_ICONS: Record<string, typeof Smartphone> = {
  bkash: Smartphone,
  cod: Banknote,
  nagad: Smartphone,
  card: CreditCard,
};

export function PaymentSplitCard() {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({
    preset: "all_time",
  });

  const { data: response, isLoading } = useGetPaymentChannelsQuery({
    dateRange: dateFilter.preset,
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
  });

  const paymentData = response?.data;

  const channels = paymentData?.channels ?? [];
  const cashlessPct = paymentData?.cashlessPercentage ?? 0;
  const activeChannelsWithPct = channels.filter((p) => p.pct > 0);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-4 sm:p-5 border-none admin-card flex flex-col justify-between h-full gap-4">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div>
        {/* Header with Date Filter Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Payment Channels
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Verified Only
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live settlement &amp; MFS distribution
            </p>
          </div>

          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <DashboardDateFilter
              value={dateFilter}
              onChange={setDateFilter}
            />
          </div>
        </div>

        {/* Ratio Tag Banner */}
        <div className="flex items-center justify-between pt-2.5 pb-1">
          <span className="text-xs text-muted-foreground font-medium">Digital vs COD Share</span>
          {cashlessPct > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {cashlessPct}% Cashless
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              100% Cash on Delivery
            </span>
          )}
        </div>

        {/* Unified Multi-Segment Strip Gauge */}
        <div className="py-1">
          <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted/70 gap-0.5 p-0.5">
            {activeChannelsWithPct.length > 0 ? (
              activeChannelsWithPct.map((p) => (
                <div
                  key={p.name}
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    p.barColor
                  )}
                  style={{ width: `${p.pct}%` }}
                  title={`${p.name}: ${p.pct}% (${p.volume})`}
                />
              ))
            ) : (
              <div className="h-full w-full rounded-full bg-muted transition-all" />
            )}
          </div>
        </div>

        {/* Channels List - Only Verified Payments from PostgreSQL */}
        {channels.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No payment distribution data found
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            {channels.map((p) => {
              const Icon = CHANNEL_ICONS[p.method] || Smartphone;
              return (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg",
                        p.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-none">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
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
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Insight Note */}
      <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>Only verified transactions are calculated in this ledger.</span>
      </div>
    </div>
  );
}
