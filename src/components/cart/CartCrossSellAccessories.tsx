"use client";

import React from "react";
import Link from "next/link";
import { ProductImageDisplay } from "@/components/shared";
import { PlusCircle, Plus, CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/ecommerce.types";

interface CartCrossSellAccessoriesProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function CartCrossSellAccessories({
  products,
  onAddToCart,
}: CartCrossSellAccessoriesProps) {
  if (products.length === 0) return null;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm sm:text-base font-black tracking-tight text-foreground">
            Frequently Paired Tech Accessories
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground">
          Verified Compatible
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((rec) => (
          <div
            key={rec.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5 hover:border-amber-500/40 hover:bg-card transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-background border border-border/40">
                <ProductImageDisplay
                  src={rec.thumbnail}
                  alt={rec.name}
                  fill
                  sizes="56px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackIconSize={18}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {rec.brand}
                </span>
                <Link
                  href={`/products/${rec.slug}`}
                  className="block text-xs font-bold text-foreground line-clamp-1 hover:text-amber-500 transition-colors"
                >
                  {rec.name}
                </Link>
                <p className="text-xs font-black text-foreground">
                  ৳{rec.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                In Stock
              </span>
              <button
                type="button"
                onClick={() => onAddToCart(rec)}
                className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
