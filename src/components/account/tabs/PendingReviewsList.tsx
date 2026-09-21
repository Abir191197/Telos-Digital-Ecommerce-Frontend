"use client";

import React from "react";
import Link from "next/link";
import { AppImage } from "@/components/shared";
import { CheckCircle2, Sparkles, Star } from "lucide-react";
import { ROUTES } from "@/constants";
import type { CustomerReview } from "../accountNavData";

interface PendingReviewsListProps {
  reviews: CustomerReview[];
  onStartReview: (review: CustomerReview) => void;
}

export function PendingReviewsList({
  reviews,
  onStartReview,
}: PendingReviewsListProps) {
  const pendingReviews = reviews.filter((r) => r.status === "pending_review");

  if (pendingReviews.length === 0) {
    return (
      <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
          <CheckCircle2 className="h-6 w-6 stroke-[1.8]" />
        </div>
        <h4 className="text-sm font-bold text-foreground">All caught up!</h4>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          You have reviewed all your delivered purchases. Check back after your next order arrives.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingReviews.map((rev) => (
        <div
          key={rev.id}
          className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4.5 sm:p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <Link
              href={ROUTES.PRODUCT_DETAIL(rev.productId)}
              className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs border border-border/40 hover:opacity-85 transition-opacity"
            >
              <AppImage
                src={rev.productThumbnail}
                alt={rev.productName}
                fill
                className="object-cover"
                fallbackIconSize={20}
              />
            </Link>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Verified Purchase</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Purchased {rev.date}
                </span>
              </div>
              <h4>
                <Link
                  href={ROUTES.PRODUCT_DETAIL(rev.productId)}
                  className="text-xs sm:text-sm font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1 sm:line-clamp-2 block"
                >
                  {rev.productName}
                </Link>
              </h4>
              <p className="text-xs text-muted-foreground">
                Help other shoppers make smart choices by rating this item.
              </p>
            </div>
          </div>

          <div className="self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
            <button
              type="button"
              onClick={() => onStartReview(rev)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>Write Review</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
