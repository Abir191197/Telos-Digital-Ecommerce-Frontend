"use client";

import React from "react";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerReview } from "../accountNavData";

interface ReviewInputModalProps {
  reviewModalItem: CustomerReview | null;
  onClose: () => void;
  ratingInput: number;
  setRatingInput: (rating: number) => void;
  commentInput: string;
  setCommentInput: (comment: string) => void;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewInputModal({
  reviewModalItem,
  onClose,
  ratingInput,
  setRatingInput,
  commentInput,
  setCommentInput,
  isSubmitting,
  submitError,
  onSubmit,
}: ReviewInputModalProps) {
  if (!reviewModalItem) return null;

  return (
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
                Rate &amp; Review Product
              </h3>
              <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-[240px]">
                {reviewModalItem.productName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          onSubmit={onSubmit}
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

          {/* Bottom Action Buttons */}
          <div className="pt-2 pb-6 sm:pb-1 flex items-center gap-2.5 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
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
  );
}
