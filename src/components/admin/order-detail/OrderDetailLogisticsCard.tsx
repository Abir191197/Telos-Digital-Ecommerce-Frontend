import React from "react";
import { Truck, Send } from "lucide-react";
import { Order } from "@/types/order.types";

interface OrderDetailLogisticsCardProps {
  order: Order;
  courierNameInput: string;
  setCourierNameInput: (val: string) => void;
  trackingNumberInput: string;
  setTrackingNumberInput: (val: string) => void;
  onAssignTracking: (e: React.FormEvent) => void;
}

export function OrderDetailLogisticsCard({
  order,
  courierNameInput,
  setCourierNameInput,
  trackingNumberInput,
  setTrackingNumberInput,
  onAssignTracking,
}: OrderDetailLogisticsCardProps) {
  return (
    <div className="rounded-3xl bg-card p-5 sm:p-7 admin-card border border-border/60 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              Logistics & Courier Assignment
            </h2>
            <p className="text-xs text-muted-foreground">
              Consignment tracking and delivery carrier dispatch
            </p>
          </div>
        </div>
        {order.courierName ? (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
            Dispatched
          </span>
        ) : (
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
            Awaiting Courier
          </span>
        )}
      </div>

      {order.courierName ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Courier Partner
            </span>
            <strong className="text-foreground font-bold text-sm mt-0.5 block">
              {order.courierName}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Tracking / Consignment
            </span>
            <strong className="text-foreground font-mono font-black text-sm mt-0.5 block">
              {order.trackingNumber}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              Est. Delivery
            </span>
            <span className="text-foreground font-semibold text-sm mt-0.5 block">
              {order.estimatedDelivery || "1-3 Business Days"}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No courier has been assigned yet. Assign Steadfast, Pathao, or RedX with
          consignment code.
        </p>
      )}

      {/* Quick Courier Assignment Form */}
      <form onSubmit={onAssignTracking} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Courier Partner
            </label>
            <select
              value={courierNameInput}
              onChange={(e) => setCourierNameInput(e.target.value)}
              className="h-11 w-full rounded-2xl bg-muted/50 border border-border/60 px-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="Steadfast Courier">Steadfast Courier (API)</option>
              <option value="Pathao Courier">Pathao Courier</option>
              <option value="RedX Logistics">RedX Logistics</option>
              <option value="eCourier">eCourier Bangladesh</option>
              <option value="Paperfly">Paperfly Home Delivery</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Consignment / Tracking #
            </label>
            <input
              type="text"
              required
              placeholder="e.g. STE-94281"
              value={trackingNumberInput}
              onChange={(e) => setTrackingNumberInput(e.target.value)}
              className="h-11 w-full rounded-2xl bg-muted/50 border border-border/60 px-3.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>Save & Assign Courier</span>
        </button>
      </form>
    </div>
  );
}
