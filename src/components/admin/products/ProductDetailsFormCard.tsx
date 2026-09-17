"use client";

import React from "react";
import {
  Ticket,
  Layers,
  Plus,
  Trash2,
  TrendingUp,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThematicSelect } from "@/components/common";
import { RichTextEditor } from "./RichTextEditor";

export interface ProductVariantItem {
  id?: string;
  color: string;
  size: string;
  weight: string;
  price: number | "";
  costPrice: number | "";
  stock: number | "";
}

export interface ProductFormValues {
  title: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  shortDesc: string;
  price: number | ""; // 1. Selling Price
  costPrice: number | ""; // 2. Purchase Price
  stock: number | "";
  badge: string;
  hasVoucher: boolean;
  voucherType: "percentage" | "flat";
  voucherValue: number | "";
  voucherCode: string;
  showVoucherOnCard: boolean;
  hasVariants: boolean;
  variants: ProductVariantItem[];
  description: string;
  isFeatured: boolean;
  isFlashDeal: boolean;
}

interface ProductDetailsFormCardProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
  categories?: any[];
  brands?: any[];
  isLoadingTaxonomy?: boolean;
}

const STOREFRONT_BADGE_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Trending", label: "Trending" },
  { value: "Hot", label: "Hot" },
  { value: "Sale", label: "Sale" },
  { value: "Official Warranty", label: "Official Warranty" },
];

