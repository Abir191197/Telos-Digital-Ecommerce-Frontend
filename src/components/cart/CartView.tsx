"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, useWishlistStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { ChevronRight, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import {
  useGetMyCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useAddToCartMutation,
} from "@/services/api/cart/cartApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import type { CartItem } from "@/types/cart.types";
import type { Product } from "@/types/ecommerce.types";

import {
  CartFreeShippingBar,
  CartLineItemsTable,
  CartSummarySidebar,
  CartCrossSellAccessories,
  CartSavedForLaterShelf,
  CartEmptyState,
} from "./";

export function CartView() {
  const mounted = useMounted();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

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

  const {
    items: wishlistItems,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();

  // Backend Cart API hooks
  const { isLoading: isCartLoading } = useGetMyCartQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  const [updateCartItemMutation] = useUpdateCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();
  const [addToCartMutation] = useAddToCartMutation();

  // Real catalog products for cross-sell recommendations
  const { data: productsData } = useGetProductsQuery({ limit: 6 });

  // Local state
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

  const estimatedShippingFee =
    subtotal >= 5000 ? 0 : deliveryZone === "inside-dhaka" ? 70 : 130;
  const estimatedTotal = Math.max(0, subtotal - discount + estimatedShippingFee);

  const freeShippingProgress = Math.min(
    100,
    Math.round(((5000 - freeShippingRemaining) / 5000) * 100)
  );

  const perksUnlocked = useMemo(
    () => ({
      stickers: subtotal >= 2000,
      freeDelivery: subtotal >= 5000,
      extendedWarranty: subtotal >= 15000,
    }),
    [subtotal]
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

  const handleUpdateQuantity = async (id: string, qty: number) => {
    updateQuantity(id, qty);
    try {
      await updateCartItemMutation({ id, quantity: qty }).unwrap();
    } catch (err) {
      console.error("Failed to update cart quantity on server:", err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    removeItem(id);
    try {
      await removeCartItemMutation(id).unwrap();
    } catch (err) {
      console.error("Failed to remove cart item on server:", err);
    }
  };

  const handleClearCart = async () => {
    clearCart();
    setShowClearConfirm(false);
    try {
      await clearCartMutation().unwrap();
    } catch (err) {
      console.error("Failed to clear cart on server:", err);
    }
  };

  const handleSaveForLater = (item: CartItem) => {
    addToWishlist(item.product);
    handleRemoveItem(item.id);
    setSaveToast(`Moved "${item.product.name}" to your Saved for Later shelf.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleMoveBackToCart = async (product: Product) => {
    addItem(product, 1);
    removeFromWishlist(product.id);
    setSaveToast(`Moved "${product.name}" back into your Cart.`);
    setTimeout(() => setSaveToast(null), 3000);
    try {
      await addToCartMutation({ productId: product.id, quantity: 1 }).unwrap();
    } catch (err) {
      console.error("Failed to add to cart on server:", err);
    }
  };

  const handleAddCrossSell = async (product: Product) => {
    addItem(product, 1);
    try {
      await addToCartMutation({ productId: product.id, quantity: 1 }).unwrap();
    } catch (err) {
      console.error("Failed to add accessory to server cart:", err);
    }
  };

  // Cross-sell items from real catalog products
  const crossSellAccessories = useMemo(() => {
    const catalog = productsData?.data || [];
    return catalog
      .filter((p) => !items.some((item) => item.product.id === p.id))
      .slice(0, 3);
  }, [productsData, items]);

  useEffect(() => {
    if (!mounted) return;
    if (user?.role === "admin") {
      router.replace(ROUTES.DASHBOARD);
    } else if (!user) {
      router.replace(`${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(ROUTES.CART)}`);
    }
  }, [mounted, user, router]);

  if (!mounted || user?.role === "admin" || !user) {
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
                    onClick={handleClearCart}
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
        {isCartLoading && items.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-muted-foreground">Loading your cart from server...</p>
          </div>
        ) : items.length === 0 ? (
          <CartEmptyState wishlistCount={wishlistItems.length} />
        ) : (
          /* ── Content Stage (Line Items + Summary) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Line Items + Perks + Saved Shelf (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Free Delivery Milestone Bar */}
              <CartFreeShippingBar
                freeShippingRemaining={freeShippingRemaining}
                freeShippingProgress={freeShippingProgress}
                perksUnlocked={perksUnlocked}
              />

              {/* 2. Primary Line Items Table */}
              <CartLineItemsTable
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onSaveForLater={handleSaveForLater}
              />

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

              {/* 4. Frequently Paired Tech Accessories */}
              <CartCrossSellAccessories
                products={crossSellAccessories}
                onAddToCart={handleAddCrossSell}
              />

              {/* 5. Saved for Later Shelf */}
              <CartSavedForLaterShelf
                wishlistItems={wishlistItems}
                onMoveBackToCart={handleMoveBackToCart}
                onRemoveFromWishlist={removeFromWishlist}
              />
            </div>

            {/* Right Column: Order Summary & Estimate (4 cols, sticky) */}
            <CartSummarySidebar
              itemCount={itemCount}
              subtotal={subtotal}
              discount={discount}
              estimatedShippingFee={estimatedShippingFee}
              estimatedTotal={estimatedTotal}
              deliveryZone={deliveryZone}
              onDeliveryZoneChange={setDeliveryZone}
              promoInput={promoInput}
              onPromoInputChange={setPromoInput}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              promoSuccess={promoSuccess}
              onApplyPromo={handleApplyPromo}
              onRemoveCoupon={removeCoupon}
            />
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
