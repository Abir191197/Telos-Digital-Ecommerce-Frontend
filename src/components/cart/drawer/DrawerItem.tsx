import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, Check } from "lucide-react";
import type { CartItem } from "@/types/cart.types";
import { ROUTES } from "@/constants";

interface DrawerItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCloseCart: () => void;
}

export function DrawerItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onCloseCart,
}: DrawerItemProps) {
  return (
    <div className="relative p-3 sm:p-3.5 rounded-2xl bg-card/80 dark:bg-card/60 backdrop-blur-md border border-border/70 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.45),0_2px_6px_-2px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_28px_-6px_rgba(245,158,11,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_16px_32px_-6px_rgba(245,158,11,0.2),0_4px_12px_-2px_rgba(0,0,0,0.5)] hover:border-amber-500/30 transition-all duration-300 flex items-center gap-3.5 group">
      {/* Thumb */}
      <Link
        href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
        onClick={onCloseCart}
        className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/40 group-hover:border-amber-500/40 shadow-inner transition-colors"
      >
        <Image
          src={item.product.thumbnail}
          alt={item.product.name}
          fill
          sizes="72px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={ROUTES.PRODUCT_DETAIL(item.product.slug)}
            onClick={onCloseCart}
            className="text-xs font-bold text-foreground line-clamp-1 hover:text-amber-500 transition-colors"
          >
            {item.product.name}
          </Link>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            aria-label="Remove item"
            title="Remove item"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white border border-rose-500/20 hover:border-rose-600 active:scale-90 transition-all shadow-2xs cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {item.variant ? (
            <span className="inline-block rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {item.variant.name}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="h-2.5 w-2.5 stroke-[3]" /> In Stock
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Crisp Clean Segmented Stepper */}
          <div className="inline-flex items-center rounded-xl bg-muted/60 border border-border/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background active:scale-90 transition-all cursor-pointer"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-xs font-bold text-foreground select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={item.quantity >= item.product.stock}
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
              title={
                item.quantity >= item.product.stock
                  ? `Only ${item.product.stock} units in stock`
                  : undefined
              }
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-xs font-black text-foreground">
              ৳{item.subtotal.toLocaleString()}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-muted-foreground">
                ৳{item.unitPrice.toLocaleString()} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

