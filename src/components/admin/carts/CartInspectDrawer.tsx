"use client";

import React from "react";
import Image from "next/image";
import { AdminCustomerCart } from "@/types/customer-cart.types";
import { CartStatusBadge } from "./CartStatusBadge";
import { X, Mail, Phone, MapPin, Tag, ShoppingBag, Send } from "lucide-react";

interface CartInspectDrawerProps {
  cart: AdminCustomerCart | null;
  onClose: () => void;
}

export function CartInspectDrawer({ cart, onClose }: CartInspectDrawerProps) {
  if (!cart) return null;

  const date = new Date(cart.updatedAt);
  const dateFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-2xl max-h-[85vh] bg-card border border-border/80 rounded-3xl p-5 sm:p-7 overflow-y-auto space-y-6 animate-in slide-in-from-bottom md:zoom-in-95 duration-200 shadow-2xl flex flex-col justify-between mx-3 md:mx-0"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Active Bag Audit
                </span>
                <CartStatusBadge status={cart.status} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                {cart.customerName}&rsquo;s Cart
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-muted/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Customer Metadata Card */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email:
              </span>
              <span className="font-mono font-bold text-foreground">{cart.customerEmail}</span>
            </div>
            {cart.customerPhone && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone:
                </span>
                <span className="font-mono font-bold text-foreground">{cart.customerPhone}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Destination:
              </span>
              <span className="font-semibold text-foreground">{cart.city}, Bangladesh</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <span className="text-muted-foreground">Last Recorded Activity:</span>
              <span className="font-semibold text-foreground">{dateFormatted} at {timeFormatted}</span>
            </div>
          </div>

          {/* Products List inside Cart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                <span>Selected Items ({cart.itemsCount})</span>
              </span>
              <span className="font-mono text-muted-foreground">Qty &bull; Price</span>
            </div>

            <div className="space-y-2.5">
              {cart.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-background shrink-0 border border-border/60">
                    <Image
                      src={item.productThumbnail}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-foreground truncate">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {item.variantName}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        ৳{item.price.toLocaleString()} &times; {item.quantity}
                      </span>
                      <span className="font-mono font-bold text-xs text-foreground">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Discounts */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated Subtotal:</span>
              <span className="font-mono font-black text-base text-foreground">
                ৳{cart.subtotal.toLocaleString()}
              </span>
            </div>
            {cart.appliedCoupon && (
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Applied Coupon:
                </span>
                <span className="font-mono">{cart.appliedCoupon}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border/50 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              alert(`Follow-up reminder queued for ${cart.customerEmail}!`);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Nudge SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
