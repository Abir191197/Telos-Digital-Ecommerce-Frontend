"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Star,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminReview } from "@/stores";
import { RatingStars, ReviewStatusBadge } from "./ReviewBadges";

interface ReviewDetailModalProps {
  review: AdminReview | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleVisibility?: (id: string, status?: "published" | "hidden" | "flagged") => void;
  onDelete?: (id: string) => void;
}

export function ReviewDetailModal({
  review,
  isOpen,
  onClose,
  onToggleVisibility,
  onDelete,
}: ReviewDetailModalProps) {
  if (!isOpen || !review) return null;

  const productHref = review.productSlug
    ? `/products/${review.productSlug}`
    : `/products/${review.productId}`;

  const formattedDate = new Date(review.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-foreground">
                Customer Review Details
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3 w-3" />
                <span>Submitted on {formattedDate}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Linked Product Card with Storefront Navigation */}
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
              <span>Reviewed Product</span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono">
                Storefront Linked
              </span>
            </div>

            <Link
              href={productHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 p-2 -m-2 rounded-xl hover:bg-muted/50 transition-colors"
              title={`View ${review.productName} in storefront (opens in new tab)`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/60 group-hover:border-amber-500/40 transition-colors">
                  {review.productThumbnail ? (
                    <Image
                      src={review.productThumbnail}
                      alt={review.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                      No Pic
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {review.productName}
                  </h4>
                  <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                    {review.productSlug ? `/${review.productSlug}` : `ID: ${review.productId}`}
                  </p>
                </div>
              </div>

              <div className="h-8 px-2.5 rounded-xl border border-border/60 bg-background text-foreground text-[11px] font-semibold flex items-center gap-1.5 shrink-0 group-hover:border-amber-500/40 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-all shadow-2xs">
                <span>View Product</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </Link>
          </div>

          {/* Customer Profile & Verification Snapshot */}
          <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                  {review.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-foreground truncate">
                      {review.customerName}
                    </p>
                    {review.verifiedPurchase && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
                        title="Verified Buyer"
                      >
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[170px]">{review.customerEmail}</span>
                    </span>
                    {review.customerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{review.customerPhone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ReviewStatusBadge status={review.status} />
            </div>
          </div>

          {/* Review Score & Full Comment Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-card via-muted/20 to-muted/30 border border-border/70 space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <div className="flex items-center gap-2">
                <RatingStars rating={review.rating} />
                <span className="font-mono font-black text-xs text-foreground">
                  {review.rating}.0 / 5.0
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Customer Rating
              </span>
            </div>

            {review.title && (
              <h3 className="font-extrabold text-sm sm:text-base text-foreground leading-snug">
                {review.title}
              </h3>
            )}

            <div className="p-3.5 rounded-xl bg-background/80 border border-border/50">
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap select-text">
                {review.comment || "(No text comment provided by customer)"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-border/50">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(review.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Review</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onToggleVisibility && (
              review.status === "hidden" ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onToggleVisibility(review.id, "published");
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Publish Review</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onToggleVisibility(review.id, "hidden");
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-border/70 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Hide from Storefront</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-muted/60 hover:bg-muted transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
