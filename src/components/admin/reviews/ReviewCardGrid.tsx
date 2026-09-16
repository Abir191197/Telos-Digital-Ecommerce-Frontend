"use client";

import React from "react";
import Image from "next/image";
import {
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Flag,
} from "lucide-react";
import type { AdminReview } from "@/stores";
import { RatingStars, ReviewStatusBadge } from "./ReviewBadges";
import { cn } from "@/lib/utils";

interface ReviewCardGridProps {
  reviews: AdminReview[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onToggleVisibility: (id: string, status?: "published" | "hidden" | "flagged") => void;
  onDelete: (id: string) => void;
}

export function ReviewCardGrid({
  reviews,
  activeMenuId,
  setActiveMenuId,
  onToggleVisibility,
  onDelete,
}: ReviewCardGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground text-xs rounded-3xl bg-card">
        No customer reviews match the selected filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {reviews.map((rev) => {
        const isMenuOpen = activeMenuId === rev.id;

        return (
          <div
            key={rev.id}
            className={cn(
              "group relative flex flex-col justify-between overflow-visible rounded-3xl bg-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 admin-card border border-border/40 sm:border-none",
              "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]",
              rev.status === "hidden" && "opacity-80"
            )}
          >
            {/* Top Row: Product thumbnail, title, status, and 3-dot menu */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-muted/40 shrink-0 border border-border/50 shadow-xs">
                    <Image
                      src={rev.productThumbnail}
                      alt={rev.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-foreground text-xs sm:text-sm tracking-tight truncate max-w-[150px]">
                      {rev.productName}
                    </h4>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {new Date(rev.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <ReviewStatusBadge status={rev.status} />

                  {/* 3-Dot Action Menu */}
                  <div className="relative" data-action-menu>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : rev.id);
                      }}
                      className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                      title="Moderation Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
                        {rev.status === "hidden" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleVisibility(rev.id, "published");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Publish Review</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleVisibility(rev.id, "hidden");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Hide Review</span>
                          </button>
                        )}

                        {rev.status === "flagged" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleVisibility(rev.id, "published");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Clear Flag</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleVisibility(rev.id, "flagged");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <Flag className="h-3.5 w-3.5 text-amber-500" />
                            <span>Flag for Audit</span>
                          </button>
                        )}

                        <div className="my-1 border-t border-border/40" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDelete(rev.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Review</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating & Review Body */}
              <div className="p-3.5 rounded-2xl bg-muted/30 space-y-2 mb-4">
                <RatingStars rating={rev.rating} />
                {rev.title && (
                  <p className="font-bold text-foreground text-xs">{rev.title}</p>
                )}
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                  {rev.comment || "(No text comment provided)"}
                </p>
              </div>
            </div>

            {/* Bottom: Customer identity pill */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-foreground truncate">
                  {rev.customerName}
                </span>
                {rev.verifiedPurchase && (
                  <span
                    title="Verified Buyer"
                    className="inline-flex items-center text-emerald-500 shrink-0"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground truncate max-w-[120px] font-mono">
                {rev.customerEmail}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
