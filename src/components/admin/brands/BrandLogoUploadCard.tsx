"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  AlertTriangle,
  Award,
  Link as LinkIcon,
  Check,
  Globe,
  FileImage,
  RefreshCw,
} from "lucide-react";

interface BrandLogoUploadCardProps {
  logoUrl: string | null;
  logoError: string | null;
  maxFileSizeMb: number;
  isExternalUrl?: boolean;
  onLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUrlSet?: (url: string) => void;
  onRemoveLogo: () => void;
}

export function BrandLogoUploadCard({
  logoUrl,
  logoError,
  maxFileSizeMb,
  isExternalUrl = false,
  onLogoSelect,
  onLogoUrlSet,
  onRemoveLogo,
}: BrandLogoUploadCardProps) {
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
    if (onLogoUrlSet) {
      onLogoUrlSet(trimmed);
    }
    setUrlInput("");
    setIsChangingUrl(false);
  };

  const isUrlType =
    isExternalUrl ||
    (Boolean(logoUrl) &&
      !logoUrl?.startsWith("blob:") &&
      /^https?:\/\//i.test(logoUrl || ""));

  return (
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div>
          <h3 className="text-sm font-bold text-foreground">Brand Logo & Emblem</h3>
          <p className="text-[11px] text-muted-foreground">
            Attach 1 official brand mark via file upload or direct image URL (Max {maxFileSizeMb}MB).
          </p>
        </div>
        <Award className="h-5 w-5 text-amber-500" />
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          setIsChangingUrl(false);
          onLogoSelect(e);
        }}
        className="hidden"
      />

      {/* Error Alert */}
      {logoError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{logoError}</span>
        </div>
      )}

      {/* Active Logo View */}
      {logoUrl && !isChangingUrl ? (
        <div className="relative rounded-2xl overflow-hidden bg-muted/30 p-6 flex flex-col items-center justify-center gap-3 border border-border/60">
          {/* Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {isUrlType ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 text-[10px] font-bold border border-sky-500/30">
                <Globe className="h-3 w-3" /> URL Image
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                <FileImage className="h-3 w-3" /> Uploaded File
              </span>
            )}
          </div>

          <div className="relative h-28 w-28 rounded-2xl overflow-hidden shadow-md p-3 flex items-center justify-center bg-card border border-border/60">
            <Image
              src={logoUrl}
              alt="Brand logo"
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all cursor-pointer border border-border/60"
              title="Replace file"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Replace File</span>
            </button>
            <button
              type="button"
              onClick={() => setIsChangingUrl(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all cursor-pointer border border-border/60"
              title="Change URL"
            >
              <LinkIcon className="h-3 w-3" />
              <span>Change URL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsChangingUrl(false);
                onRemoveLogo();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Dual Mode: Upload from Device OR Paste URL */
        <div className="space-y-3">
          {isChangingUrl && logoUrl && (
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-muted-foreground font-semibold">Change Brand Logo:</span>
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
            {/* Left: Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-6 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Upload from Device
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  PNG, SVG, JPG, or WEBP up to {maxFileSizeMb}MB
                </p>
              </div>
            </div>

            {/* Right: Paste Image URL */}
            <div className="rounded-2xl border border-border/70 bg-muted/15 p-4 flex flex-col justify-between space-y-3">
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
                  Paste a direct brand emblem link. Saves 1 logo for this brand.
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
