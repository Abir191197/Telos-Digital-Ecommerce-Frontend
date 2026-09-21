"use client";

import React from "react";
import { DollarSign, Clock, Truck, PackageCheck } from "lucide-react";
import { KpiCard } from "../dashboard/KpiCard";

interface OrdersKpiMetrics {
  totalVolume: number;
  pendingCount: number;
  inTransitCount: number;
  completedCount: number;
}

export function OrdersKpiGrid({ metrics }: { metrics: OrdersKpiMetrics }) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Fulfillment Volume"
          rawValue={metrics.totalVolume}
          prefix="৳"
          change="+14.2%"
          isPositive={true}
          icon={DollarSign}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Pending / QC"
          rawValue={metrics.pendingCount}
          change={metrics.pendingCount > 0 ? "Needs Action" : "All Clear"}
          isPositive={metrics.pendingCount === 0}
          icon={Clock}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="In Transit Courier"
          rawValue={metrics.inTransitCount}
          change="Real-time Logistics"
          isPositive={true}
          icon={Truck}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Delivered Successfully"
          rawValue={metrics.completedCount}
          change="98.5% Rate"
          isPositive={true}
          icon={PackageCheck}
        />
      </div>
    </div>
  );
}
