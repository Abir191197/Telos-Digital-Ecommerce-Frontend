"use client";

import React from "react";
import Link from "next/link";
import { AppImage } from "@/components/shared";
import { ROUTES } from "@/constants";
import { Sparkles, Edit3, Package, Truck, MapPin, Check, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerUser } from "@/stores";
import type { Order, OrderStatus } from "@/types/order.types";
import type { AccountTabKey } from "../accountNavData";

interface OverviewTabProps {
  user: CustomerUser;
  orders: Order[];
  isLoadingOrders?: boolean;
  onSelectTab: (tab: AccountTabKey) => void;
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
      {/* Profile Details Hero Card on Overview */}
      <div className="order-1 rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card/95 to-amber-500/[0.04] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.2),0_8px_20px_-4px_rgba(245,158,11,0.12)] transition-shadow duration-300">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500/80 shadow-md shadow-amber-500/20 bg-muted/40">
            <AppImage
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
              fallbackIcon={<span className="font-bold text-lg text-amber-600">{user.name.charAt(0).toUpperCase()}</span>}
            />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                <span>Telos Gold Member</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.email} • {user.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab("profile")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 dark:border-white/10 bg-card/80 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-transparent text-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-amber-500" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Top Hero Card: Latest Active Order with Sleek Milestone Segments */}
      {orders[0] && (() => {
        const latestOrder = orders[0];
        const statusMap: Record<OrderStatus, number> = {
          pending: 0,
          processing: 1,
          shipped: 2,
          delivered: 3,
          cancelled: -1,
        };
        const currentStep = statusMap[latestOrder.status] ?? 1;

        // Formatted timestamp helpers
        const orderDate = new Date(latestOrder.createdAt);
        const placedTime = orderDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        // Computed approximate step times based on order timeline
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
            desc: latestOrder.courierName || "Steadfast Courier",
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
              latestOrder.status === "delivered"
                ? "Completed"
                : latestOrder.estimatedDelivery
                ? `Est. ${latestOrder.estimatedDelivery}`
                : "Est. 2-3 Days",
          },
        ];

        return (
          <div className="order-2 lg:order-1 rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-6.5 space-y-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
            {/* Top Row: Order Details & Live Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
                  <Package className="h-5 w-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                      Order #{latestOrder.orderNumber}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      •{" "}
                      {new Date(latestOrder.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {latestOrder.items.length} item{latestOrder.items.length > 1 ? "s" : ""} • Total:{" "}
                    <strong className="text-foreground font-bold">
                      ৳{latestOrder.total.toLocaleString()}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                {getStatusBadge(latestOrder.status)}
                <button
                  type="button"
                  onClick={() => onSelectTab("tracking")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-3.5 py-1.5 text-xs font-bold shadow-xs shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Truck className="h-3.5 w-3.5" />
                  <span>Track Live</span>
                </button>
              </div>
            </div>

            {/* Connected Chain / Progress Line: Vertical on mobile, Horizontal on desktop */}
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
                      {/* Segment connector strictly between this node and next node */}
                      {!isLast && (
                        <div
                          className={cn(
                            "absolute left-[calc(50%+24px)] right-[calc(-50%+24px)] top-5 h-0.5 -translate-y-1/2 z-0 pointer-events-none transition-all duration-300",
                            nextStepComplete ? "bg-amber-500" : "bg-border/60 dark:bg-zinc-800"
                          )}
                        />
                      )}

                      {/* Node Icon Circle: Solid background + z-20 */}
                      <div
                        className={cn(
                          "relative z-20 flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                          isCurrent
                            ? "bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-4 ring-amber-500/20 scale-110"
                            : isComplete
                            ? "bg-card bg-amber-500/20 border-amber-500 text-amber-500"
                            : "bg-card border-border/70 text-muted-foreground"
                        )}
                      >
                        {isComplete ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <Icon className="h-4 w-4 stroke-[2.2]" />
                        )}
                      </div>

                      {/* Text Details */}
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
                      {/* Vertical Connecting Line */}
                      {!isLast && (
                        <div
                          className={cn(
                            "absolute left-[17px] top-9 w-0.5 bottom-0 transition-colors duration-300",
                            isComplete ? "bg-amber-500" : "bg-border/60 dark:bg-zinc-800"
                          )}
                        />
                      )}

                      {/* Node Circle */}
                      <div
                        className={cn(
                          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300",
                          isCurrent
                            ? "bg-amber-500 border-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-500/25"
                            : isComplete
                            ? "bg-amber-500/20 border-amber-500 text-amber-500"
                            : "bg-card border-border/70 text-muted-foreground"
                        )}
                      >
                        {isComplete ? (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                          <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                        )}
                      </div>

                      {/* Step Labels */}
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

            {/* Items Preview Strip & Delivery Partner Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden py-0.5">
                  {latestOrder.items.slice(0, 3).map((item, i) => (
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
                  {latestOrder.items.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-background bg-muted text-[10px] font-bold text-foreground shrink-0 shadow-2xs">
                      +{latestOrder.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="text-muted-foreground truncate">
                  Courier:{" "}
                  <strong className="text-foreground font-semibold">
                    {latestOrder.courierName || "Steadfast Courier"}
                  </strong>
                  <span className="mx-1.5 text-border">•</span>
                  <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[11px] text-foreground">
                    {latestOrder.trackingNumber || "TRK-PENDING"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab("orders")}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>View All Orders ({orders.length})</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* 2-Column Responsive Grid on Large Screen: Primary Delivery Address + Saved Payment Methods */}
      <div className="order-3 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Address Book Snapshot */}
        <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Delivery Address
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("addresses")}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-1.5">
              {user.addresses[0] ? (
                <>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">
                      {user.addresses[0].name}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase">
                      {user.addresses[0].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {user.addresses[0].street}, {user.addresses[0].area},{" "}
                    {user.addresses[0].city} - {user.addresses[0].postalCode}
                  </p>
                  <p className="text-xs text-foreground font-mono font-medium">
                    Phone: {user.addresses[0].phone}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No default delivery address configured yet.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Courier Availability</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Steadfast & Pathao
            </span>
          </div>
        </div>

        {/* 2. Saved Payment Methods Snapshot */}
        <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Package className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Default Payment Method
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab("payments")}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-14 rounded-xl bg-white dark:bg-white/95 p-1 flex items-center justify-center border border-border/40 shadow-2xs shrink-0 overflow-hidden">
                    <AppImage
                      src="/images/payment-partners/bkash.png"
                      alt="bKash"
                      fill
                      className="object-contain p-1"
                      fallbackIconSize={16}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">bKash Personal</p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      017***-**678
                    </p>
                  </div>
                </div>
                <div className="h-6 w-6 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Default Checkout</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              1-Tap Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
