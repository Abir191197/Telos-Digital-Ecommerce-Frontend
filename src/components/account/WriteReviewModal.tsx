"use client";

import React, { useState } from "react";
import { ProductImageDisplay } from "@/components/shared";
import { Star, X, Upload, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateReviewMutation } from "@/services/api/reviews/reviewApi";

interface WriteReviewModalProps {
  item: {
    productId: string;
    productName: string;
    productThumbnail: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: {
    productId: string;
    productName: string;
    productThumbnail: string;
    rating: number;
    comment: string;
    hasPhoto: boolean;
  }) => void;
}

export function WriteReviewModal({
  item,
  isOpen,
  onClose,
  onSubmitReview,
}: WriteReviewModalProps) {
  const [createReviewMutation] = useCreateReviewMutation();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (item.productId) {
        await createReviewMutation({
          productId: item.productId,
          rating,
          comment: comment.trim(),
        }).unwrap();
      }
    } catch (err: any) {
      console.warn("Backend review submission notice:", err);
      // If backend throws an error, we display it or fall back gracefully
      if (err?.data?.message) {
        setErrorMsg(err.data.message);
        setIsSubmitting(false);
        return;
      }
    }

    onSubmitReview({
      productId: item.productId,
      productName: item.productName,
      productThumbnail: item.productThumbnail,
      rating,
      comment,
      hasPhoto: photoAttached,
    });

    setIsSubmitting(false);
    onClose();
  };

  const ratingDescriptions = [
    "Very Poor - Not recommended",
    "Poor - Significant issues",
    "Average - Standard experience",
    "Good - Satisfied with purchase",
    "Outstanding - Highly recommended!",
  ];

  return (
    <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-t sm:border border-border/80 bg-background shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90vh] overflow-hidden relative animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between shrink-0 bg-background">
          <div className="min-w-0 pr-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Customer Review</span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Rate & Review Delivered Item
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product mini card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/70">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0">
              <ProductImageDisplay
                src={item.productThumbnail}
                alt={item.productName}
                fill
                className="object-cover"
                fallbackIconSize={16}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {item.productName}
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Delivered & Verified Purchase
              </p>
            </div>
          </div>

          {/* Star selector */}
          <div className="text-center space-y-2 py-1 bg-muted/20 p-3 rounded-2xl">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="h-11 w-11 flex items-center justify-center cursor-pointer transition-transform hover:scale-115 active:scale-125 focus:outline-none touch-manipulation"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      (hoverRating || rating) >= star
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {ratingDescriptions[(hoverRating || rating) - 1]}
            </p>
          </div>

          {/* Feedback textarea */}
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Your Review:
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How is the quality, performance, and durability? Your feedback helps fellow shoppers in Bangladesh..."
              className="w-full rounded-2xl border border-border/80 bg-background p-3 text-xs text-foreground focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Photo attachment */}
          <div
            onClick={() => setPhotoAttached(!photoAttached)}
            className={cn(
              "border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all",
              photoAttached
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-border/80 hover:border-amber-500 hover:bg-muted/40"
            )}
          >
            <Upload className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <span className="text-xs font-bold text-foreground block">
              {photoAttached ? "Photo Attached ✓ (Click to remove)" : "Add Unboxing Photo (Optional)"}
            </span>
          </div>

          {/* Action buttons with safe-area bottom clearance */}
          <div className="flex items-center gap-2 pt-2 pb-6 sm:pb-1 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer active:scale-98"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Publishing..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
