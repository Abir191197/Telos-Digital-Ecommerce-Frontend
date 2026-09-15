"use client";

import React from "react";
import { Zap, ShieldCheck, Star, Ticket, ImageIcon } from "lucide-react";

interface ProductLivePreviewCardProps {
  title: string;
  brand: string;
  categoryName: string;
  shortDesc: string;
  badge: string;
  warranty: string;
  stock: number;
  numericPrice: number;
  numericOriginal: number;
  discountPercent: number;
  previewThumbnail: string;
  hasImages: boolean;
  hasVoucher: boolean;
  showVoucherOnCard: boolean;
  voucherCode: string;
  voucherType: "percentage" | "flat";
  voucherValue: number | "";
}

export function ProductLivePreviewCard({
  title,
  brand,
  categoryName,
  shortDesc,
  badge,
  warranty,
  stock,
  numericPrice,
  numericOriginal,
  discountPercent,
  previewThumbnail,
  hasImages,
  hasVoucher,
  showVoucherOnCard,
  voucherCode,
  voucherType,
  voucherValue,
}: ProductLivePreviewCardProps) {
  return (
    <div className="relative flex flex-col rounded-3xl bg-card text-card-foreground p-3 border border-border/80 shadow-md">
      {/* Image Box */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/40 flex items-center justify-center">
        {hasImages ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewThumbnail}
            alt={title || "Product preview"}
            className="h-full w-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/60 gap-1.5 p-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground/50">
              <ImageIcon className="h-7 w-7" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground/70">
              Product Photo Preview
            </span>
          </div>
        )}

        {/* Discount or Custom Badge */}
        {discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-zinc-950 shadow-xs">
            <Zap className="h-3 w-3 fill-zinc-950" />
            <span>-{discountPercent}%</span>
          </div>
        ) : badge ? (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-zinc-900/85 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            {badge}
          </div>
        ) : null}

        <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-muted-foreground shadow-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        </div>
      </div>

      {/* Info Body */}
      <div className="flex flex-1 flex-col px-1 pt-3 pb-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold uppercase tracking-wider text-foreground">
            {brand || "Brand"}
          </span>
          <span className="truncate max-w-[130px] text-[10px]">
            {categoryName}
          </span>
        </div>

        <h4 className="mt-1 font-bold text-sm text-foreground line-clamp-2 leading-snug">
          {title || "Product Title Will Appear Here"}
        </h4>

        {shortDesc && (
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
            {shortDesc}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-foreground text-[11px]">
              5.0
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">(New SKU)</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
          </span>
        </div>

        {/* Price Row */}
        <div className="mt-3 pt-2 border-t border-border/50 flex items-baseline justify-between">
          <div>
            <span className="text-base font-extrabold text-foreground">
              ৳{numericPrice > 0 ? numericPrice.toLocaleString() : "0"}
            </span>
            {numericOriginal > numericPrice && (
              <span className="ml-2 text-xs line-through text-muted-foreground">
                ৳{numericOriginal.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {warranty ? warranty.split(" ")[0] : "1"} Yr Warranty
          </span>
        </div>

        {/* Live Voucher Pill in Preview */}
        {hasVoucher && showVoucherOnCard && voucherCode && (
          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-amber-500/10 border border-dashed border-amber-500/35 px-2.5 py-1 text-[10px] text-amber-700 dark:text-amber-300 font-bold animate-in fade-in duration-200">
            <span className="flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-amber-500" />
              <span>
                {voucherType === "percentage"
                  ? `${voucherValue || 0}% OFF with ${voucherCode}`
                  : `৳${(voucherValue || 0).toLocaleString()} OFF with ${voucherCode}`}
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
              Coupon
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
