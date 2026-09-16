"use client";

import React from "react";
import { ActivityLog } from "@/data/activity-logs";
import { ActivitySeverityBadge, ActivityCategoryPill } from "./ActivityBadges";
import { Clock, Globe, Laptop, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityDesktopTableProps {
  logs: ActivityLog[];
}

export function ActivityDesktopTable({ logs }: ActivityDesktopTableProps) {
  if (logs.length === 0) {
    return (
      <div className="hidden md:block p-12 text-center text-muted-foreground text-xs rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
        No audit events match the selected criteria.
      </div>
    );
  }

  return (
    <div className="hidden md:block rounded-3xl bg-card border-none overflow-hidden shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3.5 px-4 w-44">Timestamp</th>
              <th className="py-3.5 px-4 w-48">Actor</th>
              <th className="py-3.5 px-4 w-36">Category</th>
              <th className="py-3.5 px-4">Event &amp; Context</th>
              <th className="py-3.5 px-4 w-32">Severity</th>
              <th className="py-3.5 px-4 w-44 text-right">Origin &amp; IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
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
                <tr
                  key={log.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-foreground font-bold">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5 pl-5">
                      {timeStr}
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 border border-amber-500/20 text-xs">
                        {log.actor.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs truncate">
                          {log.actor.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          {log.actor.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <ActivityCategoryPill category={log.category} />
                  </td>

                  {/* Event & Details */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-md">
                      <p className="font-bold text-foreground text-xs">
                        {log.action}
                        {log.entity && (
                          <span className="text-amber-600 dark:text-amber-400 ml-1 font-semibold">
                            &bull; {log.entity}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {log.details}
                      </p>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <ActivitySeverityBadge severity={log.severity} />
                  </td>

                  {/* IP & Location */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-mono text-[11px] font-bold text-foreground">
                      {log.ipAddress}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <Globe className="h-3 w-3" />
                      <span>{log.location}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
