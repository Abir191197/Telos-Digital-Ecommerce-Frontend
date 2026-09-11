"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/common";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    getFreeShippingRemaining,
    getItemCount,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Close drawer on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const freeShippingRemaining = getFreeShippingRemaining();
  const itemCount = getItemCount();

  const freeShippingProgress = Math.min(
    100,
    Math.round(((5000 - freeShippingRemaining) / 5000) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyCoupon(promoInput);
    if (ok) {
      setPromoSuccess(true);
      setPromoInput("");
      setTimeout(() => setPromoSuccess(false), 3000);
    }
  };

  const mounted = useMounted();
  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay (leaves bottom nav free) */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="fixed inset-0 bottom-16 md:bottom-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-over panel (Right desktop / Bottom mobile above nav) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className="relative z-10 flex h-[calc(100%-4rem)] md:h-full w-full max-w-md flex-col bg-background text-foreground shadow-2xl transition-transform animate-in slide-in-from-right duration-300 sm:border-l sm:border-border/80"
      >
        {/* ── Drawer Header ── */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground">Shopping Cart</h2>
              <p className="text-xs text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        <div className="border-b border-border/60 bg-muted/20 px-5 py-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Truck className="h-4 w-4 text-amber-500" />
              {freeShippingRemaining === 0 ? (
                <span className="text-emerald-600 font-bold">You unlocked Free Express Delivery!</span>
              ) : (
                <span>
                  Add <strong className="text-amber-600">৳{freeShippingRemaining.toLocaleString()}</strong> more for Free Delivery
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">
              {freeShippingProgress}%
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                freeShippingRemaining === 0 ? "bg-emerald-500" : "bg-amber-500"
              )}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* ── Line Items Scroll Area ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border/50">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/80 text-muted-foreground">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Your cart is empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Looks like you haven&apos;t added any items to your shopping cart yet.
                </p>
              </div>
              <Button
                type="button"
                variant="amber"
                size="sm"
                onClick={closeCart}
              >
                Browse Catalog
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start gap-3.5">
                {/* Thumb */}
                <Link
                  href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                  onClick={closeCart}
                  className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/30"
                >
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                      onClick={closeCart}
                      className="text-xs font-bold text-foreground line-clamp-1 hover:text-amber-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="text-muted-foreground hover:text-rose-600 transition-colors p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {item.variant && (
                    <span className="inline-block rounded bg-muted/70 px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
                      {item.variant.name}
                    </span>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg border border-border/80 bg-card shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-transform cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-transform cursor-pointer"
                        title={
                          item.quantity >= item.product.stock
                            ? `Only ${item.product.stock} units in stock`
                            : undefined
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">
                        ৳{item.subtotal.toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-muted-foreground">
                          ৳{item.unitPrice.toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Drawer Footer (Totals & Checkout) ── */}
        {items.length > 0 && (
          <div className="border-t border-border/70 bg-card/60 p-5 space-y-4 shadow-lg">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      Promo <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.description})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. TELOS10)"
                      className="h-9 w-full rounded-xl border border-border/80 bg-background pl-8 pr-3 text-xs uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
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
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                  <AlertCircle className="h-3 w-3" />
                  {couponError}
                </p>
              )}

              {promoSuccess && (
                <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Check className="h-3 w-3" />
                  Coupon discount applied successfully!
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">৳{subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-৳{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `৳${shipping.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-baseline justify-between text-sm">
                <span className="font-bold text-foreground">Total Payable</span>
                <span className="text-lg font-black text-foreground">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="space-y-2">
              <Button
                asChild
                variant="amber"
                size="lg"
                className="w-full"
              >
                <Link
                  href="/checkout"
                  onClick={closeCart}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Official Warranty
                </span>
                <span>•</span>
                <span>Cash on Delivery</span>
                <span>•</span>
                <span>bKash / Nagad</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
