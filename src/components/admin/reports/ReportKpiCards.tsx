"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardItem {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface ReportKpiCardsProps {
  cards: KpiCardItem[];
}

export function ReportKpiCards({ cards }: ReportKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 print:hidden">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="admin-card rounded-2xl bg-card border-none p-4.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className="h-8 w-8 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {card.value}
              </div>
              {card.subtitle && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
