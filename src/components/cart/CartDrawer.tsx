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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="fixed inset-0 bottom-16 md:bottom-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-over panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className="relative z-10 flex h-[calc(100%-4rem)] md:h-full w-full max-w-md flex-col bg-background/95 backdrop-blur-xl text-foreground shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-transform animate-in slide-in-from-right duration-300 border-l border-border/70"
      >
        {/* ── Drawer Header ── */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20 shadow-inner">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-foreground">Shopping Bag</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {itemCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {itemCount === 0 ? "No items selected" : `Ready for express Bangladesh delivery`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <>
                {showClearConfirm ? (
                  <div className="flex items-center gap-1 bg-destructive/10 rounded-lg p-1 border border-destructive/20 animate-in fade-in duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setShowClearConfirm(false);
                      }}
                      className="px-2 py-1 text-[11px] font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    title="Clear entire cart"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        <div className="border-b border-border/60 bg-muted/20 px-5 py-3.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Truck className="h-3.5 w-3.5" />
              </div>
              {freeShippingRemaining === 0 ? (
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <span className="text-xs">Free Delivery Qualified</span>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.2 text-[10px] text-amber-600 dark:text-amber-400">
                    ৳0 Delivery
                  </span>
                </div>
              ) : (
                <span>
                  Add <strong className="text-amber-500 font-bold">৳{freeShippingRemaining.toLocaleString()}</strong> for Free Delivery
                </span>
              )}
            </div>
            <span className="text-[11px] font-black tabular-nums text-foreground">
              {freeShippingProgress}%
            </span>
          </div>

          <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted/70 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 shadow-xs",
                freeShippingRemaining === 0
                  ? "bg-linear-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                  : "bg-linear-to-r from-amber-500 to-amber-400"
              )}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* ── Line Items Scroll Area ── */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-border/40 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500/80 border border-amber-500/20">
                <ShoppingBag className="h-10 w-10" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
                </span>
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-base font-black text-foreground">Your shopping bag is empty</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Discover genuine smartphones, laptops, audio gear, and gadgets with official warranties.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
                <Button
                  type="button"
                  variant="amber"
                  size="default"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/products">
                    <span>Explore Products</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
                <Link
                  href="/wishlist"
                  onClick={closeCart}
                  className="text-xs font-semibold text-muted-foreground hover:text-amber-500 py-1 transition-colors"
                >
                  Check Saved Items in Wishlist →
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center gap-3.5 group">
                  {/* Thumb */}
                  <Link
                    href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                    onClick={closeCart}
                    className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-muted/30 group-hover:border-amber-500/40 transition-colors"
                  >
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="72px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                        onClick={closeCart}
                        className="text-xs font-bold text-foreground line-clamp-1 hover:text-amber-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.variant ? (
                        <span className="inline-block rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {item.variant.name}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="h-2.5 w-2.5" /> In Stock
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1.5">
                      {/* Crisp Clean Segmented Stepper */}
                      <div className="inline-flex items-center rounded-xl bg-muted/60 border border-border/80 p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background active:scale-90 transition-all cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-foreground select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.product.stock}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
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
              ))}
            </div>
          )}
        </div>

        {/* ── Drawer Footer (Totals & Checkout) ── */}
        {items.length > 0 && (
          <div className="border-t border-border/70 bg-card/80 backdrop-blur-md p-5 space-y-3.5 shadow-2xl">
            {/* Promo Code Accordion / Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
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
                <span className="font-semibold text-foreground">৳{subtotal.toLocaleString()}</span>
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
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                  ) : (
                    `৳${shipping.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-baseline justify-between text-sm">
                <div>
                  <span className="font-black text-foreground">Total Payable</span>
                  <p className="text-[10px] text-muted-foreground font-normal">VAT included where applicable</p>
                </div>
                <span className="text-xl font-black text-foreground">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions: View Cart + Checkout (Horizontal Clean Layout) */}
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
                    onClick={closeCart}
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
                    onClick={closeCart}
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
        )}
      </aside>
    </div>
  );
}

