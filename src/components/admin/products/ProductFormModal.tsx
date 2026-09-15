import React from "react";
import { X } from "lucide-react";
import { Product } from "@/types/ecommerce.types";

interface ProductFormData {
  name: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  stock: number;
  brand: string;
  sku: string;
  thumbnail: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  categories: string[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProductFormModal({
  isOpen,
  editingProduct,
  formData,
  setFormData,
  categories,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-border/80 bg-background p-5 sm:p-6 shadow-2xl space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <h3 className="text-base sm:text-lg font-black text-foreground">
            {editingProduct ? "Edit Product Listing" : "Add Product to Inventory"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure catalog metadata, pricing tier, and inventory count.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-foreground block mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Samsung Galaxy S25 Ultra 12GB/512GB"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-foreground block mb-1">
                Brand *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samsung / Apple"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">
                Category *
              </label>
              <select
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-foreground block mb-1">
                Price (৳) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="120000"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">
                Original Price
              </label>
              <input
                type="number"
                placeholder="130000"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: Number(e.target.value),
                  })
                }
                className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-foreground block mb-1">
              SKU Reference
            </label>
            <input
              type="text"
              placeholder="Leave blank to auto-generate"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-foreground block mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.value })
              }
              className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-border/70 font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {editingProduct ? "Review & Save" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
