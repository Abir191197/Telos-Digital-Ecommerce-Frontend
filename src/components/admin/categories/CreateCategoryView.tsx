"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/stores";
import type { Category } from "@/types/ecommerce.types";
import {
  CategoryBannerUploadCard,
  CategoryPropertiesFormCard,
  CategoryLivePreviewCard,
  type CategoryFormValues,
} from "./";
import { AdminCategoriesListView } from "./AdminCategoriesListView";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface CreateCategoryViewProps {
  initialTab?: "create" | "list";
  categoryId?: string;
}

export function CreateCategoryView({ initialTab = "create", categoryId }: CreateCategoryViewProps) {
  const { categories, addCategory, updateCategory } = useAdminStore();
  const [currentView, setCurrentView] = useState<"create" | "list">(initialTab);

  const editingCategory = React.useMemo(() => {
    if (!categoryId) return null;
    return (
      categories.find((c) => c.id === categoryId || c.slug === categoryId) || null
    );
  }, [categoryId, categories]);

  const isEditMode = Boolean(editingCategory);

  // Form State
  const [formValues, setFormValues] = useState<CategoryFormValues>(() => {
    if (editingCategory) {
      return {
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || "",
        icon: editingCategory.icon || "Smartphone",
        itemCount: editingCategory.itemCount || 0,
        featured: Boolean(editingCategory.featured),
      };
    }
    return {
      name: "",
      slug: "",
      description: "",
      icon: "Smartphone",
      itemCount: 0,
      featured: false,
    };
  });

  // Banner State
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    if (editingCategory) {
      return editingCategory.image || null;
    }
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";
  });
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Subcategories
  const [subcategories, setSubcategories] = useState<string[]>(() => {
    if (editingCategory?.subcategories) {
      return editingCategory.subcategories.map((s) => s.name);
    }
    return [];
  });

  // Submission / Toast
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [lastCreatedCategory, setLastCreatedCategory] = useState<string>("");

  // Sync state if editingCategory changes
  React.useEffect(() => {
    if (editingCategory) {
      setFormValues({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || "",
        icon: editingCategory.icon || "Smartphone",
        itemCount: editingCategory.itemCount || 0,
        featured: Boolean(editingCategory.featured),
      });
      setBannerUrl(editingCategory.image || null);
      setSubcategories(editingCategory.subcategories?.map((s) => s.name) || []);
    }
  }, [editingCategory]);

  const handleFieldChange = <K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setBannerError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setBannerError(
        `Banner file "${file.name}" (${sizeMb}MB) exceeds ${MAX_FILE_SIZE_MB}MB maximum. Please use an optimized image.`
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setBannerUrl(previewUrl);
    e.target.value = "";
  };

  const handleBannerRemove = () => {
    setBannerUrl(null);
  };

  const handleAddSubcategory = (name: string) => {
    setSubcategories((prev) => [...prev, name]);
  };

  const handleRemoveSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetForm = () => {
    if (editingCategory) {
      setFormValues({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || "",
        icon: editingCategory.icon || "Smartphone",
        itemCount: editingCategory.itemCount || 0,
        featured: Boolean(editingCategory.featured),
      });
      setBannerUrl(editingCategory.image || null);
      setSubcategories(editingCategory.subcategories?.map((s) => s.name) || []);
    } else {
      setFormValues({
        name: "",
        slug: "",
        description: "",
        icon: "Smartphone",
        itemCount: 0,
        featured: false,
      });
      setBannerUrl(null);
      setSubcategories([]);
    }
    setSuccessToast(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim() || !formValues.slug.trim()) return;

    setIsSubmitting(true);

    if (isEditMode && editingCategory) {
      const updatedCategory: Partial<Category> = {
        name: formValues.name.trim(),
        slug: formValues.slug.trim(),
        description: formValues.description.trim(),
        icon: formValues.icon,
        image: bannerUrl || undefined,
        itemCount: Number(formValues.itemCount) || 0,
        featured: formValues.featured,
        subcategories: subcategories.map((sub, idx) => {
          const existing = editingCategory.subcategories?.find((s) => s.name.toLowerCase() === sub.toLowerCase());
          return (
            existing || {
              id: `sub-${Date.now()}-${idx}`,
              name: sub,
              slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              itemCount: 0,
            }
          );
        }),
      };

      updateCategory(editingCategory.id, updatedCategory);
      setLastCreatedCategory(formValues.name);
      setIsSubmitting(false);
      setSuccessToast(true);
      return;
    }

    const newCategory: Category = {
      id: String(Date.now()).slice(-6),
      slug: formValues.slug.trim(),
      name: formValues.name.trim(),
      description:
        formValues.description.trim() ||
        `Explore verified ${formValues.name} catalog with official warranties and fast delivery across Bangladesh.`,
      icon: formValues.icon,
      image: bannerUrl || undefined,
      itemCount: Number(formValues.itemCount) || 0,
      featured: formValues.featured,
      subcategories: subcategories.map((sub, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        name: sub,
        slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        itemCount: 0,
      })),
      createdAt: new Date().toISOString(),
    };

    addCategory(newCategory);
    setLastCreatedCategory(formValues.name);
    setIsSubmitting(false);
    setSuccessToast(true);
  };

  return (
    <div className="w-full space-y-6 pb-24">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/categories"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors shadow-2xs"
            title="Back to Categories"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Admin Catalog
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Hierarchy & Taxonomies</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              {isEditMode ? `Edit Category: ${editingCategory?.name || "Category"}` : "Create Category"}
            </h1>
          </div>
        </div>
      </div>

      {/* SUCCESS BANNER ALERT */}
      {successToast && (
        <div className="rounded-2xl border-none bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <div className="text-xs">
              <strong className="font-bold">
                {isEditMode ? "Category Updated!" : "Category Created!"}
              </strong>{" "}
              &ldquo;{lastCreatedCategory}&rdquo; {isEditMode ? "changes saved successfully." : "added to store catalog navigation."}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs font-bold underline hover:no-underline cursor-pointer"
              >
                Add Another
              </button>
            )}
            <Link
              href="/dashboard/categories"
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 cursor-pointer"
            >
              View Catalog
            </Link>
          </div>
        </div>
      )}

      {/* VIEW 1: CATEGORY CREATION (Banner Upload Card + Properties Card + Live Preview Card) */}
      {currentView === "create" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT (8 cols): Photo Upload Card + Properties Form Card */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. PHOTO UPLOAD CARD FOR CATEGORY BANNER */}
            <CategoryBannerUploadCard
              bannerUrl={bannerUrl}
              bannerError={bannerError}
              onBannerSelect={handleBannerSelect}
              onBannerRemove={handleBannerRemove}
              onBannerUrlChange={(url) => setBannerUrl(url)}
              onClearError={() => setBannerError(null)}
            />

            {/* 2. PROPERTIES INPUT CARD */}
            <form id="category-create-form" onSubmit={handleSubmit} className="space-y-6">
              <CategoryPropertiesFormCard
                values={formValues}
                onChange={handleFieldChange}
                subcategories={subcategories}
                onAddSubcategory={handleAddSubcategory}
                onRemoveSubcategory={handleRemoveSubcategory}
              />

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl border-none bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs"
                >
                  {isEditMode ? "Reset Changes" : "Reset Form"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formValues.name.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isSubmitting
                      ? "Saving..."
                      : isEditMode
                      ? "Save Category Changes"
                      : "Publish Category"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT (4 cols): CATEGORY CARD LIVE PREVIEW */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-3">
            <CategoryLivePreviewCard
              name={formValues.name}
              slug={formValues.slug}
              icon={formValues.icon}
              bannerUrl={bannerUrl}
              itemCount={formValues.itemCount}
              featured={formValues.featured}
              description={formValues.description}
              subcategories={subcategories}
            />
          </div>
        </div>
      ) : (
        /* VIEW 2: ALL CATEGORIES LIST */
        <AdminCategoriesListView onSwitchToCreate={() => setCurrentView("create")} />
      )}
    </div>
  );
}
