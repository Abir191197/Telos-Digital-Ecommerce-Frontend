"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/stores";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { OrderStatus } from "@/types/order.types";

export function DashboardOverview() {
  const { orders, products, customers, transactions, updateOrderStatus } =
    useAdminStore();
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "all">("7d");

  // Calculations
  const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;
  const avgOrderValue = totalOrders > 0 ? Math.round(grossRevenue / totalOrders) : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 4);

  const kpis = [
    {
      title: "Total Revenue (BDT)",
      value: `৳${grossRevenue.toLocaleString()}`,
      change: "+18.4%",
      isPositive: true,
      subtext: "vs previous 7 days",
      icon: DollarSign,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Completed Orders",
      value: totalOrders.toString(),
      change: "+12.2%",
      isPositive: true,
      subtext: "94% fulfillment rate",
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Average Order Value",
      value: `৳${avgOrderValue.toLocaleString()}`,
      change: "+6.8%",
      isPositive: true,
      subtext: "Bangladeshi cart average",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pending Dispatch",
      value: pendingOrders.toString(),
      change: pendingOrders > 0 ? "Requires Action" : "All Clear",
      isPositive: pendingOrders === 0,
      subtext: "Steadfast & Pathao queue",
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  // Simulated daily sales trend for chart
  const salesTrend = [
    { day: "Mon", revenue: 42000, orders: 4 },
    { day: "Tue", revenue: 68000, orders: 7 },
    { day: "Wed", revenue: 54000, orders: 5 },
    { day: "Thu", revenue: 92000, orders: 9 },
    { day: "Fri", revenue: 145000, orders: 14 },
    { day: "Sat", revenue: 180000, orders: 18 },
    { day: "Sun", revenue: 125000, orders: 11 },
  ];

  const maxRev = Math.max(...salesTrend.map((s) => s.revenue));

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-extrabold uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 px-2 py-0.5 text-[10px] font-extrabold uppercase">
            Cancelled
          </span>
        );
      case "pending":
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-extrabold uppercase">
            <Clock className="h-3 w-3" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header Title & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Store Performance & Analytics
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time snapshot of sales, inventory, and nationwide logistics in Bangladesh.
          </p>
        </div>

        {/* Time period filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/80 text-xs font-bold self-start sm:self-auto">
          {(
            [
              { key: "today", label: "Today" },
              { key: "7d", label: "Last 7 Days" },
              { key: "30d", label: "30 Days" },
              { key: "all", label: "All Time" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTimeRange(t.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                timeRange === t.key
                  ? "bg-background text-foreground shadow-2xs font-extrabold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Metrics Cards (Mobile 2x2, Desktop 4x1) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 shadow-xs hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                {kpi.title}
              </span>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-2xl", kpi.bg, kpi.color)}>
                <kpi.icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {kpi.value}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span
                  className={cn(
                    "font-bold flex items-center",
                    kpi.isPositive ? "text-emerald-600" : "text-amber-600"
                  )}
                >
                  {kpi.change}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sales Curve Chart + Payment Methods Share ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Histogram */}
        <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-foreground">
                Weekly Revenue Trend (BDT)
              </h3>
              <p className="text-xs text-muted-foreground">
                Daily online payment & COD distribution
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              ৳605,000 Total
            </span>
          </div>

          {/* Bar / Column Chart Visual */}
          <div className="h-48 pt-4 flex items-end justify-between gap-2 sm:gap-4 border-b border-border/60 pb-3">
            {salesTrend.map((st) => {
              const heightPct = Math.max(15, Math.round((st.revenue / maxRev) * 100));
              return (
                <div
                  key={st.day}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-foreground">
                    ৳{Math.round(st.revenue / 1000)}k
                  </div>
                  <div className="w-full max-w-[40px] bg-muted/50 rounded-xl overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-xl transition-all duration-500 group-hover:from-amber-600 group-hover:to-amber-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {st.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>Peak Day: Saturday (Dhaka weekend volume)</span>
            <span className="text-emerald-600 font-semibold">+22% Weekend Surge</span>
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-foreground">
            Payment Method Split
          </h3>
          <p className="text-xs text-muted-foreground">
            Customer payment choices across BD
          </p>

          <div className="space-y-3 pt-2">
            {[
              { name: "bKash Digital MFS", pct: 48, amount: "৳290,400", color: "bg-pink-500" },
              { name: "Cash on Delivery (COD)", pct: 32, amount: "৳193,600", color: "bg-amber-500" },
              { name: "Nagad Post Office", pct: 12, amount: "৳72,600", color: "bg-orange-500" },
              { name: "Credit/Debit Cards (SSL)", pct: 8, amount: "৳48,400", color: "bg-blue-500" },
            ].map((p) => (
              <div key={p.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="font-mono font-bold text-foreground">{p.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", p.color)}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-700 dark:text-amber-300 leading-snug mt-2">
            Cashless payments (bKash + Nagad + Card) represent <strong>68%</strong> of gross revenue.
          </div>
        </div>
      </div>

      {/* ── Recent Orders Stream & Low Stock Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-sm font-black text-foreground">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-muted-foreground">
                Live feed of incoming orders
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 text-[10px] font-bold uppercase text-muted-foreground">
                  <th className="py-2.5 px-2">Order #</th>
                  <th className="py-2.5 px-2">Customer</th>
                  <th className="py-2.5 px-2">Total</th>
                  <th className="py-2.5 px-2">Payment</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-foreground">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-foreground">
                        {order.shippingAddress.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {order.shippingAddress.city}
                      </p>
                    </td>
                    <td className="py-3 px-2 font-bold font-mono text-foreground">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 uppercase font-semibold text-muted-foreground text-[10px]">
                      {order.paymentMethod} ({order.paymentStatus})
                    </td>
                    <td className="py-3 px-2">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-border/80 bg-background px-2 py-1 text-[11px] font-semibold text-foreground focus:border-amber-500 focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-black text-foreground">
                Low Inventory Alert
              </h3>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">
              {lowStockProducts.length} Items
            </span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {lowStockProducts.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/20 border border-border/60"
              >
                <div className="relative h-11 w-11 shrink-0 rounded-xl overflow-hidden border border-border/60">
                  <Image
                    src={prod.thumbnail}
                    alt={prod.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-foreground truncate">
                    {prod.name}
                  </p>
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                    Only {prod.stock} left in stock
                  </p>
                </div>
                <Link
                  href="/dashboard/products"
                  className="px-2.5 py-1 rounded-lg border border-border/80 bg-background hover:bg-muted text-[11px] font-bold text-foreground transition-colors cursor-pointer"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
