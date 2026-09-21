"use client";

import React from "react";
import { Package, Users, CircleDollarSign, Layers } from "lucide-react";
import { KpiCard } from "../dashboard/KpiCard";

interface CartMetrics {
  totalItemsCount: number;
  uniqueCustomers: number;
  totalValue: number;
  avgCartSize: string;
}

export function AdminCartsKpiGrid({ metrics }: { metrics: CartMetrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiCard
        title="In-Cart Items"
        rawValue={metrics.totalItemsCount}
        change="Platform wide"
        isPositive={true}
        icon={Package}
      />
      <KpiCard
        title="Active Carts"
        rawValue={metrics.uniqueCustomers}
        change="Unique shoppers"
        isPositive={true}
        icon={Users}
      />
      <KpiCard
        title="Cart Value"
        rawValue={metrics.totalValue}
        prefix="৳"
        change="Unrealized revenue"
        isPositive={true}
        icon={CircleDollarSign}
      />
      <KpiCard
        title="Avg. Cart Size"
        rawValue={parseFloat(metrics.avgCartSize) || 0}
        suffix=" items"
        change="Items per shopper"
        isPositive={true}
        icon={Layers}
      />
    </div>
  );
}
