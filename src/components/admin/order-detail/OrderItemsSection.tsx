import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { Order } from "@/types/order.types";

interface OrderItemsSectionProps {
  order: Order;
}

export function OrderItemsSection({ order }: OrderItemsSectionProps) {
  const totalUnits = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Items Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Package className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Purchased Items ({order.items.length})
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Total units: {totalUnits}
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border/50 bg-muted/20 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/40">
              <Image
                src={item.productThumbnail}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {item.productName}
              </h3>
              {item.variantName && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Variant: <span className="text-foreground font-medium">{item.variantName}</span>
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
                <span className="px-2 py-0.5 rounded bg-muted text-foreground font-semibold text-[11px]">
                  Qty: {item.quantity}
                </span>
                <span>&times;</span>
                <span className="font-semibold text-foreground">
                  ৳{item.unitPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-right font-mono shrink-0 pl-2">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                Subtotal
              </p>
              <p className="text-sm sm:text-base font-black text-foreground">
                ৳{item.subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="rounded-2xl bg-muted/25 border border-border/40 p-4 space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({order.items.length} items)</span>
          <span className="font-mono font-bold text-foreground">
            ৳{order.subtotal.toLocaleString()}
          </span>
        </div>
        {order.deliveryFee !== undefined && (
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping Fee</span>
            <span className="font-mono font-bold text-foreground">
              {order.deliveryFee === 0
                ? "Free"
                : `৳${order.deliveryFee.toLocaleString()}`}
            </span>
          </div>
        )}
        {order.discount !== undefined && order.discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Discount</span>
            <span className="font-mono font-bold">
              -৳{order.discount.toLocaleString()}
            </span>
          </div>
        )}
        <div className="pt-2.5 border-t border-border/40 flex justify-between items-baseline text-base sm:text-lg font-black text-foreground">
          <span>Grand Total</span>
          <span className="font-mono text-amber-500 font-black">
            ৳{order.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
