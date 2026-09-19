"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Zap, BellRing, ShieldCheck, LayoutDashboard } from "lucide-react";
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
  isAdmin?: boolean;
}

export function ProductActions({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  isAdding,
  onAddToCart,
  onOpenNotifyStock,
  isAdmin = false,
}: ProductActionsProps) {
  if (isAdmin) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-3.5">
        <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span>Administrator Preview Mode</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You are currently logged in with an Administrative account. Shopping bag and checkout operations are reserved exclusively for customer profiles. You can manage product inventory, pricing, and stock directly from the Admin Portal.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <Button asChild variant="amber" size="sm" className="rounded-xl font-bold">
            <Link href="/dashboard/products">
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Manage in Admin Portal
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
            className="w-full rounded-2xl font-bold shadow-md bg-zinc-900 text-white hover:bg-amber-500 hover:text-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-amber-500 dark:hover:text-zinc-950 transition-all duration-200 group"
          >
            <Link
              href={`/checkout?directProduct=${product.slug}&qty=${quantity}${
                selectedVariant ? `&variantId=${selectedVariant.id}` : ""
              }`}
            >
              <Zap className="h-4 w-4 fill-amber-400 text-amber-400 group-hover:fill-zinc-950 group-hover:text-zinc-950 transition-colors" />
              <span>Buy Now (Instant)</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
