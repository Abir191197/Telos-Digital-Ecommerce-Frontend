import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, Truck } from "lucide-react";
import { KpiCard } from "./KpiCard";

interface KpiMetricGridProps {
  grossRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  pendingOrders: number;
}

export function KpiMetricGrid({
  grossRevenue,
  totalOrders,
  avgOrderValue,
  pendingOrders,
}: KpiMetricGridProps) {
  const metrics = [
    {
      title: "Gross Revenue",
      rawValue: grossRevenue,
      prefix: "৳",
      change: "+18.4%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Completed Orders",
      rawValue: totalOrders,
      change: "+12.2%",
      isPositive: true,
      icon: ShoppingBag,
    },
    {
      title: "Avg Order Value",
      rawValue: avgOrderValue,
      prefix: "৳",
      change: "+6.8%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Pending Dispatch",
      rawValue: pendingOrders,
      change: pendingOrders > 0 ? "+3 Queue" : "All Clear",
      isPositive: pendingOrders === 0,
      icon: Truck,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {metrics.map((m) => (
        <KpiCard key={m.title} {...m} />
      ))}
    </div>
  );
}
