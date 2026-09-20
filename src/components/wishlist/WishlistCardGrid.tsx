"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductImageDisplay } from "@/components/shared";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/ecommerce.types";

interface WishlistCardGridProps {
  items: Product[];
  addedIds: Record<string, boolean>;
  onRemoveItem: (id: string) => void;
  onMoveToCart: (product: Product) => void;
}

export function WishlistCardGrid({
  items,
  addedIds,
  onRemoveItem,
  onMoveToCart,
}: WishlistCardGridProps) {
  return (
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
                className="block relative h-full w-full"
              >
                <ProductImageDisplay
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                  fallbackIconSize={28}
                />
              </Link>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemoveItem(product.id)}
                aria-label={`Remove ${product.name} from wishlist`}
                className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-md text-muted-foreground hover:bg-rose-500 hover:text-white transition-all shadow-xs cursor-pointer z-10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {/* Stock Status Pill */}
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
                    onClick={() => onMoveToCart(product)}
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
  );
}
