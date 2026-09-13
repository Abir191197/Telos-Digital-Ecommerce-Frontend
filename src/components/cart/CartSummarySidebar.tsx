"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Tag,
  Sparkles,
  AlertCircle,
  Check,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/common";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { CouponDiscount } from "@/types/cart.types";

interface CartSummarySidebarProps {
  itemCount: number;
  subtotal: number;
  discount: number;
  estimatedShippingFee: number;
  estimatedTotal: number;
  deliveryZone: "inside-dhaka" | "outside-dhaka";
  onDeliveryZoneChange: (zone: "inside-dhaka" | "outside-dhaka") => void;
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
  deliveryZone,
  onDeliveryZoneChange,
  promoInput,
  onPromoInputChange,
  appliedCoupon,
  couponError,
  promoSuccess,
  onApplyPromo,
  onRemoveCoupon,
}: CartSummarySidebarProps) {
  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg space-y-5">
        <h2 className="text-lg font-black tracking-tight text-foreground border-b border-border/60 pb-3">
          Summary & Estimate
        </h2>

        {/* Shipping Zone Estimator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              Delivery Destination
            </span>
            <span className="text-[11px] text-muted-foreground">Estimated</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDeliveryZoneChange("inside-dhaka")}
              className={cn(
                "rounded-xl p-2.5 text-left border text-xs transition-all cursor-pointer",
                deliveryZone === "inside-dhaka"
                  ? "border-amber-500 bg-amber-500/10 text-foreground font-bold"
                  : "border-border/70 bg-muted/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <p className="font-bold">Inside Dhaka</p>
              <p className="text-[10px] opacity-80">24-48 hrs • ৳70</p>
            </button>
            <button
              type="button"
              onClick={() => onDeliveryZoneChange("outside-dhaka")}
              className={cn(
                "rounded-xl p-2.5 text-left border text-xs transition-all cursor-pointer",
                deliveryZone === "outside-dhaka"
                  ? "border-amber-500 bg-amber-500/10 text-foreground font-bold"
                  : "border-border/70 bg-muted/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <p className="font-bold">Outside Dhaka</p>
              <p className="text-[10px] opacity-80">48-72 hrs • ৳130</p>
            </button>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="space-y-2 pt-1 border-t border-border/50">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Have a Promo Code?
          </label>
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
          ) : (
            <form onSubmit={onApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => onPromoInputChange(e.target.value)}
                  placeholder="Promo code (TELOS10)"
                  className="h-10 w-full rounded-xl border border-border/70 bg-background pl-9 pr-3 text-xs uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-muted hover:bg-muted/80 text-foreground px-4 text-xs font-bold border border-border/80 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {couponError && (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <AlertCircle className="h-3 w-3" />
              {couponError}
            </p>
          )}

          {promoSuccess && (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" />
              Coupon applied successfully!
            </p>
          )}
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-2.5 text-sm text-muted-foreground border-t border-border/60 pt-4">
          <div className="flex justify-between">
            <span>
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="font-semibold text-foreground">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Coupon Discount</span>
              <span className="font-semibold">
                -৳{discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between">
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
            <div>
              <span className="text-base font-black text-foreground">
                Estimated Total
              </span>
              <p className="text-[11px] text-muted-foreground">
                VAT included where applicable
              </p>
            </div>
            <span className="text-2xl font-black text-foreground">
              ৳{estimatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Direct Checkout CTA */}
        <div className="space-y-3 pt-1">
          <Button
            asChild
            variant="amber"
            size="lg"
            className="w-full font-bold text-base py-6 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-transform"
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

          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              100% Genuine BD Warranty
            </span>
          </div>
        </div>
      </div>

      {/* Order Assurance Mini Guarantee Box */}
      <div className="rounded-3xl border border-border/60 bg-muted/20 p-4 space-y-2.5">
        <p className="text-xs font-black uppercase tracking-wider text-foreground">
          Shopping Guarantees
        </p>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>7-Day Easy Replacement</strong> on defects.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>BTRC Verified IMEI</strong> for smartphones.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Open-box inspection</strong> with courier.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
