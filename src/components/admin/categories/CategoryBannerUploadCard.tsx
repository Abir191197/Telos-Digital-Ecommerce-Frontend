"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, Trash2, AlertTriangle } from "lucide-react";

export interface CategoryBannerUploadCardProps {
  bannerUrl: string | null;
  bannerError: string | null;
  onBannerSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerRemove: () => void;
  onClearError: () => void;
}

export function CategoryBannerUploadCard({
  bannerUrl,
  bannerError,
  onBannerSelect,
  onBannerRemove,
  onClearError,
}: CategoryBannerUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Category Banner
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              Hero Cover
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Upload high-resolution category hero banner. Recommended aspect ratio 16:9 or 800x400px.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onBannerSelect}
        className="hidden"
      />

      {/* Error Alert */}
      {bannerError && (
        <div className="flex items-start justify-between gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{bannerError}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-[10px] underline hover:no-underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Drop Area or Active Banner View */}
      {bannerUrl ? (
        <div className="relative group overflow-hidden rounded-2xl border-none bg-muted/20 aspect-16/7 sm:aspect-21/9 w-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)]">
          <Image
            src={bannerUrl}
            alt="Category banner preview"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Top Actions */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-background/80 hover:bg-background text-foreground text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onBannerRemove}
              className="p-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
              title="Remove banner"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-[11px]">Active Cover Banner</span>
            </div>
            <span className="text-[10px] text-white/75 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-md">
              High Resolution
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/15 hover:bg-amber-500/5 p-8 text-center transition-all duration-200 group"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Click to browse or drop banner photo
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                PNG, JPG, WebP up to 5MB (1200×600 or 800×400 suggested)
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
