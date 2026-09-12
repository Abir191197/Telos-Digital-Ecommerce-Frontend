import React from "react";
import { Order, OrderStatus } from "@/types/order.types";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  Building,
  Calendar,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackingTimelineProps {
  order: Order;
}

export function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStepState = (stepIndex: number, currentStatus: OrderStatus) => {
    const statusMap: Record<OrderStatus, number> = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1,
    };

    const currentRank = statusMap[currentStatus];
    if (currentStatus === "cancelled") {
      return { isComplete: false, isCurrent: false, isCancelled: true };
    }
    return {
      isComplete: currentRank > stepIndex,
      isCurrent: currentRank === stepIndex,
      isCancelled: false,
    };
  };

  const milestones = [
    {
      title: "Order Placed",
      desc: "Received & Logged in Telos System",
      time: new Date(order.createdAt).toLocaleDateString("en-BD", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon: Clock,
    },
    {
      title: "Quality Check & Packed",
      desc: "Authentic seal verified, IMEI scanned",
      time: order.status !== "pending" ? "Same Day Verified" : "Pending",
      icon: ShieldCheck,
    },
    {
      title: "Handed to Courier",
      desc: `${order.courierName || "Steadfast Courier"} Sorting Hub`,
      time: ["shipped", "delivered"].includes(order.status) ? "In Transit" : "Awaiting Dispatch",
      icon: Truck,
    },
    {
      title: "Delivered to Doorstep",
      desc: `Receiver: ${order.shippingAddress.name} (${order.shippingAddress.zone === "inside-dhaka" ? "Dhaka" : "Outside Dhaka"})`,
      time: order.status === "delivered" ? "Completed" : order.estimatedDelivery || "Next 24-48h",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-7">
      {/* Top Banner: Status & Tracking Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              #{order.orderNumber}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground mt-1 tracking-tight">
            {order.status === "delivered"
              ? "Package Delivered Successfully"
              : order.status === "shipped"
              ? "Package is On The Way"
              : order.status === "processing"
              ? "Processing & Warranty Verification"
              : "Order Received & Queued"}
          </h3>
        </div>

        {/* Courier & Tracking Copy Pill */}
        {order.trackingNumber && (
          <div className="flex items-center gap-2.5 bg-muted/40 p-2 sm:px-3 rounded-2xl border border-border/70 text-xs self-start sm:self-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                {order.courierName || "Courier Parcel"}
              </span>
              <span className="font-mono font-black text-foreground text-xs sm:text-sm">
                {order.trackingNumber}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyTracking}
              className="p-2 rounded-xl hover:bg-background text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              title="Copy tracking number"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500 stroke-[3]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Stepper Bar & Milestones */}
      <div className="relative pt-2">
        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-4">
          {milestones.map((milestone, idx) => {
            const { isComplete, isCurrent } = getStepState(idx, order.status);
            const Icon = milestone.icon;

            return (
              <div key={milestone.title} className="relative flex sm:flex-col items-start gap-4 sm:gap-3">
                {/* Horizontal connect line for desktop */}
                {idx < milestones.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block absolute top-5 left-10 right-0 h-0.5 -z-0 transition-colors",
                      isComplete ? "bg-emerald-500" : "bg-border/70"
                    )}
                  />
                )}

                {/* Step Circle Node */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-xs shadow-xs transition-all",
                    isComplete && "bg-emerald-500 text-white shadow-emerald-500/20 shadow-md",
                    isCurrent && "bg-amber-500 text-zinc-950 font-black shadow-amber-500/25 shadow-lg ring-4 ring-amber-500/20",
                    !isComplete && !isCurrent && "bg-muted text-muted-foreground border border-border/80"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
                </div>

                {/* Milestone Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "text-xs sm:text-sm font-black tracking-tight",
                        isCurrent ? "text-amber-600 dark:text-amber-400" : isComplete ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {milestone.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                    {milestone.desc}
                  </p>
                  <span className="inline-block text-[10px] font-mono font-semibold text-muted-foreground/80 mt-1">
                    {milestone.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch note banner */}
      <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Estimated Delivery Window:</span>
          <span className="font-bold text-foreground">
            {order.estimatedDelivery || "Within 24–48 Hours"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Delivery Partner:</span>
          <span className="font-bold text-foreground">
            {order.courierName || "Telos Express Delivery"}
          </span>
        </div>
      </div>
    </div>
  );
}
