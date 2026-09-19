"use client";

import React from "react";
import { ActivityLog } from "@/types/activity.types";
import { ActivitySeverityBadge, ActivityCategoryPill } from "./ActivityBadges";
import { Clock, Globe, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityMobileListProps {
  logs: ActivityLog[];
}

export function ActivityMobileList({ logs }: ActivityMobileListProps) {
  if (logs.length === 0) {
    return (
      <div className="block md:hidden p-8 text-center text-muted-foreground text-xs rounded-3xl bg-card border-none">
        No audit events match the selected criteria.
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3.5">
      {logs.map((log) => {
        const date = new Date(log.timestamp);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div
            key={log.id}
            className="p-4 rounded-3xl bg-card border-none space-y-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]"
          >
            {/* Top row: Category pill + Severity badge */}
            <div className="flex items-center justify-between gap-2">
              <ActivityCategoryPill category={log.category} />
              <ActivitySeverityBadge severity={log.severity} />
            </div>

            {/* Event Name and Detail */}
            <div className="space-y-1">
              <h4 className="text-sm font-black text-foreground">{log.action}</h4>
              {log.entity && (
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono">
                  {log.entity}
                </p>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {log.details}
              </p>
            </div>

            {/* Actor + Origin metadata box */}
            <div className="p-2.5 rounded-2xl bg-muted/30 flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {log.actor.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 truncate">
                  <span className="font-bold text-foreground truncate block">
                    {log.actor.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground shrink-0">
                <Globe className="h-3 w-3" />
                <span>{log.ipAddress}</span>
              </div>
            </div>

            {/* Bottom timestamp */}
            <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground/70" />
                <span>{dateStr} at {timeStr}</span>
              </div>
              <span>{log.device}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
