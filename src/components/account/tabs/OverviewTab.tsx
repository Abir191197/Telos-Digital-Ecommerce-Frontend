"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Edit3, Package, Truck, MapPin, Check, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerUser } from "@/stores";
import type { Order, OrderStatus } from "@/types/order.types";
import type { AccountTabKey } from "../accountNavData";

interface OverviewTabProps {
  user: CustomerUser;
  orders: Order[];
  onSelectTab: (tab: AccountTabKey) => void;
}

export function OverviewTab({
  user,
  orders,
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
      <div className="order-1 rounded-3xl border border-border/80 dark:border-white/10 bg-gradient-to-br from-card via-card/95 to-amber-500/[0.03] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08),0_2px_10px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.65)] hover:border-amber-500/40 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500/80 shadow-md shadow-amber-500/20 bg-muted/40">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-black text-xl text-amber-600 bg-amber-500/10">
                {user.name.charAt(0)}
              </div>
            )}
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 dark:border-white/10 bg-card hover:bg-muted/80 text-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs hover:border-amber-500/30 transition-all cursor-pointer"
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

        const steps = [
          { label: "Placed", icon: Clock, desc: "Confirmed" },
          { label: "Packing", icon: Package, desc: "Quality Verified" },
          { label: "In Transit", icon: Truck, desc: latestOrder.courierName || "Courier" },
          { label: "Delivered", icon: CheckCircle2, desc: "To Doorstep" },
        ];

        return (
          <div className="order-2 lg:order-1 rounded-3xl border border-border/80 dark:border-white/10 bg-card p-5 sm:p-6.5 space-y-5 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08),0_2px_10px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.65)] hover:border-amber-500/30 transition-all">
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

            {/* 4-Stage Segmented Milestone Cards (Replaces plain cheap progress bar) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {steps.map((step, idx) => {
                const isComplete = currentStep > idx;
                const isCurrent = currentStep === idx;
                const Icon = step.icon;

                return (
                  <div
                    key={step.label}
                    className={cn(
                      "relative flex flex-col p-3 rounded-2xl border transition-all duration-300",
                      isCurrent
                        ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs ring-1 ring-amber-500/30"
                        : isComplete
                        ? "bg-muted/40 border-border/70 text-foreground"
                        : "bg-muted/15 border-border/40 opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-all",
                          isCurrent
                            ? "bg-amber-500 text-zinc-950 shadow-xs"
                            : isComplete
                            ? "bg-emerald-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isComplete ? (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                          <Icon className="h-3 w-3 stroke-[2.2]" />
                        )}
                      </div>

                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                          isCurrent
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                            : isComplete
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground/70"
                        )}
                      >
                        {isCurrent ? "Active" : isComplete ? "Done" : `Step ${idx + 1}`}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "text-xs font-extrabold tracking-tight truncate",
                        isCurrent
                          ? "text-amber-700 dark:text-amber-400"
                          : isComplete
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Items Preview Strip & Delivery Partner Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs">
              <div className="flex items-center gap-3">
                {/* Visual item thumbnails */}
                <div className="flex -space-x-2 overflow-hidden py-0.5">
                  {latestOrder.items.slice(0, 3).map((item, i) => (
                    <div
                      key={item.id || i}
                      className="relative h-8 w-8 rounded-xl border-2 border-background overflow-hidden bg-muted shadow-2xs shrink-0"
                      title={item.productName}
                    >
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
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
        <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08),0_2px_10px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.65)] hover:border-amber-500/30 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
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
        <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08),0_2px_10px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.65)] hover:border-amber-500/30 transition-colors">
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
                  <div className="h-8 w-12 rounded-lg bg-pink-500/15 flex items-center justify-center font-bold text-xs text-pink-600">
                    bKash
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
