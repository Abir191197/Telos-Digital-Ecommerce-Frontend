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
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mounted = useMounted();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) => state.isInWishlist(product.id));
  const isWishlisted = mounted ? isInWishlistStore : false;

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
        "group relative flex flex-col rounded-3xl bg-card text-card-foreground p-2.5 transition-all duration-300 ease-out hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]",
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/40 dark:bg-zinc-900/60">
        <Link href={productUrl} className="block h-full w-full">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-zinc-950 shadow-sm">
            <Zap className="h-3 w-3 fill-zinc-950" />
            <span>-{product.discountPercentage}%</span>
          </div>
        ) : product.badge ? (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-zinc-900/80 dark:bg-zinc-100/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-100 dark:text-zinc-900 shadow-sm">
            {product.badge}
          </div>
        ) : null}

        {/* Wishlist Quick Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
            isWishlisted
              ? "text-rose-600 bg-rose-500/15"
              : "text-muted-foreground hover:text-rose-500 hover:bg-background"
          )}
        >
          <Heart
            className={cn("h-4 w-4 transition-transform", isWishlisted && "fill-rose-500 text-rose-500 scale-110")}
          />
        </button>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col px-2 pt-3 pb-1">
        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold uppercase tracking-wider text-muted-foreground/90">
            {product.brand}
          </span>
          <span className="truncate max-w-[110px] text-[10px] text-muted-foreground/70">
            {product.specifications?.Subcategory || product.categoryName}
          </span>
        </div>

        {/* Title */}
        <Link
          href={productUrl}
          className="mt-1 font-semibold text-sm text-foreground line-clamp-2 hover:text-amber-500 transition-colors leading-snug"
        >
          {product.name}
        </Link>

        {/* Rating & Reviews */}
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-foreground text-xs">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
          <span className="mx-1 text-muted/80">·</span>
          <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-semibold">
            <ShieldCheck className="h-3 w-3" />
            Genuine
          </span>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-auto pt-3.5 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-foreground tracking-tight">
              ৳{product.price.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-muted-foreground line-through">
                ৳{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-all active:scale-95 cursor-pointer",
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-foreground text-background hover:opacity-90 hover:scale-105 shadow-sm"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-[2.3]" />
            <span>{isAdding ? "Added" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
