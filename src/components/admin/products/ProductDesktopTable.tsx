"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckSquare, Square, MoreVertical, ExternalLink, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";

interface ProductDesktopTableProps {
  products: Product[];
  selectedIds: string[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onOpenEdit: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function ProductDesktopTable({
  products,
  selectedIds,
  activeMenuId,
  setActiveMenuId,
  onToggleSelect,
  onSelectAll,
  onRequestDelete,
}: ProductDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl border-none bg-card shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      {/* min-h-[320px] ensures action dropdown popovers never trigger a vertical scrollbar when table has few items */}
      <div className="overflow-x-auto min-h-[320px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
              <th className="py-3 px-4 w-10">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Select all"
                >
                  {selectedIds.length > 0 && selectedIds.length === products.length ? (
                    <CheckSquare className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Selling Price</th>
              <th className="py-3 px-4 text-right">Purchase Price</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created / Updated</th>
              <th className="py-3 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-muted-foreground">
                  <p className="font-semibold text-sm">No products found in catalog</p>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const isMenuOpen = activeMenuId === prod.id;
                const sellingPrice = Number(prod.price) || 0;
                const costPrice =
                  prod.costPrice !== undefined && prod.costPrice !== null
                    ? Number(prod.costPrice)
                    : (prod as any).costPrice !== undefined
                    ? Number((prod as any).costPrice)
                    : null;
                const subCat = prod.subCategoryName || (prod as any).subCategory?.name;
                const brandName = prod.brand || (prod as any).brand?.name || "—";
                const profitMargin =
                  costPrice !== null && sellingPrice > costPrice
                    ? sellingPrice - costPrice
                    : null;
                const profitPercent =
                  profitMargin !== null && sellingPrice > 0
                    ? Math.round((profitMargin / sellingPrice) * 100)
                    : null;

                return (
                  <tr
                    key={prod.id}
                    className={cn(
                      "hover:bg-muted/20 transition-colors",
                      selectedIds.includes(prod.id) && "bg-amber-500/[0.03]"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(prod.id)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Select product"
                      >
                        {selectedIds.includes(prod.id) ? (
                          <CheckSquare className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Product Thumbnail & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30">
                          {prod.thumbnail ? (
                            <Image
                              src={prod.thumbnail}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted/60 text-[10px] font-bold text-muted-foreground">
                              No Pic
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs xl:max-w-sm">
                          <p className="font-extrabold text-foreground truncate" title={prod.name}>
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            SKU: {prod.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/40">
                        {brandName}
                      </span>
                    </td>

                    {/* Category & Subcategory */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground whitespace-nowrap">
                          {prod.categoryName || "Uncategorized"}
                        </span>
                        {subCat && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium mt-0.5 whitespace-nowrap">
                            <span className="text-amber-500 font-bold">&rsaquo;</span>
                            <span>{subCat}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Separate Column: Selling Price */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-mono font-black text-foreground text-sm">
                        ৳{sellingPrice.toLocaleString()}
                      </span>
                    </td>

                    {/* Separate Column: Purchase Price / Cost */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {costPrice !== null ? (
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-bold text-foreground/80 text-xs">
                            ৳{costPrice.toLocaleString()}
                          </span>
                          {profitMargin !== null && (
                            <span className="text-[9.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              +{profitPercent}% margin
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs font-mono">—</span>
                      )}
                    </td>

                    {/* Stock Column */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          "font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block",
                          prod.stock <= 0
                            ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                            : prod.stock <= 5
                            ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                            : "text-foreground bg-muted/50"
                        )}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Stock Health Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {prod.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                          Out of Stock
                        </span>
                      ) : prod.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Separate Column: Created / Updated Info */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col text-[11px] leading-tight space-y-0.5">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <span className="text-[9.5px] uppercase font-bold text-muted-foreground tracking-wider">
                            Created:
                          </span>
                          <span className="font-mono">{formatDate(prod.createdAt)}</span>
                        </div>
                        {prod.updatedAt && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="text-[9.5px] uppercase font-bold text-amber-500/90 tracking-wider">
                              Updated:
                            </span>
                            <span className="font-mono text-[10.5px]">{formatDate(prod.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Three-Dot Action Column */}
                    <td className="py-3.5 px-4 text-right relative whitespace-nowrap" data-action-menu>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : prod.id);
                        }}
                        className={cn(
                          "h-8 w-8 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
                          isMenuOpen && "bg-muted text-foreground ring-1 ring-amber-500/30"
                        )}
                        title="Product Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-4 top-11 z-50 w-48 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left space-y-0.5">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            onClick={() => setActiveMenuId(null)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>View in Store</span>
                          </Link>
                          <Link
                            href={`/dashboard/products/${prod.slug || prod.id}/edit`}
                            onClick={() => setActiveMenuId(null)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Edit Details</span>
                          </Link>
                          <div className="my-1 border-t border-border/60" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onRequestDelete(prod);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Product</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
