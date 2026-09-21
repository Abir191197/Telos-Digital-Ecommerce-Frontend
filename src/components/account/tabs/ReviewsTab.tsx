"use client";

import React, { useState } from "react";
import {
  MessageSquarePlus,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerReview } from "../accountNavData";
import { useCreateReviewMutation } from "@/services/api/reviews/reviewApi";
import { ReviewInputModal } from "./ReviewInputModal";
import { PendingReviewsList } from "./PendingReviewsList";
import { PublishedReviewsList } from "./PublishedReviewsList";

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

  const handleStartReview = (rev: CustomerReview) => {
    setReviewModalItem(rev);
    setRatingInput(5);
    setCommentInput("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Bar with 2-State Segmented Control */}
      <div className="sticky top-[80px] z-20 sm:static flex flex-col items-start gap-3.5 bg-card/95 sm:bg-muted/20 backdrop-blur-md sm:backdrop-blur-none p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/70 sm:border-transparent shadow-xs sm:shadow-none transition-all">
        <div className="hidden sm:block">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Reviews &amp; Ratings
          </h3>
          <p className="text-xs text-muted-foreground">
            Share feedback on your verified purchases and view past reviews.
          </p>
        </div>

        {/* 2 States Toggle: "To Review" and "History" */}
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

      {/* STATE 1: TO REVIEW (Pending Reviews) */}
      {reviewTabState === "to_review" && (
        <PendingReviewsList
          reviews={reviews}
          onStartReview={handleStartReview}
        />
      )}

      {/* STATE 2: HISTORY (Published Reviews) */}
      {reviewTabState === "history" && (
        <PublishedReviewsList reviews={reviews} />
      )}

      {/* Review Input Modal */}
      <ReviewInputModal
        reviewModalItem={reviewModalItem}
        onClose={() => setReviewModalItem(null)}
        ratingInput={ratingInput}
        setRatingInput={setRatingInput}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
