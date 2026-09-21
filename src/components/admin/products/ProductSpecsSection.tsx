"use client";

import React from "react";
import { FileText } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { ProductFormValues } from "./ProductDetailsFormCard";

interface ProductSpecsSectionProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function ProductSpecsSection({ values, onChange }: ProductSpecsSectionProps) {
  return (
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

      <RichTextEditor
        value={values.description}
        onChange={(val) => onChange("description", val)}
        placeholder="Enter full specifications, highlights, box contents, battery capacity, warranty notes..."
      />

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
  );
}
