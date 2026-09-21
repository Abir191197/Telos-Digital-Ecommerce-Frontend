"use client";

import React from "react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { ProductFormValues, ProductVariantItem } from "./ProductDetailsFormCard";

interface ProductVariantsSectionProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function ProductVariantsSection({ values, onChange }: ProductVariantsSectionProps) {
  const handleAddVariant = () => {
    const newVariant: ProductVariantItem = {
      color: "",
      size: "",
      weight: "",
      price: values.price !== "" ? values.price : "",
      costPrice: values.costPrice !== "" ? values.costPrice : "",
      stock: 5,
    };
    const updated = [...(values.variants || []), newVariant];
    onChange("variants", updated);
    const newTotal = updated.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    onChange("stock", newTotal > 0 ? newTotal : "");
  };

  const handleRemoveVariant = (index: number) => {
    const updated = values.variants.filter((_, i) => i !== index);
    onChange("variants", updated);
    const newTotal = updated.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    onChange("stock", newTotal > 0 ? newTotal : "");
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantItem,
    val: any
  ) => {
    const updated = values.variants.map((v, i) => {
      if (i === index) {
        return { ...v, [field]: val };
      }
      return v;
    });
    onChange("variants", updated);
    if (field === "stock") {
      const newTotal = updated.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
      onChange("stock", newTotal > 0 ? newTotal : "");
    }
  };

  return (
    <div className="pt-2">
      <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">
                Product Variants (Color, Size, Weight)
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Enable if this item has multiple options with individual prices & stock
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={values.hasVariants}
              onChange={(e) => {
                const checked = e.target.checked;
                onChange("hasVariants", checked);
                if (checked && (!values.variants || values.variants.length === 0)) {
                  handleAddVariant();
                }
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            <span className="ml-2 text-[11px] font-bold text-foreground">
              {values.hasVariants ? "ON" : "OFF"}
            </span>
          </label>
        </div>

        {values.hasVariants && (
          <div className="space-y-3 pt-3 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-[11px] text-muted-foreground">
                Define specific combinations for <strong>Color</strong>, <strong>Size</strong>, and <strong>Weight</strong>.
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Variant Row</span>
              </button>
            </div>

            {values.variants && values.variants.length > 0 ? (
              <div className="space-y-2.5 overflow-x-auto">
                <div className="hidden lg:grid lg:grid-cols-12 gap-2 px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-2">Color</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Weight</div>
                  <div className="col-span-2">Selling (৳)</div>
                  <div className="col-span-2">Purchase (৳)</div>
                  <div className="col-span-1">Stock</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {values.variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 p-3 rounded-xl bg-background/80 border border-border/70 items-center"
                  >
                    <div className="lg:col-span-2">
                      <label className="block lg:hidden text-[10px] font-bold text-muted-foreground mb-0.5">
                        Color
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Space Black"
                        value={v.color}
                        onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                        className="w-full rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block lg:hidden text-[10px] font-bold text-muted-foreground mb-0.5">
                        Size
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 256GB / XL"
                        value={v.size}
                        onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                        className="w-full rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block lg:hidden text-[10px] font-bold text-muted-foreground mb-0.5">
                        Weight
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 220g / 1kg"
                        value={v.weight}
                        onChange={(e) => handleVariantChange(idx, "weight", e.target.value)}
                        className="w-full rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block lg:hidden text-[10px] font-bold text-muted-foreground mb-0.5">
                        Selling Price (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder={values.price ? String(values.price) : "Selling"}
                        value={v.price}
                        onChange={(e) =>
                          handleVariantChange(
                            idx,
                            "price",
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block lg:hidden text-[10px] font-bold text-muted-foreground mb-0.5">
                        Purchase Price (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder={values.costPrice ? String(values.costPrice) : "Cost"}
                        value={v.costPrice}
                        onChange={(e) =>
                          handleVariantChange(
                            idx,
                            "costPrice",
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-1">
                      <label className="block lg:hidden text-[10px] font-bold text-muted-foreground mb-0.5">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            idx,
                            "stock",
                            e.target.value !== "" ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="lg:col-span-1 flex items-center justify-end lg:justify-center pt-2 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px]">
                    Total Variants: <strong>{values.variants.length}</strong>
                  </span>
                  <span className="font-bold text-foreground text-[11px]">
                    Combined Inventory: <strong className="text-amber-500">{values.stock || 0} units</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-border/80 text-center text-xs text-muted-foreground">
                No variant combinations added yet. Click &quot;Add Variant Row&quot; above.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
