"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Flag,
  ExternalLink,
  FileText,
} from "lucide-react";
import type { AdminReview } from "@/stores";
import { RatingStars, ReviewStatusBadge } from "./ReviewBadges";
import { cn } from "@/lib/utils";

interface ReviewDesktopTableProps {
  reviews: AdminReview[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onToggleVisibility: (id: string, status?: "published" | "hidden" | "flagged") => void;
  onDelete: (id: string) => void;
  onViewReview?: (review: AdminReview) => void;
}

export function ReviewDesktopTable({
  reviews,
  activeMenuId,
  setActiveMenuId,
  onToggleVisibility,
  onDelete,
  onViewReview,
}: ReviewDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl bg-card border-none overflow-visible shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
      <div className="overflow-x-visible">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3.5 px-4 w-1/4">Product</th>
              <th className="py-3.5 px-4 w-1/6">Customer</th>
              <th className="py-3.5 px-4">Rating &amp; Review</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Visibility</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground text-xs"
                >
                  No customer reviews match the selected filter.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => {
                const isMenuOpen = activeMenuId === rev.id;
                const productHref = rev.productSlug
                  ? `/products/${rev.productSlug}`
                  : `/products/${rev.productId}`;

                return (
                  <tr
                    key={rev.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      rev.status === "hidden" && "opacity-75 bg-muted/10"
                    )}
                  >
                    {/* Product: Clickable Link to Storefront Product Page */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={productHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/prod flex items-center gap-3 cursor-pointer"
                        title={`View ${rev.productName} in storefront (opens in new tab)`}
                      >
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50 group-hover/prod:border-amber-500/50 transition-colors">
                          {rev.productThumbnail ? (
                            <Image
                              src={rev.productThumbnail}
                              alt={rev.productName}
                              fill
                              className="object-cover group-hover/prod:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[9px] text-muted-foreground font-bold">
                              No Pic
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[180px] group-hover/prod:text-amber-600 dark:group-hover/prod:text-amber-400 flex items-center gap-1 transition-colors">
                            <span className="truncate">{rev.productName}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/prod:opacity-100 text-amber-500 transition-opacity" />
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[180px]">
                            {rev.productSlug ? `/${rev.productSlug}` : `ID: ${rev.productId}`}
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-foreground">{rev.customerName}</p>
                        {rev.verifiedPurchase && (
                          <span
                            title="Verified Purchaser"
                            className="inline-flex items-center text-emerald-500"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {rev.customerEmail}
                      </p>
                    </td>

                    {/* Rating & Review (Click to view full review) */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onViewReview?.(rev)}
                        className="space-y-1 cursor-pointer group/rev"
                        title="Click to view full review details"
                      >
                        <RatingStars rating={rev.rating} />
                        {rev.title && (
                          <p className="font-bold text-foreground text-xs group-hover/rev:text-amber-600 dark:group-hover/rev:text-amber-400 transition-colors">
                            {rev.title}
                          </p>
                        )}
                        <p className="text-muted-foreground text-[11px] line-clamp-2 max-w-sm">
                          {rev.comment || "(No text comment provided)"}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                      {new Date(rev.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Visibility Status */}
                    <td className="py-3.5 px-4">
                      <ReviewStatusBadge status={rev.status} />
                    </td>

                    {/* Three-Dot Menu Action */}
                    <td className="py-3.5 px-4 text-right relative" data-action-menu>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : rev.id);
                        }}
                        className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title="Moderation Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-4 top-10 z-40 w-44 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
                          {/* View Full Review in Modal */}
                          {onViewReview && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewReview(rev);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 rounded-xl transition-colors text-left cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5 text-amber-500" />
                              <span>View Full Review</span>
                            </button>
                          )}

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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
