"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { Product } from "@/types/ecommerce.types";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore } from "@/stores";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));

  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl",
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-muted/40">
        <Link href={productUrl} className="block h-full w-full">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            <Zap className="h-3 w-3 fill-white" />
            <span>-{product.discountPercentage}%</span>
          </div>
        ) : product.badge ? (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {product.badge}
          </div>
        ) : null}

        {/* Wishlist Quick Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110 active:scale-95",
            isWishlisted
              ? "text-rose-600 bg-rose-50 dark:bg-rose-950/50"
              : "text-muted-foreground hover:text-rose-600 hover:bg-background"
          )}
        >
          <Heart
            className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")}
          />
        </button>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {product.brand}
          </span>
          <span className="truncate max-w-[120px]">
            {product.specifications?.Subcategory || product.categoryName}
          </span>
        </div>

        {/* Title */}
        <Link
          href={productUrl}
          className="mt-1 font-semibold text-sm text-foreground line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          {product.name}
        </Link>

        {/* Rating & Reviews */}
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-foreground">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-muted-foreground">({product.reviewCount})</span>
          <span className="mx-1 text-border">·</span>
          <span className="flex items-center gap-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-3 w-3" />
            Official
          </span>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-border/50">
          <div>
            <div className="text-base font-bold text-foreground">
              ৳{product.price.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-muted-foreground line-through">
                ৳{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold shadow-xs transition-all active:scale-95",
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 text-white hover:bg-amber-600"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{isAdding ? "Added!" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
