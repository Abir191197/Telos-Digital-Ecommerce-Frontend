"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Flag,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { AdminReview } from "@/stores";
import { RatingStars, ReviewStatusBadge } from "./ReviewBadges";
import { cn } from "@/lib/utils";

interface ReviewMobileListProps {
  reviews: AdminReview[];
  onToggleVisibility: (id: string, status?: "published" | "hidden" | "flagged") => void;
  onDelete: (id: string) => void;
  onViewReview?: (review: AdminReview) => void;
}

export function ReviewMobileList({
  reviews,
  onToggleVisibility,
  onDelete,
  onViewReview,
}: ReviewMobileListProps) {
  if (reviews.length === 0) {
    return (
      <div className="block md:hidden p-8 text-center text-muted-foreground text-xs rounded-3xl bg-card">
        No customer reviews match the selected filter.
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3.5">
      {reviews.map((rev) => {
        const productHref = rev.productSlug
          ? `/products/${rev.productSlug}`
          : `/products/${rev.productId}`;

        return (
          <div
            key={rev.id}
            className={cn(
              "p-4 rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] space-y-3",
              rev.status === "hidden" && "opacity-80"
            )}
          >
            {/* Header Row: Product info and Visibility Status */}
            <div className="flex items-start justify-between gap-2.5">
              <Link
                href={productHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 min-w-0 cursor-pointer"
                title={`View ${rev.productName} on storefront`}
              >
                <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50 group-hover:border-amber-500/50 transition-colors">
                  {rev.productThumbnail ? (
                    <Image
                      src={rev.productThumbnail}
                      alt={rev.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[8px] text-muted-foreground font-bold">
                      No Pic
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-xs truncate max-w-[170px] group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1">
                    <span className="truncate">{rev.productName}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-amber-500 shrink-0" />
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                    <span>{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    )}
                  </div>
                </div>
              </Link>
              <ReviewStatusBadge status={rev.status} />
            </div>

            {/* Rating and Review content (Clickable to open modal) */}
            <div
              onClick={() => onViewReview?.(rev)}
              className="p-3 rounded-2xl bg-muted/30 space-y-1.5 text-xs cursor-pointer"
              title="Click to view full review details"
            >
              <div className="flex items-center justify-between">
                <RatingStars rating={rev.rating} />
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(rev.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {rev.title && (
                <p className="font-bold text-foreground text-xs">{rev.title}</p>
              )}
              <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-3">
                {rev.comment || "(No text comment provided)"}
              </p>
            </div>

            {/* Actions: View, Hide/Show, Flag, Delete */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onViewReview?.(rev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs cursor-pointer border border-amber-500/20"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>

                {rev.status === "hidden" ? (
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(rev.id, "published")}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs cursor-pointer border border-emerald-500/20"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Unhide</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(rev.id, "hidden")}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground font-bold text-xs cursor-pointer border border-border/60"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Hide</span>
                  </button>
                )}

                {rev.status === "flagged" ? (
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(rev.id, "published")}
                    className="px-2 py-1.5 rounded-xl bg-rose-500/15 text-rose-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(rev.id, "flagged")}
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-amber-500 hover:bg-muted cursor-pointer"
                    title="Flag for Audit"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDelete(rev.id)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete Review"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
