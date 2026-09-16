"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/stores";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";
import type { Product } from "@/types/ecommerce.types";
import {
  ProductPhotosUploadCard,
  ProductLivePreviewCard,
  ProductDetailsFormCard,
  type ProductFormValues,
} from "@/components/admin/products";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface CreateProductViewProps {
  productId?: string;
}

export function CreateProductView({ productId }: CreateProductViewProps = {}) {
  const router = useRouter();
  const { products, addProduct, updateProduct } = useAdminStore();

  const editingProduct = productId
    ? products.find((p) => p.id === productId || p.slug === productId)
    : null;

  // Form State
  const [formValues, setFormValues] = useState<ProductFormValues>(() => {
    if (editingProduct) {
      return {
        title: editingProduct.name,
        brand: editingProduct.brand || brandsData[0]?.name || "Apple",
        categorySlug: editingProduct.categorySlug || categoriesData[0]?.slug || "smartphones-tablets",
        shortDesc: editingProduct.shortDescription || "",
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice || editingProduct.price,
        stock: editingProduct.stock,
        badge: editingProduct.badge || editingProduct.tags?.[0] || "New",
        warranty: editingProduct.specifications?.Warranty || "1 Year Official Brand Warranty",
        hasVoucher: false,
        voucherType: "percentage",
        voucherValue: 10,
        voucherCode: "TELOS10",
        showVoucherOnCard: true,
        sku: editingProduct.sku || "",
        description: editingProduct.description || "",
        isFeatured: editingProduct.isFeatured || false,
        isFlashDeal: editingProduct.isFlashDeal || false,
      };
    }

    return {
      title: "",
      brand: brandsData[0]?.name || "Apple",
      categorySlug: categoriesData[0]?.slug || "smartphones-tablets",
      shortDesc: "",
      price: 95000,
      originalPrice: 105000,
      stock: 15,
      badge: "New",
      warranty: "1 Year Official Brand Warranty",
      hasVoucher: false,
      voucherType: "percentage",
      voucherValue: 10,
      voucherCode: "TELOS10",
      showVoucherOnCard: true,
      sku: "",
      description: "",
      isFeatured: false,
      isFlashDeal: false,
    };
  });

  // Photos State
  const [images, setImages] = useState<string[]>(() => {
    if (editingProduct) {
      return editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.thumbnail
        ? [editingProduct.thumbnail]
        : [];
    }
    return [];
  });
  const [imageError, setImageError] = useState<string | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form Field Change Handler
  const handleFieldChange = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Image Upload handler
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    const validUrls: string[] = [];
    const oversizedFileNames: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        oversizedFileNames.push(`"${file.name}" (${sizeMb}MB)`);
      } else {
        const url = URL.createObjectURL(file);
        validUrls.push(url);
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

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Category & Calculations
  const selectedCategory =
    categoriesData.find((c) => c.slug === formValues.categorySlug) ||
    categoriesData[0];

  const numericPrice = Number(formValues.price) || 0;
  const numericOriginal = Number(formValues.originalPrice) || 0;
  const discountPercent =
    numericOriginal > numericPrice && numericPrice > 0
      ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
      : 0;

  const previewThumbnail =
    images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80";

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.title.trim() || !formValues.price || numericPrice <= 0) return;

    setIsSubmitting(true);

    const slug = formValues.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const generatedSku =
      formValues.sku.trim() ||
      `TELOS-${formValues.brand.slice(0, 3).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formValues.title.trim(),
        shortDescription: formValues.shortDesc.trim() || editingProduct.shortDescription,
        description: formValues.description.trim() || editingProduct.description,
        categoryId: selectedCategory.id,
        categorySlug: selectedCategory.slug,
        categoryName: selectedCategory.name,
        price: numericPrice,
        originalPrice: numericOriginal > numericPrice ? numericOriginal : numericPrice,
        discountPercentage: discountPercent,
        stock: Number(formValues.stock),
        inStock: Number(formValues.stock) > 0,
        isFeatured: formValues.isFeatured,
        isFlashDeal: formValues.isFlashDeal,
        badge: (formValues.badge as any) || undefined,
        images: images.length > 0 ? images : [previewThumbnail],
        thumbnail: previewThumbnail,
        brand: formValues.brand,
        sku: formValues.sku.trim() || editingProduct.sku,
        specifications: {
          ...(editingProduct.specifications || {}),
          Brand: formValues.brand,
          Warranty: formValues.warranty || "1 Year Official Warranty",
        },
      });
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formValues.title.trim(),
        shortDescription:
          formValues.shortDesc.trim() ||
          `Authentic ${formValues.brand} ${formValues.title.trim()} backed with official Bangladesh manufacturer warranty.`,
        description:
          formValues.description.trim() ||
          `Authentic ${formValues.title.trim()} from ${formValues.brand}. Includes official verified importer coverage.`,
        categoryId: selectedCategory.id,
        categorySlug: selectedCategory.slug,
        categoryName: selectedCategory.name,
        price: numericPrice,
        originalPrice: numericOriginal > numericPrice ? numericOriginal : numericPrice,
        discountPercentage: discountPercent,
        currency: "BDT",
        rating: 5.0,
        reviewCount: 0,
        stock: Number(formValues.stock),
        inStock: Number(formValues.stock) > 0,
        isFeatured: formValues.isFeatured,
        isFlashDeal: formValues.isFlashDeal,
        isNewArrival: true,
        badge: (formValues.badge as any) || undefined,
        images: images.length > 0 ? images : [previewThumbnail],
        thumbnail: previewThumbnail,
        brand: formValues.brand,
        sku: generatedSku,
        specifications: {
          Brand: formValues.brand,
          Warranty: formValues.warranty || "1 Year Official Warranty",
        },
        tags: ["official-store", "bangladesh-tech"],
        createdAt: new Date().toISOString(),
      };

      addProduct(newProduct);
    }

    setSuccessToast(true);

    setTimeout(() => {
      router.push("/dashboard/products");
    }, 900);
  };

  return (
    <div className="w-full space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors shadow-2xs"
            title="Back to Product Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Admin Catalog
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {editingProduct ? "Edit Product" : "Quick Entry"}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Product"}
            </h1>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <div className="text-xs font-medium">
            <strong className="font-bold">Product saved!</strong> &ldquo;{formValues.title}&rdquo;{" "}
            {editingProduct ? "updated successfully." : "added to live inventory."} Redirecting...
          </div>
        </div>
      )}

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (8 cols): Photo Upload + Form Inputs */}
        <div className="lg:col-span-8 space-y-6">
          <ProductPhotosUploadCard
            images={images}
            imageError={imageError}
            onFilesSelect={handleFilesSelect}
            onRemoveImage={handleRemoveImage}
            onClearError={() => setImageError(null)}
          />

          <form id="unified-product-form" onSubmit={handleSubmit} className="space-y-6">
            <ProductDetailsFormCard
              values={formValues}
              onChange={handleFieldChange}
            />

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Link
                href="/dashboard/products"
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT (4 cols): Real-Time Live Preview Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-3">
          <ProductLivePreviewCard
            title={formValues.title}
            brand={formValues.brand}
            categoryName={selectedCategory.name}
            shortDesc={formValues.shortDesc}
            badge={formValues.badge}
            warranty={formValues.warranty}
            stock={Number(formValues.stock)}
            numericPrice={numericPrice}
            numericOriginal={numericOriginal}
            discountPercent={discountPercent}
            previewThumbnail={previewThumbnail}
            hasImages={images.length > 0}
            hasVoucher={formValues.hasVoucher}
            showVoucherOnCard={formValues.showVoucherOnCard}
            voucherCode={formValues.voucherCode}
            voucherType={formValues.voucherType}
            voucherValue={formValues.voucherValue}
          />

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3 text-[11px] text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">💡 How customers see it</p>
            <p>
              This preview matches your storefront product card layout. Updates change instantly as you type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
