"use client";

import React from "react";
import { Users, CheckCircle2, ShieldAlert, UserPlus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminCustomersSummary } from "@/services/api/customers/customerApi";

interface CustomerKpiStripProps {
  summary?: AdminCustomersSummary;
  isLoading?: boolean;
}

export function CustomerKpiStrip({ summary, isLoading }: CustomerKpiStripProps) {
  const cards = [
    {
      title: "Total Customers",
      value: summary?.totalCustomers ?? 0,
      subtext: "Registered directory accounts",
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      border: "border-amber-500/20",
    },
    {
      title: "Active Accounts",
      value: summary?.activeCustomers ?? 0,
      subtext: "Eligible for checkout & browsing",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/20",
    },
    {
      title: "Inactive / Suspended",
      value: (summary?.inactiveCustomers ?? 0) + (summary?.suspendedCustomers ?? 0),
      subtext: "Restricted or paused accounts",
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      border: "border-rose-500/20",
    },
    {
      title: "New This Month",
      value: summary?.newThisMonth ?? 0,
      subtext: "Joined in the current cycle",
      icon: UserPlus,
      color: "text-sky-500",
      bg: "bg-sky-500/10 dark:bg-sky-500/15",
      border: "border-sky-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-3xl bg-card p-4 sm:p-5 border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] transition-all hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted/60 animate-pulse rounded-lg" />
                  ) : (
                    card.value.toLocaleString()
                  )}
                </div>
              </div>
              <div className={cn("p-2.5 sm:p-3 rounded-2xl border", card.bg, card.border)}>
                <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", card.color)} />
              </div>
            </div>
            <p className="mt-2 text-[11px] font-medium text-muted-foreground line-clamp-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
