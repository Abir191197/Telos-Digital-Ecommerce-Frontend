"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { CartItem, CouponDiscount } from "@/types/cart.types";
import {
  Tag,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common";

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
  isSubmitting?: boolean;
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
  isSubmitting = false,
}: OrderSummaryStickyProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponSuccessMessage, setCouponSuccessMessage] = useState<string | null>(null);

  const handleCouponSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = onApplyCoupon(couponInput.trim().toUpperCase());
    if (ok) {
      setCouponSuccessMessage(`Coupon ${couponInput.trim().toUpperCase()} applied!`);
      setCouponInput("");
      setTimeout(() => setCouponSuccessMessage(null), 3000);
    }
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.percentage
      ? Math.round((subtotal * appliedCoupon.percentage) / 100)
      : appliedCoupon.fixedAmount || 0
    : 0;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
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
        <div className="max-h-64 overflow-y-auto space-y-3 pt-2 pb-1 px-1 -mx-1 divide-y divide-border/40">
          {items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
              {/* Thumbnail with unclipped quantity badge */}
              <div className="relative shrink-0 my-1">
                <div className="relative h-14 w-14 rounded-xl border border-border/70 overflow-hidden bg-muted/30">
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-black shadow-xs">
                  {item.quantity}
                </span>
              </div>

              {/* Title & specs */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground line-clamp-1">
                  {item.product.name}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>{item.product.brand || "Official Store"}</span>
                  {item.variant && <span>• {item.variant.name}</span>}
                </div>
              </div>

              {/* Price */}
              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                ৳{item.subtotal.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Promo Code - Compact Collapsible */}
      <div className="pt-1 border-t border-border/50">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
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
              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : !isCouponOpen ? (
          <button
            type="button"
            onClick={() => setIsCouponOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <Tag className="h-3.5 w-3.5" />
            <span>Have a promo code?</span>
          </button>
        ) : (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Promo Code
              </span>
              <button
                type="button"
                onClick={() => setIsCouponOpen(false)}
                className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter code"
                  autoFocus
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCouponSubmit();
                    }
                  }}
                  className="h-9 w-full pl-9 pr-3 rounded-xl border border-border/70 bg-background text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500"
                />
              </div>
              <Button
                type="button"
                onClick={handleCouponSubmit}
                variant="amber"
                size="sm"
                className="h-9 px-3.5 font-bold rounded-xl cursor-pointer"
              >
                Apply
              </Button>
            </div>
            {couponSuccessMessage && (
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {couponSuccessMessage}
              </p>
            )}
          </div>
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
          <span>Delivery Fee</span>
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

        <div className="border-t border-border/60 pt-3.5 flex items-baseline justify-between text-sm">
          <span className="font-black text-base text-foreground">Total Payable</span>
          <span className="text-2xl font-black text-foreground tracking-tight">
            ৳{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Primary Confirm & Place Order Button */}
      <Button
        type="submit"
        form="checkout-form"
        variant="amber"
        disabled={isSubmitting}
        className="w-full h-11 font-bold text-sm rounded-xl shadow-xs active:scale-[0.99] transition-transform cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Placing Order...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Confirm Order</span>
          </span>
        )}
      </Button>
    </div>
  );
}
