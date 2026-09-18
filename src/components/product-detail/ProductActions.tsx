"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Zap, BellRing } from "lucide-react";
import { Button } from "@/components/common";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types/ecommerce.types";

interface ProductActionsProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isAdding: boolean;
  onAddToCart: () => void;
  onOpenNotifyStock: () => void;
}

export function ProductActions({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  isAdding,
  onAddToCart,
  onOpenNotifyStock,
}: ProductActionsProps) {
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = activeStock <= 0;

  return (
    <div className="mt-6 space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Quantity:
        </label>
        <div className="flex items-center rounded-2xl bg-card border border-border/80 p-1 shadow-2xs">
          <button
            type="button"
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 cursor-pointer transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-black">{isOutOfStock ? 0 : quantity}</span>
          <button
            type="button"
            disabled={isOutOfStock || quantity >= activeStock}
            onClick={() => onQuantityChange(Math.min(activeStock, quantity + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {activeStock > 0 && quantity >= activeStock && (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
            Max available stock reached
          </span>
        )}
      </div>

      {/* Primary Action Buttons */}
      {isOutOfStock ? (
        <div className="space-y-2">
          <Button
            type="button"
            variant="amber"
            size="lg"
            onClick={onOpenNotifyStock}
            className="w-full rounded-2xl font-bold"
          >
            <BellRing className="h-4 w-4" />
            <span>Notify Me When In Stock</span>
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Get an instant alert when fresh stock of this edition arrives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant={isAdding ? "default" : "amber"}
            size="lg"
            onClick={onAddToCart}
            className={cn(
              "w-full rounded-2xl font-bold shadow-md shadow-amber-500/20 transition-all",
              isAdding && "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAdding ? "Added to Cart!" : "Add to Cart"}</span>
          </Button>

          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full rounded-2xl font-bold shadow-md hover:bg-primary/90"
          >
            <Link
              href={`/checkout?directProduct=${product.slug}&qty=${quantity}${
                selectedVariant ? `&variantId=${selectedVariant.id}` : ""
              }`}
            >
              <Zap className="h-4 w-4 fill-current text-amber-400" />
              <span>Buy Now (Instant)</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
