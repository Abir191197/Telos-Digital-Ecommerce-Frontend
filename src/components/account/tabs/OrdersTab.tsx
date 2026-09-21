"use client";

import React, { useState } from "react";
import { AppImage } from "@/components/shared";
import {
  Package,
  Truck,
  Download,
  AlertCircle,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order.types";
import { CancelOrderModal } from "../CancelOrderModal";
import { ReturnRequestModal, type ReturnTicketData } from "../ReturnRequestModal";
import { WriteReviewModal } from "../WriteReviewModal";
import { InvoiceModal } from "../InvoiceModal";

interface OrdersTabProps {
  orders: Order[];
  onCancelOrder: (orderNumber: string, reason: string) => void;
  onSubmitReturnTicket: (ticket: ReturnTicketData) => void;
  onSelectTab: (tab: "overview" | "profile" | "addresses" | "orders" | "tracking" | "returns" | "wishlist" | "reviews" | "payments" | "notifications") => void;
  onReviewSubmitted: (newRev: {
    productId: string;
    productName: string;
    productThumbnail: string;
    rating: number;
    comment: string;
  }) => void;
}

export function OrdersTab({
  orders,
  onCancelOrder,
  onSubmitReturnTicket,
  onSelectTab,
  onReviewSubmitted,
}: OrdersTabProps) {
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");

  // Modal states
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [reviewWriteItem, setReviewWriteItem] = useState<{
    productId: string;
    productName: string;
    productThumbnail: string;
  } | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTrackingId(trackingNumber);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Controls: Sticky on mobile under top nav, Swipeable on overflow */}
      <div className="sticky top-[80px] z-20 sm:static flex flex-col items-start gap-3.5 bg-card/95 sm:bg-muted/20 backdrop-blur-md sm:backdrop-blur-none p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/70 sm:border-transparent shadow-xs sm:shadow-none transition-all">
        <div className="hidden sm:block">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Order History
          </h3>
          <p className="text-xs text-muted-foreground">
            Track shipments, invoices, and post-delivery guarantees.
          </p>
        </div>

        {/* Filter Pills - Full width segmented control */}
        <div className="w-full">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 bg-background/90 dark:bg-muted/60 p-1 sm:p-1.5 rounded-2xl shadow-2xs w-full border border-border/50">
            {(
              [
                { key: "all", label: "All" },
                { key: "processing", label: "Processing" },
                { key: "shipped", label: "In Transit" },
                { key: "delivered", label: "Delivered" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setOrderFilter(tab.key)}
                className={cn(
                  "w-full py-2 px-1 sm:px-3 text-center rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95",
                  orderFilter === tab.key
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
            <Package className="h-6 w-6 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-bold text-foreground">No orders found</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            There are no orders in this category yet. Browse our catalog to place your first order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isMultiItem = order.items.length > 1;
            const isExpanded = expandedOrders[order.id];
            const visibleItems = isMultiItem && !isExpanded ? order.items.slice(0, 1) : order.items;

            return (
              <div
                key={order.id}
                className="rounded-2xl sm:rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-3.5 sm:p-5 space-y-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300"
              >
                {/* 1. Ultra-Lean Single-Line Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyTracking(order.orderNumber)}
                      className="inline-flex items-center gap-1 font-mono font-black text-foreground text-xs sm:text-sm hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                      title="Click to copy order number"
                    >
                      <span>#{order.orderNumber}</span>
                      {copiedTrackingId === order.orderNumber ? (
                        <Check className="h-3 w-3 text-emerald-500 stroke-[3]" />
                      ) : (
                        <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                      )}
                    </button>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className="text-xs sm:text-sm font-black text-foreground">
                      ৳{order.total.toLocaleString()}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted/60 dark:bg-muted text-foreground">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* 2. Compact Items Row */}
                <div className="space-y-2">
                  {visibleItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl overflow-hidden bg-muted/40 border border-border/40">
                          <AppImage
                            src={item.productThumbnail}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            fallbackIconSize={18}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.variantName ? `${item.variantName} • ` : ""}Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-foreground shrink-0 text-right">
                        ৳{item.subtotal.toLocaleString()}
                      </div>
                    </div>
                  ))}

                  {/* Multi-item expander trigger */}
                  {isMultiItem && (
                    <button
                      type="button"
                      onClick={() => toggleOrderExpanded(order.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer pt-0.5"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 stroke-[2.5]" />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 stroke-[2.5]" />
                          <span>+ {order.items.length - 1} more item{order.items.length - 1 > 1 ? "s" : ""}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* 3. Merged Courier & Actions Footer */}
                <div className="pt-2.5 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  {/* Courier pill with click-to-copy */}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                    <Truck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">
                      <strong className="text-foreground font-semibold">{order.courierName}</strong>
                      <span className="mx-1 text-border">•</span>
                      {order.trackingNumber ? (
                        <button
                          type="button"
                          onClick={() => handleCopyTracking(order.trackingNumber!)}
                          className="inline-flex items-center gap-1 font-mono px-1.5 py-0.5 rounded-md bg-muted/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-foreground transition-all cursor-pointer font-bold"
                          title="Click to copy tracking code"
                        >
                          <span>{order.trackingNumber}</span>
                          {copiedTrackingId === order.trackingNumber ? (
                            <Check className="h-3 w-3 text-emerald-500 stroke-[3]" />
                          ) : (
                            <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                          )}
                        </button>
                      ) : (
                        <span className="font-mono text-muted-foreground">Pending</span>
                      )}
                      {order.estimatedDelivery && (
                        <>
                          <span className="mx-1 text-border">•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-medium">Est. {order.estimatedDelivery}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Actions inline */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    {/* Live Tracking Jump */}
                    <button
                      type="button"
                      onClick={() => onSelectTab("tracking")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                      title="Track live shipment"
                    >
                      <Truck className="h-3 w-3" />
                      <span>Track</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInvoiceModalOrder(order)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="h-3 w-3 text-muted-foreground" />
                      <span>Invoice</span>
                    </button>

                    {(order.status === "pending" || order.status === "processing") && (
                      <button
                        type="button"
                        onClick={() => setCancelModalOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                      >
                        <AlertCircle className="h-3 w-3" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <button
                        type="button"
                        onClick={() => setReturnModalOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Return</span>
                      </button>
                    )}

                    {order.status === "delivered" && order.items[0] && (
                      <button
                        type="button"
                        onClick={() =>
                          setReviewWriteItem({
                            productId: order.items[0].productId,
                            productName: order.items[0].productName,
                            productThumbnail: order.items[0].productThumbnail,
                          })
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 text-[11px] font-bold shadow-xs shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                      >
                        <Star className="h-3 w-3 fill-current" />
                        <span>Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals triggered from Orders */}
      {cancelModalOrder && (
        <CancelOrderModal
          orderNumber={cancelModalOrder.orderNumber}
          isOpen={Boolean(cancelModalOrder)}
          onClose={() => setCancelModalOrder(null)}
          onConfirmCancel={(orderNumber, reason) => {
            onCancelOrder(orderNumber, reason);
            setCancelModalOrder(null);
          }}
        />
      )}

      {returnModalOrder && (
        <ReturnRequestModal
          order={returnModalOrder}
          isOpen={Boolean(returnModalOrder)}
          onClose={() => setReturnModalOrder(null)}
          onSubmitReturn={(ticket) => {
            onSubmitReturnTicket(ticket);
            setReturnModalOrder(null);
            onSelectTab("returns");
          }}
        />
      )}

      {reviewWriteItem && (
        <WriteReviewModal
          item={reviewWriteItem}
          isOpen={Boolean(reviewWriteItem)}
          onClose={() => setReviewWriteItem(null)}
          onSubmitReview={(newRev) => {
            onReviewSubmitted(newRev);
            setReviewWriteItem(null);
            onSelectTab("reviews");
          }}
        />
      )}

      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          isOpen={Boolean(invoiceModalOrder)}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
}
