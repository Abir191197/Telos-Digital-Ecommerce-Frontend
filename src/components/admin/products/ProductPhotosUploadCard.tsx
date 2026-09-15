"use client";

import React, { useRef } from "react";
import { UploadCloud, X, Trash2, AlertTriangle } from "lucide-react";

interface ProductPhotosUploadCardProps {
  images: string[];
  imageError: string | null;
  onFilesSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onClearError: () => void;
}

export function ProductPhotosUploadCard({
  images,
  imageError,
  onFilesSelect,
  onRemoveImage,
  onClearError,
}: ProductPhotosUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Product Photos
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Upload product pictures from your device. First photo becomes the main store thumbnail.
          </p>
        </div>
        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
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

      {/* Upload Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-6 text-center transition-all duration-200"
      >
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-foreground hover:underline">
              Click to browse photo(s)
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground"> or drag & drop here</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Supported formats: PNG, JPG, WebP (Max 5MB per image)
          </p>
        </div>
      </div>

      {/* Oversized Warning */}
      {imageError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-400 flex items-start gap-2.5 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Photo size too large</span>
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

      {/* Thumbnails Gallery */}
      {images.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] font-bold text-foreground mb-2">
            Uploaded Gallery (First is primary):
          </p>
          <div className="flex flex-wrap gap-2.5">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-border bg-muted/40 shrink-0 shadow-2xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 rounded bg-amber-500 px-1 py-0.2 text-[8px] font-black uppercase text-zinc-950 shadow-xs">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 className="h-4 w-4 text-rose-400 hover:text-rose-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
