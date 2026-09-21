"use client";

import React from "react";
import Image from "next/image";
import { Heart, Trash2, CheckSquare, Square, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { type BackendWishlistItem } from "@/services/api/wishlist/wishlistApi";

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

interface AdminWishlistTableProps {
  items: BackendWishlistItem[];
  selectedIds: string[];
  searchQuery: string;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeleteItem: (item: BackendWishlistItem) => void;
}

export function AdminWishlistTable({
  items,
  selectedIds,
  searchQuery,
  onToggleSelect,
  onSelectAll,
  onDeleteItem,
}: AdminWishlistTableProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto min-h-[300px]">
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
                  {selectedIds.length > 0 && selectedIds.length === items.length ? (
                    <CheckSquare className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-center">Stock Status</th>
              <th className="py-3 px-4 text-center">Rating</th>
              <th className="py-3 px-4">Date Saved</th>
              <th className="py-3 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-muted-foreground">
                  <Heart className="h-10 w-10 mx-auto mb-2 opacity-30 text-rose-500" />
                  <p className="font-semibold text-sm">No wishlist items found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery ? "Try adjusting your search query" : "No products currently saved to wishlists"}
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const stock = item.product?.stock ?? 0;
                const inStock = stock > 0;

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "transition-colors hover:bg-muted/40",
                      isSelected && "bg-amber-500/5"
                    )}
                  >
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(item.id)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-500 font-bold flex items-center justify-center shrink-0 text-xs">
                          {item.customer?.name ? item.customer.name.slice(0, 2).toUpperCase() : "CU"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{item.customer?.name || "Guest / Unnamed"}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.customer?.email || "—"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                          {item.product?.thumbnail ? (
                            <Image
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground line-clamp-1">{item.product?.name || "Deleted Product"}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>SKU: {item.product?.sku || "—"}</span>
                            {item.product?.category && (
                              <>
                                <span>·</span>
                                <span>{item.product.category.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-black text-foreground">
                      ৳{(item.product?.price || 0).toLocaleString()}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                          inStock
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {inStock ? `In Stock (${stock})` : "Out of Stock"}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{(item.product?.rating || 5).toFixed(1)}</span>
                      </div>
                    </td>

                    {/* Date Added */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
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
