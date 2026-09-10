"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, X, Upload, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomerReview } from "./accountNavData";

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
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [mockPhotoUploaded, setMockPhotoUploaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview({
        productId: item.productId,
        productName: item.productName,
        productThumbnail: item.productThumbnail,
        rating,
        comment,
        hasPhoto: mockPhotoUploaded,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const ratingDescriptions = [
    "Very Poor - Not recommended",
    "Poor - Significant issues",
    "Average - Standard experience",
    "Good - Satisfied with purchase",
    "Outstanding - Highly recommended!",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 sm:p-7 shadow-2xl space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Customer Review</span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            Rate & Review Product
          </h3>
        </div>

        {/* Product mini card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/70">
          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0">
            <Image
              src={item.productThumbnail}
              alt={item.productName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {item.productName}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Official BD Warranty Unit
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="text-center space-y-2 py-1">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
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
            <label className="text-xs font-bold text-foreground">
              Your Review:
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How is the build quality, performance, and battery life? Your feedback helps fellow shoppers in Bangladesh..."
              className="mt-1 w-full rounded-2xl border border-border/80 bg-background p-3 text-xs text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Photo attachment */}
          <div
            onClick={() => setMockPhotoUploaded(!mockPhotoUploaded)}
            className={cn(
              "border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all",
              mockPhotoUploaded
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-border/80 hover:border-amber-500 hover:bg-muted/40"
            )}
          >
            <Upload className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <span className="text-xs font-bold text-foreground block">
              {mockPhotoUploaded ? "Photo Attached ✓ (Click to remove)" : "Add Unboxing Photo (Optional)"}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Publishing..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
