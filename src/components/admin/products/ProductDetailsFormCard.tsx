"use client";

import React from "react";
import { ProductBasicInfoSection } from "./ProductBasicInfoSection";
import { ProductPricingSection } from "./ProductPricingSection";
import { ProductVariantsSection } from "./ProductVariantsSection";
import { ProductVoucherSection } from "./ProductVoucherSection";
import { ProductSpecsSection } from "./ProductSpecsSection";

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

export function ProductDetailsFormCard({
  values,
  onChange,
  categories = [],
  brands = [],
  isLoadingTaxonomy = false,
}: ProductDetailsFormCardProps) {
  return (
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-6">
      {/* Section 1: Basic Info & Taxonomy */}
      <ProductBasicInfoSection
        values={values}
        onChange={onChange}
        categories={categories}
        brands={brands}
        isLoadingTaxonomy={isLoadingTaxonomy}
      />

      {/* Section 2: Pricing, Stock, Variants & Voucher */}
      <div className="space-y-4 pb-5 border-b border-border/50">
        <ProductPricingSection values={values} onChange={onChange} />
        <ProductVariantsSection values={values} onChange={onChange} />
        <ProductVoucherSection values={values} onChange={onChange} />
      </div>

      {/* Section 3: Full Specifications & Rich Text Details */}
      <ProductSpecsSection values={values} onChange={onChange} />
    </div>
  );
}
