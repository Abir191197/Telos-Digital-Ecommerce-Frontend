"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types/ecommerce.types";

interface ProductInfoProps {
  product: Product;
  selectedVariantId?: string;
  onSelectVariant: (id: string) => void;
  currentPrice: number;
}

export function ProductInfo({
  product,
  selectedVariantId,
  onSelectVariant,
  currentPrice,
}: ProductInfoProps) {
  const discountAmount =
    product.originalPrice && product.originalPrice > currentPrice
      ? product.originalPrice - currentPrice
      : 0;

  return (
    <div>
      {/* Brand & Stock Pill */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-zinc-950 transition-colors"
          >
            {product.brand} Official
          </Link>
          <span className="text-[11px] text-muted-foreground font-mono">
            SKU: {product.sku}
          </span>
        </div>

        {product.inStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            In Stock ({product.stock} available)
          </span>
        ) : (
          <span className="text-xs font-semibold text-rose-600">Out of Stock</span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="mt-3 text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-foreground leading-tight">
        {product.name}
      </h1>

      {/* Rating & Short Review Summary */}
      <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-400 font-bold">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground font-medium">
          {product.reviewCount} customer reviews
        </span>
        <span className="text-muted-foreground/30">•</span>
        <span className="text-muted-foreground">
          Aisle:{" "}
          <strong className="text-foreground font-semibold">
            {product.specifications?.Subcategory || product.categoryName}
          </strong>
        </span>
      </div>

      {/* Clean Frameless Pricing Box */}
      <div className="mt-5 p-5 rounded-3xl bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            ৳{currentPrice.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > currentPrice && (
            <>
              <span className="text-base sm:text-lg text-muted-foreground line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
              <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-xs font-bold">
                Save ৳{discountAmount.toLocaleString()}
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Inclusive of VAT and official Bangladesh warranty. Free delivery in Dhaka metro.
        </p>
      </div>

      {/* Short Description */}
      <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Variant Selector (if variants exist) */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-6 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Edition / Specification:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: ProductVariant) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant(v.id)}
                className={cn(
                  "rounded-2xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs",
                  selectedVariantId === v.id
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                <span>{v.name}</span>
                {v.price !== product.price && (
                  <span className="ml-1.5 text-[11px] opacity-75">
                    (৳{v.price.toLocaleString()})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
