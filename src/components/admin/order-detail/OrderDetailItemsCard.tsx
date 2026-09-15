import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { Order } from "@/types/order.types";

interface OrderDetailItemsCardProps {
  order: Order;
}

export function OrderDetailItemsCard({ order }: OrderDetailItemsCardProps) {
  return (
    <div className="rounded-3xl bg-card p-5 sm:p-7 admin-card border border-border/60 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground">
              Purchased Merchandise
            </h2>
            <p className="text-xs text-muted-foreground">
              {order.items.length} items &bull; Total{" "}
              {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
            </p>
          </div>
        </div>
      </div>

      {/* High-Detail Product List */}
      <div className="grid grid-cols-1 gap-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/20 p-4 hover:border-amber-500/40 hover:bg-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden bg-muted shadow-md group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={item.productThumbnail}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-foreground text-sm sm:text-base leading-snug">
                  {item.productName}
                </p>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground">
                    Variant:{" "}
                    <strong className="text-foreground">{item.variantName}</strong>
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1 font-mono text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold">
                    Qty: {item.quantity}
                  </span>
                  <span>&times;</span>
                  <span className="font-semibold text-foreground">
                    ৳{item.unitPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40 font-mono">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Subtotal
              </p>
              <p className="font-black text-lg sm:text-xl text-foreground">
                ৳{item.subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Ledger & Breakdown */}
      <div className="pt-4 border-t border-border/40 space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({order.items.length} items)</span>
          <span className="font-mono font-bold text-foreground">
            ৳{order.subtotal.toLocaleString()}
          </span>
        </div>
        {order.deliveryFee !== undefined && (
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping & Handling</span>
            <span className="font-mono font-bold text-foreground">
              {order.deliveryFee === 0
                ? "Free Shipping"
                : `৳${order.deliveryFee.toLocaleString()}`}
            </span>
          </div>
        )}
        {order.discount !== undefined && order.discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Promotional Discount</span>
            <span className="font-mono font-bold">
              -৳{order.discount.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between text-base sm:text-lg font-black text-foreground pt-3 border-t border-border/40">
          <span>Grand Total</span>
          <span className="font-mono text-amber-500 font-black">
            ৳{order.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
