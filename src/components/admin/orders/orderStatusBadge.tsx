"use client";

import React from "react";
import { CheckCircle2, Truck, AlertCircle, Clock } from "lucide-react";
import { OrderStatus } from "@/types/order.types";

export function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-bold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Delivered
        </span>
      );
    case "shipped":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-[11px] font-bold">
          <Truck className="h-3.5 w-3.5" />
          In Transit
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-600 px-2.5 py-1 text-[11px] font-bold">
          <AlertCircle className="h-3.5 w-3.5" />
          Cancelled
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-[11px] font-bold">
          <Clock className="h-3.5 w-3.5 animate-pulse" />
          Processing
        </span>
      );
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 text-[11px] font-bold">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      );
  }
}
