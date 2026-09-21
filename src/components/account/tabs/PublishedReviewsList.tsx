"use client";

import React from "react";
import Link from "next/link";
import { AppImage } from "@/components/shared";
import { CheckCircle2, History, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { CustomerReview } from "../accountNavData";

interface PublishedReviewsListProps {
  reviews: CustomerReview[];
}

export function PublishedReviewsList({ reviews }: PublishedReviewsListProps) {
  const publishedReviews = reviews.filter((r) => r.status === "published");

  if (publishedReviews.length === 0) {
    return (
      <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
          <History className="h-6 w-6 stroke-[1.8]" />
        </div>
        <h4 className="text-sm font-bold text-foreground">No review history</h4>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Your published feedback and seller responses will be recorded here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {publishedReviews.map((rev) => (
        <div
          key={rev.id}
          className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4.5 sm:p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300 space-y-3"
        >
          {/* Product Header Row */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={ROUTES.PRODUCT_DETAIL(rev.productId)}
                className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-muted/40 shadow-2xs border border-border/40 hover:opacity-85 transition-opacity"
              >
                <AppImage
                  src={rev.productThumbnail}
                  alt={rev.productName}
                  fill
                  className="object-cover"
                  fallbackIconSize={16}
                />
              </Link>
              <div className="min-w-0">
                <h4>
                  <Link
                    href={ROUTES.PRODUCT_DETAIL(rev.productId)}
                    className="text-xs sm:text-sm font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block"
                  >
                    {rev.productName}
                  </Link>
                </h4>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Reviewed on {rev.date}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="h-3 w-3" />
              <span>Published</span>
            </span>
          </div>

          {/* Rating Stars & Comment Body */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < rev.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-foreground">
                {rev.rating}.0 / 5.0
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-xl">
              {rev.comment || "Great quality product, completely satisfied with fast BD delivery."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
