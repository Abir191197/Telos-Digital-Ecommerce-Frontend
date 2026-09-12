"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, useWishlistStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Heart,
  Lock,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Gift,
} from "lucide-react";
import { Button } from "@/components/common";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import { products } from "@/data";

export function CartView() {
  const mounted = useMounted();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getFreeShippingRemaining,
    getItemCount,
    addItem,
  } = useCartStore();

  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  // Local state for Cart page specific capabilities
  const [promoInput, setPromoInput] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<"inside-dhaka" | "outside-dhaka">("inside-dhaka");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Calculations
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const freeShippingRemaining = getFreeShippingRemaining();
  const itemCount = getItemCount();

  // Dynamic shipping estimate based on user toggle
  const estimatedShippingFee = subtotal >= 5000 ? 0 : deliveryZone === "inside-dhaka" ? 70 : 130;
  const estimatedTotal = Math.max(0, subtotal - discount + estimatedShippingFee);

  const freeShippingProgress = Math.min(
    100,
    Math.round(((5000 - freeShippingRemaining) / 5000) * 100)
  );

  // Free Tiered Perks calculation
  const perksUnlocked = useMemo(() => ({
    stickers: subtotal >= 2000,
    freeDelivery: subtotal >= 5000,
    extendedWarranty: subtotal >= 15000,
  }), [subtotal]);

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

  const handleSaveForLater = (item: (typeof items)[0]) => {
    addToWishlist(item.product);
    removeItem(item.id);
    setSaveToast(`Moved "${item.product.name}" to your Saved for Later shelf.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleMoveBackToCart = (product: (typeof wishlistItems)[0]) => {
    addItem(product, 1);
    removeFromWishlist(product.id);
    setSaveToast(`Moved "${product.name}" back into your Cart.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Restrict cart page without login
  if (!user) {
    router.replace(`${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(ROUTES.CART)}`);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Breadcrumb Navigation ── */}
      <nav aria-label="Breadcrumb" className="border-b border-border/50 bg-muted/20">
        <div className="container py-3.5">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li>
              <Link href={ROUTES.HOME} className="hover:text-amber-500 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
            <li className="font-semibold text-foreground">Shopping Bag</li>
          </ol>
        </div>
      </nav>

      {/* ── Toast Notification Banner ── */}
      {saveToast && (
        <div className="sticky top-16 z-30 bg-amber-500 text-zinc-950 px-4 py-2.5 text-xs font-bold text-center shadow-md animate-in slide-in-from-top duration-300">
          {saveToast}
        </div>
      )}

      {/* ── Main Stage ── */}
      <main className="container py-6 sm:py-8 space-y-6">
        {/* Page Header with Cart Summary */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                Shopping Bag
              </h1>
              {itemCount > 0 && (
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Review line items, adjust quantities, preview delivery fees, or save items for later before moving to checkout.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {showClearConfirm ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/25 px-3 py-1.5 animate-in fade-in duration-200">
                  <span className="text-xs font-semibold text-destructive">Clear all items?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                    }}
                    className="rounded-lg bg-destructive px-2.5 py-1 text-xs font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Cart</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Empty State ── */}
        {items.length === 0 ? (
          <div className="py-16 text-center space-y-6">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
              <ShoppingBag className="h-12 w-12" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-black text-foreground">Your shopping bag is empty</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You haven&apos;t placed any products in your cart yet. Discover authentic flagship gadgets, laptops, audio gear, and lifestyle tech with 100% official brand warranties.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild variant="amber" size="lg" className="rounded-2xl font-bold">
                <Link href={ROUTES.PRODUCTS}>
                  <span>Explore Products</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl font-semibold">
                <Link href={ROUTES.WISHLIST}>
                  <Heart className="h-4 w-4 mr-1.5 text-rose-500" />
                  <span>View Saved Wishlist ({wishlistItems.length})</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* ── Content Stage (Line Items + Summary) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Line Items + Perks + Saved Shelf (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Spatial Glassmorphic Free Delivery Milestone Bar */}
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-6 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-all">
                {/* Subtle ambient light gradient */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl"
                />

                <div className="relative z-10 space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
                        freeShippingRemaining === 0
                          ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          : "bg-muted/80 text-muted-foreground border border-border/60"
                      )}>
                        <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        {freeShippingRemaining === 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-xs sm:text-sm font-black tracking-tight text-foreground">
                              Free Delivery Qualified
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Sparkles className="h-2.5 w-2.5" /> ৳0 Shipping
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm font-bold text-foreground">
                            Add <span className="text-amber-500 font-black">৳{freeShippingRemaining.toLocaleString()}</span> for Free Delivery
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground pt-0.5 hidden xs:block">
                          Express courier coverage across all 64 districts
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs sm:text-sm font-black tabular-nums text-foreground">
                        {freeShippingProgress}%
                      </span>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">Goal ৳5,000</p>
                    </div>
                  </div>

                  {/* Glassmorphic Track & Antigravity Fill */}
                  <div className="relative h-2 w-full rounded-full bg-muted/70 p-0.5 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out shadow-xs",
                        freeShippingRemaining === 0
                          ? "bg-linear-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                          : "bg-linear-to-r from-amber-600/80 to-amber-400"
                      )}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>

                  {/* Tiered Milestone Indicators */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-border/50 text-[10px] sm:text-[11px]">
                    <div className={cn(
                      "flex items-center gap-1 sm:gap-1.5 transition-colors truncate",
                      perksUnlocked.stickers ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>
                      <span className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        perksUnlocked.stickers ? "bg-amber-500 ring-2 ring-amber-500/30" : "bg-muted-foreground/40"
                      )} />
                      <span className="truncate">৳2k Freebie</span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-1 sm:gap-1.5 justify-center transition-colors truncate",
                      perksUnlocked.freeDelivery ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>
                      <span className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        perksUnlocked.freeDelivery ? "bg-amber-500 ring-2 ring-amber-500/30" : "bg-muted-foreground/40"
                      )} />
                      <span className="truncate">৳5k Delivery</span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-1 sm:gap-1.5 justify-end transition-colors truncate",
                      perksUnlocked.extendedWarranty ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}>
                      <span className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        perksUnlocked.extendedWarranty ? "bg-amber-500 ring-2 ring-amber-500/30" : "bg-muted-foreground/40"
                      )} />
                      <span className="truncate">৳15k VIP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Primary Line Items Table */}
              <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground items-center">
                  <div className="col-span-5">Product Details</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-5 lg:p-6 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 items-stretch lg:items-center hover:bg-muted/15 transition-colors"
                    >
                      {/* Product (Col 5) */}
                      <div className="w-full lg:col-span-5 flex items-start sm:items-center gap-3 sm:gap-4">
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                          className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-amber-500/40 transition-colors"
                        >
                          <Image
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </Link>

                        <div className="min-w-0 flex-1 space-y-1">
                          <Link
                            href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                            className="font-bold text-xs sm:text-sm lg:text-base text-foreground hover:text-amber-500 transition-colors line-clamp-2 leading-snug"
                          >
                            {item.product.name}
                          </Link>

                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs">
                              {item.product.brand || "Official Store"}
                            </span>
                            {item.variant && (
                              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                                {item.variant.name}
                              </span>
                            )}
                            {item.product.stock <= 3 && item.product.stock > 0 && (
                              <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-rose-600">
                                {item.product.stock} left
                              </span>
                            )}
                          </div>

                          {/* Mobile inline Unit Price */}
                          <div className="flex lg:hidden items-baseline gap-1.5 pt-0.5">
                            <span className="text-xs font-semibold text-muted-foreground">Unit:</span>
                            <span className="text-xs font-bold text-foreground">
                              ৳{item.unitPrice.toLocaleString()}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.unitPrice && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                ৳{item.product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Quick Actions (Save for later, delete) */}
                          <div className="flex items-center gap-3 pt-1 text-xs">
                            <button
                              type="button"
                              onClick={() => handleSaveForLater(item)}
                              className="font-semibold text-muted-foreground hover:text-amber-500 transition-colors flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
                            >
                              <Heart className="h-3 w-3" />
                              <span>Save for Later</span>
                            </button>
                            <span className="text-border">•</span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="font-semibold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Unit Price (Col 2 - Desktop only) */}
                      <div className="hidden lg:flex w-full lg:col-span-2 lg:justify-center items-baseline gap-2">
                        <span className="text-sm sm:text-base font-bold text-foreground">
                          ৳{item.unitPrice.toLocaleString()}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.unitPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ৳{item.product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Mobile unified row for Quantity & Subtotal */}
                      <div className="w-full lg:contents flex items-center justify-between pt-2.5 lg:pt-0 border-t border-border/50 lg:border-t-0">
                        {/* Quantity Stepper (Col 3) */}
                        <div className="lg:col-span-3 flex lg:justify-center items-center gap-2">
                          <span className="lg:hidden text-xs font-semibold text-muted-foreground">
                            Qty:
                          </span>
                          <div className="inline-flex items-center rounded-xl bg-muted/60 border border-border/80 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background active:scale-90 transition-all cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 sm:w-8 text-center text-xs font-bold text-foreground select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={item.quantity >= item.product.stock}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
                              title={
                                item.quantity >= item.product.stock
                                  ? `Only ${item.product.stock} units in stock`
                                  : undefined
                              }
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal (Col 2) */}
                        <div className="lg:col-span-2 flex lg:justify-end items-baseline gap-1.5">
                          <span className="lg:hidden text-xs font-semibold text-muted-foreground">
                            Total:
                          </span>
                          <span className="text-base sm:text-lg font-black text-foreground">
                            ৳{item.subtotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Navigation link bar */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 pt-1">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-amber-500 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  Need help? Call <strong className="text-foreground">+880 1700-000000</strong>
                </span>
              </div>

              {/* 4. "Frequently Paired Tech Accessories" - Fills whitespace & boosts AOV */}
              <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h2 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                      Frequently Paired Tech Accessories
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Verified Compatible
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products
                    .filter((p) => !items.some((item) => item.product.id === p.id))
                    .slice(0, 3)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 hover:border-amber-500/40 hover:bg-card transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-background border border-border/40">
                            <Image
                              src={rec.thumbnail}
                              alt={rec.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              {rec.brand}
                            </span>
                            <Link
                              href={`/products/${rec.slug}`}
                              className="block text-xs font-bold text-foreground line-clamp-1 hover:text-amber-500 transition-colors"
                            >
                              {rec.name}
                            </Link>
                            <p className="text-xs font-black text-foreground">
                              ৳{rec.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            In Stock
                          </span>
                          <button
                            type="button"
                            onClick={() => addItem(rec, 1)}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 5. "Saved for Later" Shelf (Wishlist Integration) */}
              {wishlistItems.length > 0 && (
                <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <h2 className="text-sm font-bold text-foreground">
                        Saved for Later ({wishlistItems.length})
                      </h2>
                    </div>
                    <Link
                      href={ROUTES.WISHLIST}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Manage All Wishlist Items →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlistItems.slice(0, 4).map((savedProduct) => (
                      <div
                        key={savedProduct.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50 hover:border-amber-500/30 transition-colors"
                      >
                        <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-background border border-border/50">
                          <Image
                            src={savedProduct.thumbnail}
                            alt={savedProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-xs font-bold text-foreground truncate">
                            {savedProduct.name}
                          </p>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            ৳{savedProduct.price.toLocaleString()}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleMoveBackToCart(savedProduct)}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Move to Cart</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(savedProduct.id)}
                          aria-label={`Delete ${savedProduct.name}`}
                          className="text-muted-foreground/60 hover:text-destructive p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Estimate (4 cols, sticky) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg space-y-5">
                <h2 className="text-lg font-black tracking-tight text-foreground border-b border-border/60 pb-3">
                  Summary & Estimate
                </h2>

                {/* Shipping Zone Estimator (Cart page preview only) */}
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
                      onClick={() => setDeliveryZone("inside-dhaka")}
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
                      onClick={() => setDeliveryZone("outside-dhaka")}
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
                          <p className="text-[11px] opacity-80">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
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
                    <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span className="font-semibold text-foreground">৳{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">-৳{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Delivery</span>
                    <span>
                      {estimatedShippingFee === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `৳${estimatedShippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-foreground">Estimated Total</span>
                      <p className="text-[11px] text-muted-foreground">VAT included where applicable</p>
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
                    <Link href={ROUTES.CHECKOUT} className="flex items-center justify-center gap-2">
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
                    <span><strong>7-Day Easy Replacement</strong> on defects.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>BTRC Verified IMEI</strong> for smartphones.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Open-box inspection</strong> with courier.</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ── Guarantees & Dhaka Support CTA Section ── */}
        <section className="pt-2">
          <TrustGuaranteeCards />
        </section>
        <section className="pt-1">
          <SupportAndHelpstrip />
        </section>
      </main>
    </div>
  );
}
