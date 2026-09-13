"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  Truck,
  Download,
  AlertCircle,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
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

        {/* Filter Pills - Swipeable by touch on mobile with momentum scrolling */}
        <div className="w-full overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none py-0.5">
          <div className="inline-flex items-center gap-1.5 bg-background/90 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs min-w-max">
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
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 touch-manipulation active:scale-95",
                  orderFilter === tab.key
                    ? "bg-amber-500 text-white shadow-2xs"
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
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl sm:rounded-3xl bg-card/90 dark:bg-muted/30 p-4 sm:p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* Order Header: Order Number, Date, Status, Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-sm sm:text-base font-black tracking-tight text-foreground font-mono">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-muted-foreground block">Order Total</span>
                    <span className="text-sm sm:text-base font-black text-foreground">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-muted/60 dark:bg-muted text-foreground">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border/30">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs">
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 leading-snug">
                        {item.productName}
                      </p>
                      {item.variantName && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          Variant: {item.variantName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Qty: <strong className="text-foreground font-semibold">{item.quantity}</strong> × ৳{item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-foreground shrink-0 text-right">
                      ৳{item.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier & Delivery Status Line */}
              <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="truncate">
                    Courier: <strong className="text-foreground font-semibold">{order.courierName}</strong>
                    <span className="mx-1.5 text-border">•</span>
                    <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[11px]">
                      {order.trackingNumber}
                    </span>
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Estimated: {order.estimatedDelivery}
                </span>
              </div>

              {/* Action Buttons: Touch-friendly on mobile, right-aligned on desktop */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                {/* Download invoice button */}
                <button
                  type="button"
                  onClick={() => setInvoiceModalOrder(order)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Invoice</span>
                </button>

                {/* Cancel order if pending or processing */}
                {(order.status === "pending" || order.status === "processing") && (
                  <button
                    type="button"
                    onClick={() => setCancelModalOrder(order)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                )}

                {/* 7-Day Return / Replacement if delivered */}
                {order.status === "delivered" && (
                  <button
                    type="button"
                    onClick={() => setReturnModalOrder(order)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Return</span>
                  </button>
                )}

                {/* Write Review if delivered */}
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
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
            </div>
          ))}
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
