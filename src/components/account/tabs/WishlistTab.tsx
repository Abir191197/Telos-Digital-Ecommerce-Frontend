"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  LayoutList,
  LayoutGrid,
  ExternalLink,
  ShoppingBag,
  Eye,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { Product } from "@/types/ecommerce.types";

interface WishlistTabProps {
  wishlistItems: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveWishlistItem: (productId: string) => void;
}

export function WishlistTab({
  wishlistItems,
  onAddToCart,
  onRemoveWishlistItem,
}: WishlistTabProps) {
  const [wishlistViewMode, setWishlistViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar: Title, Count, View Mode Toggle (List default vs Grid), and Full View link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Saved Wishlist
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
              {wishlistItems.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Items you saved for later purchase with live stock & price updates.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* View Mode Toggle Switch (Default: List) */}
          <div className="flex items-center bg-background/80 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={() => setWishlistViewMode("list")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                wishlistViewMode === "list"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-label="List view"
            >
              <LayoutList className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setWishlistViewMode("grid")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                wishlistViewMode === "grid"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <Link
            href={ROUTES.WISHLIST}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline px-2.5 py-1.5 rounded-xl hover:bg-amber-500/10 transition-colors"
          >
            <span>Full Page</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-3xl border border-border/80 dark:border-white/10 bg-card p-6 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08),0_2px_10px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.65)] space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto">
            <Heart className="h-6 w-6 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Your Wishlist is Empty</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Explore our collection and tap the heart icon on any product to save it here for later.
          </p>
          <div className="pt-2">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      ) : wishlistViewMode === "list" ? (
        /* ── 1. DEFAULT LIST VIEW ── */
        <div className="space-y-3">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4 sm:p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.06] hover:shadow-[0_12px_30px_-4px_rgba(245,158,11,0.08)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
            >
              {/* Product Thumbnail & Core Info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs group cursor-pointer border border-border/40"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    className="text-xs sm:text-sm font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 line-clamp-1 sm:line-clamp-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.categoryName || "Electronics"}
                  </p>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through font-mono">
                        ৳{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Remove */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                <button
                  type="button"
                  onClick={() => onAddToCart(item, 1)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer active:scale-95"
                  title="View Product"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onRemoveWishlistItem(item.id)}
                  aria-label="Remove item from wishlist"
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all cursor-pointer active:scale-95"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── 2. GRID VIEW ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4 space-y-3.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.06] hover:shadow-[0_14px_35px_-6px_rgba(245,158,11,0.1)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted/30 block group cursor-pointer shadow-2xs border border-border/40"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveWishlistItem(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-xs cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Link>

                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {item.categoryName || "Telos Cart"}
                  </p>
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block mt-0.5"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through font-mono">
                        ৳{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onAddToCart(item, 1)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer active:scale-95"
                  title="View Product"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
