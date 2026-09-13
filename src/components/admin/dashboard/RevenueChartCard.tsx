import React from "react";
import { TrendingUp } from "lucide-react";

interface SalesPoint {
  day: string;
  revenue: number;
  orders: number;
}

interface RevenueChartCardProps {
  data: SalesPoint[];
}

export function RevenueChartCard({ data }: RevenueChartCardProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const totalPeriodRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground">Daily sales performance</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <span>৳{Math.round(totalPeriodRevenue / 1000)}k total</span>
        </div>
      </div>

      {/* Bar Chart Visual */}
      <div className="h-44 pt-4 flex items-end justify-between gap-2 sm:gap-4 border-b border-border/60 pb-2">
        {data.map((item) => {
          const heightPct = Math.max(16, Math.round((item.revenue / maxRevenue) * 100));
          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-medium text-foreground pointer-events-none">
                ৳{Math.round(item.revenue / 1000)}k
              </div>

              {/* Bar track and fill (neutral foreground bar) */}
              <div className="w-full max-w-[32px] bg-muted/70 rounded-md overflow-hidden h-32 flex items-end">
                <div
                  className="w-full bg-foreground/75 rounded-md transition-all duration-200 group-hover:bg-foreground"
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Highest revenue recorded on Saturday</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">+22% weekend volume</span>
      </div>
    </div>
  );
}
