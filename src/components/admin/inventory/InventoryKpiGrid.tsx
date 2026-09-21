"use client";

import React from "react";
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import { KpiCard } from "../dashboard/KpiCard";

interface InventoryKpiGridProps {
  totalCount: number;
  inStockCount: number;
  criticalLowCount: number;
  reserveLowCount: number;
  outOfStockCount: number;
}

export function InventoryKpiGrid({
  totalCount,
  inStockCount,
  criticalLowCount,
  reserveLowCount,
  outOfStockCount,
}: InventoryKpiGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiCard
        title="Total Products"
        rawValue={totalCount}
        change="Catalog items"
        isPositive={true}
        icon={Boxes}
      />
      <KpiCard
        title="In-Stock Healthy"
        rawValue={inStockCount}
        change="Stock > 10 units"
        isPositive={true}
        icon={CheckCircle2}
      />
      <KpiCard
        title="Low Stock Watch"
        rawValue={reserveLowCount > 0 ? reserveLowCount : criticalLowCount}
        change={reserveLowCount > 0 ? `${reserveLowCount} items ≤ 10` : "Healthy balance"}
        isPositive={reserveLowCount === 0 && criticalLowCount === 0}
        icon={AlertTriangle}
      />
      <KpiCard
        title="Out of Stock"
        rawValue={outOfStockCount}
        change={outOfStockCount > 0 ? "Zero balance" : "All available"}
        isPositive={outOfStockCount === 0}
        icon={AlertOctagon}
      />
    </div>
  );
}
