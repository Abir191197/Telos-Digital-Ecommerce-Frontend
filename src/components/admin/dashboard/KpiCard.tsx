import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export function KpiCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  colorClass,
  bgClass,
}: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-border">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            bgClass,
            colorClass
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {value}
        </h3>
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center font-medium",
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            {change}
          </span>
          <span className="text-muted-foreground">&bull; 7 days</span>
        </div>
      </div>
    </div>
  );
}
