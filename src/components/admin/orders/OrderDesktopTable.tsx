"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Printer, Globe, Phone, ShieldCheck } from "lucide-react";
import { OrderListItem, OrderStatus, OrderSource } from "@/types/order.types";

interface OrderDesktopTableProps {
  orders: OrderListItem[];
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
  onPrintInvoice: (order: OrderListItem) => void;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SourceBadge({ source }: { source?: OrderSource }) {
  const s = source || "WEBSITE";

  if (s === "FACEBOOK") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 shadow-xs whitespace-nowrap">
        <FacebookIcon className="h-3.5 w-3.5 shrink-0" />
        Facebook
      </span>
    );
  }

  if (s === "PHONE") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs whitespace-nowrap">
        <Phone className="h-3.5 w-3.5 shrink-0" />
        Phone
      </span>
    );
  }

  if (s === "ADMIN") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 shadow-xs whitespace-nowrap">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        Admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 shadow-xs whitespace-nowrap">
      <Globe className="h-3.5 w-3.5 shrink-0" />
      Website
    </span>
  );
}

const itemLabel = (itemCount: number) => `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

export function OrderDesktopTable({ orders, getStatusBadge, onPrintInvoice }: OrderDesktopTableProps) {
  const router = useRouter();
  const navigateToOrder = (orderNumber: string) => router.push(`/dashboard/orders/${orderNumber}`);

  return (
    <div className="hidden sm:flex admin-card rounded-2xl bg-card border-none overflow-hidden flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-muted-foreground">
                  No orders found matching filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  tabIndex={0}
                  role="link"
                  aria-label={`View order ${order.orderNumber}`}
                  onClick={() => navigateToOrder(order.orderNumber)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToOrder(order.orderNumber);
                    }
                  }}
                  className="group cursor-pointer hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-black text-foreground group-hover:underline">#{order.orderNumber}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <SourceBadge source={order.source} />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-foreground">{order.shippingAddress.name}</p>
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        window.location.href = `tel:${order.shippingAddress.phone}`;
                      }}
                      className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {order.shippingAddress.phone}
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-foreground">{order.shippingAddress.city}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[130px]" title={order.shippingAddress.street}>
                      {order.shippingAddress.street}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
                      {itemLabel(order.itemCount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-foreground">
                    ৳{order.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold uppercase text-[10px] text-foreground">{order.paymentMethod}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{order.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(event) => event.stopPropagation()}>
                      <Link
                        href={`/dashboard/orders/${order.orderNumber}`}
                        className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer inline-flex"
                        title="View order details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onPrintInvoice(order)}
                        className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                        title="Print invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
