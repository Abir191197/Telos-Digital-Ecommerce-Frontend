"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { ThematicSelect } from "@/components/common";
import { ProductFormValues } from "./ProductDetailsFormCard";

interface ProductBasicInfoSectionProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
  categories?: any[];
  brands?: any[];
  isLoadingTaxonomy?: boolean;
}

export function ProductBasicInfoSection({
  values,
  onChange,
  categories = [],
  brands = [],
  isLoadingTaxonomy = false,
}: ProductBasicInfoSectionProps) {
  const selectedCategory = categories.find(
    (c: any) => c.id === values.categoryId || c.slug === values.categoryId
  );

  const availableSubCategories: any[] =
    selectedCategory?.subCategories || selectedCategory?.subcategories || [];

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

  return (
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

      {/* Brand & Category Selectors */}
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
              onChange("subCategoryId", "");
            }}
            options={categoryOptions}
            placeholder="Select Category..."
            searchable={categoryOptions.length > 5}
          />
        </div>
      </div>

      {/* Subcategory Selector */}
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
  );
}
