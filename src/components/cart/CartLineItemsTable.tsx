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
    <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground items-center">
        <div className="col-span-5">Product Details</div>
        <div className="col-span-2 text-center">Unit Price</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/60">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-5 lg:p-6 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 items-stretch lg:items-center hover:bg-muted/15 transition-colors"
          >
            {/* Product (Col 5) */}
            <div className="w-full lg:col-span-5 flex items-start sm:items-center gap-3 sm:gap-4">
              <Link
                href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-muted/30 border border-border/50 hover:border-amber-500/40 transition-colors"
              >
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
                  className="font-bold text-xs sm:text-sm lg:text-base text-foreground hover:text-amber-500 transition-colors line-clamp-2 leading-snug"
                >
                  {item.product.name}
                </Link>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs">
                    {item.product.brand || "Official Store"}
                  </span>
                  {item.variant && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                      {item.variant.name}
                    </span>
                  )}
                  {item.product.stock <= 3 && item.product.stock > 0 && (
                    <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold text-rose-600">
                      {item.product.stock} left
                    </span>
                  )}
                </div>

                {/* Mobile inline Unit Price */}
                <div className="flex lg:hidden items-baseline gap-1.5 pt-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Unit:</span>
                  <span className="text-xs font-bold text-foreground">
                    ৳{item.unitPrice.toLocaleString()}
                  </span>
                  {item.product.originalPrice && item.product.originalPrice > item.unitPrice && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      ৳{item.product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => onSaveForLater(item)}
                    className="font-semibold text-muted-foreground hover:text-amber-500 transition-colors flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
                  >
                    <Heart className="h-3 w-3" />
                    <span>Save for Later</span>
                  </button>
                  <span className="text-border">•</span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="font-semibold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Unit Price (Col 2 - Desktop only) */}
            <div className="hidden lg:flex w-full lg:col-span-2 lg:justify-center items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-foreground">
                ৳{item.unitPrice.toLocaleString()}
              </span>
              {item.product.originalPrice && item.product.originalPrice > item.unitPrice && (
                <span className="text-xs text-muted-foreground line-through">
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

              {/* Subtotal (Col 2) */}
              <div className="lg:col-span-2 flex lg:justify-end items-baseline gap-1.5">
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
