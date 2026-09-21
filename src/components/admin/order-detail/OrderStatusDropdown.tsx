import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderStatusDropdownProps {
  order: Order;
  onStatusChange: (newStatus: OrderStatus) => void;
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
}

const STATUS_ITEMS = [
  { value: "pending", label: "Confirmed / Pending", icon: CheckCircle2, color: "text-zinc-400" },
  { value: "processing", label: "Processing", icon: Clock, color: "text-amber-500" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-blue-500" },
  { value: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-emerald-500" },
  { value: "cancelled", label: "Cancelled", icon: AlertCircle, color: "text-rose-500" },
] as const;

export function OrderStatusDropdown({
  order,
  onStatusChange,
  getStatusBadge,
}: OrderStatusDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-3 sm:p-4 rounded-2xl border border-border/60">
      <div className="flex items-center gap-3">
        <span className="text-xs font-black uppercase tracking-wider text-foreground">
          Order Lifecycle Status:
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="h-9 px-3 rounded-xl bg-card border border-border/70 hover:border-amber-500/50 text-xs font-bold text-foreground transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <span className="flex items-center gap-1.5 font-bold">
              {getStatusBadge(order.status)}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                open && "rotate-180 text-foreground"
              )}
            />
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 z-50 w-56 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Change Status
                </p>
                {STATUS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = order.status === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        onStatusChange(item.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer",
                        isCurrent
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-3.5 w-3.5", item.color)} />
                        <span>{item.label}</span>
                      </div>
                      {isCurrent && (
                        <Check className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Payment:</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
            order.paymentStatus === "paid"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          )}
        >
          {order.paymentStatus}
        </span>
      </div>
    </div>
  );
}
