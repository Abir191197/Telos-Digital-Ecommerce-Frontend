"use client";

import React, { useState } from "react";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order.types";
import { OrderTrackingTimeline } from "../OrderTrackingTimeline";

interface TrackingTabProps {
  orders: Order[];
}

export function TrackingTab({ orders }: TrackingTabProps) {
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(
    orders[0]?.id || null
  );

  const currentOrder =
    orders.find((o) => o.id === selectedTrackingId) || orders[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Live Courier Tracking
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time parcel dispatch radar across Bangladesh (Pathao & Steadfast logistics).
          </p>
        </div>

        {/* Switch order pills if multiple orders exist */}
        {orders.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-background/80 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs">
            {orders.map((o) => {
              const isSelected =
                (selectedTrackingId
                  ? selectedTrackingId === o.id
                  : orders[0]?.id === o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedTrackingId(o.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0",
                    isSelected
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  #{o.orderNumber}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Selected Order Timeline */}
      {!currentOrder ? (
        <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
            <Truck className="h-6 w-6 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-bold text-foreground">No active orders to track</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Once you place an order, live shipping status and courier rider milestones will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <OrderTrackingTimeline order={currentOrder} />
        </div>
      )}
    </div>
  );
}
