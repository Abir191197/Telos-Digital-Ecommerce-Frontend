"use client";

import React from "react";
import { useGetAllOrdersQuery } from "@/services/api/orders/orderApi";
import { useGetDashboardKpisQuery } from "@/services/api/dashboard/dashboardApi";
import {
  DashboardHeader,
  ActionCenterCard,
  KpiMetricGrid,
  RevenueChartCard,
  PaymentSplitCard,
  RecentOrdersFeed,
  InventoryAlertList,
  TopProductsCard,
  RecentActivityCard,
  AdminDashboardSkeleton,
} from "./dashboard";

export function DashboardOverview() {
  const { data: kpiResponse, isLoading: isKpisLoading } = useGetDashboardKpisQuery();
  const { data: allOrdersData, isLoading: isOrdersLoading } = useGetAllOrdersQuery({ limit: 8 });
  const liveOrders = allOrdersData?.data ?? [];

  if (isKpisLoading && !kpiResponse) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6 pb-8">
      {/* 1. Header bar with live pulse */}
      <DashboardHeader />

      {/* 2. Urgent Action Center (Bottlenecks & Queues) */}
      <ActionCenterCard />

      {/* 3. 4 Essential KPI Cards - Connected independently to /dashboard/kpis */}
      <KpiMetricGrid />

      {/* 4. Revenue curve & payment channels distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <div className="xl:col-span-7">
          <RevenueChartCard />
        </div>
        <div className="xl:col-span-5">
          <PaymentSplitCard />
        </div>
      </div>

      {/* 5. Live Recent Orders Table & Top Bestsellers */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <div className="xl:col-span-7">
          <RecentOrdersFeed orders={liveOrders} />
        </div>
        <div className="xl:col-span-5">
          <TopProductsCard />
        </div>
      </div>

      {/* 6. Stock Alerts & Live Admin Activity Audit Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        <div className="xl:col-span-5">
          <InventoryAlertList />
        </div>
        <div className="xl:col-span-7">
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
