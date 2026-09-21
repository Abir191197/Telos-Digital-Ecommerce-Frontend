"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ProductLivePreviewCard } from "./ProductLivePreviewCard";
import { type ProductFormValues } from "./ProductDetailsFormCard";

interface ProductPreviewSidebarProps {
  formValues: ProductFormValues;
  brandName?: string;
  categoryName?: string;
  numericPrice: number;
  numericStock: number;
  previewThumbnail: string;
  hasImages: boolean;
}

export function ProductPreviewSidebar({
  formValues,
  brandName = "Brand",
  categoryName = "Product Category",
  numericPrice,
  numericStock,
  previewThumbnail,
  hasImages,
}: ProductPreviewSidebarProps) {
  return (
    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Storefront Preview
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" /> Live Sync
        </span>
      </div>

      <ProductLivePreviewCard
        title={formValues.title}
        brand={brandName}
        categoryName={categoryName}
        shortDesc={formValues.shortDesc}
        badge={formValues.badge}
        stock={numericStock}
        numericPrice={numericPrice}
        previewThumbnail={previewThumbnail}
        hasImages={hasImages}
        hasVoucher={formValues.hasVoucher}
        showVoucherOnCard={formValues.showVoucherOnCard}
        voucherCode={formValues.voucherCode}
        voucherType={formValues.voucherType}
        voucherValue={formValues.voucherValue}
      />

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
        <h4 className="text-xs font-bold text-foreground">
          Real-time Customer View
        </h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          This interactive preview renders exactly how your customers will see this item on the storefront cards and promotional listings.
        </p>
      </div>
    </div>
  );
}
