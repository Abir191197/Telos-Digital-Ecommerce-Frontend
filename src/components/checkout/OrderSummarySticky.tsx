"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, CouponDiscount } from "@/types/cart.types";
import {
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderSummaryStickyProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  deliveryZone: "inside-dhaka" | "outside-dhaka";
  appliedCoupon: CouponDiscount | null;
  couponError: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  total: number;
}

export function OrderSummarySticky({
  items,
  subtotal,
  shippingFee,
  deliveryZone,
  appliedCoupon,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  total,
}: OrderSummaryStickyProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [couponSuccessMessage, setCouponSuccessMessage] = useState<string | null>(null);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = onApplyCoupon(couponInput.trim().toUpperCase());
    if (ok) {
      setCouponSuccessMessage(`Coupon ${couponInput.trim().toUpperCase()} applied!`);
      setCouponInput("");
    }
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.percentage
      ? Math.round((subtotal * appliedCoupon.percentage) / 100)
      : appliedCoupon.fixedAmount || 0
    : 0;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-md space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h3 className="text-base font-black text-foreground tracking-tight">
            Order Summary
          </h3>
          <p className="text-xs text-muted-foreground">
            {items.reduce((acc, item) => acc + item.quantity, 0)} items in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsItemsExpanded(!isItemsExpanded)}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{isItemsExpanded ? "Hide Details" : "Show Details"}</span>
          {isItemsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Item Previews (Collapsible) */}
      {isItemsExpanded && (
        <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-border/40">
          {items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
              <div className="relative h-14 w-14 rounded-xl border border-border/70 overflow-hidden shrink-0 bg-muted/30">
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-foreground line-clamp-1">
                  {item.product.name}
                </h4>
                {item.variant && (
                  <p className="text-[10px] text-muted-foreground">
                    Variant: {item.variant.name}
                  </p>
                )}
                <p className="text-xs font-black text-foreground mt-0.5">
                  ৳{item.subtotal.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promo Code Input */}
      <div className="pt-1">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {appliedCoupon.code}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {appliedCoupon.description}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="p-1 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCouponSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Promo Code (e.g. TELOS10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="h-10 flex-1 px-3 rounded-xl border border-border/80 bg-background text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-muted hover:bg-amber-500 hover:text-white text-xs font-bold text-foreground transition-all cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}
        {couponError && (
          <p className="text-[11px] font-medium text-rose-500 mt-1">
            {couponError}
          </p>
        )}
      </div>

      {/* Breakdown lines */}
      <div className="space-y-2.5 text-xs border-t border-border/60 pt-3">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-bold text-foreground">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Coupon Discount</span>
            <span>-৳{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground items-center">
          <div className="flex items-center gap-1.5">
            <span>Delivery Fee</span>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-semibold text-foreground">
              {deliveryZone === "inside-dhaka" ? "Dhaka Metro" : "Outside Dhaka"}
            </span>
          </div>
          <span>
            {shippingFee === 0 ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              <span className="font-bold text-foreground">
                ৳{shippingFee.toLocaleString()}
              </span>
            )}
          </span>
        </div>

        {/* Free shipping progress note */}
        {subtotal < 5000 && (
          <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Truck className="h-3 w-3 shrink-0" />
            <span>
              Add ৳{(5000 - subtotal).toLocaleString()} more for <b>FREE Delivery</b> anywhere in BD.
            </span>
          </div>
        )}

        <div className="border-t border-border/60 pt-3 flex items-baseline justify-between text-sm">
          <span className="font-black text-foreground">Total Payable</span>
          <div className="text-right">
            <span className="text-xl font-black text-foreground">
              ৳{total.toLocaleString()}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              VAT & Taxes included
            </span>
          </div>
        </div>
      </div>

      {/* Trust guarantees strip */}
      <div className="pt-2 border-t border-border/60 space-y-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>100% Genuine Official BD Warranty Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-amber-500 shrink-0" />
          <span>7-Day Hassle Free Replacement Policy</span>
        </div>
      </div>
    </div>
  );
}
