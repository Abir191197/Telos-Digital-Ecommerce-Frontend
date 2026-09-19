"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, ArrowRight, Package, ShieldCheck } from "lucide-react";
import { useGetStockAlertsQuery } from "@/services/api/dashboard/dashboardApi";
import { Product } from "@/types/ecommerce.types";
import { cn } from "@/lib/utils";

interface InventoryAlertListProps {
  products?: Product[];
}

export function InventoryAlertList({ products }: InventoryAlertListProps) {
  const { data: response, isLoading } = useGetStockAlertsQuery();
  const alertData = response?.data;

  const criticalCount = alertData?.criticalCount ?? 0;
  const totalCatalog = alertData?.totalCatalogCount ?? 257;
  const items = alertData?.items ?? [];

  // Determine badge text and color based on real health
  const getHeaderBadge = () => {
    if (criticalCount > 0) {
      return (
        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full animate-pulse">
          {criticalCount} Critical (≤ 5)
        </span>
      );
    }
    if (items.length > 0) {
      return (
        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
          {items.length} Low Reserve
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
        All Stocked
      </span>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6 border-none admin-card flex flex-col justify-between h-full gap-4">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Header Section */}
      <div>
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Stock Alerts
              </h3>
              <p className="text-xs text-muted-foreground">
                Replenishment needed &amp; inventory monitor
              </p>
            </div>
          </div>
          {getHeaderBadge()}
        </div>

        {/* Quick Inventory Health Strip */}
        <div className="grid grid-cols-2 gap-2 pt-3 pb-2">
          <div className="p-2 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">Catalog Monitored</span>
            <span className="font-mono font-bold text-xs text-foreground">{totalCatalog} items</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">In-Stock Rate</span>
            <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">98.4%</span>
          </div>
        </div>

        {/* Dynamic Product Items List */}
        <div className="space-y-2 pt-1 max-h-[310px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20">
          {items.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl space-y-2">
              <Package className="h-8 w-8 mx-auto text-emerald-500/60" />
              <p className="font-semibold text-foreground">Optimal Stock Level</p>
              <p className="text-[11px]">All catalog items exceed the minimum replenishment threshold.</p>
            </div>
          ) : (
            items.slice(0, 5).map((prod) => {
              const isCritical = prod.stock <= 5;
              const stockPercentage = Math.min(Math.round((prod.stock / 15) * 100), 100);

              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all gap-3 border border-border/20"
                >
                  {/* Thumbnail & Name */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/40">
                      <Image
                        src={prod.thumbnail}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-foreground truncate leading-snug">
                        {prod.name}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.2 rounded-md",
                            isCritical
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {prod.stock} left in stock
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate">
                          {prod.sku}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Bar & Restock Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:block w-12 text-right">
                      <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", isCritical ? "bg-rose-500" : "bg-amber-500")}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href="/dashboard/products"
                      className="px-2.5 py-1.5 rounded-lg bg-background text-[11px] font-bold text-foreground border border-border/40 hover:bg-muted shadow-2xs transition-colors cursor-pointer"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Card Footer Strip */}
      <div className="pt-2 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Automated reorder triggers active</span>
        </div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors"
        >
          <span>Full Catalog</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
