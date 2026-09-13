import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimeRange = "today" | "7d" | "30d" | "all";

interface DashboardHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "all", label: "All" },
];

export function DashboardHeader({
  timeRange,
  onTimeRangeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
      {/* Title & Status */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Store overview & performance metrics
        </p>
      </div>

      {/* Segmented Filter */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/80 text-xs font-medium self-start sm:self-auto">
        {TIME_RANGES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTimeRangeChange(t.key)}
            className={cn(
              "px-3 py-1 rounded-md text-xs transition-all cursor-pointer",
              timeRange === t.key
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
