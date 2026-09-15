"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, Trash2, AlertTriangle, Link as LinkIcon, Sparkles } from "lucide-react";

export interface CategoryBannerUploadCardProps {
  bannerUrl: string | null;
  bannerError: string | null;
  onBannerSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerRemove: () => void;
  onBannerUrlChange: (url: string) => void;
  onClearError: () => void;
}

const PRESET_BANNERS = [
  {
    name: "Devices & Tech",
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Laptops & Workspace",
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Audio & Acoustics",
    url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Smart Wearables",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
];

export function CategoryBannerUploadCard({
  bannerUrl,
  bannerError,
  onBannerSelect,
  onBannerRemove,
  onBannerUrlChange,
  onClearError,
}: CategoryBannerUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customUrl, setCustomUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onBannerUrlChange(customUrl.trim());
      setCustomUrl("");
      setShowUrlInput(false);
      onClearError();
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
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
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-semibold text-muted-foreground hover:text-amber-500 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-muted/60"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Image URL</span>
        </button>
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

      {/* Optional Direct Image URL Input */}
      {showUrlInput && (
        <form
          onSubmit={handleApplyCustomUrl}
          className="flex items-center gap-2 p-2 rounded-2xl bg-muted/30 border border-border/60 animate-in fade-in slide-in-from-top-1"
        >
          <input
            type="url"
            placeholder="Paste direct image URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer"
          >
            Apply
          </button>
        </form>
      )}

      {/* Upload Drop Area or Active Banner View */}
      {bannerUrl ? (
        <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-muted/20 aspect-16/7 sm:aspect-21/9 w-full shadow-inner">
          <Image
            src={bannerUrl}
            alt="Category banner preview"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-103"
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

      {/* Preset Suggestions */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Quick Curated Presets
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_BANNERS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onBannerUrlChange(preset.url);
                onClearError();
              }}
              className="relative overflow-hidden rounded-xl border border-border/70 hover:border-amber-500/80 bg-muted/30 p-1.5 text-left group transition-all duration-200 cursor-pointer"
            >
              <div className="relative h-14 w-full rounded-lg overflow-hidden mb-1">
                <Image
                  src={preset.url}
                  alt={preset.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[10px] font-bold text-foreground truncate px-1">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
