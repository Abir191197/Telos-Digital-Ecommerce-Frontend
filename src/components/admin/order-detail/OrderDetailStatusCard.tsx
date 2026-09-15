import React from "react";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderDetailStatusCardProps {
  order: Order;
  onStatusChange: (newStatus: OrderStatus) => void;
}

export function OrderDetailStatusCard({
  order,
  onStatusChange,
}: OrderDetailStatusCardProps) {
  return (
    <div className="rounded-3xl bg-card p-5 sm:p-6 admin-card border border-border/60 shadow-lg space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
        <CheckSquare className="h-4 w-4 text-emerald-500" />
        <h2 className="text-sm font-black text-foreground">Lifecycle Status</h2>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground">
          Select Status:
        </label>
        <select
          value={order.status}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
          className="h-11 w-full rounded-2xl bg-muted/50 border border-border/60 px-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="pending">Pending Verification</option>
          <option value="processing">Processing & QC Inspection</option>
          <option value="shipped">Handed to Courier (In Transit)</option>
          <option value="delivered">Delivered Successfully</option>
          <option value="cancelled">Cancelled & Refunded</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => onStatusChange("processing")}
          disabled={order.status === "processing"}
          className={cn(
            "py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
            order.status === "processing"
              ? "bg-amber-500/20 text-amber-600 opacity-60 cursor-not-allowed"
              : "bg-muted/70 text-foreground hover:bg-muted"
          )}
        >
          Mark Processing
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("shipped")}
          disabled={order.status === "shipped"}
          className={cn(
            "py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
            order.status === "shipped"
              ? "bg-blue-500/20 text-blue-600 opacity-60 cursor-not-allowed"
              : "bg-muted/70 text-foreground hover:bg-muted"
          )}
        >
          Mark Shipped
        </button>
      </div>
    </div>
  );
}