export function ProductDetailsFormCard({
  values,
  onChange,
  categories = [],
  brands = [],
  isLoadingTaxonomy = false,
}: ProductDetailsFormCardProps) {
  // Find selected category object
  const selectedCategory = categories.find(
    (c: any) => c.id === values.categoryId || c.slug === values.categoryId
  );

  // Available subcategories for the selected category
  const availableSubCategories: any[] =
    selectedCategory?.subCategories || selectedCategory?.subcategories || [];

  // Profit calculation for Financial Integrity
  const sellingNum = Number(values.price) || 0;
  const costNum = Number(values.costPrice) || 0;
  const hasCost = values.costPrice !== "" && costNum > 0;
  const grossProfit = sellingNum - costNum;
  const marginPercent =
    sellingNum > 0 && hasCost ? Math.round((grossProfit / sellingNum) * 100) : null;

  // Options for ThematicSelect
  const brandOptions = brands.map((b: any) => ({
    value: b.id,
    label: b.name,
    sublabel: b.tagline || undefined,
  }));

  const categoryOptions = categories.map((c: any) => ({
    value: c.id,
    label: c.name,
    sublabel: c.subCategories?.length
      ? `${c.subCategories.length} subcategories`
      : undefined,
  }));

  const subCategoryOptions = availableSubCategories.map((sub: any) => ({
    value: sub.id,
    label: sub.name,
  }));

  // Variant operations
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
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-6">
      {/* Section 1: Basic Info & Taxonomy */}
      <div className="space-y-4 pb-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Basic Information
          </h3>
          {isLoadingTaxonomy && (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading taxonomy...
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
            value={values.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground focus:border-amber-500 focus:outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Brand & Category Selectors (Thematic Custom Dropdowns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Brand <span className="text-rose-500">*</span>
            </label>
            <ThematicSelect
              value={values.brandId}
              onChange={(val) => onChange("brandId", val)}
              options={brandOptions}
              placeholder="Select Brand..."
              searchable={brandOptions.length > 5}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <ThematicSelect
              value={values.categoryId}
              onChange={(val) => {
                onChange("categoryId", val);
                onChange("subCategoryId", ""); // reset subcategory on category change
              }}
              options={categoryOptions}
              placeholder="Select Category..."
              searchable={categoryOptions.length > 5}
            />
          </div>
        </div>

        {/* Dynamic Subcategory Selector (Shows if selected category has subcategories) */}
        {availableSubCategories.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/70 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-foreground">
                Subcategory
              </label>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Child of {selectedCategory?.name}
              </span>
            </div>
            <ThematicSelect
              value={values.subCategoryId}
              onChange={(val) => onChange("subCategoryId", val)}
              options={subCategoryOptions}
              placeholder="Select a Subcategory (Optional)..."
              clearable={true}
            />
            <span className="text-[10px] text-muted-foreground block">
              Assign this product to a specific sub-classification for refined store navigation.
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Short Description (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Fast A18 Pro chip, 5x Telephoto camera, Ceramic Shield."
            value={values.shortDesc}
            onChange={(e) => onChange("shortDesc", e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Section 2: Pricing & Financial Integrity */}
      <div className="space-y-4 pb-5 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Pricing & Financial Integrity
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Define customer selling price, supplier purchase cost, and inventory quantity.
            </p>
          </div>

          {/* Unit Profit Badge */}
          {hasCost && sellingNum > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>
                Unit Profit: ৳{grossProfit.toLocaleString()} ({marginPercent}% margin)
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Selling Price */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Selling Price (৳) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 95000"
                value={values.price}
                onChange={(e) =>
                  onChange("price", e.target.value ? Number(e.target.value) : "")
                }
                className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none placeholder:text-muted-foreground/60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                ৳
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">Customer storefront price</span>
          </div>

          {/* 2. Purchase Price */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Purchase Price (৳)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="e.g. 82000"
                value={values.costPrice}
                onChange={(e) =>
                  onChange("costPrice", e.target.value ? Number(e.target.value) : "")
                }
                className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-mono font-semibold text-foreground focus:border-amber-500 focus:outline-none placeholder:text-muted-foreground/60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                ৳
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">Wholesale / Supplier cost</span>
          </div>

          {/* 3. Total Stock */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Available Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 15"
              disabled={values.hasVariants && values.variants.length > 0}
              value={values.stock}
              onChange={(e) =>
                onChange("stock", e.target.value !== "" ? Number(e.target.value) : "")
              }
              className={cn(
                "w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none placeholder:text-muted-foreground/60",
                values.hasVariants && values.variants.length > 0 && "opacity-75 bg-muted/60 cursor-not-allowed"
              )}
            />
            <span className="text-[10px] text-muted-foreground">
              {values.hasVariants && values.variants.length > 0
                ? "Auto-synced from variants"
                : "Total units on hand"}
            </span>
          </div>
        </div>

        {/* Storefront Badge (Thematic Custom Dropdown) */}
        <div className="pt-1">
          <label className="block text-xs font-bold text-foreground mb-1">
            Storefront Badge
          </label>
          <div className="w-full sm:w-1/2">
            <ThematicSelect
              value={values.badge}
              onChange={(val) => onChange("badge", val)}
              options={STOREFRONT_BADGE_OPTIONS}
              placeholder="Select Badge (Optional)..."
              clearable={true}
              searchable={false}
            />
          </div>
        </div>

        {/* Section: Product Variants (Color, Size, Weight) */}
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

              {/* Toggle Switch */}
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

                {/* Variant Rows Table / Grid */}
                {values.variants && values.variants.length > 0 ? (
                  <div className="space-y-2.5 overflow-x-auto">
                    {/* Header for Desktop */}
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
                        {/* Color */}
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

                        {/* Size */}
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

                        {/* Weight */}
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

                        {/* Selling Price */}
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

                        {/* Purchase Price */}
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

                        {/* Stock */}
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

                        {/* Remove button */}
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

        {/* Interactive Voucher / Coupon Section */}
        <div className="pt-2">
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Special Voucher / Promo Discount
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Attach an optional coupon code for extra discount on this item
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.hasVoucher}
                  onChange={(e) => onChange("hasVoucher", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-2 text-[11px] font-bold text-foreground">
                  {values.hasVoucher ? "ON" : "OFF"}
                </span>
              </label>
            </div>

            {values.hasVoucher && (
              <div className="space-y-3 pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Discount Type Pill */}
                <div>
                  <label className="block text-[11px] font-bold text-foreground mb-1.5">
                    Discount Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border/60">
                    <button
                      type="button"
                      onClick={() => {
                        onChange("voucherType", "percentage");
                        if (!values.voucherValue || Number(values.voucherValue) > 100) {
                          onChange("voucherValue", 10);
                        }
                      }}
                      className={cn(
                        "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                        values.voucherType === "percentage"
                          ? "bg-amber-500 text-zinc-950 shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      % Percentage Off
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChange("voucherType", "flat");
                        if (!values.voucherValue || Number(values.voucherValue) <= 100) {
                          onChange("voucherValue", 500);
                        }
                      }}
                      className={cn(
                        "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                        values.voucherType === "flat"
                          ? "bg-amber-500 text-zinc-950 shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      ৳ Flat Money Off
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-foreground mb-1">
                      {values.voucherType === "percentage"
                        ? "Discount Percentage (%)"
                        : "Discount Amount (৳)"}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={values.voucherType === "percentage" ? 99 : 500000}
                        placeholder={values.voucherType === "percentage" ? "10" : "500"}
                        value={values.voucherValue}
                        onChange={(e) =>
                          onChange(
                            "voucherValue",
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                        {values.voucherType === "percentage" ? "%" : "৳"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-foreground mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TELOS10"
                      value={values.voucherCode}
                      onChange={(e) =>
                        onChange("voucherCode", e.target.value.toUpperCase())
                      }
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border/60 hover:bg-background cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Show Voucher Badge on Storefront Card
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      When enabled, customers see coupon ribbon directly on the product card
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={values.showVoucherOnCard}
                    onChange={(e) => onChange("showVoucherOnCard", e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-500 cursor-pointer ml-3 shrink-0"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Full Specifications & Rich Text Details */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Full Details & Specifications
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Use rich text formatting (headings, lists, bold, links) to present specs and product highlights
            </p>
          </div>
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor
          value={values.description}
          onChange={(val) => onChange("description", val)}
          placeholder="Enter full specifications, highlights, box contents, battery capacity, warranty notes..."
        />

        {/* Visibility & Marketing Flags */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => onChange("isFeatured", e.target.checked)}
              className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
            />
            <span>Feature on Homepage</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={values.isFlashDeal}
              onChange={(e) => onChange("isFlashDeal", e.target.checked)}
              className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
            />
            <span>Include in Flash Deals</span>
          </label>
        </div>
      </div>
    </div>
  );
}
