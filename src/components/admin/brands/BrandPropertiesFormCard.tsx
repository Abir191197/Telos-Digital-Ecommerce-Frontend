"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export interface BrandFormValues {
  name: string;
  slug: string;
  tag: string;
  customTag: string;
  featured: boolean;
  description: string;
}

interface BrandPropertiesFormCardProps {
  values: BrandFormValues;
  presetTags: string[];
  isSubmitting: boolean;
  submitLabel?: string;
  onFieldChange: <K extends keyof BrandFormValues>(key: K, value: BrandFormValues[K]) => void;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BrandPropertiesFormCard({
  values,
  presetTags,
  isSubmitting,
  submitLabel,
  onFieldChange,
  onNameChange,
  onSubmit,
}: BrandPropertiesFormCardProps) {
  return (
    <div className="rounded-3xl border-none bg-card p-5 sm:p-7 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-6">
      {/* Section: Basic info */}
      <div className="space-y-4 pb-5 border-b border-border/50">
        <h3 className="text-sm font-bold text-foreground">Brand Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Brand Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony, Anker, Razer"
              value={values.name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-foreground">
                Slug identifier
              </label>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Auto
              </span>
            </div>
            <input
              type="text"
              readOnly
              tabIndex={-1}
              placeholder="auto-generated"
              value={values.slug ? `/${values.slug}` : ""}
              className="w-full rounded-xl border border-border/60 bg-muted/60 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-muted-foreground cursor-not-allowed select-none focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Official Tagline / Badge
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {presetTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onFieldChange("tag", t);
                  onFieldChange("customTag", "");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  values.tag === t && !values.customTag
                    ? "bg-amber-500 text-zinc-950 shadow-xs"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or type custom badge tagline..."
            value={values.customTag}
            onChange={(e) => onFieldChange("customTag", e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Description / Positioning
          </label>
          <textarea
            rows={3}
            placeholder="Brief description of the brand's authorized products in Telos catalog..."
            value={values.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground focus:border-amber-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Featured Status Switch */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-foreground">Featured in Official Brands Marquee</p>
          <p className="text-[11px] text-muted-foreground">
            Display prominently in the homepage official brands ticker.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => onFieldChange("featured", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
        </label>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-2.5">
        <Link
          href="/dashboard/brands"
          className="px-4 py-2.5 rounded-xl border border-border/80 bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !values.name.trim()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isSubmitting
              ? "Saving..."
              : submitLabel || "Save & Register Brand"}
          </span>
        </button>
      </div>
    </div>
  );
}
