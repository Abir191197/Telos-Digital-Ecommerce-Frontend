import React from "react";
import { ActivitySeverity, ActivityCategory } from "@/data/activity-logs";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Package,
  ShoppingBag,
  CreditCard,
  Lock,
  Sliders,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ActivitySeverityBadge({ severity }: { severity: ActivitySeverity }) {
  const map: Record<
    ActivitySeverity,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }
  > = {
    info: {
      label: "Info",
      icon: Info,
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
    },
    success: {
      label: "Success",
      icon: ShieldCheck,
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
    },
    warning: {
      label: "Warning",
      icon: AlertTriangle,
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
    },
    danger: {
      label: "High Alert",
      icon: ShieldAlert,
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20",
    },
  };

  const item = map[severity] || map.info;
  const Icon = item.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0",
        item.bg,
        item.text,
        item.border
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{item.label}</span>
    </span>
  );
}

export function ActivityCategoryPill({ category }: { category: ActivityCategory }) {
  const map: Record<
    ActivityCategory,
    { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    auth: { label: "Authentication", icon: Lock, color: "text-purple-500 bg-purple-500/10" },
    catalog: { label: "Catalog & Store", icon: Package, color: "text-amber-500 bg-amber-500/10" },
    orders: { label: "Orders & Shipping", icon: ShoppingBag, color: "text-blue-500 bg-blue-500/10" },
    payments: { label: "Payments", icon: CreditCard, color: "text-emerald-500 bg-emerald-500/10" },
    security: { label: "Security & TLS", icon: ShieldCheck, color: "text-rose-500 bg-rose-500/10" },
    settings: { label: "Settings & Rates", icon: Settings, color: "text-cyan-500 bg-cyan-500/10" },
  };

  const item = map[category] || map.catalog;
  const Icon = item.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-bold",
        item.color
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{item.label}</span>
    </span>
  );
}
