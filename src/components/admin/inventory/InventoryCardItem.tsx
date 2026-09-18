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

interface InventoryCardItemProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onManageStock: (product: Product) => void;
}

export function InventoryCardItem({
  product,
  isSelected,
  onToggleSelect,
  onManageStock,
}: InventoryCardItemProps) {
  const sellingPrice = Number(product.price) || 0;
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const stock = Number(product.stock) || 0;
  const lowThreshold = product.lowStockThreshold ? Number(product.lowStockThreshold) : 5;

  const isOutOfStock = stock <= 0;
  const isCriticalLow = stock > 0 && stock <= lowThreshold;
  const isModerate = stock > lowThreshold && stock <= 10;
  const progressPercent = Math.min(100, Math.max(0, Math.round((stock / 20) * 100)));

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-4 transition-all shadow-xs flex flex-col justify-between gap-3.5 relative",
        isSelected
          ? "border-amber-500/50 bg-amber-500/[0.02] shadow-sm"
          : "border-border/60 hover:border-border/90"
      )}
    >
      {/* Top row: Checkbox & Product Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleSelect(product.id)}
          className="text-muted-foreground hover:text-foreground cursor-pointer mt-0.5 shrink-0"
          aria-label="Select product"
        >
          {isSelected ? (
            <CheckSquare className="h-4 w-4 text-amber-500" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>

        <Link
          href={`/products/${product.slug}`}
          className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30 block cursor-pointer"
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
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

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.categoryName && (
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-muted text-muted-foreground">
                {product.categoryName}
              </span>
            )}
            {product.brand && (
              <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[120px]">
                {product.brand}
              </span>
            )}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="font-extrabold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 text-xs leading-snug cursor-pointer mt-0.5"
          >
            {product.name}
          </Link>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
            SKU: {product.sku || "N/A"}
          </p>
        </div>
      </div>

      {/* Middle row: Price & Stock Level */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/40">
        <div className="flex flex-col font-mono">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Price
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-foreground text-sm">
              ৳{sellingPrice.toLocaleString()}
            </span>
            {originalPrice && originalPrice > sellingPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Stock
          </span>
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 text-[11px] font-bold">
              <AlertOctagon className="h-3 w-3" />
              0 units
            </span>
          ) : isCriticalLow ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-bold">
              <AlertTriangle className="h-3 w-3" />
              {stock} units
            </span>
          ) : isModerate ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 text-[11px] font-bold">
              <Package className="h-3 w-3" />
              {stock} units
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-bold">
              <CheckCircle2 className="h-3 w-3" />
              {stock} units
            </span>
          )}
        </div>
      </div>

      {/* Visual Stock Bar */}
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

      {/* Action Button: Manage Stock */}
      <button
        type="button"
        onClick={() => onManageStock(product)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-zinc-950 border border-amber-500/30 transition-all cursor-pointer"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>Manage Stock</span>
      </button>
    </div>
  );
}
