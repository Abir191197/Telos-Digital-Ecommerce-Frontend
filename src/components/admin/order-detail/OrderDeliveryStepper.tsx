import React from "react";
import { CheckCircle2, Clock, Truck, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderDeliveryStepperProps {
  order: Order;
  onReopenOrder?: () => void;
}

export function OrderDeliveryStepper({ order, onReopenOrder }: OrderDeliveryStepperProps) {
  const steps = [
    {
      key: "pending" as const,
      label: "Confirmed",
      time: new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      desc: "Order accepted and queued for fulfillment.",
      icon: CheckCircle2,
    },
    {
      key: "processing" as const,
      label: "Processing",
      time:
        order.status === "processing" ||
        order.status === "shipped" ||
        order.status === "delivered"
          ? "In Progress"
          : "Not set",
      desc: "Warehouse team prepares and inspects ordered pieces.",
      icon: Clock,
    },
    {
      key: "shipped" as const,
      label: "Shipped",
      time:
        order.status === "shipped" || order.status === "delivered"
          ? order.courierName
            ? `${order.courierName} dispatched`
            : "Dispatched"
          : "Not set",
      desc: "Courier shipment created and moving to destination.",
      icon: Truck,
    },
    {
      key: "delivered" as const,
      label: "Delivered",
      time:
        order.status === "delivered"
          ? "Completed"
          : order.estimatedDelivery || "Not set",
      desc: "Shipment successfully handed over to customer.",
      icon: CheckCircle2,
    },
  ];

  const statusOrder: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];
  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <div className="mt-4 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
            <Truck className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            Delivery Progress
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Auto-synced with order status
        </span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCurrent = order.status === step.key;
            const isCompleted = currentIdx >= idx && order.status !== "cancelled";
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className={cn(
                  "text-left p-3.5 rounded-xl border relative overflow-hidden flex flex-col justify-between gap-3 select-none transition-colors",
                  isCurrent
                    ? "bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/10"
                    : isCompleted
                    ? "bg-card/90 border-border/80"
                    : "bg-background/40 border-border/40 opacity-70"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl",
                      isCurrent
                        ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30"
                        : isCompleted
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                      Current
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span>Done</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground/70">
                      Step {idx + 1}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4
                    className={cn(
                      "text-sm font-black",
                      isCurrent
                        ? "text-amber-500"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    {step.time}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 leading-snug line-clamp-2 pt-0.5">
                    {step.desc}
                  </p>
                </div>

                {isCurrent && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                )}
              </div>
            );
          })}
        </div>

        {order.status === "cancelled" && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-600 dark:text-rose-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-bold">
                This order has been cancelled and refunded.
              </span>
            </div>
            {onReopenOrder && (
              <button
                type="button"
                onClick={onReopenOrder}
                className="px-2.5 py-1 rounded-lg bg-background border border-rose-500/40 text-foreground text-[11px] font-bold hover:bg-muted cursor-pointer"
              >
                Re-open as Confirmed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
