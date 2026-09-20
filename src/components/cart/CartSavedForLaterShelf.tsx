"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Trash2 } from "lucide-react";
import { ROUTES } from "@/constants";
import type { Product } from "@/types/ecommerce.types";

interface CartSavedForLaterShelfProps {
  wishlistItems: Product[];
  onMoveBackToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export function CartSavedForLaterShelf({
  wishlistItems,
  onMoveBackToCart,
  onRemoveFromWishlist,
}: CartSavedForLaterShelfProps) {
  if (wishlistItems.length === 0) return null;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <h2 className="text-sm font-bold text-foreground">
            Saved for Later ({wishlistItems.length})
          </h2>
        </div>
        <Link
          href={ROUTES.WISHLIST}
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          Manage All Wishlist Items →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {wishlistItems.slice(0, 4).map((savedProduct) => (
          <div
            key={savedProduct.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/50 hover:border-amber-500/30 transition-colors"
          >
            <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-background border border-border/50">
              <Image
                src={savedProduct.thumbnail}
                alt={savedProduct.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-xs font-bold text-foreground truncate">
                {savedProduct.name}
              </p>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ৳{savedProduct.price.toLocaleString()}
              </p>
              <button
                type="button"
                onClick={() => onMoveBackToCart(savedProduct)}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <Plus className="h-3 w-3" />
                <span>Move to Cart</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemoveFromWishlist(savedProduct.id)}
              aria-label={`Delete ${savedProduct.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-background text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors shadow-2xs active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
