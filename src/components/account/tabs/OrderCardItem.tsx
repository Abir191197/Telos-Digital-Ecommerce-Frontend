"use client";

import React from "react";
import Link from "next/link";
import { AppImage } from "@/components/shared";
import { ROUTES } from "@/constants";
import {
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
import type { Order, OrderStatus } from "@/types/order.types";

interface OrderCardItemProps {
  order: Order;
  isExpanded: boolean;
  copiedTrackingId: string | null;
  onToggleExpand: (orderId: string) => void;
  onCopyTracking: (trackingNumber: string) => void;
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
  onOpenInvoice: (order: Order) => void;
  onOpenCancel: (order: Order) => void;
  onOpenReturn: (order: Order) => void;
  onOpenReview: (item: {
    productId: string;
    productName: string;
    productThumbnail: string;
  }) => void;
}

function getStatusBadge(status: OrderStatus) {
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
}

export function OrderCardItem({
  order,
  isExpanded,
  copiedTrackingId,
  onToggleExpand,
  onCopyTracking,
  onSelectTab,
  onOpenInvoice,
  onOpenCancel,
  onOpenReturn,
  onOpenReview,
}: OrderCardItemProps) {
  const isMultiItem = order.items.length > 1;
  const visibleItems = isMultiItem && !isExpanded ? order.items.slice(0, 1) : order.items;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-3.5 sm:p-5 space-y-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/40 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onCopyTracking(order.orderNumber)}
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
        {visibleItems.map((item) => {
          const productUrl = ROUTES.PRODUCT_DETAIL(item.productId);

          return (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Link
                  href={productUrl}
                  className="group/thumb relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl overflow-hidden bg-muted/40 border border-border/40 hover:border-amber-500/50 transition-colors shadow-2xs block"
                  title={`View ${item.productName}`}
                >
                  <AppImage
                    src={item.productThumbnail}
                    alt={item.productName}
                    fill
                    className="object-cover group-hover/thumb:scale-108 transition-transform duration-300"
                    fallbackIconSize={18}
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={productUrl}
                    className="text-xs sm:text-sm font-bold text-foreground truncate block hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    title={`View ${item.productName}`}
                  >
                    {item.productName}
                  </Link>
                  <p className="text-[11px] text-muted-foreground">
                    {item.variantName ? `${item.variantName} • ` : ""}Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm font-bold text-foreground shrink-0 text-right">
                ৳{item.subtotal.toLocaleString()}
              </div>
            </div>
          );
        })}

        {/* Multi-item expander trigger */}
        {isMultiItem && (
          <button
            type="button"
            onClick={() => onToggleExpand(order.id)}
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
        {/* Courier pill */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
          <Truck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="truncate">
            <strong className="text-foreground font-semibold">{order.courierName}</strong>
            <span className="mx-1 text-border">•</span>
            {order.trackingNumber ? (
              <button
                type="button"
                onClick={() => onCopyTracking(order.trackingNumber!)}
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
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Est. {order.estimatedDelivery}
                </span>
              </>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab("tracking", { orderId: order.orderNumber })}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
            title="Track live shipment"
          >
            <Truck className="h-3 w-3" />
            <span>Track</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenInvoice(order)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-[11px] font-bold transition-all cursor-pointer active:scale-95"
          >
            <Download className="h-3 w-3 text-muted-foreground" />
            <span>Invoice</span>
          </button>

          {(order.status === "pending" || order.status === "processing") && (
            <button
              type="button"
              onClick={() => onOpenCancel(order)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
            >
              <AlertCircle className="h-3 w-3" />
              <span>Cancel</span>
            </button>
          )}

          {order.status === "delivered" && (
            <button
              type="button"
              onClick={() => onOpenReturn(order)}
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
                onOpenReview({
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
}
