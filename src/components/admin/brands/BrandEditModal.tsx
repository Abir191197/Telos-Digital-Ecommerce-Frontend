"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Save,
  Award,
  UploadCloud,
  AlertTriangle,
} from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const PRESET_TAGS = [
  "Official Flagship",
  "Authorized Hub",
  "Certified Partner",
  "Premium Partner",
  "Direct Distributor",
];

interface BrandEditModalProps {
  isOpen: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Brand>) => void;
}

export function BrandEditModal({
  isOpen,
  brand,
  onClose,
  onSave,
}: BrandEditModalProps) {
  if (!isOpen || !brand) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(brand.name);
  const [slug, setSlug] = useState(brand.slug);
  const [tag, setTag] = useState(brand.tag);
  const [description, setDescription] = useState(brand.description || "");
  const [logo, setLogo] = useState(brand.logo || "");
  const [featured, setFeatured] = useState(Boolean(brand.featured));
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(
        `File "${file.name}" (${sizeMb}MB) exceeds ${MAX_FILE_SIZE_MB}MB limit.`
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLogo(previewUrl);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!name.trim()) return;

    onSave(brand.id, {
      name: name.trim(),
      slug: slug.trim() || brand.slug,
      tag: tag.trim() || brand.tag,
      description: description.trim(),
      logo: logo || undefined,
      featured,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[85dvh] sm:max-h-[90vh] flex flex-col rounded-3xl bg-card border border-border/50 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header (Sticky) */}
        <div className="flex items-center justify-between border-b border-border/50 px-5 sm:px-6 py-4 bg-card/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">
                Edit Brand
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                ID: {brand.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body Form (Scrollable) */}
        <div className="space-y-4 p-5 sm:p-6 overflow-y-auto flex-1">
          {/* Logo Upload Section */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Brand Logo
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {logo ? (
              <div className="relative rounded-2xl bg-muted/40 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-card p-1 shrink-0 flex items-center justify-center shadow-xs">
                    <Image
                      src={logo}
                      alt={name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    Brand emblem uploaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-muted text-xs font-semibold hover:bg-muted/80 text-foreground cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-4 text-center transition-all"
              >
                <UploadCloud className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                <span className="text-xs font-bold text-foreground">
                  Click to upload logo ({MAX_FILE_SIZE_MB}MB max)
                </span>
              </div>
            )}

            {fileError && (
              <div className="flex items-center gap-2 mt-2 rounded-xl bg-rose-500/10 p-2.5 text-xs text-rose-600 font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  const generated = e.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_-]+/g, "-");
                  setSlug(generated);
                }}
                className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  Slug identifier
                </label>
                <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-1 rounded">
                  Auto
                </span>
              </div>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                value={slug ? `/${slug}` : ""}
                className="w-full rounded-xl border border-border/60 bg-muted/60 px-3.5 py-2 text-xs font-mono text-muted-foreground cursor-not-allowed select-none focus:outline-none"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Badge Tagline
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tag === t
                      ? "bg-amber-500 text-zinc-950"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          {/* Featured Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
            <span className="text-xs font-bold text-foreground">
              Featured in Official Brands Marquee
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>
        </div>

        {/* Modal Actions (Pinned Footer) */}
        <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-3.5 border-t border-border/50 bg-card/95 backdrop-blur-md shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
