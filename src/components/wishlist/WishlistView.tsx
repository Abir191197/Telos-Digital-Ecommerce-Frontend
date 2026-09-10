"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WishlistView() {
  const mounted = useMounted();
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  const handleMoveToCart = (product: (typeof items)[0]) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleAddAllToCart = () => {
    items.forEach((product) => {
      addToCart(product, 1);
    });
  };

  if (!mounted) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="h-40 rounded-3xl bg-muted/40 animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <Heart className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Save items you love by tapping the heart icon on any smartphone, laptop, or gadget in our catalog.
          </p>
        </div>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Explore Verified Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-10 sm:py-14 space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
            <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
            <span>Saved Favorites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Products saved to your wishlist with real-time BD warranty and pricing status.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 text-xs font-bold text-muted-foreground transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All</span>
          </button>

          <button
            type="button"
            onClick={handleAddAllToCart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Move All to Cart</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => {
          const isAdded = addedIds[product.id];

          return (
            <div
              key={product.id}
              className="group relative flex flex-col rounded-3xl border border-border/80 bg-card p-4 text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square w-full rounded-2xl bg-muted/40 overflow-hidden mb-3">
                <Link href={ROUTES.PRODUCT_DETAIL(product.slug)} className="block h-full w-full">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Remove from wishlist button */}
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-background/85 backdrop-blur-md text-muted-foreground hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Discount Badge */}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                  </span>
                  <Link
                    href={ROUTES.PRODUCT_DETAIL(product.slug)}
                    className="block font-bold text-xs sm:text-sm text-foreground hover:text-amber-600 transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                </div>

                <div className="space-y-2 pt-1 border-t border-border/60">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm sm:text-base font-black text-foreground">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Add to cart CTA */}
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    className={cn(
                      "w-full h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs",
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-foreground text-background hover:bg-amber-500 hover:text-white"
                    )}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>{isAdded ? "Added to Cart!" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
