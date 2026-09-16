"use client";

import React from "react";
import Image from "next/image";
import { AdminCustomerCart } from "@/data/customer-carts";
import { CartStatusBadge } from "./CartStatusBadge";
import { Eye, Clock, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartMobileListProps {
  carts: AdminCustomerCart[];
  onInspect: (cart: AdminCustomerCart) => void;
}

export function CartMobileList({ carts, onInspect }: CartMobileListProps) {
  if (carts.length === 0) {
    return (
      <div className="block md:hidden p-8 text-center text-muted-foreground text-xs rounded-3xl bg-card border-none">
        No customer shopping carts match the selected criteria.
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3.5">
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
            className="p-4 rounded-3xl bg-card border-none space-y-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]"
          >
            {/* Top row: Status & Subtotal */}
            <div className="flex items-center justify-between gap-2">
              <CartStatusBadge status={cart.status} />
              <div className="font-mono font-black text-sm text-foreground">
                ৳{cart.subtotal.toLocaleString()}
              </div>
            </div>

            {/* Customer Box */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-muted/30">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 text-xs">
                {cart.customerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  {cart.customerName}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  {cart.customerEmail}
                </p>
              </div>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-lg text-muted-foreground">
                {cart.city}
              </span>
            </div>

            {/* Micro thumbnail strip */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {cart.items.map((item, idx) => (
                <div
                  key={idx}
                  className="relative h-10 w-10 rounded-xl overflow-hidden bg-background shrink-0 border border-border/50"
                >
                  <Image
                    src={item.productThumbnail}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-black/80 text-white font-mono text-[8px] px-1 rounded-tl font-bold">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3 text-muted-foreground/70" />
                <span>{dateFormatted} at {timeFormatted}</span>
              </div>

              <button
                type="button"
                onClick={() => onInspect(cart)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-zinc-950 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Bag</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
