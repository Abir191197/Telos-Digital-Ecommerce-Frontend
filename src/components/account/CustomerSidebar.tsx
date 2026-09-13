"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ACCOUNT_NAV_GROUPS,
  type AccountTabKey,
} from "./accountNavData";
import {
  LogOut,
  ChevronRight,
} from "lucide-react";
import type { CustomerUser } from "@/stores";

interface CustomerSidebarProps {
  user: CustomerUser;
  activeTab: AccountTabKey;
  onSelectTab: (tab: AccountTabKey) => void;
  orderCount: number;
  wishlistCount: number;
  pendingReviewCount: number;
  onLogout: () => void;
}

export function CustomerSidebar({
  user,
  activeTab,
  onSelectTab,
  orderCount,
  wishlistCount,
  pendingReviewCount,
  onLogout,
}: CustomerSidebarProps) {
  return (
    <aside className="w-full space-y-4">
      {/* ── Navigation Group List ── */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-3.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] divide-y divide-border/40">
        {ACCOUNT_NAV_GROUPS.map((group, groupIdx) => (
          <div
            key={group.group}
            className={cn("space-y-1", groupIdx > 0 && "pt-3 mt-3")}
          >
            <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {group.group}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              // Compute dynamic badge counts
              let badgeCount: string | number | undefined = undefined;
              if (item.id === "orders") badgeCount = orderCount;
              if (item.id === "wishlist" && wishlistCount > 0)
                badgeCount = wishlistCount;
              if (item.id === "reviews" && pendingReviewCount > 0)
                badgeCount = `${pendingReviewCount} new`;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold shadow-md shadow-amber-500/25"
                      : "text-muted-foreground hover:bg-gradient-to-r hover:from-amber-500/[0.08] hover:via-amber-500/[0.03] hover:to-transparent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-zinc-950 stroke-[2.2]"
                          : "text-amber-500 dark:text-amber-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {badgeCount !== undefined && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight",
                          isActive
                            ? "bg-zinc-950/15 text-zinc-950"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {badgeCount}
                      </span>
                    )}
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isActive
                          ? "text-zinc-950 translate-x-0.5"
                          : "text-muted-foreground/50 opacity-0 group-hover:opacity-100"
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        {/* Logout button */}
        <div className="pt-3 mt-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
