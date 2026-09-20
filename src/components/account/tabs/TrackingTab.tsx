"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order.types";

interface TrackingTabProps {
  orders: Order[];
}

export function TrackingTab({ orders }: TrackingTabProps) {
  const searchParams = useSearchParams();
  const paramOrderId = searchParams.get("orderId");

  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Active tracking order: Prioritize search param, then user-selected or active order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (paramOrderId) {
      const match = orders.find(
        (o) => o.id === paramOrderId || o.orderNumber === paramOrderId
      );
      if (match) return match;
    }
    // Default to latest active order (processing/shipped), or first order
    return orders.find((o) => o.status === "shipped" || o.status === "processing") || orders[0] || null;
  });

  useEffect(() => {
    if (paramOrderId) {
      const match = orders.find(
        (o) => o.id === paramOrderId || o.orderNumber === paramOrderId
      );
      if (match) setSelectedOrder(match);
    }
  }, [paramOrderId, orders]);

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return;

    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(clean) ||
        o.id.toLowerCase().includes(clean) ||
        o.trackingNumber?.toLowerCase().includes(clean) ||
        o.shippingAddress?.phone?.replace(/\D/g, "").includes(clean.replace(/\D/g, ""))
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`No order found matching "${searchQuery}". Please check your order or tracking number.`);
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

  const milestones = selectedOrder
    ? [
        {
          title: "Order Placed",
          desc: "Received & logged in Telos BD dispatch system",
          time: new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          icon: Clock,
        },
        {
          title: "QC & Sealed",
          desc: "Authenticity checked & packaged with tamper proof seal",
          time: selectedOrder.status !== "pending" ? "Same Day Verified" : "Pending",
          icon: ShieldCheck,
        },
        {
          title: "In Transit",
          desc: `${selectedOrder.courierName || "Courier"} Sorting Hub dispatch`,
          time: ["shipped", "delivered"].includes(selectedOrder.status)
            ? "Dispatched"
            : "Awaiting Courier Pickup",
          icon: Truck,
        },
        {
          title: "Delivered",
          desc: `Doorstep delivery to ${selectedOrder.shippingAddress.area || "Destination"}`,
          time:
            selectedOrder.status === "delivered"
              ? "Completed"
              : selectedOrder.estimatedDelivery
              ? `Est. ${selectedOrder.estimatedDelivery}`
              : "Next 24-48 Hours",
          icon: CheckCircle2,
        },
      ]
    : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── 1. Clean Header + Live Search Bar ── */}
      <div className="border-b border-border/50 pb-4 space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Live Courier Tracking
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time delivery progress with Pathao, Steadfast, and RedX logistics across Bangladesh.
          </p>
        </div>

        {/* Live Search Form - Full Width */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order # (e.g. 1001) or Courier Tracking # (e.g. STE-...)"
            className="h-11 w-full rounded-2xl border border-border/80 bg-card pl-10 pr-24 text-xs sm:text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none shadow-xs"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-4 py-1.5 text-xs font-bold shadow-xs shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>


      {/* ── 3. Active Order Milestones Radar Card ── */}
      {!selectedOrder ? (
        <div className="py-16 px-6 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
            <Truck className="h-6 w-6 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-bold text-foreground">No Order Selected</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Enter an order number above or select from your recent purchases to view live courier status.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-7 space-y-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
          {/* Header Row: Order ID, Date, Total & Courier Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm sm:text-base text-foreground">
                  Order #{selectedOrder.orderNumber}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Destination: <strong className="text-foreground font-semibold">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}</strong>
              </p>
            </div>

            {/* Courier Tracking Pill */}
            {selectedOrder.trackingNumber && (
              <div className="flex items-center gap-2.5 bg-muted/30 dark:bg-muted/40 px-3 py-2 rounded-2xl border border-border/60 self-start sm:self-auto">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {selectedOrder.courierName || "Courier"} Tracking
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-foreground">
                    {selectedOrder.trackingNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(selectedOrder.trackingNumber!)}
                  className="p-1.5 rounded-xl hover:bg-background text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  title="Copy tracking code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500 stroke-[3]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Connected Progress Chain Timeline (Responsive) */}
          <div className="py-2">
            {/* Desktop Horizontal Chain with separate inter-node connectors */}
            <div className="hidden sm:grid sm:grid-cols-4 items-start relative px-2">
              {milestones.map((step, idx) => {
                const { isComplete, isCurrent } = getStepState(idx, selectedOrder.status);
                const Icon = step.icon;
                const isLast = idx === milestones.length - 1;
                const nextStepComplete = idx + 1 <= (selectedOrder.status === "delivered" ? 3 : selectedOrder.status === "shipped" ? 2 : selectedOrder.status === "processing" ? 1 : 0);

                // Stage semantic accents
                const stageTheme =
                  idx === 0
                    ? { activeBorder: "border-blue-500", activeBg: "bg-blue-500", activeText: "text-blue-600 dark:text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]", doneBg: "bg-blue-500/15 border-blue-500 text-blue-500" }
                    : idx === 1
                    ? { activeBorder: "border-purple-500", activeBg: "bg-purple-500", activeText: "text-purple-600 dark:text-purple-400", glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]", doneBg: "bg-purple-500/15 border-purple-500 text-purple-500" }
                    : idx === 2
                    ? { activeBorder: "border-amber-500", activeBg: "bg-amber-500", activeText: "text-amber-600 dark:text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]", doneBg: "bg-amber-500/15 border-amber-500 text-amber-500" }
                    : { activeBorder: "border-emerald-500", activeBg: "bg-emerald-500", activeText: "text-emerald-600 dark:text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]", doneBg: "bg-emerald-500/15 border-emerald-500 text-emerald-500" };

                return (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    {/* Segment connector strictly between this node and next node */}
                    {!isLast && (
                      <div
                        className={cn(
                          "absolute left-[calc(50%+24px)] right-[calc(-50%+24px)] top-5 h-0.5 -translate-y-1/2 z-0 pointer-events-none transition-all duration-300",
                          nextStepComplete ? "bg-amber-500" : "bg-border/60 dark:bg-zinc-800"
                        )}
                      />
                    )}

                    {/* Node Icon Circle: Solid background + z-20 so line NEVER shows over or inside icon */}
                    <div
                      className={cn(
                        "relative z-20 flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                        isCurrent
                          ? `${stageTheme.activeBg} ${stageTheme.activeBorder} text-zinc-950 ${stageTheme.glow} ring-4 ring-amber-500/20 scale-110`
                          : isComplete
                          ? `bg-card ${stageTheme.doneBg}`
                          : "bg-card border-border/70 text-muted-foreground"
                      )}
                    >
                      {isComplete ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <Icon className="h-4 w-4 stroke-[2.2]" />
                      )}
                    </div>

                    <div className="mt-2.5 space-y-0.5 relative z-10 px-1">
                      <span
                        className={cn(
                          "text-xs font-bold block",
                          isCurrent ? `${stageTheme.activeText} font-black` : isComplete ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground block max-w-[120px] mx-auto">
                        {step.desc}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/80 block">
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Chain */}
            <div className="sm:hidden space-y-4 relative pl-3">
              {milestones.map((step, idx) => {
                const { isComplete, isCurrent } = getStepState(idx, selectedOrder.status);
                const Icon = step.icon;
                const isLast = idx === milestones.length - 1;
                const nextStepComplete = idx + 1 <= (selectedOrder.status === "delivered" ? 3 : selectedOrder.status === "shipped" ? 2 : selectedOrder.status === "processing" ? 1 : 0);

                const stageTheme =
                  idx === 0
                    ? { activeBg: "bg-blue-500 text-zinc-950", activeText: "text-blue-600 dark:text-blue-400", doneBg: "bg-blue-500/15 border-blue-500 text-blue-500" }
                    : idx === 1
                    ? { activeBg: "bg-purple-500 text-zinc-950", activeText: "text-purple-600 dark:text-purple-400", doneBg: "bg-purple-500/15 border-purple-500 text-purple-500" }
                    : idx === 2
                    ? { activeBg: "bg-amber-500 text-zinc-950", activeText: "text-amber-600 dark:text-amber-400", doneBg: "bg-amber-500/15 border-amber-500 text-amber-500" }
                    : { activeBg: "bg-emerald-500 text-zinc-950", activeText: "text-emerald-600 dark:text-emerald-400", doneBg: "bg-emerald-500/15 border-emerald-500 text-emerald-500" };

                return (
                  <div key={step.title} className="relative flex items-start gap-3.5">
                    {/* Vertical connector line segment */}
                    {!isLast && (
                      <div
                        className={cn(
                          "absolute left-4.5 top-9 bottom-[-16px] w-0.5 z-0 transition-colors duration-300",
                          nextStepComplete ? "bg-amber-500" : "bg-border/60 dark:bg-zinc-800"
                        )}
                      />
                    )}

                    <div
                      className={cn(
                        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
                        isCurrent
                          ? `${stageTheme.activeBg} border-amber-400 shadow-md ring-2 ring-amber-500/20`
                          : isComplete
                          ? stageTheme.doneBg
                          : "bg-card border-border/70 text-muted-foreground"
                      )}
                    >
                      {isComplete ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4 stroke-[2]" />}
                    </div>
                    <div className="flex-1 space-y-0.5 pt-0.5">
                      <span className={cn("text-xs font-bold block", isCurrent ? `${stageTheme.activeText} font-black` : "text-foreground")}>
                        {step.title}
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {step.desc}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground block">
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Items Preview Strip in this tracked parcel ── */}
          <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">
                Parcel contents ({selectedOrder.items.length} item{selectedOrder.items.length > 1 ? "s" : ""}):
              </span>
              <span className="font-semibold text-foreground truncate max-w-xs">
                {selectedOrder.items.map((it) => it.productName).join(", ")}
              </span>
            </div>

            <div className="text-right sm:text-left text-xs font-bold text-foreground">
              Total: ৳{selectedOrder.total.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
