"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Trash2, CheckSquare, Square, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { type BackendCartItem } from "@/services/api/cart/cartApi";

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

interface AdminCartTableProps {
  items: BackendCartItem[];
  selectedIds: string[];
  searchQuery: string;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeleteItem: (item: BackendCartItem) => void;
}

export function AdminCartTable({
  items,
  selectedIds,
  searchQuery,
  onToggleSelect,
  onSelectAll,
  onDeleteItem,
}: AdminCartTableProps) {
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
              <th className="py-3 px-4">Variant / Option</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
              <th className="py-3 px-4">Date Added</th>
              <th className="py-3 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
                  <p className="font-semibold text-sm">No cart items found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery ? "Try adjusting your search criteria" : "Customer carts are currently empty"}
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const unitPrice = item.variant?.price ?? item.product?.price ?? 0;
                const lineSubtotal = unitPrice * item.quantity;
                const variantDesc = item.variant
                  ? [item.variant.color, item.variant.size, item.variant.weight].filter(Boolean).join(" / ") || item.variant.sku
                  : "Standard";

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
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 text-xs">
                          {item.customer?.name ? item.customer.name.slice(0, 2).toUpperCase() : "CU"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{item.customer?.name || "Guest / Unnamed"}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.customer?.email || "—"}</p>
                          {item.customer?.phone && (
                            <p className="text-[10px] text-muted-foreground/70 truncate">{item.customer.phone}</p>
                          )}
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

                    {/* Variant */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-muted/60 text-[11px] font-medium text-foreground">
                        {variantDesc}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 text-center font-bold text-foreground">
                      {item.quantity}
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 px-4 text-right font-semibold text-foreground">
                      ৳{unitPrice.toLocaleString()}
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-4 text-right font-black text-amber-600 dark:text-amber-400">
                      ৳{lineSubtotal.toLocaleString()}
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
                        title="Delete this cart item"
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
