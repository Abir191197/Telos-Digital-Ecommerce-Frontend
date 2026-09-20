"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tag,
  Sparkles,
  AlertCircle,
  Check,
  Lock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/common";
import { ROUTES } from "@/constants";
import type { CouponDiscount } from "@/types/cart.types";

interface CartSummarySidebarProps {
  itemCount: number;
  subtotal: number;
  discount: number;
  estimatedShippingFee: number;
  estimatedTotal: number;
  promoInput: string;
  onPromoInputChange: (val: string) => void;
  appliedCoupon: CouponDiscount | null;
  couponError: string | null;
  promoSuccess: boolean;
  onApplyPromo: (e: React.FormEvent) => void;
  onRemoveCoupon: () => void;
}

export function CartSummarySidebar({
  itemCount,
  subtotal,
  discount,
  estimatedShippingFee,
  estimatedTotal,
  promoInput,
  onPromoInputChange,
  appliedCoupon,
  couponError,
  promoSuccess,
  onApplyPromo,
  onRemoveCoupon,
}: CartSummarySidebarProps) {
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-40 space-y-4">
      <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
        <h2 className="text-lg font-black tracking-tight text-foreground border-b border-border/60 pb-3">
          Summary & Estimate
        </h2>

        {/* Calculation Breakdown */}
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="font-semibold text-foreground">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
              <span>Coupon Discount</span>
              <span className="font-semibold">
                -৳{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span>Estimated Delivery</span>
            <span>
              {estimatedShippingFee === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  FREE
                </span>
              ) : (
                `৳${estimatedShippingFee.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-baseline justify-between">
            <span className="text-base font-black text-foreground">
              Estimated Total
            </span>
            <span className="text-2xl font-black text-foreground tracking-tight">
              ৳{estimatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Collapsible Promo Code Trigger / Section */}
        <div className="pt-2 border-t border-border/50">
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-4 w-4 shrink-0" />
                <div>
                  <p className="font-bold">Code: {appliedCoupon.code}</p>
                  <p className="text-[11px] opacity-80">
                    {appliedCoupon.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-2"
              >
                Remove
              </button>
            </div>
          ) : !isPromoOpen ? (
            <button
              type="button"
              onClick={() => setIsPromoOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 cursor-pointer transition-colors"
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Have a promo code?</span>
            </button>
          ) : (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Promo Code
                </label>
                <button
                  type="button"
                  onClick={() => setIsPromoOpen(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={onApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => onPromoInputChange(e.target.value)}
                    placeholder="Enter code"
                    autoFocus
                    className="h-9 w-full rounded-xl border border-border/70 bg-background pl-9 pr-3 text-xs uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-muted hover:bg-muted/80 text-foreground px-3.5 text-xs font-bold border border-border/80 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            </div>
          )}

          {couponError && (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 pt-1.5">
              <AlertCircle className="h-3 w-3" />
              {couponError}
            </p>
          )}

          {promoSuccess && (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1.5">
              <Check className="h-3 w-3" />
              Coupon applied successfully!
            </p>
          )}
        </div>

        {/* Direct Checkout CTA */}
        <div className="space-y-3 pt-2">
          <Button
            asChild
            variant="amber"
            size="lg"
            className="w-full font-bold text-base py-5 sm:py-6 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-transform"
          >
            <Link
              href={ROUTES.CHECKOUT}
              className="flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold">100% Genuine BD Warranty</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
