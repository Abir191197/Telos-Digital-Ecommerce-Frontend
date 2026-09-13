"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Zap, BellRing } from "lucide-react";
import { Button } from "@/components/common";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/ecommerce.types";

interface ProductActionsProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isAdding: boolean;
  onAddToCart: () => void;
  onOpenNotifyStock: () => void;
}

export function ProductActions({
  product,
  quantity,
  onQuantityChange,
  isAdding,
  onAddToCart,
  onOpenNotifyStock,
}: ProductActionsProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Quantity:
        </label>
        <div className="flex items-center rounded-2xl bg-card shadow-2xs p-1">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 cursor-pointer transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-black">{quantity}</span>
          <button
            type="button"
            disabled={quantity >= product.stock}
            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {product.stock > 0 && quantity >= product.stock && (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
            Max stock reached
          </span>
        )}
      </div>

      {/* Primary Action Buttons */}
      {product.stock <= 0 ? (
        <div>
          <Button
            type="button"
            variant="amber"
            size="lg"
            onClick={onOpenNotifyStock}
            className="w-full rounded-2xl"
          >
            <BellRing className="h-4 w-4" />
            <span>Notify Me When In Stock</span>
          </Button>
          <p className="text-center text-[11px] text-muted-foreground mt-1.5">
            Get an instant SMS or Email notification when fresh stock arrives.
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
              "w-full rounded-2xl font-bold shadow-md shadow-amber-500/20",
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
            className="w-full rounded-2xl font-bold shadow-md"
          >
            <Link href={`/checkout?directProduct=${product.slug}&qty=${quantity}`}>
              <Zap className="h-4 w-4 fill-current text-amber-400" />
              <span>Buy Now (Instant)</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
