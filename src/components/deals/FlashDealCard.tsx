"use client";

import React, { useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductImageDisplay } from "@/components/shared";
import { useRouter, usePathname } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Shield,
  Zap,
  Flame,
  Check,
} from "lucide-react";
import type { Product } from "@/types/ecommerce.types";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAddToCartMutation } from "@/services/api/cart/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveWishlistItemMutation,
} from "@/services/api/wishlist/wishlistApi";

export interface FlashDealCardProps {
  product: Product;
  className?: string;
  claimedPercent?: number;
  itemsLeft?: number;
}

export function FlashDealCard({
  product,
  className,
  claimedPercent: customClaimed,
  itemsLeft: customItemsLeft,
}: FlashDealCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const progressId = useId();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) => state.isInWishlist(product.id));
  const isWishlisted = mounted ? isInWishlistStore : false;

  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistItemMutation] = useRemoveWishlistItemMutation();

  const [isAdding, setIsAdding] = React.useState(false);

  // Deterministic calculation for stock scarcity if not explicitly provided
  const { claimed, left } = React.useMemo(() => {
    if (customClaimed !== undefined) {
      return {
        claimed: customClaimed,
        left: customItemsLeft ?? Math.max(2, Math.min(product.stock || 5, 8)),
      };
    }
    // Generate deterministic yet lively % based on product id
    let seed = 0;
    for (let i = 0; i < product.id.length; i++) {
      seed = (seed * 31 + product.id.charCodeAt(i)) % 1000;
    }
    const derivedClaimed = 58 + (seed % 34); // 58% to 92%
    const derivedLeft = Math.max(2, Math.min(product.stock || 5, 3 + (seed % 6)));
    return { claimed: derivedClaimed, left: derivedLeft };
  }, [customClaimed, customItemsLeft, product.id, product.stock]);

  // Price calculations
  const discountPercent = React.useMemo(() => {
    if (product.discountPercentage && product.discountPercentage > 0) {
      return product.discountPercentage;
    }
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 15; // default minimum promotional visual
  }, [product.discountPercentage, product.originalPrice, product.price]);

  const originalPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : Math.round(product.price * (1 + discountPercent / 100));

  const savingsAmount = originalPrice - product.price;

  const isUuid = (id?: string) =>
    Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      router.push("/dashboard/products");
      return;
    }

    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(
        pathname
      )}&action=add-to-cart&productId=${product.id}&quantity=1`;
      router.push(redirectUrl);
      return;
    }

    setIsAdding(true);
    addItem(product, 1);
    if (isUuid(product.id)) {
      try {
        await addToCartMutation({ productId: product.id, quantity: 1 }).unwrap();
      } catch (err) {
        console.error("Failed to add to cart on server:", err);
      }
    }
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdmin) return;

    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(
        pathname
      )}&action=add-to-wishlist&productId=${product.id}`;
      router.push(redirectUrl);
      return;
    }

    const willBeWishlisted = !isWishlisted;
    toggleWishlist(product);
    if (isUuid(product.id)) {
      try {
        if (willBeWishlisted) {
          await addToWishlistMutation({ productId: product.id }).unwrap();
        } else {
          await removeWishlistItemMutation(product.id).unwrap();
        }
      } catch (err: any) {
        console.error(
          "Failed to toggle wishlist on server:",
          err?.data?.message || err?.message || err
        );
      }
    }
  };

  const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full rounded-2xl sm:rounded-3xl bg-card text-card-foreground p-3 sm:p-3.5 border border-amber-500/15 hover:border-amber-500/15 transition-all duration-300 ease-out hover:-translate-y-2 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_-10px_rgba(245,158,11,0.22),0_12px_24px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_22px_50px_-10px_rgba(245,158,11,0.3),0_12px_28px_-8px_rgba(0,0,0,0.7)]",
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-muted/40 dark:bg-zinc-900/60">
        <Link href={productUrl} className="relative block h-full w-full">
          <ProductImageDisplay
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Dynamic Flash Discount Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black text-zinc-950 shadow-md shadow-amber-500/25">
          <Zap className="h-3 w-3 fill-zinc-950" />
          <span>-{discountPercent}%</span>
        </div>

        {/* Wishlist Quick Button */}
        {!isAdmin && (
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "absolute top-2.5 right-2.5 flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
              isWishlisted
                ? "text-rose-600 bg-rose-500/15"
                : "text-muted-foreground hover:text-rose-500 hover:bg-background"
            )}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform",
                isWishlisted && "fill-rose-500 text-rose-500 scale-110"
              )}
            />
          </button>
        )}
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col pt-3 pb-1">
        {/* Brand & Genuine Tag */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground">
          <span className="font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {product.brand}
          </span>
          <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-3 w-3" />
            Genuine
          </span>
        </div>

        {/* Product Title */}
        <div className="mt-1 h-9 sm:h-10 flex items-start">
          <Link
            href={productUrl}
            className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 hover:text-amber-500 transition-colors leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500 shrink-0">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-foreground text-[11px]">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price & Savings */}
        <div className="mt-2.5 flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-foreground tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
              ৳{originalPrice.toLocaleString()}
            </span>
          </div>

          {savingsAmount > 0 && (
            <span className="rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 whitespace-nowrap">
              Save ৳{savingsAmount.toLocaleString()}
            </span>
          )}
        </div>

        {/* Flash Scarcity & Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1 font-semibold">
            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
              <Flame className="h-3 w-3 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{claimed}% Claimed</span>
            </span>
            <span className="text-muted-foreground text-[10px]">
              Only <strong className="text-foreground font-black">{left}</strong> left!
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={claimed}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby={progressId}
            className="relative h-2 w-full overflow-hidden rounded-full bg-amber-500/15 dark:bg-zinc-800"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-700 ease-out"
              style={{ width: `${claimed}%` }}
            />
          </div>
          <span id={progressId} className="sr-only">
            {claimed}% claimed
          </span>
        </div>

        {/* Quick CTA Action Button */}
        <div className="mt-3.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label={isAdmin ? "Manage product" : "Claim Deal and add to cart"}
            className={cn(
              "w-full flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl px-3 text-[11px] sm:text-xs font-black transition-all duration-200 active:scale-95 cursor-pointer shadow-xs",
              isAdmin
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                : isAdding
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 hover:from-amber-400 hover:to-orange-400 hover:shadow-md hover:shadow-orange-500/25"
            )}
          >
            {isAdmin ? (
              <>
                <Shield className="h-3.5 w-3.5 stroke-[2.3]" />
                <span>Admin Manage</span>
              </>
            ) : isAdding ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>Claimed to Cart!</span>
              </>
            ) : (
              <>
                <Flame className="h-3.5 w-3.5 fill-zinc-950" />
                <span>Claim Deal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
