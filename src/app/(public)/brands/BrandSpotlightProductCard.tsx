"use client";

import React from "react";
import Link from "next/link";
import { ProductImageDisplay } from "@/components/shared";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Shield,
  Zap,
  Flame,
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

interface BrandSpotlightProductCardProps {
  product: Product;
  className?: string;
}

export function BrandSpotlightProductCard({
  product,
  className,
}: BrandSpotlightProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );
  const isWishlisted = mounted ? isInWishlistStore : false;

  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistItemMutation] = useRemoveWishlistItemMutation();
  const [isAdding, setIsAdding] = React.useState(false);

  const isUuid = (id?: string) =>
    Boolean(
      id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id
        )
    );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?.role === "admin") {
      router.push("/dashboard/products");
      return;
    }

    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}&action=add-to-cart&productId=${product.id}&quantity=1`;
      router.push(redirectUrl);
      return;
    }

    setIsAdding(true);
    addItem(product, 1);
    if (isUuid(product.id)) {
      try {
        await addToCartMutation({ productId: product.id, quantity: 1 }).unwrap();
      } catch (err: any) {
        console.error("Failed to add to cart on server:", err);
      }
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdmin) {
      return;
    }

    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}&action=add-to-wishlist&productId=${product.id}`;
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
      } catch (err) {
        console.error("Failed to sync wishlist on server:", err);
      }
    }
  };

  const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full rounded-3xl bg-gradient-to-b from-card via-card to-card/95 border border-amber-500/20 hover:border-amber-500/50 p-3 transition-all duration-300 ease-out hover:-translate-y-1.5 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_42px_-10px_rgba(245,158,11,0.18)] dark:hover:shadow-[0_20px_42px_-10px_rgba(245,158,11,0.25)] select-none",
        className
      )}
    >
      {/* Top Ambient Glow on Hover */}
      <div
        aria-hidden="true"
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Media Container with distinct warm aspect */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl bg-muted/40 dark:bg-zinc-900/60">
        <Link href={productUrl} className="relative block h-full w-full">
          <ProductImageDisplay
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Hot / Official Flagship Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-950 shadow-md">
          <Flame className="h-3 w-3 fill-zinc-950 animate-pulse" />
          <span>Hot Pick</span>
        </div>

        {/* Wishlist Quick Button */}
        {!isAdmin && (
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className={cn(
              "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur-md shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
              isWishlisted
                ? "text-rose-600 bg-rose-500/15"
                : "text-muted-foreground hover:text-rose-500 hover:bg-background"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform",
                isWishlisted && "fill-rose-500 text-rose-500 scale-110"
              )}
            />
          </button>
        )}
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-0.5">
        {/* Brand Capsule Tag */}
        <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
          <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md tracking-wider text-[10px] uppercase">
            {product.brand}
          </span>
          <span className="text-[10px] text-muted-foreground/80 truncate">
            Official Warranty
          </span>
        </div>

        {/* Title */}
        <div className="h-10 flex items-start mt-0.5">
          <Link
            href={productUrl}
            className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 hover:text-amber-500 transition-colors leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Rating & Stock */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500 shrink-0">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-foreground text-[11px]">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            ({product.reviewCount})
          </span>
          <span className="text-muted/60">·</span>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
            <ShieldCheck className="h-3 w-3 shrink-0" />
            Authorized
          </span>
        </div>

        {/* Price & Action Button Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border/40">
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="text-sm sm:text-base font-black text-foreground tracking-tight truncate leading-tight">
              ৳{product.price.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="text-[10px] sm:text-xs text-muted-foreground line-through truncate leading-none mt-0.5">
                ৳{product.originalPrice.toLocaleString()}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={
              user?.role === "admin"
                ? "Manage in Admin Dashboard"
                : "Add to cart"
            }
            className={cn(
              "shrink-0 flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-xl px-3 sm:px-4 text-[11px] sm:text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-xs",
              user?.role === "admin"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                : isAdding
                ? "bg-emerald-600 text-white shadow-emerald-600/25"
                : "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black hover:shadow-md hover:shadow-amber-500/25 hover:scale-105"
            )}
          >
            {user?.role === "admin" ? (
              <>
                <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.3]" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.3]" />
                <span>{isAdding ? "Added" : "Add"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
