"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWishlistStore, useCartStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { useGetMyWishlistQuery } from "@/services/api/wishlist/wishlistApi";
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = user?.role === "admin";

  const isCustomer = isAuthenticated && !isAdmin;
  const { isLoading: isServerWishlistLoading, isFetching: isServerWishlistFetching } =
    useGetMyWishlistQuery(undefined, {
      skip: !isCustomer,
    });

  const items = useWishlistStore((state) => state.items);
  const hasHydrated = useWishlistStore((state) => state._hasHydrated);
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

  const { data: serverProducts } = useGetProductsQuery({ limit: 20 });
  const allProducts = serverProducts?.data || [];

  // Recommendations for empty state
  const trendingRecommendations = useMemo(() => {
    const featured = allProducts.filter((p) => p.isFeatured || p.isFlashDeal);
    return (featured.length > 0 ? featured : allProducts).slice(0, 5);
  }, [allProducts]);

  const isWishlistDataLoading =
    !mounted ||
    !hasHydrated ||
    (isCustomer && (isServerWishlistLoading || (isServerWishlistFetching && items.length === 0)));

  if (isWishlistDataLoading || (mounted && isAdmin)) {
    return (
      <div className="container py-8 sm:py-12 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 md:pb-6 border-b border-border/60">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-muted/60 rounded-full" />
            <div className="h-8 sm:h-10 w-48 sm:w-64 bg-muted/70 rounded-xl" />
            <div className="h-4 w-72 sm:w-96 bg-muted/50 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-muted/60 rounded-xl" />
            <div className="h-9 w-32 bg-muted/60 rounded-xl" />
          </div>
        </div>

        {/* Wishlist Items List Skeleton */}
        <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-xs divide-y divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`wishlist-skeleton-${i}`}
              className="p-4 sm:p-5 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center justify-between">
              <div className="w-full lg:col-span-5 flex items-center gap-4">
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-muted/60 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-muted/70 rounded" />
                  <div className="h-3 w-1/3 bg-muted/50 rounded" />
                  <div className="h-3 w-1/2 bg-muted/40 rounded" />
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-2 text-center">
                <div className="h-6 w-20 bg-muted/60 rounded-full mx-auto" />
              </div>
              <div className="hidden lg:block lg:col-span-2 text-center">
                <div className="h-5 w-24 bg-muted/70 rounded mx-auto" />
              </div>
              <div className="w-full lg:col-span-3 flex items-center justify-end gap-2">
                <div className="h-9 w-28 bg-muted/60 rounded-full" />
                <div className="h-9 w-9 bg-muted/40 rounded-full" />
              </div>
            </div>
          ))}
        </div>
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
