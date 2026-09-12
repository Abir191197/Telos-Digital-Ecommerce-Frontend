"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Flame,
  LayoutGrid,
  List,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

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

  const getItemQuantity = (id: string) => quantities[id] || 1;

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
  const handleMoveToCart = (product: (typeof items)[0]) => {
    addToCart(product, 1);
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

  // Recommendations for empty state or below wishlist
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
        <div className="container py-12 sm:py-16 space-y-12">
          {/* Empty Hero Card */}
          <m.div
            variants={fadeUpAnim}
            initial="hidden"
            animate="visible"
            className="rounded-3xl sm:rounded-[2.5rem] bg-card border border-border/60 p-8 sm:p-14 text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] max-w-2xl mx-auto space-y-6"
          >
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="h-10 w-10 sm:h-12 sm:w-12 fill-rose-500/20 text-rose-500" />
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Your Wishlist is Empty
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Save gadgets, smartphones, laptops, and accessories to track official Bangladesh pricing, stock levels, and discount deals.
              </p>
            </div>

            {/* Quick Category Discovery Pills */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Explore Popular Aisles
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: "Smartphones", slug: "smartphones-tablets" },
                  { label: "Laptops & MacBooks", slug: "laptops-macbooks" },
                  { label: "Audio & Headphones", slug: "audio-headphones" },
                  { label: "Gaming Gear", slug: "gaming-gear-consoles" },
                ].map((aisle) => (
                  <Link
                    key={aisle.slug}
                    href={ROUTES.CATEGORY_DETAIL(aisle.slug)}
                    className="rounded-full bg-muted/60 hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                  >
                    {aisle.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3 text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Explore Full Catalog</span>
              </Link>
            </div>
          </m.div>

          {/* Trending Deals Rail */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <span>Trending BD Official Deals</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Most saved tech gear this week with manufacturer warranty.
                </p>
              </div>
              <Link
                href={ROUTES.PRODUCTS}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {trendingRecommendations.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>

          {/* BD Trust & Support Strips */}
          <section className="pt-4">
            <TrustGuaranteeCards />
          </section>
          <section className="pt-2">
            <SupportAndHelpstrip />
          </section>
        </div>
      </LazyMotion>
    );
  }

  // ── POPULATED STATE ──
  return (
    <LazyMotion features={domAnimation}>
      <div className="container py-8 sm:py-12 space-y-8">
        {/* ── 1. Top Header Card ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
              <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
              <span>Saved Tech Favorites</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              My Wishlist ({items.length})
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Live Bangladesh pricing, authentic manufacturer distributor warranty, and real-time inventory.
            </p>
          </div>

          {/* Action Buttons & View Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
            {/* Grid vs List View Toggle Pill */}
            <div className="flex items-center rounded-xl bg-muted/50 p-1 border border-border/70 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer",
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 px-3 sm:px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all cursor-pointer shadow-2xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Clear All</span>
              </button>

              <button
                type="button"
                disabled={inStockCount === 0}
                onClick={handleMoveAllToCart}
                className={cn(
                  "inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap",
                  inStockCount === 0
                    ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                    : allMoved
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/25"
                )}
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{allMoved ? "Added!" : "Add All to Cart"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Wishlist Product Cards Grid / List View ── */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
            {items.map((product) => {
              const isAdded = addedIds[product.id];
              const isInStock = product.inStock && product.stock > 0;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_18px_38px_-8px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Top Media / Thumbnail */}
                  <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                    <Link
                      href={ROUTES.PRODUCT_DETAIL(product.slug)}
                      className="block h-full w-full"
                    >
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                      />
                    </Link>

                    {/* Remove button (top right) */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-md text-muted-foreground hover:bg-rose-500 hover:text-white transition-all shadow-xs cursor-pointer z-10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Stock Status Pill (top left) */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                      {isInStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-zinc-300 shadow-2xs">
                          <span>Out of Stock</span>
                        </span>
                      )}

                      {/* Discount Percentage */}
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <span className="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-zinc-950 shadow-2xs">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content & Action */}
                  <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                        <span className="uppercase tracking-wider truncate">
                          {product.brand}
                        </span>
                        <span className="text-amber-500 shrink-0">
                          ★ {product.rating}
                        </span>
                      </div>

                      <Link
                        href={ROUTES.PRODUCT_DETAIL(product.slug)}
                        className="line-clamp-2 text-xs sm:text-sm font-bold text-foreground hover:text-amber-500 transition-colors leading-snug"
                      >
                        {product.name}
                      </Link>

                      {/* Live Bangladesh Pricing */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm sm:text-base font-black text-foreground">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div>
                      {isInStock ? (
                        <button
                          type="button"
                          onClick={() => handleMoveToCart(product)}
                          className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer",
                            isAdded
                              ? "bg-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20"
                          )}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>{isAdded ? "Added to Cart" : "Add to Cart"}</span>
                        </button>
                      ) : (
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(product.slug)}
                          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-border/80 bg-muted/50 py-2.5 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <span>Notify When Back</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Responsive List View (Desktop table, Mobile native app card) ── */
          <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
            {/* Table Header (Desktop only) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground items-center">
              <div className="col-span-4">Product</div>
              <div className="col-span-2 text-center">Stock Status</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-1 text-center">Buy Action</div>
              <div className="col-span-1 text-center">Remove</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-border/60">
              {items.map((product) => {
                const isAdded = addedIds[product.id];
                const isInStock = product.inStock && product.stock > 0;
                const qty = getItemQuantity(product.id);

                return (
                  <div
                    key={product.id}
                    className="p-3.5 sm:p-5 lg:px-6 lg:py-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-stretch lg:items-center hover:bg-muted/15 transition-colors"
                  >
                    {/* 1. Product Details & Thumbnail (Col 4) */}
                    <div className="w-full lg:col-span-4 flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl bg-muted/30 border border-border/40">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground font-black text-xl">
                            {product.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={ROUTES.PRODUCT_DETAIL(product.slug)}
                            className="font-bold text-sm sm:text-base text-foreground hover:text-amber-500 transition-colors line-clamp-2 lg:line-clamp-1 leading-snug"
                          >
                            {product.name}
                          </Link>
                          {/* Mobile quick remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="lg:hidden flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {product.brand || "Official Store"}
                          </span>
                          <span className="text-muted-foreground/50">•</span>
                          {/* Mobile inline stock badge */}
                          {isInStock ? (
                            <span className="inline-flex lg:hidden items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>In Stock</span>
                            </span>
                          ) : (
                            <span className="inline-flex lg:hidden items-center gap-1 text-[11px] font-bold text-rose-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              <span>Out of Stock</span>
                            </span>
                          )}
                        </div>

                        {/* Mobile inline price presentation */}
                        <div className="flex lg:hidden items-baseline gap-2 pt-0.5">
                          <span className="text-base font-black text-foreground">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. Stock Status (Col 2 - Desktop) */}
                    <div className="hidden lg:flex w-full lg:col-span-2 lg:justify-center items-center gap-2">
                      {isInStock ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{product.stock} In Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </div>

                    {/* 3. Price (Col 2 - Desktop) */}
                    <div className="hidden lg:flex w-full lg:col-span-2 lg:justify-center items-baseline gap-2">
                      <span className="text-base font-black text-foreground">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* 4. Thematic Quantity Counter (Col 2) */}
                    <div className="w-full lg:col-span-2 flex justify-between lg:justify-center items-center pt-2 lg:pt-0 border-t border-border/40 lg:border-t-0">
                      <span className="lg:hidden text-xs font-medium text-muted-foreground">
                        Select Quantity:
                      </span>
                      <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/5 px-2.5 py-1 gap-2.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.id, -1, product.stock || 10)}
                          disabled={qty <= 1}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 transition-all cursor-pointer active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-foreground">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.id, 1, product.stock || 10)}
                          disabled={qty >= (product.stock || 10)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 transition-all cursor-pointer active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 5. Buy Action (Col 1) */}
                    <div className="w-full lg:col-span-1 flex items-center justify-center pt-1 lg:pt-0">
                      {isInStock ? (
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product, qty);
                            setAddedIds((prev) => ({ ...prev, [product.id]: true }));
                            setTimeout(() => {
                              setAddedIds((prev) => ({ ...prev, [product.id]: false }));
                            }, 1200);
                          }}
                          className={cn(
                            "w-full lg:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 lg:py-2 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap",
                            isAdded
                              ? "bg-emerald-600 text-white shadow-emerald-500/20"
                              : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20"
                          )}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>{isAdded ? "Added to Cart" : "Add to Cart"}</span>
                        </button>
                      ) : (
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(product.slug)}
                          className="w-full lg:w-auto inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 lg:py-1.5 text-xs font-semibold bg-muted/60 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                        >
                          Notify When Back
                        </Link>
                      )}
                    </div>

                    {/* 6. Remove Column (Col 1 - Desktop) */}
                    <div className="hidden lg:flex w-full lg:col-span-1 items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
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
