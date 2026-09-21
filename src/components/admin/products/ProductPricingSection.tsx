"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThematicSelect } from "@/components/common";
import { ProductFormValues } from "./ProductDetailsFormCard";

interface ProductPricingSectionProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

const STOREFRONT_BADGE_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Trending", label: "Trending" },
  { value: "Hot", label: "Hot" },
  { value: "Sale", label: "Sale" },
  { value: "Official Warranty", label: "Official Warranty" },
];

export function ProductPricingSection({ values, onChange }: ProductPricingSectionProps) {
  const sellingNum = Number(values.price) || 0;
  const costNum = Number(values.costPrice) || 0;
  const hasCost = values.costPrice !== "" && costNum > 0;
  const grossProfit = sellingNum - costNum;
  const marginPercent =
    sellingNum > 0 && hasCost ? Math.round((grossProfit / sellingNum) * 100) : null;

  return (
    <div className="space-y-4">
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
        {/* Selling Price */}
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

        {/* Purchase Price */}
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

        {/* Total Stock */}
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

      {/* Storefront Badge */}
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
    </div>
  );
}
