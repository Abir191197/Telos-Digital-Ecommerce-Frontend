"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  Link as LinkIcon,
  Check,
  Globe,
  FileImage,
  RefreshCw,
} from "lucide-react";

export interface CategoryBannerUploadCardProps {
  bannerUrl: string | null;
  bannerError: string | null;
  isExternalUrl?: boolean;
  onBannerSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUrlSet?: (url: string) => void;
  onBannerRemove: () => void;
  onClearError: () => void;
}

export function CategoryBannerUploadCard({
  bannerUrl,
  bannerError,
  isExternalUrl = false,
  onBannerSelect,
  onBannerUrlSet,
  onBannerRemove,
  onClearError,
}: CategoryBannerUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isChangingUrl, setIsChangingUrl] = useState(false);

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    setUrlError(null);
    if (onBannerUrlSet) {
      onBannerUrlSet(trimmed);
    }
    setUrlInput("");
    setIsChangingUrl(false);
  };

  const isUrlType =
    isExternalUrl ||
    (Boolean(bannerUrl) &&
      !bannerUrl?.startsWith("blob:") &&
      /^https?:\/\//i.test(bannerUrl || ""));

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
            Attach 1 high-resolution category hero banner via direct file upload or image URL (16:9 or 800x400px recommended).
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          setIsChangingUrl(false);
          onBannerSelect(e);
        }}
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
            className="text-[10px] underline hover:no-underline font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Banner View */}
      {bannerUrl && !isChangingUrl ? (
        <div className="space-y-3">
          <div className="relative group overflow-hidden rounded-2xl border-none bg-muted/20 aspect-16/7 sm:aspect-21/9 w-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)]">
            <Image
              src={bannerUrl}
              alt="Category banner preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-103"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Badges Top Left */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {isUrlType ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-bold shadow-md">
                  <Globe className="h-3 w-3" /> URL Image
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-500/90 backdrop-blur-md text-white text-[10px] font-bold shadow-md">
                  <FileImage className="h-3 w-3" /> Uploaded File
                </span>
              )}
            </div>

            {/* Top Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-background/85 hover:bg-background text-foreground text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Upload replacement file"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Replace File</span>
              </button>
              <button
                type="button"
                onClick={() => setIsChangingUrl(true)}
                className="px-3 py-1.5 rounded-xl bg-background/85 hover:bg-background text-foreground text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Set new image URL"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Change URL</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingUrl(false);
                  onBannerRemove();
                }}
                className="p-1.5 rounded-xl bg-rose-500/85 hover:bg-rose-500 text-white backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
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
                1 Image Assigned
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Dual Mode: Upload from Device OR Paste URL */
        <div className="space-y-3">
          {isChangingUrl && bannerUrl && (
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-muted-foreground font-semibold">Change Banner Image:</span>
              <button
                type="button"
                onClick={() => setIsChangingUrl(false)}
                className="text-amber-500 hover:underline font-bold cursor-pointer"
              >
                Cancel & Keep Current
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Drop / Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-6 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2.5 group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Upload from Device
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Browse PNG, JPG, or WebP up to 5MB
                </p>
              </div>
            </div>

            {/* Right: Paste Image URL */}
            <div className="rounded-2xl border border-border/70 bg-muted/15 p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                  <LinkIcon className="h-3.5 w-3.5" />
                </div>
                <span>Attach Image URL</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (urlError) setUrlError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleApplyUrl();
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    disabled={!urlInput.trim()}
                    className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-zinc-950 font-bold px-3.5 py-2 text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Paste a direct web image link. Saves 1 single banner photo for this category.
                </p>
                {urlError && (
                  <p className="text-[10.5px] font-semibold text-rose-500">{urlError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
