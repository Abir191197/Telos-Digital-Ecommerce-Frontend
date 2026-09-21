"use client";

import React from "react";
import { Boxes, Layers, AlertTriangle, AlertOctagon } from "lucide-react";
import { KpiCard } from "../dashboard/KpiCard";

interface ProductsKpiMetrics {
  total: number;
  activeCategories: number;
  lowStock: number;
  outOfStock: number;
}

export function ProductsKpiGrid({ metrics }: { metrics: ProductsKpiMetrics }) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Total Products"
          rawValue={metrics.total}
          change="Catalog items"
          isPositive={true}
          icon={Boxes}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Active Categories"
          rawValue={metrics.activeCategories}
          change="Catalog aisles"
          isPositive={true}
          icon={Layers}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Low Stock (<=5)"
          rawValue={metrics.lowStock}
          change={metrics.lowStock > 0 ? "Restock needed" : "Healthy levels"}
          isPositive={metrics.lowStock === 0}
          icon={AlertTriangle}
        />
      </div>
      <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
        <KpiCard
          title="Out of Stock"
          rawValue={metrics.outOfStock}
          change={metrics.outOfStock > 0 ? "Zero balance" : "All available"}
          isPositive={metrics.outOfStock === 0}
          icon={AlertOctagon}
        />
      </div>
    </div>
  );
}
