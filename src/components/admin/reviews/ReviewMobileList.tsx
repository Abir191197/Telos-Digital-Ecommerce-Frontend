"use client";

import React from "react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Flag,
} from "lucide-react";
import type { AdminReview } from "@/stores";
import { RatingStars, ReviewStatusBadge } from "./ReviewBadges";
import { cn } from "@/lib/utils";

interface ReviewMobileListProps {
  reviews: AdminReview[];
  onToggleVisibility: (id: string, status?: "published" | "hidden" | "flagged") => void;
  onDelete: (id: string) => void;
}

export function ReviewMobileList({
  reviews,
  onToggleVisibility,
  onDelete,
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
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className={cn(
            "p-4 rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] space-y-3",
            rev.status === "hidden" && "opacity-80"
          )}
        >
          {/* Header Row: Product info and Visibility Status */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50">
                <Image
                  src={rev.productThumbnail}
                  alt={rev.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-xs truncate max-w-[170px]">
                  {rev.productName}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                  <span>{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
            <ReviewStatusBadge status={rev.status} />
          </div>

          {/* Rating and Review content */}
          <div className="p-3 rounded-2xl bg-muted/30 space-y-1.5 text-xs">
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
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {rev.comment || "(No text comment provided)"}
            </p>
          </div>

          {/* Actions: Hide/Show, Flag, Delete */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              {rev.status === "hidden" ? (
                <button
                  type="button"
                  onClick={() => onToggleVisibility(rev.id, "published")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs cursor-pointer border border-emerald-500/20"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Unhide</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleVisibility(rev.id, "hidden")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground font-bold text-xs cursor-pointer border border-border/60"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Hide Review</span>
                </button>
              )}

              {rev.status === "flagged" ? (
                <button
                  type="button"
                  onClick={() => onToggleVisibility(rev.id, "published")}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 text-rose-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Clear Flag</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleVisibility(rev.id, "flagged")}
                  className="p-2 rounded-xl text-muted-foreground hover:text-amber-500 hover:bg-muted cursor-pointer"
                  title="Flag for Audit"
                >
                  <Flag className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDelete(rev.id)}
              className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete Review"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
