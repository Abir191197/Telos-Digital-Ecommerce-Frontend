"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CheckCircle2, Loader2, Save } from "lucide-react";
import {
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/services/api/products/productApi";
import { useGetCategoriesQuery } from "@/services/api/categories/categoryApi";
import { useGetBrandsQuery } from "@/services/api/brands/brandApi";
import {
  ConfirmationModal,
  PageLoader,
  type ConfirmationDialogState,
} from "@/components/common";
import {
  ProductPhotosUploadCard,
  ProductLivePreviewCard,
  ProductDetailsFormCard,
  type ProductFormValues,
  type ProductPhotoItem,
} from "@/components/admin/products";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface CreateProductViewProps {
  productId?: string;
  productSlug?: string;
}

export function CreateProductView({ productId, productSlug }: CreateProductViewProps = {}) {
  const router = useRouter();

  // Queries & Mutations (support either slug or direct id)
  const { data: productBySlug, isLoading: isLoadingBySlug } = useGetProductBySlugQuery(
    productSlug || "",
    { skip: !productSlug }
  );

  const { data: productById, isLoading: isLoadingById } = useGetProductByIdQuery(
    productId || "",
    { skip: !productId }
  );

  const existingProduct = productBySlug || productById;
  const isLoadingProduct =
    (Boolean(productSlug) && isLoadingBySlug) || (Boolean(productId) && isLoadingById);

  // Live Category and Brand GET APIs
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery({ limit: 100 });
  const { data: brandsResponse, isLoading: isLoadingBrands } = useGetBrandsQuery({ limit: 100 });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isSubmitting = isCreating || isUpdating;
  const isEditMode = Boolean((productId || productSlug) && existingProduct);

  const categoriesList = useMemo(() => {
    if (Array.isArray(categoriesResponse?.data) && categoriesResponse.data.length > 0) {
      return categoriesResponse.data;
    }
    if (Array.isArray(categoriesResponse) && (categoriesResponse as any).length > 0) {
      return categoriesResponse as any;
    }
    return [];
  }, [categoriesResponse]);

  const brandsList = useMemo(() => {
    if (Array.isArray(brandsResponse?.data) && brandsResponse.data.length > 0) {
      return brandsResponse.data;
    }
    if (Array.isArray(brandsResponse) && (brandsResponse as any).length > 0) {
      return brandsResponse as any;
    }
    return [];
  }, [brandsResponse]);

  // Clean empty defaults (no hardcoded prices or mock selections)
  const defaultFormValues: ProductFormValues = {
    title: "",
    brandId: "",
    categoryId: "",
    subCategoryId: "",
    shortDesc: "",
    price: "",
    costPrice: "",
    stock: "",
    badge: "",
    hasVoucher: false,
    voucherType: "percentage",
    voucherValue: "",
    voucherCode: "",
    showVoucherOnCard: false,
    hasVariants: false,
    variants: [],
    description: "",
    isFeatured: false,
    isFlashDeal: false,
  };

  const [formValues, setFormValues] = useState<ProductFormValues>(defaultFormValues);
  const [mediaItems, setMediaItems] = useState<ProductPhotoItem[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Success Modal Dialog State
  const [confirmModal, setConfirmModal] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "View All Products",
    cancelLabel: "Create Another",
    variant: "success",
    onConfirm: () => router.push("/dashboard/products"),
    onCancel: () => {
      setFormValues(defaultFormValues);
      setMediaItems([]);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    },
  });

  // Populate form if editing existing product
  useEffect(() => {
    if (existingProduct) {
      const existingCost =
        (existingProduct as any).costPrice !== undefined &&
        (existingProduct as any).costPrice !== null &&
        (existingProduct as any).costPrice !== ""
          ? Number((existingProduct as any).costPrice)
          : "";
      const existingBrandId =
        (existingProduct as any).brandId ||
        (existingProduct as any).brand?.id ||
        "";
      const existingCategoryId =
        (existingProduct as any).categoryId ||
        (existingProduct as any).category?.id ||
        "";
      const existingSubCategoryId =
        (existingProduct as any).subCategoryId ||
        (existingProduct as any).subCategory?.id ||
        "";
      const existingHasVariants = Boolean(
        (existingProduct as any).hasVariants ||
          ((existingProduct as any).variants && (existingProduct as any).variants.length > 0)
      );
      const existingVariants =
        (existingProduct as any).variants && (existingProduct as any).variants.length > 0
          ? (existingProduct as any).variants.map((v: any) => ({
              id: v.id,
              color: v.color || "",
              size: v.size || "",
              weight: v.weight || "",
              price: v.price ? Number(v.price) : "",
              costPrice: v.costPrice ? Number(v.costPrice) : "",
              stock: v.stock !== undefined ? v.stock : "",
            }))
          : [];

      setFormValues({
        title: existingProduct.name,
        brandId: existingBrandId,
        categoryId: existingCategoryId,
        subCategoryId: existingSubCategoryId,
        shortDesc: existingProduct.shortDescription || "",
        price: existingProduct.price || "",
        costPrice: existingCost,
        stock: existingProduct.stock !== undefined ? existingProduct.stock : "",
        badge: (existingProduct as any).storefrontBadgeText || existingProduct.badge || "",
        hasVoucher: (existingProduct as any).hasVoucher || false,
        voucherType: ((existingProduct as any).voucherDiscountType || "PERCENTAGE").toLowerCase() as any,
        voucherValue: (existingProduct as any).voucherDiscountValue ? Number((existingProduct as any).voucherDiscountValue) : "",
        voucherCode: (existingProduct as any).voucherCouponCode || "",
        showVoucherOnCard: (existingProduct as any).showVoucherBadge || false,
        hasVariants: existingHasVariants,
        variants: existingVariants,
        description: existingProduct.description || "",
        isFeatured: existingProduct.isFeatured || false,
        isFlashDeal: existingProduct.isFlashDeal || false,
      });

      const loadedMedia: ProductPhotoItem[] = [];
      const seenUrls = new Set<string>();

      if (existingProduct.thumbnail) {
        loadedMedia.push({
          id: "thumb-" + existingProduct.id,
          url: existingProduct.thumbnail,
          isUrl: true,
        });
        seenUrls.add(existingProduct.thumbnail);
      }

      if (Array.isArray(existingProduct.images)) {
        existingProduct.images.forEach((img: any, idx: number) => {
          const u = typeof img === "string" ? img : img.url;
          if (u && !seenUrls.has(u)) {
            seenUrls.add(u);
            loadedMedia.push({
              id: img.id || `img-${idx}`,
              url: u,
              isUrl: true,
            });
          }
        });
      }
      setMediaItems(loadedMedia);
    }
  }, [existingProduct]);

  // Form Field Change Handler
  const handleFieldChange = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Image Handlers (Files & Direct URLs)
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    const newItems: ProductPhotoItem[] = [];
    const oversizedFileNames: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        oversizedFileNames.push(`"${file.name}" (${sizeMb}MB)`);
      } else {
        const url = URL.createObjectURL(file);
        newItems.push({
          id: crypto.randomUUID(),
          url,
          file,
          isUrl: false,
        });
      }
    });

    if (oversizedFileNames.length > 0) {
      setImageError(
        `File exceeds ${MAX_FILE_SIZE_MB}MB limit: ${oversizedFileNames.join(", ")}. Please use smaller images.`
      );
    }

    if (newItems.length > 0) {
      setMediaItems((prev) => [...prev, ...newItems]);
    }

    e.target.value = "";
  };

  const handleAddImageUrl = (url: string) => {
    setImageError(null);
    const trimmed = url.trim();
    if (!trimmed) return;
    setMediaItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        url: trimmed,
        isUrl: true,
      },
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    setMediaItems((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const target = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [target, ...remaining];
    });
  };

  // Category & Calculations
  const selectedCategory = useMemo(() => {
    return categoriesList.find((c: any) => c.id === formValues.categoryId);
  }, [categoriesList, formValues.categoryId]);

  const selectedBrand = useMemo(() => {
    return brandsList.find((b: any) => b.id === formValues.brandId);
  }, [brandsList, formValues.brandId]);

  const numericPrice = Number(formValues.price) || 0;
  const numericCost = Number(formValues.costPrice) || 0;
  const numericStock = Number(formValues.stock) || 0;

  const previewThumbnail =
    mediaItems.length > 0
      ? mediaItems[0].url
      : "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80";

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError(null);

    if (!formValues.title.trim()) {
      setImageError("Please enter a product title.");
      return;
    }
    if (!formValues.brandId) {
      setImageError("Please select a brand.");
      return;
    }
    if (!formValues.categoryId) {
      setImageError("Please select a category.");
      return;
    }
    if (formValues.price === "" || numericPrice <= 0) {
      setImageError("Please specify a valid selling price greater than 0.");
      return;
    }

    const payloadFormData = new FormData();
    payloadFormData.append("name", formValues.title.trim());
    payloadFormData.append("price", String(numericPrice));
    if (formValues.costPrice !== "" && numericCost >= 0) {
      payloadFormData.append("costPrice", String(numericCost));
    }
    payloadFormData.append("stock", String(numericStock));
    payloadFormData.append("categoryId", formValues.categoryId);
    if (formValues.brandId) payloadFormData.append("brandId", formValues.brandId);
    if (formValues.subCategoryId) payloadFormData.append("subCategoryId", formValues.subCategoryId);

    if (formValues.shortDesc) payloadFormData.append("shortDescription", formValues.shortDesc.trim());
    if (formValues.description) payloadFormData.append("description", formValues.description.trim());

    // Storefront Badge
    if (formValues.badge) {
      payloadFormData.append("showStorefrontBadge", "true");
      payloadFormData.append("storefrontBadgeText", formValues.badge);
    } else {
      payloadFormData.append("showStorefrontBadge", "false");
    }

    // Voucher Promo Ribbon
    payloadFormData.append("hasVoucher", String(Boolean(formValues.hasVoucher)));
    if (formValues.hasVoucher) {
      payloadFormData.append("voucherDiscountType", formValues.voucherType === "flat" ? "FLAT" : "PERCENTAGE");
      if (formValues.voucherValue !== "") {
        payloadFormData.append("voucherDiscountValue", String(Number(formValues.voucherValue)));
      }
      if (formValues.voucherCode) {
        payloadFormData.append("voucherCouponCode", formValues.voucherCode.trim());
      }
      payloadFormData.append("showVoucherBadge", String(Boolean(formValues.showVoucherOnCard)));
    }

    // Variants (Color, Size, Weight)
    payloadFormData.append("hasVariants", String(Boolean(formValues.hasVariants)));
    if (formValues.hasVariants && formValues.variants.length > 0) {
      const formattedVariants = formValues.variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        color: v.color.trim() || undefined,
        size: v.size.trim() || undefined,
        weight: v.weight.trim() || undefined,
        price: v.price !== "" ? Number(v.price) : numericPrice,
        costPrice:
          v.costPrice !== ""
            ? Number(v.costPrice)
            : formValues.costPrice !== ""
            ? numericCost
            : undefined,
        stock: Number(v.stock) || 0,
      }));
      payloadFormData.append("variants", JSON.stringify(formattedVariants));
    }

    payloadFormData.append("isFeatured", String(Boolean(formValues.isFeatured)));
    payloadFormData.append("isFlashDeal", String(Boolean(formValues.isFlashDeal)));
    payloadFormData.append("isActive", "true");

    // Specifications
    const specificationsObj: Record<string, any> = {
      ...(selectedBrand?.name ? { Brand: selectedBrand.name } : {}),
    };
    payloadFormData.append("specifications", JSON.stringify(specificationsObj));

    // Append Media (Files & Direct URLs)
    const fileItems = mediaItems.filter((m) => !m.isUrl && m.file);
    const urlItems = mediaItems.filter((m) => m.isUrl).map((m) => m.url);

    if (mediaItems.length > 0) {
      const firstItem = mediaItems[0];
      if (firstItem.isUrl) {
        payloadFormData.append("thumbnailUrl", firstItem.url);
      } else if (firstItem.file) {
        payloadFormData.append("thumbnail", firstItem.file);
      }

      // Other files for gallery
      const otherFileItems = mediaItems.slice(1).filter((m) => !m.isUrl && m.file);
      otherFileItems.forEach((item) => {
        if (item.file) {
          payloadFormData.append("images", item.file);
        }
      });

      // Pass all direct image URLs
      if (urlItems.length > 0) {
        payloadFormData.append("imageUrls", JSON.stringify(urlItems));
      }
    }

    const targetProductId = existingProduct?.id || productId;
    try {
      if (targetProductId) {
        await updateProduct({ id: targetProductId, payload: payloadFormData }).unwrap();
        setConfirmModal({
          isOpen: true,
          title: "Product Updated",
          message: `"${formValues.title}" has been updated successfully in the store catalog.`,
          confirmLabel: "View All Products",
          cancelLabel: "Continue Editing",
          variant: "success",
          onConfirm: () => router.push("/dashboard/products"),
          onCancel: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
        });
      } else {
        await createProduct(payloadFormData).unwrap();
        setConfirmModal({
          isOpen: true,
          title: "Product Published",
          message: `"${formValues.title}" is now active in the TelosCart store catalog.`,
          confirmLabel: "View All Products",
          cancelLabel: "Create Another",
          variant: "success",
          onConfirm: () => router.push("/dashboard/products"),
          onCancel: () => {
            setFormValues(defaultFormValues);
            setMediaItems([]);
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (err: any) {
      setImageError(err?.data?.message || "Failed to save product. Please check required fields.");
    }
  };

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
        {/* Left Form Area (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Photos Upload Card */}
          <ProductPhotosUploadCard
            images={mediaItems}
            imageError={imageError}
            onFilesSelect={handleFilesSelect}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            onSetMainImage={handleSetMainImage}
            onClearError={() => setImageError(null)}
          />

          {/* Details Form Card */}
          <ProductDetailsFormCard
            values={formValues}
            onChange={handleFieldChange}
            categories={categoriesList}
            brands={brandsList}
            isLoadingTaxonomy={isLoadingCategories || isLoadingBrands}
          />

          {/* Bottom Action Card (Desktop only — mobile uses floating card) */}
          <div className="hidden sm:flex items-center justify-between p-4.5 rounded-3xl border border-border/60 bg-card shadow-xs">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">
                {isEditMode ? "Ready to update?" : "Ready to publish?"}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {isEditMode
                  ? "Ensure all pricing, specs, and gallery changes are accurate."
                  : "Listing will become instantly active on storefront."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/products"
                className="px-4 py-2.5 rounded-xl border border-border/70 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Discard
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                ) : isEditMode ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>{isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Listing"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Customer Preview (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Storefront Preview
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" /> Live Sync
            </span>
          </div>

          <ProductLivePreviewCard
            title={formValues.title}
            brand={selectedBrand?.name || "Brand"}
            categoryName={selectedCategory?.name || "Product Category"}
            shortDesc={formValues.shortDesc}
            badge={formValues.badge}
            stock={numericStock}
            numericPrice={numericPrice}
            previewThumbnail={previewThumbnail}
            hasImages={mediaItems.length > 0}
            hasVoucher={formValues.hasVoucher}
            showVoucherOnCard={formValues.showVoucherOnCard}
            voucherCode={formValues.voucherCode}
            voucherType={formValues.voucherType}
            voucherValue={formValues.voucherValue}
          />

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <h4 className="text-xs font-bold text-foreground">
              Real-time Customer View
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This interactive preview renders exactly how your customers will see this item on the storefront cards and promotional listings.
            </p>
          </div>
        </div>
      </form>

      {/* Success Confirmation Modal */}
      <ConfirmationModal
        dialog={confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* ── Mobile Floating Action Pill (Above Mobile Bottom Nav) ── */}
      <div className="fixed bottom-18 left-0 right-0 z-40 sm:hidden flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center justify-between gap-2.5 w-full max-w-[330px] px-3 py-1.5 rounded-full border border-white/10 dark:border-amber-500/25 bg-zinc-950/80 dark:bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Link
            href="/dashboard/products"
            className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-300 hover:text-white transition-all active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-1.5 text-[11px] font-black text-zinc-950 hover:from-amber-400 hover:to-amber-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin text-zinc-950" />
            ) : isEditMode ? (
              <Save className="h-3 w-3" />
            ) : (
              <Sparkles className="h-3 w-3 fill-zinc-950" />
            )}
            <span>{isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Product"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
