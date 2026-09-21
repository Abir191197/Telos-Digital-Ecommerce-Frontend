"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConfirmationModal, PageLoader } from "@/components/common";
import {
  CategoryBannerUploadCard,
  CategoryPropertiesFormCard,
  CategoryLivePreviewCard,
} from "./";
import { AdminCategoriesListView } from "./AdminCategoriesListView";
import { CategoryHeader } from "./CategoryHeader";
import { CategoryFormActions } from "./CategoryFormActions";
import { useCategoryEditor } from "./useCategoryEditor";

export interface CreateCategoryViewProps {
  initialTab?: "create" | "list";
  categoryId?: string;
  categorySlug?: string;
}

export function CreateCategoryView({
  initialTab = "create",
  categoryId,
  categorySlug,
}: CreateCategoryViewProps) {
  const {
    editingCategory,
    isLoadingCategory,
    categoryLoadError,
    isEditMode,
    currentView,
    setCurrentView,
    formValues,
    handleFieldChange,
    subcategories,
    handleAddSubcategory,
    handleRemoveSubcategory,
    bannerUrl,
    bannerError,
    setBannerError,
    handleBannerSelect,
    handleBannerRemove,
    handleResetForm,
    handleSubmit,
    isSubmitting,
    successToast,
    lastCreatedCategory,
    formError,
    confirmModal,
    setConfirmModal,
  } = useCategoryEditor({ initialTab, categoryId, categorySlug });

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
    <div className="w-full space-y-6 pb-36 sm:pb-24">
      {/* Top Header & Breadcrumbs + Success Banner Alert */}
      <CategoryHeader
        isEditMode={isEditMode}
        categoryName={editingCategory?.name}
        successToast={successToast}
        lastCreatedCategory={lastCreatedCategory}
        onResetForm={handleResetForm}
      />

      {formError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {formError}
        </div>
      )}

      {/* VIEW 1: CATEGORY CREATION */}
      {currentView === "create" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT (8 cols): Photo Upload Card + Properties Form Card */}
          <div className="lg:col-span-8 space-y-6">
            <CategoryBannerUploadCard
              bannerUrl={bannerUrl}
              bannerError={bannerError}
              onBannerSelect={handleBannerSelect}
              onBannerRemove={handleBannerRemove}
              onClearError={() => setBannerError(null)}
            />

            <form id="category-create-form" onSubmit={handleSubmit} className="space-y-6">
              <CategoryPropertiesFormCard
                values={formValues}
                onChange={handleFieldChange}
                subcategories={subcategories}
                onAddSubcategory={handleAddSubcategory}
                onRemoveSubcategory={handleRemoveSubcategory}
              />

              <CategoryFormActions
                isEditMode={isEditMode}
                isSubmitting={isSubmitting}
                hasName={Boolean(formValues.name.trim())}
                onReset={handleResetForm}
              />
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
