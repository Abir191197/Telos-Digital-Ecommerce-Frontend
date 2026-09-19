"use client";

import React from "react";
import Link from "next/link";
import { History, ShieldCheck, ChevronRight } from "lucide-react";
import { useGetRecentActivitiesQuery } from "@/services/api/dashboard/dashboardApi";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS: Record<string, string> = {
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  WARNING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  DANGER: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  INFO: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

export function RecentActivityCard() {
  const { data: response, isLoading } = useGetRecentActivitiesQuery();
  const activities = response?.data ?? [];

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSec < 60) return "just now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return "recently";
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6 border-none admin-card space-y-4 flex flex-col justify-between h-full">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">Admin Activity Log</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time system audit stream</p>
            </div>
          </div>
          <Link
            href="/dashboard/activity"
            className="text-xs font-semibold text-foreground hover:underline flex items-center gap-1"
          >
            <span>Full Audit</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Activity Stream */}
        <div className="space-y-2.5 pt-3">
          {activities.slice(0, 5).map((log) => {
            const badgeClass = SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.INFO;
            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{log.action}</span>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.2 rounded border", badgeClass)}>
                      {log.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatRelativeTime(log.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {log.details}
                </p>
                <p className="text-[10px] text-muted-foreground/80">
                  By <strong className="text-foreground/90">{log.actorName}</strong> &bull; {log.entity}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>Cryptographically timestamped immutable audit logs.</span>
      </div>
    </div>
  );
}
