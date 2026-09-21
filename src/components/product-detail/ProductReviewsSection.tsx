"use client";

import React, { useState, useEffect, useRef } from "react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { useGetProductReviewsQuery } from "@/services/api/reviews/reviewApi";
import type { Product, ProductReview } from "@/types/ecommerce.types";
import { m, type Variants } from "framer-motion";
import { CheckCircle2, PackageCheck, MessageSquare, Star, Loader2 } from "lucide-react";
import Link from "next/link";

interface ProductReviewsSectionProps {
  product: Product;
  sectionFadeUp: Variants;
}

const INITIAL_REVIEWS_BATCH = 5;
const REVIEWS_BATCH_INCREMENT = 5;

export function ProductReviewsSection({
  product,
  sectionFadeUp,
}: ProductReviewsSectionProps) {
  const { data: reviewsData } = useGetProductReviewsQuery(product.id, {
    skip: !product?.id,
  });

  // Fallback to product.reviews if query hasn't loaded or product came with embedded reviews
  const reviews: ProductReview[] = reviewsData?.data || product.reviews || [];
  const totalReviews =
    reviewsData?.totalReviews ?? product.reviewCount ?? reviews.length;
  const averageRating = reviewsData?.averageRating ?? product.rating ?? 5.0;

  // Rating breakdown percentages
  const breakdown = reviewsData?.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const getPercent = (count: number) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(INITIAL_REVIEWS_BATCH);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const hasMore = visibleCount < reviews.length;
  const visibleReviews = reviews.slice(0, visibleCount);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + REVIEWS_BATCH_INCREMENT, reviews.length)
            );
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { rootMargin: "200px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoadingMore, reviews.length]);

  return (
    <m.section
      variants={sectionFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mt-14 pt-10 border-t border-border/70 space-y-8">
      {/* Header with Verified Buyer Notice */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Customer Feedback & Ratings
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Verified Customer Reviews ({reviews.length})
          </h2>
        </div>
      </div>

      {/* Ratings Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl bg-card border border-border/70 shadow-xs">
        {/* Left: Big Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/60">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 mt-2 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= Math.round(averageRating)
                    ? "fill-amber-500 text-amber-500"
                    : "fill-muted text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <span className="mt-2 text-xs font-semibold text-muted-foreground">
            Based on {totalReviews} verified{" "}
            {totalReviews === 1 ? "review" : "reviews"}
          </span>
          <span className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Genuine BD Purchases
          </span>
        </div>

        {/* Right: Star Breakdown Progress Bars (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5 px-0 md:px-4">
          {[5, 4, 3, 2, 1].map((starCount) => {
            const count = breakdown[starCount] || 0;
            const percent = getPercent(count);
            return (
              <div key={starCount} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-muted-foreground flex items-center gap-1 shrink-0">
                  <span>{starCount}</span>
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-muted/60 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-muted-foreground font-mono font-medium shrink-0">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-border/80 bg-muted/10 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No Customer Reviews Yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Customers who have purchased and received this product can submit
              their verified rating and review directly from their Account
              Orders tab upon delivery.
            </p>
            <div className="pt-1">
              <Link
                href={`${ROUTES.ACCOUNT}?tab=orders`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-muted text-xs font-bold text-foreground border border-border/70 transition-colors shadow-2xs">
                <PackageCheck className="h-4 w-4 text-amber-500" />
                <span>View Delivered Orders</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xs space-y-3.5 hover:border-border transition-colors shadow-2xs">
                {/* Top Bar: Stars + Verified Badge + Date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "h-3.5 w-3.5",
                            s <= rev.rating
                              ? "fill-amber-500 text-amber-500"
                              : "fill-muted text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Verified Purchase
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-muted-foreground">
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>

                {/* Title & Comment */}
                <div className="space-y-1.5">
                  {rev.title && (
                    <h4 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      {rev.title}
                    </h4>
                  )}
                  {rev.comment && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {rev.comment}
                    </p>
                  )}
                </div>

                {/* Reviewer Footnote */}
                <div className="pt-2 border-t border-border/40 flex items-center gap-2.5 text-xs text-muted-foreground">
                  <div className="h-6 w-6 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] uppercase">
                    {rev.customer?.name?.[0] || "C"}
                  </div>
                  <span className="font-semibold text-foreground">
                    {rev.customer?.name || "Verified Customer"}
                  </span>
                </div>
              </div>
            ))}

            {/* Infinite Scroll Sentinel / Loading Spinner */}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                <span className="text-xs font-medium">
                  Loading more reviews ({visibleReviews.length} of {reviews.length})...
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </m.section>
  );
}
