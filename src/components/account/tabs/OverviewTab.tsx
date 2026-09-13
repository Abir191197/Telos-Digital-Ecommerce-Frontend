"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Edit3, Package, Truck, MapPin, Check, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
      <div className="order-1 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-muted/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-amber-500/30 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-sm bg-muted/40">
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
                <Sparkles className="h-2.5 w-2.5" />
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted/80 text-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-amber-500" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Top Hero Card: Latest Active Order with Real-Time Progress Stepper */}
      {orders[0] && (
        <div className="order-2 lg:order-1 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-xs hover:border-amber-500/30 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Package className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Latest Order: #{orders[0].orderNumber}
                  </h3>
                  <span className="hidden sm:inline-block text-xs text-muted-foreground">
                    •{" "}
                    {new Date(orders[0].createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {orders[0].items.length} item
                  {orders[0].items.length > 1 ? "s" : ""} • Total:{" "}
                  <strong className="text-foreground font-semibold">
                    ৳{orders[0].total.toLocaleString()}
                  </strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {getStatusBadge(orders[0].status)}
              <button
                type="button"
                onClick={() => onSelectTab("tracking")}
                className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Track Live</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-2 px-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pb-2">
              <span className="text-amber-600 dark:text-amber-400">Order Placed</span>
              <span
                className={
                  orders[0].status !== "pending"
                    ? "text-amber-600 dark:text-amber-400"
                    : ""
                }
              >
                Processing
              </span>
              <span
                className={
                  orders[0].status === "shipped" ||
                  orders[0].status === "delivered"
                    ? "text-amber-600 dark:text-amber-400"
                    : ""
                }
              >
                In Transit
              </span>
              <span
                className={
                  orders[0].status === "delivered"
                    ? "text-amber-600 dark:text-amber-400"
                    : ""
                }
              >
                Delivered
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{
                  width:
                    orders[0].status === "delivered"
                      ? "100%"
                      : orders[0].status === "shipped"
                      ? "75%"
                      : orders[0].status === "processing"
                      ? "45%"
                      : "15%",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Delivery Partner:</span>
              <strong className="text-foreground font-semibold">
                {orders[0].courierName}
              </strong>
              <span className="font-mono bg-muted/60 px-2 py-0.5 rounded-md text-[11px] text-foreground">
                {orders[0].trackingNumber}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("orders")}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer self-start sm:self-auto"
            >
              <span>View All Orders ({orders.length})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Grid on Large Screen: Primary Delivery Address + Saved Payment Methods */}
      <div className="order-3 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Address Book Snapshot */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-amber-500/30 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
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
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-amber-500/30 transition-colors">
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
