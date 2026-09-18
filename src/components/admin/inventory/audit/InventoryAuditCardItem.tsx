"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StockAuditLog } from "@/services/api/inventory/inventoryApi";

interface InventoryAuditCardItemProps {
  log: StockAuditLog;
}

function formatAuditDateTime(dateStr?: string) {
  if (!dateStr) return { date: "-", time: "-" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: "-", time: "-" };
    const date = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  } catch {
    return { date: "-", time: "-" };
  }
}

export function InventoryAuditCardItem({ log }: InventoryAuditCardItemProps) {
  const { date, time } = formatAuditDateTime(log.createdAt);
  const isIncrease = log.actionType === "INCREASE";
  const prod = log.product;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 transition-all shadow-xs flex flex-col justify-between gap-3.5 hover:border-border/90">
      {/* Top row: Date & Logged By */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
        <div className="flex items-center gap-1.5 font-mono">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
          <User className="h-3 w-3 text-muted-foreground" />
          {log.performedBy || "Super Admin"}
        </span>
      </div>

      {/* Product Summary */}
      <div className="flex items-start gap-3">
        <Link
          href={`/products/${prod?.slug || prod?.id}`}
          className="relative h-11 w-11 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30 block cursor-pointer"
        >
          {prod?.thumbnail ? (
            <Image
              src={prod.thumbnail}
              alt={prod.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted/60 text-[9px] font-bold text-muted-foreground">
              No Pic
            </div>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${prod?.slug || prod?.id}`}
            className="font-extrabold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1 text-xs leading-snug cursor-pointer"
          >
            {prod?.name || "Deleted Product"}
          </Link>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
            SKU: {prod?.sku || "N/A"}
          </p>
        </div>
      </div>

      {/* Adjustment & Stock Shift */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
        <div>
          {isIncrease ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-bold border border-emerald-500/25">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{log.quantity} units</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 text-xs font-bold border border-rose-500/25">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>-{log.quantity} units</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-muted-foreground font-semibold">{log.previousStock}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className={cn(
            "font-black text-sm",
            isIncrease
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}>
            {log.newStock}
          </span>
          <span className="text-[10px] text-muted-foreground">units</span>
        </div>
      </div>

      {/* Reason & Note */}
      <div className="p-2.5 rounded-xl bg-muted/30 border border-border/40 text-xs">
        <p className="font-bold text-foreground line-clamp-1">{log.reason}</p>
        {log.note && (
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 italic">
            &ldquo;{log.note}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
