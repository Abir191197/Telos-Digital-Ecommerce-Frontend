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
        "group relative rounded-3xl border-none bg-card p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between gap-3.5",
        "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_20px_45px_-5px_rgba(245,158,11,0.12),0_25px_65px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-5px_rgba(245,158,11,0.18),0_25px_70px_-10px_rgba(0,0,0,0.6)]",
        isSelected && "ring-2 ring-amber-500 bg-amber-500/[0.02]"
      )}
    >
      {/* ── MOBILE VIEW: Compact Horizontal Card Layout ── */}
      <div className="flex flex-col md:hidden gap-3">
        <div className="flex gap-3.5 items-center">
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

            <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted/40 shadow-xs">
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

        {/* Mobile Visible Action Buttons: Edit + Delete */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={() => onOpenEdit(product)}
            className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-amber-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Edit3 className="h-3.5 w-3.5 text-amber-500 group-hover:text-inherit" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(product)}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>

          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="p-2 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            title="View on store"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ── DESKTOP VIEW: High-End Visual Card Format ── */}
      <div className="hidden md:flex flex-col space-y-3.5">
        {/* Cover Image + Checkbox + Brand Badge */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-muted/30">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, 350px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

          {/* Top Left: Checkbox */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <button
              type="button"
              onClick={() => onToggleSelect(product.id)}
              className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/80 hover:text-amber-400 hover:bg-black/60 cursor-pointer transition-all active:scale-90"
              aria-label="Select product"
            >
              {isSelected ? (
                <CheckSquare className="h-4 w-4 text-amber-400 fill-amber-400/30" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Top Right: Brand badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold tracking-wide uppercase bg-black/60 text-white backdrop-blur-md shadow-xs border border-white/10">
              {product.brand}
            </span>
          </div>

          {/* Bottom Overlay Info: Category and SKU */}
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[10px] text-white/90 font-mono">
            <span className="font-semibold truncate max-w-[60%]">{product.categoryName}</span>
            <span className="opacity-80">SKU: {product.sku || "N/A"}</span>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h3 className="font-extrabold text-foreground text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Desktop Card Price & Stock Bar */}
        <div className="pt-2 border-t border-border/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground block font-medium">
              Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-black text-base text-foreground">
                ৳{product.price.toLocaleString()}
              </span>
              {Boolean(product.originalPrice && product.originalPrice > product.price) && (
                <span className="font-mono text-[11px] line-through text-muted-foreground">
                  ৳{(product.originalPrice ?? 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-muted-foreground block font-medium">
              Stock
            </span>
            {product.stock <= 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 text-[10px] font-bold">
                0 units
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                {product.stock} units
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold font-mono">
                {product.stock} units
              </span>
            )}
          </div>
        </div>

        {/* Desktop Direct Visible Action Buttons: Edit & Delete with warning */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/30">
          <button
            type="button"
            onClick={() => onOpenEdit(product)}
            className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-amber-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Edit3 className="h-3.5 w-3.5 text-amber-500 group-hover:text-inherit" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(product)}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>

          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="p-2 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            title="View on store"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
