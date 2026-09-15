"use client";

import React, { useState } from "react";
import { Ticket, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";

export interface ProductFormValues {
  title: string;
  brand: string;
  categorySlug: string;
  shortDesc: string;
  price: number | "";
  originalPrice: number | "";
  stock: number;
  badge: string;
  warranty: string;
  hasVoucher: boolean;
  voucherType: "percentage" | "flat";
  voucherValue: number | "";
  voucherCode: string;
  showVoucherOnCard: boolean;
  sku: string;
  description: string;
  isFeatured: boolean;
  isFlashDeal: boolean;
}

interface ProductDetailsFormCardProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function ProductDetailsFormCard({ values, onChange }: ProductDetailsFormCardProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
      {/* Section: Basic Info */}
      <div className="space-y-4 pb-5 border-b border-border/50">
        <h3 className="text-sm font-bold text-foreground">
          Basic Information
        </h3>

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
            className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Brand <span className="text-rose-500">*</span>
            </label>
            <select
              value={values.brand}
              onChange={(e) => onChange("brand", e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
            >
              {brandsData.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
              <option value="Other">Other Brand</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={values.categorySlug}
              onChange={(e) => onChange("categorySlug", e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
            >
              {categoriesData.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Short Description (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Fast A18 Pro chip, 5x Telephoto camera, Ceramic Shield."
            value={values.shortDesc}
            onChange={(e) => onChange("shortDesc", e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Section: Price & Stock */}
      <div className="space-y-4 pb-5 border-b border-border/50">
        <h3 className="text-sm font-bold text-foreground">
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Selling Price (৳) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="95000"
              value={values.price}
              onChange={(e) =>
                onChange("price", e.target.value ? Number(e.target.value) : "")
              }
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Original Price (৳)
            </label>
            <input
              type="number"
              min="0"
              placeholder="105000"
              value={values.originalPrice}
              onChange={(e) =>
                onChange("originalPrice", e.target.value ? Number(e.target.value) : "")
              }
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Available Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={values.stock}
              onChange={(e) => onChange("stock", Number(e.target.value))}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Storefront Badge
            </label>
            <select
              value={values.badge}
              onChange={(e) => onChange("badge", e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
            >
              <option value="New">New</option>
              <option value="Trending">Trending</option>
              <option value="Hot">Hot</option>
              <option value="Sale">Sale</option>
              <option value="Official Warranty">Official Warranty</option>
              <option value="">No Badge</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Warranty Tenure
            </label>
            <input
              type="text"
              value={values.warranty}
              onChange={(e) => onChange("warranty", e.target.value)}
              placeholder="e.g. 1 Year Official Brand Warranty"
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
            />
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

      {/* Section: Optional Details Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-bold text-foreground cursor-pointer"
        >
          <span>Additional Details (SKU, Full Description, Deals)</span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 rounded-2xl bg-muted/15 border border-border/60 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                SKU Reference
              </label>
              <input
                type="text"
                placeholder="Leave blank to auto-generate (TELOS-...)"
                value={values.sku}
                onChange={(e) => onChange("sku", e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Full Details / Specs
              </label>
              <textarea
                rows={3}
                placeholder="Detailed features, box contents, battery capacity..."
                value={values.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isFeatured}
                  onChange={(e) => onChange("isFeatured", e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                <span>Feature on Homepage</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isFlashDeal}
                  onChange={(e) => onChange("isFlashDeal", e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                <span>Include in Flash Deals</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
