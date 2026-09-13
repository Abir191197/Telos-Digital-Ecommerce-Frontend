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
      title: "Revenue",
      value: `৳${grossRevenue.toLocaleString()}`,
      change: "+18.4%",
      isPositive: true,
      icon: DollarSign,
      colorClass: "text-foreground",
      bgClass: "bg-muted",
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      change: "+12.2%",
      isPositive: true,
      icon: ShoppingBag,
      colorClass: "text-foreground",
      bgClass: "bg-muted",
    },
    {
      title: "Avg Value",
      value: `৳${avgOrderValue.toLocaleString()}`,
      change: "+6.8%",
      isPositive: true,
      icon: TrendingUp,
      colorClass: "text-foreground",
      bgClass: "bg-muted",
    },
    {
      title: "Pending Dispatch",
      value: pendingOrders.toString(),
      change: pendingOrders > 0 ? "Action" : "Clear",
      isPositive: pendingOrders === 0,
      icon: Truck,
      colorClass: "text-foreground",
      bgClass: "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((m) => (
        <KpiCard key={m.title} {...m} />
      ))}
    </div>
  );
}
