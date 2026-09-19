"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, ArrowUpRight, Package } from "lucide-react";
import { useGetTopProductsQuery } from "@/services/api/dashboard/dashboardApi";
import {
  DashboardDateFilter,
  DateFilterValue,
} from "./DashboardDateFilter";

export function TopProductsCard() {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({
    preset: "all_time",
  });

  const { data: response, isLoading } = useGetTopProductsQuery({
    dateRange: dateFilter.preset,
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
  });

  const products = response?.data ?? [];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6 border-none admin-card space-y-4 flex flex-col justify-between h-full">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header with Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">Top Bestsellers</h3>
              <p className="text-xs text-muted-foreground">Leading merchandise by volume</p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <DashboardDateFilter
              value={dateFilter}
              onChange={setDateFilter}
            />
          </div>
        </div>

        {/* Product Items */}
        <div className="space-y-2.5 pt-3">
          {products.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl space-y-1 my-2">
              <Package className="h-6 w-6 mx-auto text-muted-foreground/60" />
              <p className="font-semibold text-foreground">No Sales in Selected Period</p>
              <p className="text-[11px]">Select another date preset or check all time.</p>
            </div>
          ) : (
            products.slice(0, 5).map((prod, idx) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-2 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-muted-foreground/60 w-4 text-center">
                    #{idx + 1}
                  </span>
                  <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={prod.thumbnail}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{prod.category} &bull; {prod.sku}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {prod.unitsSold} sold
                  </span>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    ৳{prod.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Link
        href="/dashboard/products"
        className="inline-flex items-center justify-center gap-1 text-center text-xs font-semibold text-muted-foreground hover:text-foreground pt-2 transition-colors"
      >
        <span>View all merchandise</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
