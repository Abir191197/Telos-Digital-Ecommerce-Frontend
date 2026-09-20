"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MessageSquarePlus,
  History,
  CheckCircle2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerReview } from "../accountNavData";

import { useCreateReviewMutation } from "@/services/api/reviews/reviewApi";

interface ReviewsTabProps {
  reviews: CustomerReview[];
  onReviewUpdate: (updatedReview: CustomerReview) => void;
}

export function ReviewsTab({ reviews, onReviewUpdate }: ReviewsTabProps) {
  const [reviewTabState, setReviewTabState] = useState<"to_review" | "history">("to_review");
  const [reviewModalItem, setReviewModalItem] = useState<CustomerReview | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [createReviewMutation] = useCreateReviewMutation();

  const pendingReviewCount = reviews.filter(
    (r) => r.status === "pending_review"
  ).length;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (reviewModalItem.productId && !reviewModalItem.productId.startsWith("mock-")) {
        await createReviewMutation({
          productId: reviewModalItem.productId,
          rating: ratingInput,
          comment: commentInput.trim(),
        }).unwrap();
      }
    } catch (err: any) {
      console.warn("Review API notice:", err);
      // If backend reports error, show message or fallback
      if (err?.data?.message) {
        setSubmitError(err.data.message);
        setIsSubmitting(false);
        return;
      }
    }

    onReviewUpdate({
      ...reviewModalItem,
      rating: ratingInput,
      comment: commentInput,
      status: "published",
      date: "Just now",
    });

    setIsSubmitting(false);
    setReviewModalItem(null);
    setCommentInput("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar with 2-State Segmented Control: Sticky on mobile under top nav, Swipeable on overflow */}
      <div className="sticky top-[80px] z-20 sm:static flex flex-col items-start gap-3.5 bg-card/95 sm:bg-muted/20 backdrop-blur-md sm:backdrop-blur-none p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/70 sm:border-transparent shadow-xs sm:shadow-none transition-all">
        <div className="hidden sm:block">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Reviews & Ratings
          </h3>
          <p className="text-xs text-muted-foreground">
            Share feedback on your verified purchases and view past reviews.
          </p>
        </div>

        {/* 2 States Toggle: "To Review" and "History" - Left Aligned & Swipeable */}
        <div className="w-full overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none py-0.5">
          <div className="inline-flex items-center bg-background/90 dark:bg-muted/60 p-1.5 rounded-2xl shadow-2xs min-w-max border border-border/50">
            <button
              type="button"
              onClick={() => setReviewTabState("to_review")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95",
                reviewTabState === "to_review"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span>To Review</span>
              {pendingReviewCount > 0 && (
                <span
                  className={cn(
                    "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black",
                    reviewTabState === "to_review"
                      ? "bg-zinc-950/20 text-zinc-950"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {pendingReviewCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setReviewTabState("history")}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95",
                reviewTabState === "history"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black shadow-md shadow-amber-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <History className="h-3.5 w-3.5" />
              <span>History</span>
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black",
                  reviewTabState === "history"
                    ? "bg-zinc-950/20 text-zinc-950"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {reviews.filter((r) => r.status === "published").length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── STATE 1: TO REVIEW (Pending Reviews) ── */}
      {reviewTabState === "to_review" && (
        <div>
          {reviews.filter((r) => r.status === "pending_review").length === 0 ? (
            <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
                <CheckCircle2 className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-foreground">All caught up!</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                You have reviewed all your delivered purchases. Check back after your next order arrives.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews
                .filter((r) => r.status === "pending_review")
                .map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4.5 sm:p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.06] hover:shadow-[0_12px_30px_-4px_rgba(245,158,11,0.08)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs border border-border/40">
                        <Image
                          src={rev.productThumbnail}
                          alt={rev.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
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
                        <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 sm:line-clamp-2">
                          {rev.productName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Help other shoppers make smart choices by rating this item.
                        </p>
                      </div>
                    </div>

                    <div className="self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <button
                        type="button"
                        onClick={() => {
                          setReviewModalItem(rev);
                          setRatingInput(5);
                          setCommentInput("");
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Star className="h-4 w-4 fill-current" />
                        <span>Write Review</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── STATE 2: HISTORY (Published Reviews) ── */}
      {reviewTabState === "history" && (
        <div>
          {reviews.filter((r) => r.status === "published").length === 0 ? (
            <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
                <History className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-foreground">No review history</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Your published feedback and seller responses will be recorded here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {reviews
                .filter((r) => r.status === "published")
                .map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4.5 sm:p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.06] hover:shadow-[0_12px_30px_-4px_rgba(245,158,11,0.08)] transition-all duration-300 space-y-3"
                  >
                    {/* Product Header Row */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-muted/40 shadow-2xs border border-border/40">
                          <Image
                            src={rev.productThumbnail}
                            alt={rev.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {rev.productName}
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
          )}
        </div>
      )}

      {/* Review Input Modal (Optimized for Mobile Bottom Sheet + Desktop Dialog) */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 border-t sm:border border-border/70 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Fixed Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 p-4 sm:p-5 shrink-0 bg-card">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Rate & Review Product
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-[240px]">
                    {reviewModalItem.productName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalItem(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form
              onSubmit={handleSubmitReview}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs overscroll-contain"
            >
              {/* Rating selection with touch-friendly 44px buttons */}
              <div className="bg-muted/30 p-4 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-foreground">
                  How would you rate this item?
                </p>
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="h-11 w-11 flex items-center justify-center cursor-pointer transition-transform active:scale-125 hover:scale-110 touch-manipulation"
                      aria-label={`${star} star rating`}
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          star <= ratingInput
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                  {ratingInput === 5
                    ? "Excellent (5 Stars)"
                    : ratingInput === 4
                    ? "Very Good (4 Stars)"
                    : ratingInput === 3
                    ? "Average (3 Stars)"
                    : ratingInput === 2
                    ? "Poor (2 Stars)"
                    : "Terrible (1 Star)"}
                </span>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1.5">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tell other shoppers about authenticity, build quality, packing, and courier delivery..."
                  className="w-full rounded-2xl bg-muted/40 p-3.5 font-medium text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs sm:text-sm leading-relaxed transition-all resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {submitError}
                </div>
              )}

              {/* Sticky/Bottom-docked Action Buttons with Safe-area clearance */}
              <div className="pt-2 pb-6 sm:pb-1 flex items-center gap-2.5 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-muted/70 hover:bg-muted text-foreground py-3 text-xs font-bold transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !commentInput.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 py-3 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
