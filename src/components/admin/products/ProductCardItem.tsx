import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckSquare, Square, MoreVertical, ExternalLink, Edit3, Trash2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";

interface ProductCardItemProps {
  product: Product;
  isSelected: boolean;
  isMenuOpen: boolean;
  onToggleSelect: (id: string) => void;
  onToggleMenu: (id: string) => void;
  onOpenEdit: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  onManageMobile: (product: Product) => void;
}

export function ProductCardItem({
  product,
  isSelected,
  isMenuOpen,
  onToggleSelect,
  onToggleMenu,
  onOpenEdit,
  onRequestDelete,
  onManageMobile,
}: ProductCardItemProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-3 sm:p-4.5 transition-all duration-200 hover:border-amber-500/40 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 flex flex-col justify-between gap-3",
        isSelected && "ring-2 ring-amber-500 border-amber-500/80 bg-amber-500/[0.02]"
      )}
    >
      {/* ── MOBILE VIEW: Compact Horizontal Card Layout ── */}
      <div className="flex md:hidden gap-3.5 items-center">
        {/* Left: Checkbox + Square Thumbnail with Stock Tag */}
        <div className="relative shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSelect(product.id)}
            className="text-muted-foreground hover:text-amber-500 p-1 -ml-1 cursor-pointer transition-colors active:scale-90"
            aria-label="Select product"
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 text-amber-500 fill-amber-500/20" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </button>

          <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted/40 border border-border/70 shadow-xs">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
            {product.stock <= 0 ? (
              <span className="absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-black uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-xs">
                Out
              </span>
            ) : product.stock <= 5 ? (
              <span className="absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-black uppercase tracking-wider bg-amber-500/90 text-zinc-950 backdrop-blur-xs">
                {product.stock} Left
              </span>
            ) : null}
          </div>
        </div>

        {/* Right: Info, Price & Stock Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
              {product.brand}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/80">
              {product.sku || "NO-SKU"}
            </span>
          </div>

          <h4 className="font-bold text-foreground text-xs leading-snug line-clamp-2">
            {product.name}
          </h4>

          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-black text-sm text-foreground">
                ৳{product.price.toLocaleString()}
              </span>
              {Boolean(product.originalPrice && product.originalPrice > product.price) && (
                <span className="font-mono text-[10px] line-through text-muted-foreground">
                  ৳{(product.originalPrice ?? 0).toLocaleString()}
                </span>
              )}
            </div>

            <div>
              {product.stock > 5 ? (
                <span className="inline-flex items-center text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {product.stock} in stock
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center text-[10px] font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Low stock: {product.stock}
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-bold font-mono text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                  Sold Out (0 units)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW: High-End Visual Card Format ── */}
      <div className="hidden md:flex flex-col space-y-3">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onToggleSelect(product.id)}
            className="text-muted-foreground hover:text-amber-500 cursor-pointer p-0.5 -ml-0.5 transition-colors"
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 text-amber-500 fill-amber-500/20" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </button>

          <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wide uppercase bg-background/90 text-foreground backdrop-blur-md shadow-xs border border-border/50">
                {product.brand}
              </span>
            </div>
          </div>

          {/* Desktop Only Three-Dot Menu */}
          <div className="relative" data-action-menu>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu(product.id);
              }}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              title="Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-9 z-30 w-44 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  onClick={() => onToggleMenu("")}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>View in Store</span>
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenEdit(product)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Edit Details</span>
                </button>
                <div className="my-1 border-t border-border/60" />
                <button
                  type="button"
                  onClick={() => onRequestDelete(product)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Delete Product</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>{product.categoryName}</span>
            <span>SKU: {product.sku || "N/A"}</span>
          </div>
          <h3 className="font-extrabold text-foreground text-sm leading-snug line-clamp-2 mt-1">
            {product.name}
          </h3>
        </div>

        {/* Desktop Card Price & Stock Bar */}
        <div className="pt-2.5 border-t border-border/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground block font-medium">
              Price
            </span>
            <span className="font-mono font-black text-sm text-foreground">
              ৳{product.price.toLocaleString()}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-muted-foreground block font-medium">
              Stock
            </span>
            {product.stock <= 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 px-2 py-0.5 text-[10px] font-bold">
                0 units
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 px-2 py-0.5 text-[10px] font-bold font-mono">
                {product.stock} units
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold font-mono">
                {product.stock} units
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Action Bar: Quick Manage Button + Direct View Link ── */}
      <div className="flex md:hidden items-center gap-2 pt-2 border-t border-border/50">
        <button
          type="button"
          onClick={() => onManageMobile(product)}
          className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-amber-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-border/60 active:scale-98"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
          <span>Manage Product</span>
        </button>

        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          title="View on store"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
