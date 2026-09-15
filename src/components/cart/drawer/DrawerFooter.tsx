import React from "react";
import Link from "next/link";
import {
  Tag,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/common";
import { ROUTES } from "@/constants";
import type { CouponDiscount } from "@/types/cart.types";

interface DrawerFooterProps {
  appliedCoupon: CouponDiscount | null;
  couponError: string | null;
  promoInput: string;
  promoSuccess: boolean;
  onPromoInputChange: (val: string) => void;
  onApplyPromo: (e: React.FormEvent) => void;
  onRemoveCoupon: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onCloseCart: () => void;
}

export function DrawerFooter({
  appliedCoupon,
  couponError,
  promoInput,
  promoSuccess,
  onPromoInputChange,
  onApplyPromo,
  onRemoveCoupon,
  subtotal,
  discount,
  shipping,
  total,
  onCloseCart,
}: DrawerFooterProps) {
  return (
    <div className="border-t border-border/70 bg-card/80 backdrop-blur-md p-5 space-y-3.5 shadow-2xl">
      {/* Promo Code Accordion / Input */}
      <div>
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                Promo <strong>{appliedCoupon.code}</strong> applied (
                {appliedCoupon.description})
              </span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={onApplyPromo} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => onPromoInputChange(e.target.value)}
                placeholder="Promo code (e.g. TELOS10)"
                className="h-9 w-full rounded-xl border border-border/70 bg-background pl-8.5 pr-3 text-xs uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-muted hover:bg-muted/80 text-foreground px-3.5 text-xs font-bold border border-border/80 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}

        {couponError && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
            <AlertCircle className="h-3 w-3" />
            {couponError}
          </p>
        )}

        {promoSuccess && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="h-3 w-3" />
            Coupon discount applied!
          </p>
        )}
      </div>

      {/* Price Calculations Breakdown */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Discount</span>
            <span className="font-semibold">-৳{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery Charge</span>
          <span>
            {shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                FREE
              </span>
            ) : (
              `৳${shipping.toLocaleString()}`
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-baseline justify-between text-sm">
          <div>
            <span className="font-black text-foreground">Total Payable</span>
            <p className="text-[10px] text-muted-foreground font-normal">
              VAT included where applicable
            </p>
          </div>
          <span className="text-xl font-black text-foreground">
            ৳{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions: View Cart + Checkout */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            asChild
            variant="outline"
            size="default"
            className="rounded-xl font-bold border-border/80 hover:border-amber-500/40 hover:bg-amber-500/5 text-xs h-10 transition-colors"
          >
            <Link
              href={ROUTES.CART}
              onClick={onCloseCart}
              className="flex items-center justify-center gap-1.5"
            >
              <span>View Cart</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="amber"
            size="default"
            className="rounded-xl font-bold text-xs h-10 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-transform"
          >
            <Link
              href={ROUTES.CHECKOUT}
              onClick={onCloseCart}
              className="flex items-center justify-center gap-1.5"
            >
              <span>Checkout</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="hidden sm:flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-0.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>100% Genuine BD Warranty</span>
        </div>

        {/* Payment Methods Pill */}
        <div className="hidden sm:flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground pt-1 border-t border-border/40">
          <span>bKash</span>
          <span>•</span>
          <span>Nagad</span>
          <span>•</span>
          <span>Cards</span>
          <span>•</span>
          <span>Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
}
