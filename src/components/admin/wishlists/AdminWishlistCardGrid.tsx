"use client";

import React from "react";
import Image from "next/image";
import { Trash2, CheckSquare, Square, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { type BackendWishlistItem } from "@/services/api/wishlist/wishlistApi";

interface AdminWishlistCardGridProps {
  items: BackendWishlistItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onDeleteItem: (item: BackendWishlistItem) => void;
}

export function AdminWishlistCardGrid({
  items,
  selectedIds,
  onToggleSelect,
  onDeleteItem,
}: AdminWishlistCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const stock = item.product?.stock ?? 0;
        const inStock = stock > 0;

        return (
          <div
            key={item.id}
            className={cn(
              "relative p-4 rounded-3xl bg-card border border-border/60 shadow-xs flex flex-col justify-between gap-3 transition-all",
              isSelected && "border-amber-500 ring-1 ring-amber-500/30"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onToggleSelect(item.id)}
                className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mt-1"
              >
                {isSelected ? (
                  <CheckSquare className="h-4 w-4 text-amber-500" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>

              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                  {item.product?.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-foreground line-clamp-1">{item.product?.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">SKU: {item.product?.sku || "—"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteItem(item)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Customer info pill */}
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/30 text-xs">
              <p className="font-bold text-foreground text-[11px]">{item.customer?.name || "Guest"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{item.customer?.email || "—"}</p>
            </div>

            {/* Pricing & Stock footer */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/30">
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

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{(item.product?.rating || 5).toFixed(1)}</span>
                </div>
                <div className="font-black text-foreground">
                  ৳{(item.product?.price || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
