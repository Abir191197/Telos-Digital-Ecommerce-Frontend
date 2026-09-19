"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Ticket, Sparkles, Check, Edit3 } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import type { Product, ProductVariant } from "@/types/ecommerce.types";

interface ProductInfoProps {
  product: Product;
  selectedVariantId?: string;
  onSelectVariant: (id: string) => void;
  currentPrice: number;
  selectedVariant?: ProductVariant;
}

export function ProductInfo({
  product,
  selectedVariantId,
  onSelectVariant,
  currentPrice,
  selectedVariant,
}: ProductInfoProps) {
  // Authentication & Role Check (strictly for admin or super admin)
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated with admin role
    const hasAdminStoreRole =
      isAuthenticated &&
      (user?.role === "admin" || (user as any)?.role === "SUPER_ADMIN");

    // Also check edge/auth cookie in browser
    const hasAdminCookie =
      typeof document !== "undefined" &&
      document.cookie
        .split(";")
        .some((item) => {
          const cookie = item.trim();
          return (
            cookie.startsWith("authRole=SUPER_ADMIN") ||
            cookie.startsWith("authRole=ADMIN")
          );
        });

    setIsAdmin(Boolean(hasAdminStoreRole || hasAdminCookie));
  }, [isAuthenticated, user]);

  // Current active original price and discount
  const activeOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const discountAmount =
    activeOriginalPrice && activeOriginalPrice > currentPrice
      ? activeOriginalPrice - currentPrice
      : 0;

  // Active inventory count
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const inStock = activeStock > 0;
  const activeSku = selectedVariant?.sku || product.sku;

  // Group variants by type or render clean interactive buttons
  const variants = product.variants || [];

  return (
    <div className="space-y-4">
      {/* Brand, Badges & Admin Edit Action */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {product.brand && (
            <Link
              href={product.brandSlug ? ROUTES.BRAND_DETAIL(product.brandSlug) : ROUTES.PRODUCTS}
              className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-zinc-950 transition-colors"
            >
              {product.brand} Official
            </Link>
          )}

          {product.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> {product.badge}
            </span>
          )}

          {activeSku && (
            <span className="text-[11px] text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded-md">
              SKU: {activeSku}
            </span>
          )}
        </div>

        {/* Edit Button - ONLY visible to Admin / Super Admin */}
        {isAdmin && (
          <Link
            href={`/dashboard/products/${product.slug}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 px-3.5 py-1 text-xs font-bold transition-all shadow-sm shadow-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            title="Edit product in Admin Dashboard"
          >
            <Edit3 className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Edit Product</span>
          </Link>
        )}
      </div>

      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
        {product.name}
      </h1>

      {/* Rating & Short Review Summary */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        <div className="flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-400 font-bold">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <span>{(product.rating || 5.0).toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground">
          ({product.reviewCount || 0} reviews)
        </span>
        <span className="text-muted-foreground/30">•</span>
        <span className="text-muted-foreground">
          {product.categoryName}
        </span>
        {product.subCategoryName && (
          <>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-muted-foreground">
              {product.subCategoryName}
            </span>
          </>
        )}
      </div>

      {/* Clean Compact Pricing & Stock Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/70 shadow-2xs">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            ৳{currentPrice.toLocaleString()}
          </span>
          {activeOriginalPrice && activeOriginalPrice > currentPrice && (
            <>
              <span className="text-sm sm:text-base text-muted-foreground line-through font-medium">
                ৳{activeOriginalPrice.toLocaleString()}
              </span>
              <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-[11px] font-bold">
                Save ৳{discountAmount.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Stock status badge */}
        <div>
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Stock ({activeStock})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Promo Voucher Ribbon (clean minimal pill if enabled) */}
      {product.hasVoucher && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-medium">
          <Ticket className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span>
            Voucher:{" "}
            <strong className="font-bold">
              {product.voucherDiscountType === "PERCENTAGE"
                ? `${product.voucherDiscountValue}% OFF`
                : `৳${product.voucherDiscountValue} OFF`}
            </strong>
            {product.voucherCouponCode ? ` (Code: ${product.voucherCouponCode})` : ""}
          </span>
        </div>
      )}

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {product.shortDescription}
        </p>
      )}

      {/* Variant Selector (Handles Colors, Sizes, Weights, Editions) */}
      {variants.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Edition / Variant:
            </label>
            {selectedVariant && (
              <span className="text-xs font-semibold text-foreground">
                {selectedVariant.name || [selectedVariant.color, selectedVariant.size, selectedVariant.weight].filter(Boolean).join(" - ")}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {variants.map((v: ProductVariant) => {
              const isSelected = selectedVariantId === v.id;
              const vPrice = v.price || product.price;
              const vStock = v.stock ?? 0;
              const isOutOfStock = vStock <= 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onSelectVariant(v.id)}
                  className={cn(
                    "group relative inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border",
                    isSelected
                      ? "bg-amber-500 text-zinc-950 font-bold border-amber-500 shadow-sm shadow-amber-500/20"
                      : isOutOfStock
                        ? "bg-muted/20 text-muted-foreground/50 border-border/40 cursor-not-allowed line-through"
                        : "bg-card text-foreground border-border/70 hover:border-foreground/30 hover:bg-muted/40"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3] shrink-0" />}
                  <span>{v.name || [v.color, v.size, v.weight].filter(Boolean).join(" / ")}</span>

                  {vPrice !== product.price && (
                    <span
                      className={cn(
                        "text-[10px] font-mono",
                        isSelected ? "text-zinc-900/80 font-medium" : "text-muted-foreground"
                      )}
                    >
                      (৳{vPrice.toLocaleString()})
                    </span>
                  )}

                  {isOutOfStock && (
                    <span className="text-[9px] uppercase font-bold text-rose-500 ml-1">
                      Sold Out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
