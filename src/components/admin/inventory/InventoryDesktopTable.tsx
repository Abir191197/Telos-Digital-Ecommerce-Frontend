"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";

interface InventoryDesktopTableProps {
  products: Product[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onManageStock: (product: Product) => void;
}

function formatShortTitle(title: string, wordLimit = 12): string {
  if (!title) return "";
  const words = title.trim().split(/\s+/);
  if (words.length <= wordLimit) return title;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export function InventoryDesktopTable({
  products,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onManageStock,
}: InventoryDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl border-none bg-card shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto min-h-[340px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
              <th className="py-3.5 px-4 w-10">
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
              <th className="py-3.5 px-5">Product Name</th>
              <th className="py-3.5 px-5 text-right">Price</th>
              <th className="py-3.5 px-6 text-center">Stock Level</th>
              <th className="py-3.5 px-5 text-right w-44">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package className="h-10 w-10 text-muted-foreground/40 stroke-1" />
                    <p className="font-bold text-sm text-foreground">No stock records found</p>
                    <p className="text-xs text-muted-foreground">
                      Try clearing or adjusting your search keyword and stock threshold filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const sellingPrice = Number(prod.price) || 0;
                const originalPrice = prod.originalPrice ? Number(prod.originalPrice) : null;
                const stock = Number(prod.stock) || 0;
                const lowThreshold = prod.lowStockThreshold ? Number(prod.lowStockThreshold) : 5;

                // Determine stock health badge & progress
                const isOutOfStock = stock <= 0;
                const isCriticalLow = stock > 0 && stock <= lowThreshold;
                const isModerate = stock > lowThreshold && stock <= 10;

                // Visual progress bar (capped at 100% relative to 20 units)
                const progressPercent = Math.min(100, Math.max(0, Math.round((stock / 20) * 100)));

                return (
                  <tr
                    key={prod.id}
                    className={cn(
                      "hover:bg-muted/20 transition-colors group",
                      selectedIds.includes(prod.id) && "bg-amber-500/[0.03]"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(prod.id)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Select product"
                      >
                        {selectedIds.includes(prod.id) ? (
                          <CheckSquare className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Product Name, Thumbnail & SKU */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="relative h-12 w-12 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-muted/30 hover:opacity-85 transition-opacity block cursor-pointer group-hover:border-amber-500/40"
                          title="View live product"
                        >
                          {prod.thumbnail ? (
                            <Image
                              src={prod.thumbnail}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted/60 text-[10px] font-bold text-muted-foreground">
                              No Pic
                            </div>
                          )}
                        </Link>
                        <div className="min-w-0 max-w-[260px] lg:max-w-[360px] xl:max-w-[480px]">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {prod.categoryName && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                                {prod.categoryName}
                              </span>
                            )}
                            {prod.brand && (
                              <span className="text-[10px] font-medium text-muted-foreground">
                                • {prod.brand}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/products/${prod.slug}`}
                            className="font-extrabold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1 block text-xs leading-snug cursor-pointer"
                            title={prod.name}
                          >
                            {formatShortTitle(prod.name, 14)}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-muted-foreground">
                            <span>SKU: {prod.sku || "N/A"}</span>
                            {prod.hasVariants && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/70 text-foreground/80 font-sans font-medium">
                                Has Variants
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap font-mono">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-foreground text-sm">
                          ৳{sellingPrice.toLocaleString()}
                        </span>
                        {originalPrice && originalPrice > sellingPrice && (
                          <span className="text-[11px] text-muted-foreground line-through">
                            ৳{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Level & Visual Bar */}
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center gap-1.5 min-w-[130px]">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-3 py-1 text-xs font-bold border border-rose-500/20">
                            <AlertOctagon className="h-3.5 w-3.5" />
                            0 units • Out of Stock
                          </span>
                        ) : isCriticalLow ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-3 py-1 text-xs font-bold border border-amber-500/20">
                            <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
                            {stock} units • Critical Low
                          </span>
                        ) : isModerate ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-bold border border-blue-500/20">
                            <Package className="h-3.5 w-3.5" />
                            {stock} units • Reserve Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {stock} units • In Stock
                          </span>
                        )}

                        {/* Visual stock bar */}
                        <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              isOutOfStock
                                ? "w-0"
                                : isCriticalLow
                                ? "bg-amber-500"
                                : isModerate
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                            )}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action Button: Manage Stock */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onManageStock(prod)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-zinc-950 border border-amber-500/30 hover:border-amber-500 transition-all shadow-xs active:scale-95 cursor-pointer"
                        title={`Manage stock for ${prod.name}`}
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>Manage Stock</span>
                      </button>
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
