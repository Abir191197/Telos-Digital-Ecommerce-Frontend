"use client";

import React from "react";
import { ActivityLog } from "@/data/activity-logs";
import { ActivitySeverityBadge, ActivityCategoryPill } from "./ActivityBadges";
import { Clock, Globe, Laptop, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardGridProps {
  logs: ActivityLog[];
}

export function ActivityCardGrid({ logs }: ActivityCardGridProps) {
  if (logs.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground text-xs rounded-3xl bg-card border-none">
        No audit events match the selected criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {logs.map((log) => {
        const date = new Date(log.timestamp);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div
            key={log.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border-none p-5 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.12),0_20px_50px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.18),0_20px_50px_-10px_rgba(0,0,0,0.5)] space-y-4"
          >
            {/* Top row: Category + Severity */}
            <div className="flex items-center justify-between gap-2">
              <ActivityCategoryPill category={log.category} />
              <ActivitySeverityBadge severity={log.severity} />
            </div>

            {/* Event Name & Description */}
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-black text-foreground group-hover:text-amber-500 transition-colors">
                {log.action}
              </h4>
              {log.entity && (
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono">
                  {log.entity}
                </p>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {log.details}
              </p>
            </div>

            {/* Middle: Actor info */}
            <div className="p-3 rounded-2xl bg-muted/30 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 border border-amber-500/20 text-xs">
                {log.actor.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  {log.actor.name}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  {log.actor.email}
                </p>
              </div>
            </div>

            {/* Bottom Row: Time + Origin */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="font-semibold text-foreground">{dateStr}</span>
                <span className="text-[10px] font-mono">({timeStr})</span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[10px] text-foreground font-semibold">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>{log.ipAddress}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
