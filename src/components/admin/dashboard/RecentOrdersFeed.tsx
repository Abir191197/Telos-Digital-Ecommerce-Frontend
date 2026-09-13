import React from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types/order.types";
import { CheckCircle2, Clock, Truck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentOrdersFeedProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function RecentOrdersFeed({
  orders,
  onUpdateStatus,
}: RecentOrdersFeedProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase">
            <Truck className="h-3 w-3" />
            Transit
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase">
            Cancelled
          </span>
        );
      case "pending":
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold uppercase">
            <Clock className="h-3 w-3" />
            Active
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Recent Orders</h3>
          <p className="text-[11px] text-muted-foreground">Live transactions queue</p>
        </div>
        <Link
          href="/dashboard/orders"
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>All Orders</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ── Mobile Layout (< 640px): Adaptive Clean Cards ── */}
      <div className="space-y-2.5 sm:hidden">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-foreground">
                #{order.orderNumber}
              </span>
              {getStatusBadge(order.status)}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">
                  {order.shippingAddress.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {order.shippingAddress.city} &bull; {order.paymentMethod.toUpperCase()}
                </p>
              </div>
              <span className="font-mono font-bold text-sm text-foreground">
                ৳{order.total.toLocaleString()}
              </span>
            </div>

            <div className="pt-1 flex items-center justify-end">
              <select
                value={order.status}
                onChange={(e) =>
                  onUpdateStatus(order.id, e.target.value as OrderStatus)
                }
                className="rounded-lg border border-border/80 bg-background px-2 py-1 text-[11px] font-semibold text-foreground focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop Layout (>= 640px): Clean Minimal Table ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/80 text-[10px] font-bold uppercase text-muted-foreground">
              <th className="py-2.5 px-2">Order #</th>
              <th className="py-2.5 px-2">Customer</th>
              <th className="py-2.5 px-2">Total</th>
              <th className="py-2.5 px-2">Method</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-2 font-mono font-bold text-foreground">
                  #{order.orderNumber}
                </td>
                <td className="py-3 px-2">
                  <p className="font-semibold text-foreground">
                    {order.shippingAddress.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {order.shippingAddress.city}
                  </p>
                </td>
                <td className="py-3 px-2 font-mono font-bold text-foreground">
                  ৳{order.total.toLocaleString()}
                </td>
                <td className="py-3 px-2 uppercase font-medium text-muted-foreground text-[10px]">
                  {order.paymentMethod}
                </td>
                <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                <td className="py-3 px-2 text-right">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onUpdateStatus(order.id, e.target.value as OrderStatus)
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
  );
}
