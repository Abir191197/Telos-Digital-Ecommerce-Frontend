"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types/order.types";
import {
  CheckCircle2,
  Clock,
  Truck,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { useGetRecentOrdersQuery } from "@/services/api/dashboard/dashboardApi";
import {
  DashboardDateFilter,
  DateFilterValue,
} from "./DashboardDateFilter";

interface RecentOrdersFeedProps {
  orders?: Order[];
}

export function RecentOrdersFeed({ orders: initialOrders }: RecentOrdersFeedProps) {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({
    preset: "all_time",
  });

  const { data: response, isLoading } = useGetRecentOrdersQuery({
    dateRange: dateFilter.preset,
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    limit: 6,
  });

  const orders: Order[] =
    response?.data && response.data.length >= 0
      ? (response.data as any)
      : (initialOrders ?? []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      case "pending":
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <Clock className="h-3 w-3" />
            Active
          </span>
        );
    }
  };

  const getMethodIcon = (method: string) => {
    const m = (method || "").toLowerCase();
    if (m.includes("bkash") || m.includes("nagad")) return Smartphone;
    if (m.includes("card") || m.includes("visa")) return CreditCard;
    return Banknote;
  };

  const totalSettled = orders.reduce((sum, o) => sum + o.total, 0);
  const activeCount = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6 border-none admin-card flex flex-col justify-between h-full gap-4">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Header & Metrics Section */}
      <div>
        {/* Header Bar with Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Recent Orders
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live store transactions &amp; dispatch tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Date Filter Dropdown */}
            <DashboardDateFilter
              value={dateFilter}
              onChange={setDateFilter}
            />

            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-foreground hover:underline flex items-center gap-1 shrink-0"
            >
              <span>All Orders</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Metrics Quick Strip (Fills top of card) */}
        <div className="grid grid-cols-3 gap-2 pt-3 pb-2">
          <div className="p-2 rounded-xl bg-muted/30 border border-border/20 flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase">Filtered Volume</span>
            <span className="font-mono font-bold text-xs text-foreground mt-0.5">৳{totalSettled.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/30 border border-border/20 flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase">In-Queue</span>
            <span className="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">{activeCount} Orders</span>
          </div>
          <div className="p-2 rounded-xl bg-muted/30 border border-border/20 flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase">Delivered</span>
            <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{deliveredCount} Fulfilled</span>
          </div>
        </div>

        {/* Orders Table / Cards */}
        {orders.length === 0 ? (
          /* Empty State that completely fills the card */
          <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl space-y-2 my-2 border border-dashed border-border/60">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="font-bold text-sm text-foreground">No Orders in Selected Period</p>
            <p className="text-xs">Select another date filter or wait for upcoming customer checkouts.</p>
          </div>
        ) : (
          <>
            {/* Mobile Layout (< 640px) */}
            <div className="space-y-2.5 sm:hidden pt-1">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-muted/30 border border-border/20 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <Link
                      href={`/dashboard/orders/${order.orderNumber}`}
                      className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      #{order.orderNumber}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Link>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-foreground">
                        {order.shippingAddress?.name || "Customer"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {order.shippingAddress?.city || "Dhaka"} &bull; {order.paymentMethod?.toUpperCase() || "COD"}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-sm text-foreground">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto pt-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/40 text-[10px] font-bold uppercase text-muted-foreground">
                    <th className="py-2 px-2">Order #</th>
                    <th className="py-2 px-2">Customer &amp; Zone</th>
                    <th className="py-2 px-2">Amount</th>
                    <th className="py-2 px-2">Payment</th>
                    <th className="py-2 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {orders.slice(0, 5).map((order) => {
                    const MethodIcon = getMethodIcon(order.paymentMethod);
                    const initial = (order.shippingAddress?.name || "C").charAt(0).toUpperCase();

                    return (
                      <tr key={order.id} className="hover:bg-muted/40 transition-colors group/row">
                        <td className="py-2.5 px-2">
                          <Link
                            href={`/dashboard/orders/${order.orderNumber}`}
                            className="font-mono font-bold text-foreground group-hover/row:text-primary transition-colors flex items-center gap-1"
                          >
                            <span>#{order.orderNumber}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                          </Link>
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate leading-snug">
                                {order.shippingAddress?.name || "Customer"}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {order.shippingAddress?.city || "Dhaka"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 font-mono font-bold text-foreground">
                          ৳{order.total.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase text-muted-foreground">
                            <MethodIcon className="h-3 w-3" />
                            <span>{order.paymentMethod || "COD"}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right">{getStatusBadge(order.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Seamless Filler Slot: When fewer than 5 orders exist, fills the space with live polling beacon */}
            {orders.length < 5 && (
              <div className="mt-2.5 p-3 rounded-xl border border-dashed border-border/70 bg-muted/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Listening for incoming checkout orders... Real-time webhook active
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                  Auto-sync
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Card Footer: Always Fills Bottom of Card */}
      <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Fulfillment via Telos Express BD &amp; Steadfast Courier</span>
        </div>
        <Link
          href="/dashboard/orders?status=pending"
          className="text-xs font-bold text-primary hover:underline"
        >
          Dispatch Queue &rarr;
        </Link>
      </div>
    </div>
  );
}
