"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  X,
  Trash2,
  AlertTriangle,
  Link as LinkIcon,
  Plus,
  Star,
  Globe,
  FileImage,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProductPhotoItem = {
  id?: string;
  url: string;
  file?: File;
  isUrl?: boolean;
};

interface ProductPhotosUploadCardProps {
  images: (ProductPhotoItem | string)[];
  imageError: string | null;
  onFilesSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddImageUrl?: (url: string) => void;
  onRemoveImage: (index: number) => void;
  onSetMainImage?: (index: number) => void;
  onClearError: () => void;
}

export function ProductPhotosUploadCard({
  images,
  imageError,
  onFilesSelect,
  onAddImageUrl,
  onRemoveImage,
  onSetMainImage,
  onClearError,
}: ProductPhotosUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  // Normalize images whether passed as ProductPhotoItem[] or string[]
  const normalizedImages: ProductPhotoItem[] = images.map((item, idx) => {
    if (typeof item === "string") {
      const isWeb = item.startsWith("http://") || item.startsWith("https://");
      return {
        id: `img-${idx}`,
        url: item,
        isUrl: isWeb,
      };
    }
    return item;
  });

  const handleAddUrl = (e?: React.FormEvent | React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setUrlError(null);

    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUrlError("Please enter a valid image URL starting with http:// or https://");
      return;
    }

    if (onAddImageUrl) {
      onAddImageUrl(trimmed);
    }
    setUrlInput("");
    urlInputRef.current?.focus();
  };

  return (
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Product Photos & Media</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Upload images from device or attach direct image URLs. The first image serves as the storefront main thumbnail.
          </p>
        </div>
        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
          {images.length} photo{images.length === 1 ? "" : "s"}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFilesSelect}
        className="hidden"
      />

      {/* Grid: Left Drag & Drop, Right Add by URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Drop Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-5 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground hover:underline">
              Upload from Device
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Drag & drop or browse (PNG, JPG, WebP up to 5MB)
            </p>
          </div>
        </div>

        {/* Add Image by URL Input Area */}
        <div className="rounded-2xl border border-border/70 bg-muted/15 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <LinkIcon className="h-3.5 w-3.5" />
            </div>
            <span>Attach Image URL</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={urlInputRef}
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
                    handleAddUrl();
                  }
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-mono"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-zinc-950 font-bold px-3.5 py-2 text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Image</span>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Paste an image URL and click Add Image. You can repeat this to add another image URL one after another.
            </p>
            {urlError && (
              <p className="text-[10.5px] font-medium text-rose-500">{urlError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {imageError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-400 flex items-start gap-2.5 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Photo Notice</span>
            <span className="text-[11px]">{imageError}</span>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Active Gallery Previews */}
      {images.length > 0 && (
        <div className="pt-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-foreground">
              Current Gallery ({images.length} photo{images.length === 1 ? "" : "s"}):
            </p>
            <span className="text-[10px] text-muted-foreground">
              Click &quot;Make Main&quot; to choose storefront cover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {normalizedImages.map((item, idx) => (
              <div
                key={item.id || idx}
                className={cn(
                  "group relative rounded-2xl overflow-hidden border bg-muted/40 aspect-square shadow-xs transition-all",
                  idx === 0
                    ? "ring-2 ring-amber-500 border-amber-500/50"
                    : "border-border/70 hover:border-border"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={`Product ${idx + 1}`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback on invalid external image
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=400&q=80";
                  }}
                />

                {/* Badges Overlay */}
                <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none z-10">
                  {idx === 0 ? (
                    <span className="rounded-lg bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-zinc-950 shadow-xs flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-current" /> Main
                    </span>
                  ) : (
                    <span />
                  )}

                  {item.isUrl ? (
                    <span className="rounded-md bg-sky-500/80 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs flex items-center gap-0.5">
                      <Globe className="h-2.5 w-2.5" /> URL
                    </span>
                  ) : (
                    <span className="rounded-md bg-indigo-500/80 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs flex items-center gap-0.5">
                      <FileImage className="h-2.5 w-2.5" /> File
                    </span>
                  )}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 z-20">
                  {idx !== 0 && onSetMainImage && (
                    <button
                      type="button"
                      onClick={() => onSetMainImage(idx)}
                      className="w-full py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Star className="h-3 w-3 fill-current" /> Make Main
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveImage(idx)}
                    className="w-full py-1 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
