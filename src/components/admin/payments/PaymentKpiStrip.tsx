"use client";

import React from "react";
import { CreditCard, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const cards = [
    {
      title: "Total Logged",
      value: totalCount.toString(),
      subtext: "All Recorded Transactions",
      icon: CreditCard,
      iconBg: "bg-amber-500/10 text-amber-500",
      pillClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      pillText: "All-time",
      shimmer: "via-amber-500/40",
      valueClass: "text-foreground",
    },
    {
      title: "Pending Verification",
      value: pendingCount.toString(),
      badgeAmount: `(৳${pendingAmount.toLocaleString()})`,
      subtext: pendingCount > 0 ? "Awaiting Admin Action" : "Zero Backlog",
      icon: Clock,
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      pillClass:
        pendingCount > 0
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pillText: pendingCount > 0 ? `${pendingCount} In Queue` : "All Cleared",
      shimmer: "via-amber-500/40",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Verified Settlement",
      value: `৳${verifiedAmount.toLocaleString()}`,
      subtext: "Net Reconciled Collections",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/10 text-emerald-500",
      pillClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pillText: "Secured Funds",
      shimmer: "via-emerald-500/40",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="group relative overflow-hidden shrink-0 w-[72vw] max-w-[280px] snap-start sm:w-auto sm:max-w-none rounded-3xl bg-card p-4 sm:p-5 admin-card border border-border/40 sm:border-none flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_24px_-4px_rgba(0,0,0,0.08),0_20px_48px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5),0_12px_30px_-4px_rgba(0,0,0,0.6),0_24px_60px_-8px_rgba(0,0,0,0.7)]"
          >
            {/* Top Hover Gradient Shimmer Bar */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                c.shimmer
              )}
            />

            {/* Top Row: Label + Themed Icon Pill */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90 leading-tight">
                {c.title}
              </span>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105",
                  c.iconBg
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Middle: Big Hero Metric Number */}
            <div className="space-y-1.5 my-auto">
              <div
                className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-none font-mono flex items-baseline gap-1.5 flex-wrap",
                  c.valueClass
                )}
              >
                <span>{c.value}</span>
                {c.badgeAmount && (
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground/80 font-sans tracking-normal">
                    {c.badgeAmount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                {c.subtext}
              </p>
            </div>

            {/* Bottom: Micro Status Pill & Trend Indicator */}
            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-transparent flex items-center gap-1",
                  c.pillClass
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 animate-pulse" />
                {c.pillText}
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
