"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
      <span className="ml-1 text-[11px] font-mono font-bold text-foreground">
        {rating}.0
      </span>
    </div>
  );
}

export function ReviewStatusBadge({
  status,
}: {
  status: "published" | "hidden" | "flagged";
}) {
  switch (status) {
    case "published":
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px] bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Public
        </span>
      );
    case "hidden":
      return (
        <span className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-bold text-[10px] sm:text-[11px] bg-zinc-500/15 border border-zinc-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
          Hidden
        </span>
      );
    case "flagged":
      return (
        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-[10px] sm:text-[11px] bg-rose-500/15 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
          Flagged
        </span>
      );
  }
}
