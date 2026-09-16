"use client";

import React from "react";
import Image from "next/image";
import { AdminCustomerCart } from "@/data/customer-carts";
import { CartStatusBadge } from "./CartStatusBadge";
import { Clock, Eye, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartCardGridProps {
  carts: AdminCustomerCart[];
  onInspect: (cart: AdminCustomerCart) => void;
}

export function CartCardGrid({ carts, onInspect }: CartCardGridProps) {
  if (carts.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground text-xs rounded-3xl bg-card border-none">
        No customer shopping carts match the selected criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {carts.map((cart) => {
        const updatedDate = new Date(cart.updatedAt);
        const dateFormatted = updatedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const timeFormatted = updatedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div
            key={cart.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border-none p-5 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.12),0_20px_50px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.18),0_20px_50px_-10px_rgba(0,0,0,0.5)] space-y-4"
          >
            {/* Top row: Status + Amount */}
            <div className="flex items-center justify-between gap-2">
              <CartStatusBadge status={cart.status} />
              <div className="text-right">
                <span className="font-mono font-black text-sm text-foreground">
                  ৳{cart.subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customer Box */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-muted/30">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 border border-amber-500/20 text-xs">
                {cart.customerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  {cart.customerName}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  {cart.customerEmail}
                </p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  {cart.city}, Bangladesh
                </p>
              </div>
            </div>

            {/* Product items preview stream */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                <span>Items in Bag</span>
                <span className="font-mono">{cart.itemsCount} total</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {cart.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative h-11 w-11 rounded-xl overflow-hidden bg-background shrink-0 border border-border/60"
                    title={`${item.productName} (x${item.quantity})`}
                  >
                    <Image
                      src={item.productThumbnail}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white font-mono text-[9px] px-1 rounded font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Timestamp + Action button */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{dateFormatted} ({timeFormatted})</span>
              </div>

              <button
                type="button"
                onClick={() => onInspect(cart)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-zinc-950 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
