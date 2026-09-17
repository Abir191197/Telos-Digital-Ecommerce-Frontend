"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/services/api/categories/categoryApi";
import {
  ConfirmationModal,
  PageLoader,
  type ConfirmationDialogState,
} from "@/components/common";
import {
  CategoryBannerUploadCard,
  CategoryPropertiesFormCard,
  CategoryLivePreviewCard,
  type CategoryFormValues,
} from "./";
import { AdminCategoriesListView } from "./AdminCategoriesListView";
import { normalizeCategoryIconName } from "@/components/categories/categoryConfig";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface CreateCategoryViewProps {
  initialTab?: "create" | "list";
  categoryId?: string;
  /** Slug-based lookup — resolves to ID from the categories list */
  categorySlug?: string;
}

export function CreateCategoryView({ initialTab = "create", categoryId, categorySlug }: CreateCategoryViewProps) {
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmationDialogState | null>(null);
  const [currentView, setCurrentView] = useState<"create" | "list">(initialTab);

  // Resolve slug → ID if categorySlug is provided
  const { data: allCategoriesResponse } = useGetCategoriesQuery(
    { limit: 200 },
    { skip: !categorySlug }
  );
  const resolvedId = categorySlug
    ? (allCategoriesResponse?.data ?? []).find((c) => c.slug === categorySlug)?.id
    : categoryId;

  const {
    data: editingCategory,
    isLoading: isLoadingCategory,
    error: categoryLoadError,
  } = useGetCategoryByIdQuery(resolvedId || "", {
    skip: !resolvedId,
  });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const isEditMode = Boolean(editingCategory);

  // Form State
  const [formValues, setFormValues] = useState<CategoryFormValues>(() => {
    if (editingCategory) {
      return {
        name: editingCategory.name,
        description: editingCategory.description || "",
        icon: normalizeCategoryIconName(editingCategory.icon),
        featured: Boolean(editingCategory.featured),
        isActive: editingCategory.isActive ?? true,
      };
    }
    return {
      name: "",
      description: "",
      icon: "Smartphone",
      featured: false,
      isActive: true,
    };
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);

  // Banner State
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    if (editingCategory) {
      return editingCategory.image || null;
    }
    return null;
  });
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(() => editingCategory?.image || null);

  // Submission / Toast
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [lastCreatedCategory, setLastCreatedCategory] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if editingCategory changes
  React.useEffect(() => {
    if (editingCategory) {
      setFormValues({
        name: editingCategory.name,
        description: editingCategory.description || "",
        icon: normalizeCategoryIconName(editingCategory.icon),
        featured: Boolean(editingCategory.featured),
        isActive: editingCategory.isActive ?? true,
      });
      setBannerUrl(editingCategory.image || null);
      setBannerImageUrl(editingCategory.image || null);
      setSelectedBannerFile(null);
      setSubcategories(editingCategory.subcategories?.map((sub) => sub.name) || []);
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
    setSelectedBannerFile(file);
    setBannerUrl(previewUrl);
    setBannerImageUrl(null);
    e.target.value = "";
  };

  const handleBannerUrlSet = (url: string) => {
    setSelectedBannerFile(null);
    setBannerUrl(url);
    setBannerImageUrl(url);
    setBannerError(null);
  };

  const handleBannerRemove = () => {
    setSelectedBannerFile(null);
    setBannerUrl(null);
    setBannerImageUrl(null);
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
        description: editingCategory.description || "",
        icon: normalizeCategoryIconName(editingCategory.icon),
        featured: Boolean(editingCategory.featured),
        isActive: editingCategory.isActive ?? true,
      });
      setBannerUrl(editingCategory.image || null);
      setBannerImageUrl(editingCategory.image || null);
      setSelectedBannerFile(null);
      setSubcategories(editingCategory.subcategories?.map((sub) => sub.name) || []);
    } else {
      setFormValues({
        name: "",
        description: "",
        icon: "Smartphone",
        featured: false,
        isActive: true,
      });
      setBannerUrl(null);
      setBannerImageUrl(null);
      setSelectedBannerFile(null);
      setSubcategories([]);
    }
    setSuccessToast(false);
    setFormError(null);
  };

  const getApiErrorMessage = (error: unknown) => {
    if (
      error &&
      typeof error === "object" &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      return String(error.data.message);
    }

    return "Category could not be saved. Please check the form and try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim()) return;

    if (formValues.featured && !selectedBannerFile && !bannerUrl) {
      setBannerError("Featured homepage categories require an uploaded image.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        icon: normalizeCategoryIconName(formValues.icon),
        subCategories: subcategories.map((name) => ({
          name,
          isActive: true,
        })),
        isActive: formValues.isActive,
        isFeaturedHomepage: formValues.featured,
        image: selectedBannerFile,
        imageUrl: !selectedBannerFile && bannerImageUrl ? bannerImageUrl : undefined,
        removeImage: isEditMode && !bannerUrl && Boolean(editingCategory?.image),
      };

      const submittedCategoryName = formValues.name.trim();

      if (isEditMode && editingCategory) {
        await updateCategory({ id: editingCategory.id, payload }).unwrap();
        setConfirmModal({
          isOpen: true,
          title: "Category Updated Successfully!",
          message: `"${submittedCategoryName}" and its settings have been updated in the catalog.`,
          confirmLabel: "View Categories",
          cancelLabel: "Keep Editing",
          variant: "success",
          onConfirm: () => {
            setConfirmModal(null);
            setCurrentView("list");
            router.push("/dashboard/categories");
          },
          onCancel: () => {
            setConfirmModal(null);
          },
        });
      } else {
        await createCategory(payload).unwrap();

        // Reset all form fields completely ("all form delete")
        setFormValues({
          name: "",
          description: "",
          icon: "Smartphone",
          featured: false,
          isActive: true,
        });
        setSubcategories([]);
        setBannerUrl(null);
        setBannerImageUrl(null);
        setSelectedBannerFile(null);
        setBannerError(null);
        setFormError(null);

        // Open Success Confirmation Modal (matches delete modal look & feel)
        setConfirmModal({
          isOpen: true,
          title: "Category Created Successfully!",
          message: `"${submittedCategoryName}" has been published and added to your store's live catalog.`,
          confirmLabel: "View Categories",
          cancelLabel: "Create Another",
          variant: "success",
          onConfirm: () => {
            setConfirmModal(null);
            setCurrentView("list");
            router.push("/dashboard/categories");
          },
          onCancel: () => {
            setConfirmModal(null);
          },
        });
      }

      setLastCreatedCategory(submittedCategoryName);
      setSuccessToast(true);
      setSelectedBannerFile(null);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoryId && isLoadingCategory) {
    return (
      <PageLoader
        title="Loading Category Details..."
        description="Fetching category properties, subcategories, and banner configuration."
        badgeText="Category Editor"
      />
    );
  }

  if (categoryId && categoryLoadError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-card border border-rose-500/20 my-6 space-y-3">
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
          <ArrowLeft className="h-6 w-6" />
        </div>
        <h3 className="text-base font-extrabold text-foreground">
          Category Could Not Be Loaded
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          The requested category could not be found or you do not have permission to view it.
        </p>
        <Link
          href="/dashboard/categories"
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold shadow-xs hover:bg-amber-400 transition-all"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

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

      {formError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {formError}
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
              icon={formValues.icon}
              bannerUrl={bannerUrl}
              itemCount={0}
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

      {/* Reusable Confirmation / Creation Done Modal */}
      {confirmModal && (
        <ConfirmationModal
          dialog={confirmModal}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
