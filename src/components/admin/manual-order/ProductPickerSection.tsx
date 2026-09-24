"use client";

import React, { useState, useRef } from "react";
import { Search, Plus, Minus, X, Package, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAdminProductsQuery } from "@/services/api/products/productApi";
import type { Product, ProductVariant } from "@/types/ecommerce.types";

export interface OrderLineItem {
  tempId: string;
  productId: string;
  variantId?: string;
  productName: string;
  productThumbnail?: string;
  productSku?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
  availableVariants?: ProductVariant[];
}

interface ProductPickerSectionProps {
  items: OrderLineItem[];
  onItemsChange: (items: OrderLineItem[]) => void;
}

function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variant: ProductVariant | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = variants.find((v) => v.id === selectedVariantId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-muted/70 border border-border/60 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
      >
        <span className="truncate max-w-[140px]">
          {selected ? selected.name || `${selected.color || ""} ${selected.size || ""}`.trim() : "Select variant"}
        </span>
        <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px] rounded-xl border border-border/70 bg-card shadow-2xl overflow-hidden py-1">
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false); }}
            className="w-full px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted/60 transition-colors border-b border-border/30 cursor-pointer"
          >
            — Base product (no variant)
          </button>
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => { onSelect(v); setOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-muted/60 transition-colors cursor-pointer",
                v.id === selectedVariantId && "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
              )}
            >
              <span>{v.name || `${v.color || ""} ${v.size || ""}`.trim() || v.sku}</span>
              <span className="font-mono font-bold">৳{v.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductPickerSection({ items, onItemsChange }: ProductPickerSectionProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: productData, isFetching } = useGetAdminProductsQuery(
    search.trim().length >= 2 ? { searchTerm: search.trim(), limit: 12 } : undefined,
    { skip: search.trim().length < 2 }
  );

  const products = productData?.data ?? [];

  const handleAddProduct = (product: Product) => {
    const alreadyAdded = items.some(
      (i) => i.productId === product.id && !i.variantId
    );
    if (alreadyAdded) {
      onItemsChange(
        items.map((i) =>
          i.productId === product.id && !i.variantId
            ? { ...i, quantity: Math.min(i.quantity + 1, i.maxStock || 999) }
            : i
        )
      );
      setShowDropdown(false);
      return;
    }
    const newItem: OrderLineItem = {
      tempId: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productThumbnail: product.thumbnail,
      productSku: product.sku,
      unitPrice: product.price,
      quantity: 1,
      maxStock: product.stock,
      availableVariants: product.variants || [],
    };
    onItemsChange([...items, newItem]);
    setShowDropdown(false);
  };

  const handleVariantChange = (tempId: string, variant: ProductVariant | null) => {
    onItemsChange(
      items.map((i) =>
        i.tempId === tempId
          ? {
              ...i,
              variantId: variant?.id,
              variantName: variant
                ? variant.name || `${variant.color || ""} ${variant.size || ""}`.trim()
                : undefined,
              unitPrice: variant ? variant.price : i.unitPrice,
              productSku: variant?.sku || i.productSku,
              maxStock: variant ? variant.stock : i.maxStock,
              quantity: 1,
            }
          : i
      )
    );
  };

  const handlePriceChange = (tempId: string, newPrice: number) => {
    onItemsChange(
      items.map((i) =>
        i.tempId === tempId
          ? { ...i, unitPrice: Math.max(0, newPrice) }
          : i
      )
    );
  };

  const handleQtyChange = (tempId: string, delta: number) => {
    onItemsChange(
      items.map((i) =>
        i.tempId === tempId
          ? { ...i, quantity: Math.max(1, Math.min(i.maxStock || 999, i.quantity + delta)) }
          : i
      )
    );
  };

  const handleQtyInput = (tempId: string, value: string) => {
    const n = parseInt(value, 10);
    if (!isNaN(n)) {
      onItemsChange(
        items.map((i) =>
          i.tempId === tempId
            ? { ...i, quantity: Math.max(1, Math.min(i.maxStock || 999, n)) }
            : i
        )
      );
    }
  };

  const handleRemove = (tempId: string) => {
    onItemsChange(items.filter((i) => i.tempId !== tempId));
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10">
          <Package className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Order Items</h3>
      </div>

      {/* Product Search */}
      <div className="relative" ref={containerRef}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="product-search-input"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(e.target.value.trim().length >= 2);
          }}
          onFocus={() => search.trim().length >= 2 && setShowDropdown(true)}
          placeholder="Search products to add..."
          autoComplete="off"
          className={cn(
            "h-10 w-full rounded-xl bg-muted/40 border border-border/50 pl-10 pr-4 text-sm font-medium text-foreground",
            "focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all",
            "placeholder:text-muted-foreground/60"
          )}
        />

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-40 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden">
            {isFetching ? (
              <div className="p-4 text-xs text-muted-foreground">Searching products...</div>
            ) : products.length === 0 ? (
              <div className="p-4 text-xs text-muted-foreground">No products found for "{search}"</div>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-border/20">
                {products.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleAddProduct(product)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.name} className="object-cover w-full h-full" />
                        ) : (
                          <Package className="h-5 w-5 m-2.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">৳{product.price.toLocaleString()}</span>
                          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded",
                            product.stock > 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600"
                          )}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </span>
                          {product.hasVariants && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Has variants</span>
                          )}
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-amber-500 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Line Items */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-border/40 text-center">
          <Package className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-xs font-semibold text-muted-foreground">No items yet</p>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">Search for products above to add them to this order</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const subtotal = item.unitPrice * item.quantity;
            return (
              <div
                key={item.tempId}
                className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 space-y-3 shadow-2xs"
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                    {item.productThumbnail ? (
                      <img src={item.productThumbnail} alt={item.productName} className="object-cover w-full h-full" />
                    ) : (
                      <Package className="h-5 w-5 m-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{item.productName}</p>
                    
                    {/* Variant Selector if product has variants */}
                    {item.availableVariants && item.availableVariants.length > 0 && (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Variant:</span>
                        <VariantSelector
                          variants={item.availableVariants}
                          selectedVariantId={item.variantId}
                          onSelect={(v) => handleVariantChange(item.tempId, v)}
                        />
                      </div>
                    )}

                    {/* Unit Price Customizer */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Price:</span>
                      <div className="relative flex items-center">
                        <span className="absolute left-2 text-[11px] font-bold text-muted-foreground">৳</span>
                        <input
                          type="number"
                          min={0}
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(item.tempId, Number(e.target.value) || 0)}
                          className="h-6 w-20 pl-4 pr-1.5 rounded-md bg-background border border-border/60 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                          title="Click to edit unit price for manual order"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">/ unit</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.tempId)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                    title="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Bottom row: qty + subtotal */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-semibold">Qty:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.tempId, -1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-lg bg-muted/70 hover:bg-muted text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.maxStock || 999}
                        value={item.quantity}
                        onChange={(e) => handleQtyInput(item.tempId, e.target.value)}
                        className="w-12 h-7 text-center text-xs font-bold rounded-lg bg-background border border-border/60 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.tempId, 1)}
                        disabled={item.quantity >= (item.maxStock || 999)}
                        className="p-1 rounded-lg bg-muted/70 hover:bg-muted text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {item.maxStock > 0 && (
                      <span className="text-[10px] text-muted-foreground">(stock: {item.maxStock})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Item Total</span>
                    <span className="font-mono font-black text-sm text-foreground">৳{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
