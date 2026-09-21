"use client";

import React from "react";
import Image from "next/image";
import { Trash2, CheckSquare, Square, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { type BackendCartItem } from "@/services/api/cart/cartApi";

interface AdminCartCardGridProps {
  items: BackendCartItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onDeleteItem: (item: BackendCartItem) => void;
}

export function AdminCartCardGrid({
  items,
  selectedIds,
  onToggleSelect,
  onDeleteItem,
}: AdminCartCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const unitPrice = item.variant?.price ?? item.product?.price ?? 0;
        const lineSubtotal = unitPrice * item.quantity;

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

            {/* Pricing footer */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/30">
              <div className="text-[10px] text-muted-foreground">
                Qty: <span className="font-bold text-foreground">{item.quantity}</span> × ৳{unitPrice.toLocaleString()}
              </div>
              <div className="font-black text-amber-600 dark:text-amber-400">
                ৳{lineSubtotal.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
