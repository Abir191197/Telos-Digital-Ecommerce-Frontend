"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/services/api/products/productApi";
import { useGetCategoriesQuery } from "@/services/api/categories/categoryApi";
import { useGetBrandsQuery } from "@/services/api/brands/brandApi";
import { type ConfirmationDialogState } from "@/components/common";
import {
  type ProductFormValues,
  type ProductPhotoItem,
} from "@/components/admin/products";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DEFAULT_PRODUCT_FORM_VALUES: ProductFormValues = {
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

interface UseProductEditorParams {
  productId?: string;
  productSlug?: string;
}

export function useProductEditor({ productId, productSlug }: UseProductEditorParams = {}) {
  const router = useRouter();

  // Queries & Mutations
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

  const [formValues, setFormValues] = useState<ProductFormValues>(DEFAULT_PRODUCT_FORM_VALUES);
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
      setFormValues(DEFAULT_PRODUCT_FORM_VALUES);
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

  // Image Handlers
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

  // Category & Brand Helpers
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
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    // Append Media
    const fileItems = mediaItems.filter((m) => !m.isUrl && m.file);
    const urlItems = mediaItems.filter((m) => m.isUrl).map((m) => m.url);

    if (mediaItems.length > 0) {
      const firstItem = mediaItems[0];
      if (firstItem.isUrl) {
        payloadFormData.append("thumbnailUrl", firstItem.url);
      } else if (firstItem.file) {
        payloadFormData.append("thumbnail", firstItem.file);
      }

      const otherFileItems = mediaItems.slice(1).filter((m) => !m.isUrl && m.file);
      otherFileItems.forEach((item) => {
        if (item.file) {
          payloadFormData.append("images", item.file);
        }
      });

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
            setFormValues(DEFAULT_PRODUCT_FORM_VALUES);
            setMediaItems([]);
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (err: any) {
      setImageError(err?.data?.message || "Failed to save product. Please check required fields.");
    }
  };

  return {
    isLoadingProduct,
    isSubmitting,
    isEditMode,
    categoriesList,
    brandsList,
    isLoadingTaxonomy: isLoadingCategories || isLoadingBrands,
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
  };
}
