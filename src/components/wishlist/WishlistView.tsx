"use client";

import React, { useState, useMemo } from "react";
import { useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { products } from "@/data";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import { LazyMotion, domAnimation, type Variants } from "framer-motion";
import type { Product } from "@/types/ecommerce.types";

import {
  WishlistEmptyState,
  WishlistHeader,
  WishlistCardGrid,
  WishlistListRow,
} from "./";

const fadeUpAnim: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export function WishlistView() {
  const mounted = useMounted();
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [allMoved, setAllMoved] = useState(false);

  const handleUpdateQuantity = (id: string, delta: number, maxStock: number = 99) => {
    setQuantities((prev) => {
      const curr = prev[id] || 1;
      const next = Math.max(1, Math.min(curr + delta, maxStock));
      return { ...prev, [id]: next };
    });
  };

  // Quick count of in-stock items
  const inStockCount = useMemo(() => {
    return items.filter((p) => p.inStock && p.stock > 0).length;
  }, [items]);

  // Handler: Move single item to cart
  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleAddToCartWithQty = (product: Product, qty: number) => {
    addToCart(product, qty);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  // Handler: Move all currently in-stock items to cart
  const handleMoveAllToCart = () => {
    const inStockItems = items.filter((p) => p.inStock && p.stock > 0);
    inStockItems.forEach((p) => addToCart(p, 1));
    setAllMoved(true);
    setTimeout(() => setAllMoved(false), 2000);
  };

  // Recommendations for empty state
  const trendingRecommendations = useMemo(() => {
    return products
      .filter((p) => p.isFeatured || p.isFlashDeal)
      .slice(0, 5);
  }, []);

  if (!mounted) {
    return (
      <div className="container py-12">
        <div className="h-44 rounded-3xl bg-muted/40 animate-pulse" />
      </div>
    );
  }

  // ── EMPTY STATE ──
  if (items.length === 0) {
    return (
      <LazyMotion features={domAnimation}>
        <WishlistEmptyState
          trendingRecommendations={trendingRecommendations}
          fadeUpAnim={fadeUpAnim}
        />
      </LazyMotion>
    );
  }

  // ── POPULATED STATE ──
  return (
    <LazyMotion features={domAnimation}>
      <div className="container py-8 sm:py-12 space-y-8">
        {/* ── 1. Top Header Card ── */}
        <WishlistHeader
          itemCount={items.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClearWishlist={clearWishlist}
          inStockCount={inStockCount}
          allMoved={allMoved}
          onMoveAllToCart={handleMoveAllToCart}
        />

        {/* ── 2. Wishlist Product Cards Grid / List View ── */}
        {viewMode === "grid" ? (
          <WishlistCardGrid
            items={items}
            addedIds={addedIds}
            onRemoveItem={removeItem}
            onMoveToCart={handleMoveToCart}
          />
        ) : (
          <WishlistListRow
            items={items}
            addedIds={addedIds}
            quantities={quantities}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={removeItem}
            onAddToCartWithQty={handleAddToCartWithQty}
          />
        )}

        {/* ── BD Authenticity & Logistics Guarantees ── */}
        <section className="pt-6">
          <TrustGuaranteeCards />
        </section>

        {/* ── Dhaka Support & Customer Hotline ── */}
        <section className="pt-2">
          <SupportAndHelpstrip />
        </section>
      </div>
    </LazyMotion>
  );
}
