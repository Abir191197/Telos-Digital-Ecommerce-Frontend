"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWishlistStore, useCartStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { products } from "@/data";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import { LazyMotion, domAnimation, type Variants } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/ecommerce.types";

import {
  WishlistEmptyState,
  WishlistHeader,
  WishlistCardGrid,
  WishlistListRow,
} from "./";

const INITIAL_BATCH_SIZE = 10;
const LOAD_MORE_BATCH_SIZE = 6;

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
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (mounted && isAdmin) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [mounted, isAdmin, router]);

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [allMoved, setAllMoved] = useState(false);

  // Infinite Scroll State (active when items.length > 10)
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const isInfiniteScrollActive = items.length > INITIAL_BATCH_SIZE;
  const displayedItems = useMemo(() => {
    if (!isInfiniteScrollActive) return items;
    return items.slice(0, visibleCount);
  }, [items, visibleCount, isInfiniteScrollActive]);

  const hasMore = isInfiniteScrollActive && visibleCount < items.length;

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + LOAD_MORE_BATCH_SIZE, items.length));
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { rootMargin: "150px" }
    );

    const currentRef = loadMoreTriggerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, items.length]);

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

  if (!mounted || (mounted && isAdmin)) {
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
            items={displayedItems}
            addedIds={addedIds}
            onRemoveItem={removeItem}
            onMoveToCart={handleMoveToCart}
          />
        ) : (
          <WishlistListRow
            items={displayedItems}
            addedIds={addedIds}
            quantities={quantities}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={removeItem}
            onAddToCartWithQty={handleAddToCartWithQty}
          />
        )}

        {/* ── Infinite Scroll Trigger Indicator (shown when > 10 items) ── */}
        {isInfiniteScrollActive && (
          <div ref={loadMoreTriggerRef} className="pt-4 pb-2 flex justify-center">
            {hasMore ? (
              <div className="inline-flex items-center gap-2.5 rounded-full bg-card border border-border px-5 py-2.5 text-xs font-bold text-muted-foreground shadow-2xs animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>Loading more saved items... ({displayedItems.length} of {items.length})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>All {items.length} saved wishlist items loaded</span>
              </div>
            )}
          </div>
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
