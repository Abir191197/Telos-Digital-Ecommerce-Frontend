"use client";

import React, { useState } from "react";
import { X, Save, FolderTree } from "lucide-react";
import type { Category } from "@/types/ecommerce.types";
import { normalizeCategoryIconName } from "@/components/categories/categoryConfig";
import { CategoryEditPhotoUpload } from "./CategoryEditPhotoUpload";
import { CategoryEditProperties } from "./CategoryEditProperties";

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

  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description || "");
  const [icon, setIcon] = useState(normalizeCategoryIconName(category.icon));
  const [image, setImage] = useState(category.image || "");
  const [fileError, setFileError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [featured, setFeatured] = useState(Boolean(category.featured));
  const [subcategories, setSubcategories] = useState<string[]>(
    category.subcategories?.map((s) => s.name) || []
  );
  const [subInput, setSubInput] = useState("");

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
          <CategoryEditPhotoUpload
            name={name}
            image={image}
            setImage={setImage}
            fileError={fileError}
            setFileError={setFileError}
            showUrlInput={showUrlInput}
            setShowUrlInput={setShowUrlInput}
          />

          {/* Description, Icon Picker, Featured Toggle, Subcategories */}
          <CategoryEditProperties
            description={description}
            setDescription={setDescription}
            icon={icon}
            setIcon={setIcon}
            featured={featured}
            setFeatured={setFeatured}
            subcategories={subcategories}
            subInput={subInput}
            setSubInput={setSubInput}
            onAddSub={handleAddSub}
            onRemoveSub={handleRemoveSub}
          />
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
            disabled={!name.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save Category Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
