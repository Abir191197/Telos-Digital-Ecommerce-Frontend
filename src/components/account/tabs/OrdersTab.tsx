"use client";

import React, { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order.types";
import { CancelOrderModal } from "../CancelOrderModal";
import { ReturnRequestModal, type ReturnTicketData } from "../ReturnRequestModal";
import { WriteReviewModal } from "../WriteReviewModal";
import { InvoiceModal } from "../InvoiceModal";
import { OrderCardItem } from "./OrderCardItem";

interface OrdersTabProps {
  orders: Order[];
  onCancelOrder: (orderNumber: string, reason: string) => void;
  onSubmitReturnTicket: (ticket: ReturnTicketData) => void;
  onSelectTab: (
    tab:
      | "overview"
      | "profile"
      | "addresses"
      | "orders"
      | "tracking"
      | "returns"
      | "wishlist"
      | "reviews"
      | "payments"
      | "notifications",
    extraParams?: Record<string, string>
  ) => void;
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Controls */}
      <div className="sticky top-[80px] z-20 sm:static flex flex-col items-start gap-3.5 bg-card/95 sm:bg-muted/20 backdrop-blur-md sm:backdrop-blur-none p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/70 sm:border-transparent shadow-xs sm:shadow-none transition-all">
        <div className="hidden sm:block">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Order History
          </h3>
          <p className="text-xs text-muted-foreground">
            Track shipments, invoices, and post-delivery guarantees.
          </p>
        </div>

        {/* Filter Pills */}
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
          {filteredOrders.map((order) => (
            <OrderCardItem
              key={order.id}
              order={order}
              isExpanded={Boolean(expandedOrders[order.id])}
              copiedTrackingId={copiedTrackingId}
              onToggleExpand={toggleOrderExpanded}
              onCopyTracking={handleCopyTracking}
              onSelectTab={onSelectTab}
              onOpenInvoice={(o) => setInvoiceModalOrder(o)}
              onOpenCancel={(o) => setCancelModalOrder(o)}
              onOpenReturn={(o) => setReturnModalOrder(o)}
              onOpenReview={(item) => setReviewWriteItem(item)}
            />
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
