"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Trash2,
  AlertTriangle,
  Link as LinkIcon,
  X,
  ImageIcon,
} from "lucide-react";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface CategoryEditPhotoUploadProps {
  name: string;
  image: string;
  setImage: (url: string) => void;
  fileError: string | null;
  setFileError: (err: string | null) => void;
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
}

export function CategoryEditPhotoUpload({
  name,
  image,
  setImage,
  fileError,
  setFileError,
  showUrlInput,
  setShowUrlInput,
}: CategoryEditPhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(
        `Selected file "${file.name}" is ${sizeMb}MB, which exceeds the ${MAX_FILE_SIZE_MB}MB maximum limit. Please compress or choose a smaller image.`
      );
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <span>Category Photo</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            (Max {MAX_FILE_SIZE_MB}MB)
          </span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-semibold text-muted-foreground hover:text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <LinkIcon className="h-3 w-3" />
          <span>{showUrlInput ? "Upload Photo" : "Use Image URL"}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {fileError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-start justify-between gap-2 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <span className="font-bold">File Too Large: </span>
              <span>{fileError}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFileError(null)}
            className="p-1 hover:bg-rose-500/20 rounded-md text-rose-500 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {showUrlInput ? (
        <div className="space-y-1.5 animate-in fade-in">
          <input
            type="url"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              setFileError(null);
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500 font-mono"
          />
          <p className="text-[11px] text-muted-foreground">
            Paste a direct image link from Unsplash, CDN, or cloud storage.
          </p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative group flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            fileError
              ? "border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10"
              : "border-border/70 hover:border-amber-500/60 bg-muted/20 hover:bg-amber-500/5"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-bold text-foreground">
              Click to browse or drop category photo
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              PNG, JPG, WEBP, or SVG • Maximum file size{" "}
              <strong className="text-foreground font-semibold">{MAX_FILE_SIZE_MB}MB</strong>
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/30 group shadow-xs">
          <Image
            src={image}
            alt={name || "Category preview"}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setImage("")}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-transform hover:scale-105 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
