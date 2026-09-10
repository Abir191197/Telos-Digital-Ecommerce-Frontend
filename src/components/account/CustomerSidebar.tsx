"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ACCOUNT_NAV_GROUPS,
  type AccountTabKey,
} from "./accountNavData";
import {
  User,
  LogOut,
  ShieldCheck,
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
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* ── User Mini Profile Card ── */}
      <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs transition-all">
        <div className="flex items-center gap-3.5">
          <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xs">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-full w-full p-2 text-amber-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-foreground truncate">
                {user.name}
              </h3>
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              Telos Gold Member
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation Group List ── */}
      <div className="rounded-2xl border border-border/80 bg-card p-3 shadow-xs divide-y divide-border/50">
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
                    "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-white"
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
                            ? "bg-white/20 text-white"
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
                          ? "text-white translate-x-0.5"
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
