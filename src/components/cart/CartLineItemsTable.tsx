"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { ROUTES } from "@/constants";
import type { CartItem } from "@/types/cart.types";

interface CartLineItemsTableProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onSaveForLater: (item: CartItem) => void;
}

export function CartLineItemsTable({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onSaveForLater,
}: CartLineItemsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-card border border-border/70 shadow-xs dark:shadow-none">
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border/60 text-[11px] font-bold uppercase tracking-wider text-muted-foreground items-center">
        <div className="col-span-5">Product Details</div>
        <div className="col-span-2 text-right pr-2">Unit Price</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/60">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 sm:py-3.5 sm:px-5 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 items-stretch lg:items-center hover:bg-muted/15 transition-colors"
          >
            {/* Product (Col 5) */}
            <div className="w-full lg:col-span-5 flex items-center gap-3 sm:gap-3.5">
              <Link
                href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl bg-muted/30 border border-border/50 hover:border-amber-500/40 transition-colors shadow-2xs"
              >
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                  className="font-bold text-xs sm:text-sm text-foreground hover:text-amber-500 transition-colors line-clamp-1 leading-snug"
                >
                  {item.product.name}
                </Link>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    {item.product.brand || "Official Store"}
                  </span>
                  {item.variant && (
                    <span className="rounded-md bg-muted px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
                      {item.variant.name}
                    </span>
                  )}
                  {item.product.stock <= 3 && item.product.stock > 0 && (
                    <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-600">
                      {item.product.stock} left
                    </span>
                  )}
                </div>

                {/* Mobile inline Unit Price (Right aligned) */}
                <div className="flex lg:hidden items-end justify-between pt-0.5">
                  <span className="text-[11px] font-semibold text-muted-foreground">Unit Price:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-foreground">
                      ৳{item.unitPrice.toLocaleString()}
                    </span>
                    {item.product.originalPrice && item.product.originalPrice > item.unitPrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ৳{item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions - Icon-only buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onSaveForLater(item)}
                    className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-border/80 bg-background/90 hover:bg-amber-500/10 hover:border-amber-500/40 text-muted-foreground hover:text-amber-500 transition-all cursor-pointer shadow-2xs active:scale-90"
                    title="Save for Later"
                    aria-label="Save for Later"
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-border/80 bg-background/90 hover:bg-destructive/10 hover:border-destructive/30 text-muted-foreground hover:text-destructive transition-all cursor-pointer shadow-2xs active:scale-90"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Unit Price (Col 2 - Desktop: Right align, strikethrough below) */}
            <div className="hidden lg:flex w-full lg:col-span-2 flex-col items-end justify-center pr-2">
              <span className="text-base font-bold text-foreground tracking-tight">
                ৳{item.unitPrice.toLocaleString()}
              </span>
              {item.product.originalPrice && item.product.originalPrice > item.unitPrice && (
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  ৳{item.product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Mobile unified row for Quantity & Subtotal */}
            <div className="w-full lg:contents flex items-center justify-between pt-2.5 lg:pt-0 border-t border-border/50 lg:border-t-0">
              {/* Quantity Stepper (Col 3) */}
              <div className="lg:col-span-3 flex lg:justify-center items-center gap-2">
                <span className="lg:hidden text-xs font-semibold text-muted-foreground">
                  Qty:
                </span>
                <div className="inline-flex items-center rounded-xl bg-muted/60 border border-border/80 p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background active:scale-90 transition-all cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 sm:w-8 text-center text-xs font-bold text-foreground select-none">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={item.quantity >= item.product.stock}
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
                    title={
                      item.quantity >= item.product.stock
                        ? `Only ${item.product.stock} units in stock`
                        : undefined
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Subtotal (Col 2 - Right aligned) */}
              <div className="lg:col-span-2 flex lg:justify-end items-baseline gap-1.5 text-right">
                <span className="lg:hidden text-xs font-semibold text-muted-foreground">
                  Total:
                </span>
                <span className="text-base sm:text-lg font-black text-foreground">
                  ৳{item.subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
