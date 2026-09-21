"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/ecommerce.types";
import {
  useGetAdminProductsQuery,
  useUpdateProductMutation,
} from "@/services/api/products/productApi";

export const MAX_HOMEPAGE_FEATURED = 12;

export function useAdminFlashDeals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "flash" | "featured" | "regular">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Warning Modal State when hitting 12-item limit
  const [limitAlert, setLimitAlert] = useState<{
    isOpen: boolean;
    productName: string;
  }>({
    isOpen: false,
    productName: "",
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: adminProductsResponse,
    isLoading,
    refetch,
  } = useGetAdminProductsQuery({
    page: currentPage,
    limit: 100,
    searchTerm: searchQuery || undefined,
  });

  const [updateProductMutation] = useUpdateProductMutation();

  const allProducts: Product[] = useMemo(() => {
    return adminProductsResponse?.data || [];
  }, [adminProductsResponse?.data]);

  // Overall KPI counts
  const { totalCount, flashCount, homepageFeaturedCount } = useMemo(() => {
    const total = allProducts.length;
    const flash = allProducts.filter((p) => p.isFlashDeal).length;
    const featured = allProducts.filter((p) => p.isFlashDeal && p.isFeatured).length;
    return { totalCount: total, flashCount: flash, homepageFeaturedCount: featured };
  }, [allProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = (product.sku || "").toLowerCase().includes(q);
        const matchesBrand = (product.brand || "").toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand) return false;
      }

      if (filterMode === "flash") {
        return Boolean(product.isFlashDeal);
      }
      if (filterMode === "featured") {
        return Boolean(product.isFlashDeal && product.isFeatured);
      }
      if (filterMode === "regular") {
        return !product.isFlashDeal;
      }
      return true;
    });
  }, [allProducts, filterMode, searchQuery]);

  // Handle Toggle "Include in Flash Deals"
  const handleToggleFlashDeal = async (product: Product) => {
    const nextState = !product.isFlashDeal;
    setUpdatingId(product.id);

    try {
      const payloadFormData = new FormData();
      payloadFormData.append("isFlashDeal", String(nextState));
      if (!nextState && product.isFeatured) {
        payloadFormData.append("isFeatured", "false");
      }

      await updateProductMutation({
        id: product.id,
        payload: payloadFormData,
      }).unwrap();

      showToast(
        nextState
          ? `Added "${product.name}" to Flash Deals.`
          : `Removed "${product.name}" from Flash Deals.`
      );
      refetch();
    } catch (err: any) {
      console.error("Failed to update flash deal status:", err);
      showToast(err?.data?.message || "Failed to update flash deal status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Toggle "Feature on Homepage" (Strict Max 12 Limit)
  const handleToggleHomepageFeatured = async (product: Product) => {
    const isCurrentlyFeatured = Boolean(product.isFeatured && product.isFlashDeal);
    const nextState = !isCurrentlyFeatured;

    if (nextState && homepageFeaturedCount >= MAX_HOMEPAGE_FEATURED) {
      setLimitAlert({
        isOpen: true,
        productName: product.name,
      });
      return;
    }

    setUpdatingId(product.id);

    try {
      const payloadFormData = new FormData();
      payloadFormData.append("isFeatured", String(nextState));
      if (nextState && !product.isFlashDeal) {
        payloadFormData.append("isFlashDeal", "true");
      }

      await updateProductMutation({
        id: product.id,
        payload: payloadFormData,
      }).unwrap();

      showToast(
        nextState
          ? `"${product.name}" is now featured on Homepage Flash Deals (${homepageFeaturedCount + 1}/${MAX_HOMEPAGE_FEATURED}).`
          : `"${product.name}" removed from Homepage Flash Deals.`
      );
      refetch();
    } catch (err: any) {
      console.error("Failed to update homepage featured state:", err);
      showToast(err?.data?.message || "Failed to update featured state.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    selectedIds,
    updatingId,
    limitAlert,
    setLimitAlert,
    toastMessage,
    setToastMessage,
    isLoading,
    allProducts,
    totalCount,
    flashCount,
    homepageFeaturedCount,
    filteredProducts,
    handleToggleFlashDeal,
    handleToggleHomepageFeatured,
    handleToggleSelect,
    handleSelectAll,
  };
}
