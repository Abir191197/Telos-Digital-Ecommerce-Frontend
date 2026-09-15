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

export function ProductDesktopTable({
  products,
  selectedIds,
  activeMenuId,
  setActiveMenuId,
  onToggleSelect,
  onSelectAll,
  onOpenEdit,
  onRequestDelete,
}: ProductDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl border-none bg-card overflow-visible shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
              <th className="py-3 px-4 w-10">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {selectedIds.length > 0 && selectedIds.length === products.length ? (
                    <CheckSquare className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <p className="font-semibold text-sm">No products found</p>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const isMenuOpen = activeMenuId === prod.id;
                return (
                  <tr
                    key={prod.id}
                    className={cn(
                      "hover:bg-muted/20 transition-colors",
                      selectedIds.includes(prod.id) && "bg-amber-500/[0.03]"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(prod.id)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {selectedIds.includes(prod.id) ? (
                          <CheckSquare className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Product Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30">
                          <Image
                            src={prod.thumbnail}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs xl:max-w-sm">
                          <p className="font-extrabold text-foreground truncate">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {prod.brand} &bull;{" "}
                            <span className="font-mono">
                              {prod.sku || "NO-SKU"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">
                        {prod.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono font-black text-foreground text-sm">
                      ৳{prod.price.toLocaleString()}
                    </td>

                    {/* Stock Column */}
                    <td className="py-3 px-4 text-center">
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
                    <td className="py-3 px-4">
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

                    {/* Three-Dot Action Column */}
                    <td className="py-3 px-4 text-right relative" data-action-menu>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : prod.id);
                        }}
                        className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Product Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-4 top-11 z-30 w-44 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            onClick={() => setActiveMenuId(null)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>View in Store</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => onOpenEdit(prod)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Edit Details</span>
                          </button>
                          <div className="my-1 border-t border-border/60" />
                          <button
                            type="button"
                            onClick={() => onRequestDelete(prod)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
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
