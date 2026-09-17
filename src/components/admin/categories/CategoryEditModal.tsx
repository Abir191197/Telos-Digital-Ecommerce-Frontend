"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Save,
  Sparkles,
  FolderTree,
  AlertCircle,
  UploadCloud,
  Trash2,
  AlertTriangle,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";
import type { Category } from "@/types/ecommerce.types";
import { POPULAR_CATEGORY_ICONS } from "./CategoryPropertiesFormCard";
import {
  normalizeCategoryIconName,
  getCategoryIcon,
} from "@/components/categories/categoryConfig";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface CategoryEditModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Category>) => void;
}

export function CategoryEditModal({
  isOpen,
  category,
  onClose,
  onSave,
}: CategoryEditModalProps) {
  if (!isOpen || !category) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description || "");
  const [icon, setIcon] = useState(normalizeCategoryIconName(category.icon));
  const [image, setImage] = useState(category.image || "");
  const [fileError, setFileError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [itemCount, setItemCount] = useState(category.itemCount || 0);
  const [featured, setFeatured] = useState(Boolean(category.featured));
  const [subcategories, setSubcategories] = useState<string[]>(
    category.subcategories?.map((s) => s.name) || []
  );
  const [subInput, setSubInput] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileError(null);

    // Max size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(
        `Selected file "${file.name}" is ${sizeMb}MB, which exceeds the ${MAX_FILE_SIZE_MB}MB maximum limit. Please compress or choose a smaller image.`
      );
      e.target.value = "";
      return;
    }

    // Valid preview
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    e.target.value = "";
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
  };

  const handleAddSub = () => {
    const trimmed = subInput.trim();
    if (trimmed && !subcategories.includes(trimmed)) {
      setSubcategories([...subcategories, trimmed]);
      setSubInput("");
    }
  };

  const handleRemoveSub = (idx: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(category.id, {
      name: name.trim(),
      slug: slug.trim() || category.slug,
      description: description.trim(),
      icon: normalizeCategoryIconName(icon),
      image: image.trim() || undefined,
      itemCount: Number(itemCount) || 0,
      featured,
      subcategories: subcategories.map((sub, idx) => ({
        id: `sub-${category.id}-${idx}`,
        name: sub,
        slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        itemCount: 0,
      })),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/60 bg-muted/25">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Editor
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {category.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                Edit Category
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form id="category-edit-form" onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Title & Auto Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <span>Category Title</span>
                <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smart Watches & Wearables"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  <span>URL Slug</span>
                  <span className="text-amber-500">*</span>
                </label>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                  Auto-generated
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none">
                  /category/
                </span>
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  value={slug}
                  className="w-full pl-22 pr-3.5 py-2.5 rounded-xl border border-border/70 bg-muted/30 text-sm text-muted-foreground font-mono cursor-not-allowed select-all focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category Photo / Banner Upload */}
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

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Warning Alert if file exceeds max size */}
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

            {/* URL input when toggled */}
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
              /* Photo Upload Dropzone */
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

            {/* Current Image Preview with Remove Option */}
            {image && (
              <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/30 group shadow-xs">
                <Image
                  src={image}
                  alt={name || "Category preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-3">
                  <div className="flex items-center gap-1.5 text-white text-[11px] font-medium truncate max-w-[70%]">
                    <ImageIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    <span className="truncate">Photo preview active</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage("");
                      setFileError(null);
                    }}
                    className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-xs"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category overview and SEO summary..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            />
          </div>

          {/* Icon Selector Grid */}
          {(() => {
            const selectedCanonical = normalizeCategoryIconName(icon);
            const SelectedIconComp = getCategoryIcon(icon);

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Visual Icon
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <SelectedIconComp className="h-3.5 w-3.5" />
                    <span>{selectedCanonical}</span>
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl border border-border/60 bg-muted/20">
                  {POPULAR_CATEGORY_ICONS.map((item) => {
                    const isSelected = selectedCanonical === item.name;
                    const IconComp = item.Icon;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIcon(item.name)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-2xs font-bold ring-1 ring-amber-500"
                            : "border-border/60 bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                        <span className="text-[10px] truncate w-full">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Metrics & Badges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-3.5 rounded-2xl bg-muted/30 border border-border/60">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Item Count
              </label>
              <input
                type="number"
                min="0"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <span className="text-xs font-bold text-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Featured on Home</span>
              </span>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  featured ? "bg-amber-500" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    featured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Subcategories Editor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Subcategories ({subcategories.length})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSub();
                  }
                }}
                placeholder="Add subcategory (e.g. Smart Bands)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSub}
                className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground cursor-pointer transition-colors"
              >
                Add
              </button>
            </div>

            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {subcategories.map((sub, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs font-semibold text-foreground border border-border/60"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSub(idx)}
                      className="text-muted-foreground hover:text-rose-500 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-4 border-t border-border/60 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-edit-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
