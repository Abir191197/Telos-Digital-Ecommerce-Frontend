"use client";

import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, Truck } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { useGetDashboardKpisQuery } from "@/services/api/dashboard/dashboardApi";

interface KpiMetricGridProps {
  grossRevenue?: number;
  totalOrders?: number;
  avgOrderValue?: number;
  pendingOrders?: number;
}

export function KpiMetricGrid({
  grossRevenue: propRevenue,
  totalOrders: propOrders,
  avgOrderValue: propAov,
  pendingOrders: propPending,
}: KpiMetricGridProps) {
  const { data: response, isLoading } = useGetDashboardKpisQuery();
  const kpis = response?.data;

  const grossRevenue = kpis ? kpis.grossRevenue : (propRevenue ?? 0);
  const totalOrders = kpis ? kpis.completedOrders : (propOrders ?? 0);
  const avgOrderValue = kpis ? kpis.avgOrderValue : (propAov ?? 0);
  const pendingOrders = kpis ? kpis.pendingOrders : (propPending ?? 0);

  const metrics = [
    {
      title: "Gross Revenue",
      rawValue: grossRevenue,
      prefix: "৳",
      change: kpis?.grossRevenueChange || "0.0%",
      isPositive: kpis?.grossRevenuePositive ?? true,
      icon: DollarSign,
    },
    {
      title: "Completed Orders",
      rawValue: totalOrders,
      change: kpis?.completedOrdersChange || "0.0%",
      isPositive: kpis?.completedOrdersPositive ?? true,
      icon: ShoppingBag,
    },
    {
      title: "Avg Order Value",
      rawValue: avgOrderValue,
      prefix: "৳",
      change: kpis?.avgOrderValueChange || "0.0%",
      isPositive: kpis?.avgOrderValuePositive ?? true,
      icon: TrendingUp,
    },
    {
      title: "Pending Dispatch",
      rawValue: pendingOrders,
      change: kpis?.pendingOrdersChange || (pendingOrders > 0 ? `${pendingOrders} Queue` : "All Clear"),
      isPositive: kpis?.pendingOrdersPositive ?? (pendingOrders === 0),
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
