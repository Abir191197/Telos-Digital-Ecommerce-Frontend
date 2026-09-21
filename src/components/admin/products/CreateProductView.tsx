"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConfirmationModal, PageLoader } from "@/components/common";
import {
  ProductPhotosUploadCard,
  ProductDetailsFormCard,
  ProductPreviewSidebar,
  ProductFormActionsBar,
  useProductEditor,
} from "@/components/admin/products";

interface CreateProductViewProps {
  productId?: string;
  productSlug?: string;
}

export function CreateProductView({ productId, productSlug }: CreateProductViewProps = {}) {
  const {
    isLoadingProduct,
    isSubmitting,
    isEditMode,
    categoriesList,
    brandsList,
    isLoadingTaxonomy,
    formValues,
    handleFieldChange,
    mediaItems,
    imageError,
    setImageError,
    handleFilesSelect,
    handleAddImageUrl,
    handleRemoveImage,
    handleSetMainImage,
    selectedCategory,
    selectedBrand,
    numericPrice,
    numericStock,
    previewThumbnail,
    handleSubmit,
    confirmModal,
    setConfirmModal,
  } = useProductEditor({ productId, productSlug });

  if (isLoadingProduct && (productId || productSlug)) {
    return (
      <PageLoader
        title="Loading Product..."
        description="Fetching catalog item details, pricing tiers, and media gallery."
        badgeText="Product Catalog"
      />
    );
  }

  return (
    <div className="w-full space-y-6 pb-36 sm:pb-20">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="p-2.5 rounded-xl border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                {productId || productSlug ? "Catalog Editor" : "New Inventory Item"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {productId || productSlug ? "Edit Product Listing" : "Create New Product"}
            </h1>
          </div>
        </div>
      </div>

      {imageError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{imageError}</span>
          <button
            onClick={() => setImageError(null)}
            className="underline text-[11px] hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left Upload & Details, Right Sticky Preview */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Area */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <ProductPhotosUploadCard
            images={mediaItems}
            imageError={imageError}
            onFilesSelect={handleFilesSelect}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            onSetMainImage={handleSetMainImage}
            onClearError={() => setImageError(null)}
          />

          <ProductDetailsFormCard
            values={formValues}
            onChange={handleFieldChange}
            categories={categoriesList}
            brands={brandsList}
            isLoadingTaxonomy={isLoadingTaxonomy}
          />

          <ProductFormActionsBar
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Right Live Customer Preview */}
        <ProductPreviewSidebar
          formValues={formValues}
          brandName={selectedBrand?.name}
          categoryName={selectedCategory?.name}
          numericPrice={numericPrice}
          numericStock={numericStock}
          previewThumbnail={previewThumbnail}
          hasImages={mediaItems.length > 0}
        />
      </form>

      {/* Success Confirmation Modal */}
      <ConfirmationModal
        dialog={confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
