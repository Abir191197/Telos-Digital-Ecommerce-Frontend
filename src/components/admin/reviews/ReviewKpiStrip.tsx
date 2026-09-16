"use client";

import React from "react";
import { MessageSquare, Star, EyeOff, Flag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewKpiStripProps {
  totalCount: number;
  avgRating: number;
  hiddenCount: number;
  flaggedCount: number;
}

export function ReviewKpiStrip({
  totalCount,
  avgRating,
  hiddenCount,
  flaggedCount,
}: ReviewKpiStripProps) {
  const cards = [
    {
      title: "Total Reviews",
      value: totalCount.toString(),
      subtext: "Verified Feedback",
      icon: MessageSquare,
      iconBg: "bg-amber-500/10 text-amber-500",
      pillClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      pillText: "All-time",
      shimmer: "from-amber-500/30",
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      isRating: true,
      subtext: "Out of 5.0 Stars",
      icon: Star,
      iconBg: "bg-amber-500/15 text-amber-500",
      pillClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pillText: "Store Health",
      shimmer: "from-amber-400/40",
    },
    {
      title: "Hidden Reviews",
      value: hiddenCount.toString(),
      subtext: "Excluded from Store",
      icon: EyeOff,
      iconBg: "bg-muted/80 text-muted-foreground",
      pillClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
      pillText: hiddenCount > 0 ? `${hiddenCount} Filtered` : "None Hidden",
      shimmer: "from-zinc-500/20",
    },
    {
      title: "Flagged for Audit",
      value: flaggedCount.toString(),
      subtext: "Needs Review",
      icon: Flag,
      iconBg: "bg-rose-500/10 text-rose-500",
      pillClass:
        flaggedCount > 0
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pillText: flaggedCount > 0 ? "Action Required" : "Clean Queue",
      shimmer: "from-rose-500/30",
    },
  ];

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="group relative overflow-hidden shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none rounded-3xl bg-card p-4 sm:p-5 admin-card border border-border/40 sm:border-none flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_24px_-4px_rgba(0,0,0,0.08),0_20px_48px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5),0_12px_30px_-4px_rgba(0,0,0,0.6),0_24px_60px_-8px_rgba(0,0,0,0.7)]"
          >
            {/* Top Hover Gradient Shimmer Bar */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}
            />

            {/* Top Row: Label + Icon Pill */}
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
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-none font-mono flex items-center gap-1.5">
                <span>{c.value}</span>
                {c.isRating && (
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400 shrink-0 inline-block mb-1" />
                )}
              </div>
            </div>

            {/* Bottom Row: Context Status Chip */}
            <div className="flex items-center justify-between gap-1.5 pt-3 mt-2 border-t border-border/40 text-[11px]">
              <span
                className={cn(
                  "inline-flex items-center font-bold px-2 py-0.5 rounded-lg text-[10px] whitespace-nowrap",
                  c.pillClass
                )}
              >
                {c.pillText}
              </span>
              <span className="text-muted-foreground text-[10px] truncate">
                {c.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
