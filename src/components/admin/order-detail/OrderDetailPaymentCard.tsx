import React from "react";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";

interface OrderDetailPaymentCardProps {
  order: Order;
}

export function OrderDetailPaymentCard({ order }: OrderDetailPaymentCardProps) {
  return (
    <div className="rounded-3xl bg-card p-5 sm:p-6 admin-card border border-border/60 shadow-lg space-y-3.5">
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
        <CreditCard className="h-4 w-4 text-emerald-500" />
        <h2 className="text-sm font-black text-foreground">
          Payment Verification
        </h2>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Payment Method</span>
          <strong className="text-foreground uppercase font-mono font-bold">
            {order.paymentMethod}
          </strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Payment Status</span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
              order.paymentStatus === "paid"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            )}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
