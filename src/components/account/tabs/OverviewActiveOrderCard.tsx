"use client";

import React from "react";
import Link from "next/link";
import { Clock, Package, Truck, CheckCircle2, Check, ChevronRight } from "lucide-react";
import { AppImage } from "@/components/shared";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order.types";
import type { AccountTabKey } from "../accountNavData";

interface OverviewActiveOrderCardProps {
  order: Order;
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
  onSelectTab: (tab: AccountTabKey, extraParams?: Record<string, string>) => void;
  totalOrdersCount: number;
}

export function OverviewActiveOrderCard({
  order,
  getStatusBadge,
  onSelectTab,
  totalOrdersCount,
}: OverviewActiveOrderCardProps) {
  const statusMap: Record<OrderStatus, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1,
  };
  const currentStep = statusMap[order.status] ?? 1;

  const orderDate = new Date(order.createdAt);
  const placedTime = orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const packingDate = new Date(orderDate.getTime() + 4 * 3600 * 1000);
  const packingTime = packingDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const transitDate = new Date(orderDate.getTime() + 18 * 3600 * 1000);
  const transitTime = transitDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const steps = [
    {
      label: "Placed",
      icon: Clock,
      desc: "Confirmed",
      time: placedTime,
    },
    {
      label: "Packing",
      icon: Package,
      desc: "Quality Verified",
      time: currentStep >= 1 ? packingTime : "Pending",
    },
    {
      label: "In Transit",
      icon: Truck,
      desc: order.courierName || "Steadfast Courier",
      time:
        currentStep >= 2
          ? transitTime
          : currentStep === 1
          ? "Expected Today"
          : "Pending",
    },
    {
      label: "Delivered",
      icon: CheckCircle2,
      desc: "To Doorstep",
      time:
        order.status === "delivered"
          ? "Completed"
          : order.estimatedDelivery
          ? `Est. ${order.estimatedDelivery}`
          : "Est. 2-3 Days",
    },
  ];

  return (
    <div className="order-2 lg:order-1 rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-6.5 space-y-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
            <Package className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                Order #{order.orderNumber}
              </h3>
              <span className="text-xs text-muted-foreground">
                •{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} • Total:{" "}
              <strong className="text-foreground font-bold">
                ৳{order.total.toLocaleString()}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {getStatusBadge(order.status)}
          <button
            type="button"
            onClick={() => onSelectTab("tracking", { orderId: order.orderNumber })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-3.5 py-1.5 text-xs font-bold shadow-xs shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Track Live</span>
          </button>
        </div>
      </div>

      {/* Connected Chain / Progress Line */}
      <div className="py-2">
        {/* Desktop Horizontal Chain */}
        <div className="hidden sm:grid sm:grid-cols-4 items-start relative px-2">
          {steps.map((step, idx) => {
            const isComplete = currentStep > idx;
            const isCurrent = currentStep === idx;
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            const nextStepComplete = currentStep > idx;

            return (
              <div
                key={step.label}
                className="relative flex flex-col items-center text-center group cursor-default"
              >
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[calc(50%+22px)] right-[calc(-50%+22px)] top-5 h-[3px] -translate-y-1/2 z-0 pointer-events-none rounded-full transition-all duration-500",
                      nextStepComplete
                        ? "bg-gradient-to-r from-amber-500 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.35)]"
                        : "bg-muted/80 dark:bg-zinc-800/80"
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-20 flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
                    isCurrent
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_4px_20px_rgba(245,158,11,0.45)] ring-4 ring-amber-500/20 scale-110"
                      : isComplete
                      ? "bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 shadow-xs"
                      : "bg-muted/60 dark:bg-zinc-800/60 text-muted-foreground/60"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
                  {isComplete && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-xs ring-2 ring-card">
                      <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                    </span>
                  )}
                </div>

                <div className="mt-2.5 space-y-0.5">
                  <span
                    className={cn(
                      "text-xs font-bold block",
                      isCurrent
                        ? "text-amber-600 dark:text-amber-400 font-black"
                        : isComplete
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[110px]">
                    {step.desc}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-mono block",
                      isCurrent
                        ? "text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {step.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Chain */}
        <div className="sm:hidden space-y-0 relative pl-2">
          {steps.map((step, idx) => {
            const isComplete = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isLast = idx === steps.length - 1;
            const Icon = step.icon;

            return (
              <div key={step.label} className="relative flex items-start gap-3.5 pb-5 last:pb-1">
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[18px] top-9 w-[3px] -translate-x-1/2 bottom-0 rounded-full transition-colors duration-500",
                      isComplete
                        ? "bg-gradient-to-b from-amber-500 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.35)]"
                        : "bg-muted/80 dark:bg-zinc-800/80"
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                    isCurrent
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_4px_16px_rgba(245,158,11,0.45)] ring-4 ring-amber-500/20"
                      : isComplete
                      ? "bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 shadow-xs"
                      : "bg-muted/60 dark:bg-zinc-800/60 text-muted-foreground/60"
                  )}
                >
                  <Icon className="h-4 w-4 stroke-[2.2]" />
                  {isComplete && (
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-xs ring-2 ring-card">
                      <Check className="h-2 w-2 stroke-[3.5]" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isCurrent
                            ? "text-amber-600 dark:text-amber-400 font-black"
                            : isComplete
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                        {step.time}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md shrink-0",
                        isCurrent
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : isComplete
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {isCurrent ? "Active" : isComplete ? "Done" : `Step ${idx + 1}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items Preview Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden py-0.5">
            {order.items.slice(0, 3).map((item, i) => (
              <Link
                key={item.id || i}
                href={ROUTES.PRODUCT_DETAIL(item.productId)}
                className="relative h-8 w-8 rounded-xl border-2 border-background overflow-hidden bg-muted shadow-2xs shrink-0 hover:scale-110 hover:z-20 transition-transform block"
                title={item.productName}
              >
                <AppImage
                  src={item.productThumbnail}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  fallbackIconSize={14}
                />
              </Link>
            ))}
            {order.items.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-background bg-muted text-[10px] font-bold text-foreground shrink-0 shadow-2xs">
                +{order.items.length - 3}
              </div>
            )}
          </div>

          <div className="text-muted-foreground truncate">
            Courier:{" "}
            <strong className="text-foreground font-semibold">
              {order.courierName || "Steadfast Courier"}
            </strong>
            <span className="mx-1.5 text-border">•</span>
            <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[11px] text-foreground">
              {order.trackingNumber || "TRK-PENDING"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab("orders")}
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>View All Orders ({totalOrdersCount})</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
