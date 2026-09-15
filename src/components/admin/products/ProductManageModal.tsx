import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Edit3, Trash2, X, SlidersHorizontal } from "lucide-react";
import { Product } from "@/types/ecommerce.types";

interface ProductManageModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductManageModal({
  product,
  onClose,
  onEdit,
  onDelete,
}: ProductManageModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xl space-y-4 relative animate-in slide-in-from-bottom-6 duration-200">
        {/* Header / Grab Handle */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded-md">
              Mobile Manager
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product Summary Header */}
        <div className="flex items-start gap-3.5">
          <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted/40 border border-border/60 shrink-0">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {product.categoryName}
            </span>
            <h4 className="font-extrabold text-foreground text-sm leading-snug line-clamp-2 mt-0.5">
              {product.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Brand: <strong className="text-foreground">{product.brand}</strong> &bull; SKU:{" "}
              <span className="font-mono">{product.sku || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Key Metrics / Snapshot */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
          <div>
            <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider">
              Selling Price
            </span>
            <p className="font-mono font-black text-base text-foreground mt-0.5">
              ৳{product.price.toLocaleString()}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-[10px] text-muted-foreground line-through">
                ৳{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider">
              Stock Balance
            </span>
            <div className="mt-0.5">
              {product.stock <= 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 px-2.5 py-0.5 text-xs font-bold">
                  0 units (Out of stock)
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 px-2.5 py-0.5 text-xs font-bold font-mono">
                  {product.stock} units (Low)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-bold font-mono">
                  {product.stock} units (Healthy)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="space-y-2 pt-1">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            onClick={onClose}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/50 text-xs font-bold text-foreground transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="h-4 w-4 text-amber-500" />
              <span>Preview in Storefront</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">↗</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/50 text-xs font-bold text-foreground transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Edit3 className="h-4 w-4 text-blue-500" />
              <span>Edit Product Details &amp; Stock</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">&rarr;</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(product);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="h-4 w-4 text-rose-500" />
              <span>Delete Product Permanently</span>
            </div>
            <span className="text-[10px] font-mono">✕</span>
          </button>
        </div>

        {/* Bottom Dismiss */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-border/70 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
