"use client";

import React, { useEffect, useState } from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  colorClass?: string;
  bgClass?: string;
}

export function KpiCard({
  title,
  rawValue,
  prefix = "",
  suffix = "",
  change,
  isPositive,
  icon: Icon,
}: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s smooth count-up

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out expo curve for crisp deceleration
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(easeOut * rawValue));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(rawValue);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [rawValue]);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-3.5 sm:p-5 lg:p-6 border border-border/40 sm:border-none admin-card cursor-default flex flex-col justify-between transition-all">
      {/* Subtle top hover shimmer light */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ── MOBILE VIEW ONLY: Number First + Bottom-Right Icon ── */}
      <div className="flex sm:hidden flex-col justify-between h-full space-y-3">
        {/* Top: Number + Change Chip */}
        <div className="flex items-start justify-between gap-2">
          <div className="text-2xl font-black tracking-tight text-foreground leading-none tabular-nums">
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
          </div>

          <span
            className={cn(
              "inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[10px] whitespace-nowrap shrink-0",
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />
            )}
            <span>{change}</span>
          </span>
        </div>

        {/* Bottom: Title + Right Corner Icon */}
        <div className="flex items-end justify-between gap-2 pt-1">
          <p className="text-xs font-bold text-muted-foreground leading-snug pr-1">
            {title}
          </p>
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW: Original Proven KPI Layout (Title + Icon on top, Hero number, Change + vs last period) ── */}
      <div className="hidden sm:block">
        {/* Top row: Label + Icon */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            {title}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        {/* Hero Number */}
        <div className="space-y-2">
          <div className="text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-none tabular-nums">
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
          </div>

          {/* Change chip & timeframe */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span
              className={cn(
                "inline-flex items-center font-bold px-2 py-0.5 rounded-md text-[11px]",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {change}
            </span>
            <span className="text-muted-foreground text-[11px]">vs last period</span>
          </div>
        </div>
      </div>
    </div>
  );
}
