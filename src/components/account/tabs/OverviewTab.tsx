"use client";

import React from "react";
import { CheckCircle2, Truck, AlertCircle, Clock } from "lucide-react";
import type { CustomerUser } from "@/stores";
import type { Order, OrderStatus } from "@/types/order.types";
import type { AccountTabKey } from "../accountNavData";
import { OverviewProfileCard } from "./OverviewProfileCard";
import { OverviewActiveOrderCard } from "./OverviewActiveOrderCard";
import { OverviewQuickCardsGrid } from "./OverviewQuickCardsGrid";

interface OverviewTabProps {
  user: CustomerUser;
  orders: Order[];
  isLoadingOrders?: boolean;
  onSelectTab: (tab: AccountTabKey, extraParams?: Record<string, string>) => void;
}

export function OverviewTab({
  user,
  orders,
  isLoadingOrders = false,
  onSelectTab,
}: OverviewTabProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/15 border border-zinc-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-foreground uppercase">
            <CheckCircle2 className="h-3 w-3 text-amber-500" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase">
            <Truck className="h-3 w-3 text-amber-500" />
            In Transit
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700 dark:text-rose-400 uppercase">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase">
            <Clock className="h-3 w-3" />
            Pending Verification
          </span>
        );
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase">
            <Clock className="h-3 w-3" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Profile Details Hero Card */}
      <OverviewProfileCard
        user={user}
        onEditProfile={() => onSelectTab("profile")}
      />

      {/* Latest Active Order Tracking */}
      {orders[0] && (
        <OverviewActiveOrderCard
          order={orders[0]}
          getStatusBadge={getStatusBadge}
          onSelectTab={onSelectTab}
          totalOrdersCount={orders.length}
        />
      )}

      {/* Primary Delivery Address & Saved Payment Method */}
      <OverviewQuickCardsGrid
        user={user}
        onSelectTab={onSelectTab}
      />
    </div>
  );
}
