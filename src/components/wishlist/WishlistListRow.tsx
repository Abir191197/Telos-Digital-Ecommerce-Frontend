"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductImageDisplay } from "@/components/shared";
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/ecommerce.types";

interface WishlistListRowProps {
  items: Product[];
  addedIds: Record<string, boolean>;
  quantities: Record<string, number>;
  onUpdateQuantity: (id: string, delta: number, maxStock?: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCartWithQty: (product: Product, qty: number) => void;
}

export function WishlistListRow({
  items,
  addedIds,
  quantities,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCartWithQty,
}: WishlistListRowProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
      {/* Table Header (Desktop only) */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground items-center">
        <div className="col-span-4">Product</div>
        <div className="col-span-2 text-center">Stock Status</div>
        <div className="col-span-2 text-right pr-2">Price</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-1 text-center">Buy Action</div>
        <div className="col-span-1 text-center">Remove</div>
      </div>

      {/* List Rows */}
      <div className="divide-y divide-border/60">
        {items.map((product) => {
          const isAdded = addedIds[product.id];
          const isInStock = product.inStock && product.stock > 0;
          const qty = quantities[product.id] || 1;

          return (
            <div
              key={product.id}
              className="p-3.5 sm:p-5 lg:px-6 lg:py-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-stretch lg:items-center hover:bg-muted/15 transition-colors"
            >
              {/* 1. Product Details & Thumbnail (Col 4) */}
              <div className="w-full lg:col-span-4 flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl bg-muted/30 border border-border/40">
                  <ProductImageDisplay
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    sizes="88px"
                    className="object-cover"
                    fallbackIconSize={22}
                  />
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
                      onClick={() => onRemoveItem(product.id)}
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

                  {/* Mobile inline price */}
                  <div className="flex lg:hidden items-baseline gap-1.5 pt-0.5">
                    <span className="text-base font-black text-foreground">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] text-muted-foreground line-through decoration-muted-foreground/60">
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
              <div className="hidden lg:flex w-full lg:col-span-2 lg:justify-end items-baseline gap-2 pr-2">
                <span className="text-base font-black text-foreground">
                  ৳{product.price.toLocaleString()}
                </span>
              </div>

              {/* 4. Quantity Counter (Col 2) */}
              <div className="w-full lg:col-span-2 flex justify-between lg:justify-center items-center pt-2 lg:pt-0 border-t border-border/40 lg:border-t-0">
                <span className="lg:hidden text-xs font-medium text-muted-foreground">
                  Select Quantity:
                </span>
                <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/5 px-2.5 py-1 gap-2.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(product.id, -1, product.stock || 10)
                    }
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
                    onClick={() =>
                      onUpdateQuantity(product.id, 1, product.stock || 10)
                    }
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
                    onClick={() => onAddToCartWithQty(product, qty)}
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
                  onClick={() => onRemoveItem(product.id)}
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
  );
}
