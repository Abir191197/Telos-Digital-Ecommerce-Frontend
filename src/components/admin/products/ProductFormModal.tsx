"use client";

import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Product } from "@/types/ecommerce.types";
import { ProductDetailsFormCard, ProductFormValues } from "./ProductDetailsFormCard";
import { ProductPhotosUploadCard } from "./ProductPhotosUploadCard";

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  formData: ProductFormValues;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormValues>>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  fileObjects?: File[];
  setFileObjects?: React.Dispatch<React.SetStateAction<File[]>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export function ProductFormModal({
  isOpen,
  editingProduct,
  formData,
  setFormData,
  images,
  setImages,
  fileObjects,
  setFileObjects,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  const [imageError, setImageError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    const validUrls: string[] = [];
    const validFiles: File[] = [];
    const oversizedFileNames: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        oversizedFileNames.push(`"${file.name}" (${sizeMb}MB)`);
      } else {
        const url = URL.createObjectURL(file);
        validUrls.push(url);
        validFiles.push(file);
      }
    });

    if (oversizedFileNames.length > 0) {
      setImageError(
        `File exceeds ${MAX_FILE_SIZE_MB}MB limit: ${oversizedFileNames.join(", ")}. Please use smaller images.`
      );
    }

    if (validUrls.length > 0) {
      setImages((prev) => [...prev, ...validUrls]);
    }
    if (setFileObjects && validFiles.length > 0) {
      setFileObjects((prev) => [...prev, ...validFiles]);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (setFileObjects) {
      setFileObjects((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFormChange = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-border/80 bg-background shadow-2xl relative flex flex-col">
        {/* Header (Sticky) */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/70 p-5 sm:px-7 sm:py-5 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              {editingProduct ? "Edit Product Listing" : "Add Product to Inventory"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {editingProduct ? "Update catalog metadata and pricing." : "Configure catalog metadata, pricing tier, and inventory count."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 overflow-y-auto">
          {/* Left Column: Photos */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ProductPhotosUploadCard
              images={images}
              imageError={imageError}
              onFilesSelect={handleFilesSelect}
              onRemoveImage={handleRemoveImage}
              onClearError={() => setImageError(null)}
            />
          </div>

          {/* Right Column: Details Form */}
          <div className="lg:col-span-7">
            <ProductDetailsFormCard values={formData} onChange={handleFormChange} />
          </div>
        </div>

        {/* Footer Actions (Sticky) */}
        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-md border-t border-border/70 p-5 sm:px-7 sm:py-4 flex flex-col-reverse sm:flex-row items-center gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl border border-border/70 font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer text-xs sm:text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
