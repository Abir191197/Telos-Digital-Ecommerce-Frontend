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
        "group relative flex flex-col rounded-2xl border border-border/80 bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.12)] hover:shadow-2xl",
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-muted/30">
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
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md shadow-rose-600/25">
            <Zap className="h-3 w-3 fill-white" />
            <span>-{product.discountPercentage}%</span>
          </div>
        ) : product.badge ? (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-zinc-950 shadow-sm">
            {product.badge}
          </div>
        ) : null}

        {/* Wishlist Quick Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
            isWishlisted
              ? "text-rose-600 bg-rose-500/10 border-rose-500/30"
              : "text-muted-foreground hover:text-rose-500 hover:bg-background"
          )}
        >
          <Heart
            className={cn("h-4 w-4 transition-transform", isWishlisted && "fill-rose-500 text-rose-500 scale-110")}
          />
        </button>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold uppercase tracking-wider text-amber-500">
            {product.brand}
          </span>
          <span className="truncate max-w-[120px]">
            {product.specifications?.Subcategory || product.categoryName}
          </span>
        </div>

        {/* Title */}
        <Link
          href={productUrl}
          className="mt-1 font-semibold text-sm text-foreground line-clamp-2 hover:text-amber-500 transition-colors"
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
          <span className="flex items-center gap-0.5 text-[11px] text-emerald-500 font-medium">
            <ShieldCheck className="h-3 w-3" />
            Official
          </span>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-border/50">
          <div>
            <div className="text-base font-extrabold text-foreground tracking-tight">
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
              "flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer",
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:shadow-md hover:shadow-amber-500/25 hover:scale-105"
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-[2.3]" />
            <span>{isAdding ? "Added!" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
