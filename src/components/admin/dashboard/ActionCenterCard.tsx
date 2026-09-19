"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, PackageCheck, AlertOctagon, ChevronRight, Zap } from "lucide-react";
import { useGetActionCenterQuery } from "@/services/api/dashboard/dashboardApi";
import { cn } from "@/lib/utils";

export function ActionCenterCard() {
  const { data: response, isLoading } = useGetActionCenterQuery();
  const metrics = response?.data;

  const unverifiedPayments = metrics?.unverifiedPayments ?? 0;
  const pendingDispatch = metrics?.pendingDispatch ?? 2;
  const lowStockCount = metrics?.lowStockCount ?? 0;

  const actions = [
    {
      title: "MFS Payment Queue",
      count: unverifiedPayments,
      unit: "to verify",
      description: "bKash & Nagad TrxID payments awaiting approval",
      href: "/payments",
      icon: ShieldAlert,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      borderGlow: "hover:border-pink-500/40",
      badgeColor: unverifiedPayments > 0 ? "bg-pink-500/20 text-pink-600 dark:text-pink-300" : "bg-muted text-muted-foreground",
    },
    {
      title: "Dispatch Queue",
      count: pendingDispatch,
      unit: "ready to ship",
      description: "Orders awaiting courier parcel handover",
      href: "/dashboard/orders?status=pending",
      icon: PackageCheck,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      borderGlow: "hover:border-cyan-500/40",
      badgeColor: pendingDispatch > 0 ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300" : "bg-muted text-muted-foreground",
    },
    {
      title: "Critical Stockouts",
      count: lowStockCount,
      unit: "items low",
      description: "Catalog products below replenishment limit",
      href: "/dashboard/products",
      icon: AlertOctagon,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      borderGlow: "hover:border-amber-500/40",
      badgeColor: lowStockCount > 0 ? "bg-amber-500/20 text-amber-600 dark:text-amber-300" : "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-4 sm:p-5 border border-border/40 admin-card">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
              Action Center
            </h3>
            <p className="text-[11px] text-muted-foreground">Immediate operational bottlenecks requiring store attention</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          Operations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/20 transition-all hover:bg-muted/60",
                act.borderGlow
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0", act.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{act.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{act.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className={cn("font-mono font-black text-xs px-2 py-0.5 rounded-lg", act.badgeColor)}>
                  {act.count}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
