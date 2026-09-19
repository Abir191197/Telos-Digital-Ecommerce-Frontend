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
  grossRevenue: fallbackRevenue,
  totalOrders: fallbackOrders,
  avgOrderValue: fallbackAov,
  pendingOrders: fallbackPending,
}: KpiMetricGridProps) {
  const { data: response, isLoading } = useGetDashboardKpisQuery();
  const kpis = response?.data;

  const grossRevenue = kpis ? kpis.grossRevenue : (fallbackRevenue ?? 34170);
  const totalOrders = kpis ? kpis.completedOrders : (fallbackOrders ?? 3);
  const avgOrderValue = kpis ? kpis.avgOrderValue : (fallbackAov ?? 11390);
  const pendingOrders = kpis ? kpis.pendingOrders : (fallbackPending ?? 2);

  const metrics = [
    {
      title: "Gross Revenue",
      rawValue: grossRevenue,
      prefix: "৳",
      change: kpis ? kpis.grossRevenueChange : "+18.4%",
      isPositive: kpis ? kpis.grossRevenuePositive : true,
      icon: DollarSign,
    },
    {
      title: "Completed Orders",
      rawValue: totalOrders,
      change: kpis ? kpis.completedOrdersChange : "+12.2%",
      isPositive: kpis ? kpis.completedOrdersPositive : true,
      icon: ShoppingBag,
    },
    {
      title: "Avg Order Value",
      rawValue: avgOrderValue,
      prefix: "৳",
      change: kpis ? kpis.avgOrderValueChange : "+6.8%",
      isPositive: kpis ? kpis.avgOrderValuePositive : true,
      icon: TrendingUp,
    },
    {
      title: "Pending Dispatch",
      rawValue: pendingOrders,
      change: kpis ? kpis.pendingOrdersChange : (pendingOrders > 0 ? "+3 Queue" : "All Clear"),
      isPositive: kpis ? kpis.pendingOrdersPositive : (pendingOrders === 0),
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
