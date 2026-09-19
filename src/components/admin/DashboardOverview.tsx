"use client";

import React from "react";
import { useAdminStore } from "@/stores";
import { useGetOrderStatsQuery, useGetAllOrdersQuery } from "@/services/api/orders/orderApi";
import {
  DashboardHeader,
  KpiMetricGrid,
  RevenueChartCard,
  PaymentSplitCard,
  RecentOrdersFeed,
  InventoryAlertList,
} from "./dashboard";

export function DashboardOverview() {
  const { orders, products, updateOrderStatus } = useAdminStore();
  const { data: statsData } = useGetOrderStatsQuery();
  const { data: allOrdersData } = useGetAllOrdersQuery({ limit: 10 });
  const liveOrders = allOrdersData?.data ?? orders;
  const backendStats = statsData?.data;

  // Key KPI metrics calculations
  const grossRevenue = backendStats ? backendStats.totalRevenue : liveOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = backendStats ? backendStats.totalOrders : liveOrders.length;
  const pendingOrders = backendStats ? backendStats.pendingDispatchCount : liveOrders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;
  const avgOrderValue = totalOrders > 0 ? Math.round(grossRevenue / totalOrders) : 0;

  // Visual sales trend points
  const salesTrend = [
    { day: "Mon", revenue: 42000, orders: 4 },
    { day: "Tue", revenue: 68000, orders: 7 },
    { day: "Wed", revenue: 54000, orders: 5 },
    { day: "Thu", revenue: 92000, orders: 9 },
    { day: "Fri", revenue: 145000, orders: 14 },
    { day: "Sat", revenue: 180000, orders: 18 },
    { day: "Sun", revenue: 125000, orders: 11 },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header bar with live pulse */}
      <DashboardHeader />

      {/* 4 Essential KPI Cards (2x2 on mobile, 4x1 on desktop) */}
      <KpiMetricGrid
        grossRevenue={grossRevenue}
        totalOrders={totalOrders}
        avgOrderValue={avgOrderValue}
        pendingOrders={pendingOrders}
      />

      {/* Revenue curve & payment methods split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <div className="xl:col-span-7">
          <RevenueChartCard />
        </div>
        <div className="xl:col-span-5">
          <PaymentSplitCard />
        </div>
      </div>

      {/* Live recent orders & inventory watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersFeed orders={liveOrders} />
        </div>
        <div>
          <InventoryAlertList products={products} />
        </div>
      </div>
    </div>
  );
}
