"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Flame,
  Zap,
  CheckSquare,
  Square,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";
import { ROUTES } from "@/constants";

interface FlashDealDesktopTableProps {
  products: Product[];
  selectedIds: string[];
  homepageFeaturedCount: number;
  maxHomepageLimit: number;
  updatingId: string | null;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onToggleFlashDeal: (product: Product) => void;
  onToggleHomepageFeatured: (product: Product) => void;
}

export function FlashDealDesktopTable({
  products,
  selectedIds,
  homepageFeaturedCount,
  maxHomepageLimit,
  updatingId,
  onToggleSelect,
  onSelectAll,
  onToggleFlashDeal,
  onToggleHomepageFeatured,
}: FlashDealDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl border-none bg-card shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto min-h-[340px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
              <th className="py-3 px-4 w-10">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Select all"
                >
                  {selectedIds.length > 0 && selectedIds.length === products.length ? (
                    <CheckSquare className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Brand & Category</th>
              <th className="py-3 px-4 text-right">Selling Price</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>Include in Flash Deals</span>
                </div>
              </th>
              <th className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>Feature on Homepage ({homepageFeaturedCount}/{maxHomepageLimit})</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground">
                  <p className="font-semibold text-sm">No products found matching filters</p>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const isSelected = selectedIds.includes(prod.id);
                const isUpdating = updatingId === prod.id;
                const sellingPrice = Number(prod.price) || 0;
                const originalPrice = prod.originalPrice ? Number(prod.originalPrice) : null;
                const discount =
                  originalPrice && originalPrice > sellingPrice
                    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
                    : prod.discountPercentage || 0;

                const isInFlashDeals = Boolean(prod.isFlashDeal);
                const isFeaturedOnHome = Boolean(prod.isFeatured && prod.isFlashDeal);

                return (
                  <tr
                    key={prod.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors group",
                      isSelected && "bg-amber-500/5",
                      isUpdating && "opacity-60 pointer-events-none"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(prod.id)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Select row"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Product Media + Name */}
                    <td className="py-3 px-4 max-w-[260px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/60">
                          <Image
                            src={prod.thumbnail}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={ROUTES.PRODUCT_DETAIL(prod.slug)}
                            target="_blank"
                            className="font-bold text-foreground text-xs hover:text-amber-500 transition-colors line-clamp-1 group/title flex items-center gap-1"
                          >
                            <span>{prod.name}</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover/title:opacity-100 transition-opacity text-muted-foreground shrink-0" />
                          </Link>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            SKU: {prod.sku || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Brand & Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-foreground text-[11px]">
                        {prod.brand || "Generic"}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {prod.categoryName || "Uncategorized"}
                      </div>
                    </td>

                    {/* Selling Price & Discount */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="font-bold text-foreground">
                        ৳{sellingPrice.toLocaleString()}
                      </div>
                      {originalPrice && originalPrice > sellingPrice ? (
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted-foreground line-through">
                            ৳{originalPrice.toLocaleString()}
                          </span>
                          <span className="rounded bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[9px] font-black px-1 py-0.2">
                            -{discount}%
                          </span>
                        </div>
                      ) : null}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                          prod.stock > 10
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : prod.stock > 0
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Toggle: Include in Flash Deals */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onToggleFlashDeal(prod)}
                        disabled={isUpdating}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                          isInFlashDeals
                            ? "bg-amber-500"
                            : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                        role="switch"
                        aria-checked={isInFlashDeals}
                        aria-label={`Toggle Flash Deals for ${prod.name}`}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                            isInFlashDeals ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                      <div className="text-[9px] font-bold mt-1 text-muted-foreground">
                        {isInFlashDeals ? (
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold">Active</span>
                        ) : (
                          "Off"
                        )}
                      </div>
                    </td>

                    {/* Toggle: Feature on Homepage (Max 12) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onToggleHomepageFeatured(prod)}
                        disabled={isUpdating}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                          isFeaturedOnHome
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                        role="switch"
                        aria-checked={isFeaturedOnHome}
                        aria-label={`Toggle Homepage Feature for ${prod.name}`}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                            isFeaturedOnHome ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                      <div className="text-[9px] font-bold mt-1 text-muted-foreground">
                        {isFeaturedOnHome ? (
                          <span className="text-orange-600 dark:text-orange-400 font-extrabold flex items-center justify-center gap-0.5">
                            <Flame className="h-2.5 w-2.5 fill-orange-500" />
                            Homepage
                          </span>
                        ) : (
                          "Off"
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
