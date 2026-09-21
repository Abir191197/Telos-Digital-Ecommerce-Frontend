"use client";

import React from "react";
import { Box, Package, Truck, BadgeAlert } from "lucide-react";
import { KpiCard } from "../dashboard/KpiCard";

interface DispatchMetrics {
  awaitingPackingCount: number;
  qcReadyCount: number;
  unassignedCourierCount: number;
  urgentCount: number;
}

export function DispatchKpiGrid({ metrics }: { metrics: DispatchMetrics }) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Awaiting QC Check"
          rawValue={metrics.awaitingPackingCount}
          change="Pending verification"
          isPositive={metrics.awaitingPackingCount === 0}
          icon={Box}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Ready For Courier"
          rawValue={metrics.qcReadyCount}
          change="Packed & tagged"
          isPositive={true}
          icon={Package}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Unassigned Courier"
          rawValue={metrics.unassignedCourierCount}
          change={metrics.unassignedCourierCount > 0 ? "Rider needed" : "All assigned"}
          isPositive={metrics.unassignedCourierCount === 0}
          icon={Truck}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="SLA Breach / Urgent"
          rawValue={metrics.urgentCount}
          change={metrics.urgentCount > 0 ? "Action >12h" : "On schedule"}
          isPositive={metrics.urgentCount === 0}
          icon={BadgeAlert}
        />
      </div>
    </div>
  );
}
