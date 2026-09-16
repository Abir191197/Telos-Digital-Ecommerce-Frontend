"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, AlertTriangle, Award } from "lucide-react";

interface BrandLogoUploadCardProps {
  logoUrl: string | null;
  logoError: string | null;
  maxFileSizeMb: number;
  onLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
}

export function BrandLogoUploadCard({
  logoUrl,
  logoError,
  maxFileSizeMb,
  onLogoSelect,
  onRemoveLogo,
}: BrandLogoUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div>
          <h3 className="text-sm font-bold text-foreground">Brand Logo & Asset</h3>
          <p className="text-[11px] text-muted-foreground">
            Upload brand emblem, mark, or high-res vector preview (Max {maxFileSizeMb}MB).
          </p>
        </div>
        <Award className="h-5 w-5 text-amber-500" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onLogoSelect}
        className="hidden"
      />

      {logoUrl ? (
        <div className="relative rounded-2xl overflow-hidden bg-muted/40 p-6 flex flex-col items-center justify-center gap-3">
          <div className="relative h-28 w-28 rounded-2xl overflow-hidden shadow-lg p-3 flex items-center justify-center bg-card">
            <Image
              src={logoUrl}
              alt="Brand logo"
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={onRemoveLogo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Remove Asset</span>
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-8 text-center transition-all duration-200"
        >
          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-foreground hover:underline">
                Click to browse brand logo
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PNG, SVG, JPG, or WEBP up to {maxFileSizeMb}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {logoError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{logoError}</span>
        </div>
      )}
    </div>
  );
}
