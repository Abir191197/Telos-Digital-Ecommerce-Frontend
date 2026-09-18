"use client";

import React, { useState, useEffect } from "react";
import { useCartStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "@/services/api/cart/cartApi";
import {
  DrawerHeader,
  DrawerFreeShippingBar,
  DrawerItem,
  DrawerEmpty,
  DrawerFooter,
} from "./drawer";

export function CartDrawer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [updateCartItemMutation] = useUpdateCartItemMutation();
  const [removeCartItemMutation] = useRemoveCartItemMutation();
  const [clearCartMutation] = useClearCartMutation();

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

  const handleUpdateQuantity = async (id: string, qty: number) => {
    updateQuantity(id, qty);
    if (isAuthenticated) {
      try {
        await updateCartItemMutation({ id, quantity: qty }).unwrap();
      } catch (err) {
        console.error("Failed to update cart quantity on server:", err);
      }
    }
  };

  const handleRemoveItem = async (id: string) => {
    removeItem(id);
    if (isAuthenticated) {
      try {
        await removeCartItemMutation(id).unwrap();
      } catch (err) {
        console.error("Failed to remove cart item on server:", err);
      }
    }
  };

  const handleClearCart = async () => {
    clearCart();
    setShowClearConfirm(false);
    if (isAuthenticated) {
      try {
        await clearCartMutation().unwrap();
      } catch (err) {
        console.error("Failed to clear cart on server:", err);
      }
    }
  };

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
        {/* Drawer Header */}
        <DrawerHeader
          itemCount={itemCount}
          hasItems={items.length > 0}
          showClearConfirm={showClearConfirm}
          onShowClearConfirm={setShowClearConfirm}
          onClearCart={handleClearCart}
          onCloseCart={closeCart}
        />

        {/* Free Shipping Progress Bar */}
        <DrawerFreeShippingBar
          freeShippingRemaining={freeShippingRemaining}
        />

        {/* Line Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-border/40 scrollbar-thin">
          {items.length === 0 ? (
            <DrawerEmpty onCloseCart={closeCart} isAuthenticated={isAuthenticated} />
          ) : (
            <div className="divide-y divide-border/40">
              {items.map((item) => (
                <DrawerItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCloseCart={closeCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Totals & Checkout) */}
        {items.length > 0 && (
          <DrawerFooter
            appliedCoupon={appliedCoupon}
            couponError={couponError}
            promoInput={promoInput}
            promoSuccess={promoSuccess}
            onPromoInputChange={setPromoInput}
            onApplyPromo={handleApplyPromo}
            onRemoveCoupon={removeCoupon}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            onCloseCart={closeCart}
          />
        )}
      </aside>
    </div>
  );
}
