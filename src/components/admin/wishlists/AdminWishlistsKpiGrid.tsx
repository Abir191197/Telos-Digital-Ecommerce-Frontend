"use client";

import React from "react";
import { Heart, Users, Layers, Package } from "lucide-react";
import { KpiCard } from "../dashboard/KpiCard";

interface WishlistMetrics {
  totalItemsCount: number;
  uniqueCustomers: number;
  avgWishlistSize: number;
  inStockRate: number;
}

export function AdminWishlistsKpiGrid({ metrics }: { metrics: WishlistMetrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiCard
        title="Wishlisted Items"
        rawValue={metrics.totalItemsCount}
        change="Demand entries"
        isPositive={true}
        icon={Heart}
      />
      <KpiCard
        title="Interested Shoppers"
        rawValue={metrics.uniqueCustomers}
        change="Unique customers"
        isPositive={true}
        icon={Users}
      />
      <KpiCard
        title="Avg. Items / User"
        rawValue={metrics.avgWishlistSize}
        suffix=" items"
        change="Demand depth"
        isPositive={true}
        icon={Layers}
      />
      <KpiCard
        title="In-Stock Availability"
        rawValue={metrics.inStockRate}
        suffix="%"
        change="Ready to convert"
        isPositive={metrics.inStockRate >= 70}
        icon={Package}
      />
    </div>
  );
}
