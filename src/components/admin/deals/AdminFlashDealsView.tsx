"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";
import { ROUTES } from "@/constants";
import { PageLoader } from "@/components/common";
import {
  useGetAdminProductsQuery,
  useUpdateProductMutation,
} from "@/services/api/products/productApi";
import { FlashDealDesktopTable } from "./FlashDealDesktopTable";
import { AdminFlashDealsSkeleton } from "./AdminFlashDealsSkeleton";

const MAX_HOMEPAGE_FEATURED = 12;

export function AdminFlashDealsView() {
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch admin products
  const {
    data: adminProductsResponse,
    isLoading,
    refetch,
  } = useGetAdminProductsQuery({
    page: currentPage,
    limit: 100, // Fetch up to 100 items to enable accurate filtering & counts
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

  // Filtered products based on active tab and search
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = (product.sku || "").toLowerCase().includes(q);
        const matchesBrand = (product.brand || "").toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand) return false;
      }

      // Filter Mode
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
      // If disabling flash deal, also disable homepage featured
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

    // Check if activating and already at limit
    if (nextState) {
      if (homepageFeaturedCount >= MAX_HOMEPAGE_FEATURED) {
        setLimitAlert({
          isOpen: true,
          productName: product.name,
        });
        return;
      }
    }

    setUpdatingId(product.id);

    try {
      const payloadFormData = new FormData();
      payloadFormData.append("isFeatured", String(nextState));
      // If enabling for homepage, ensure it's also included in flash deals
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

  // Selection helpers
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

  if (isLoading && allProducts.length === 0) {
    return <AdminFlashDealsSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl text-xs font-bold transition-all animate-in fade-in slide-in-from-top-3",
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : toastMessage.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          )}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Limit Warning Modal (Max 12 Reached) ── */}
      {limitAlert.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-amber-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">
                  Homepage Limit Reached (12/12)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Maximum 12 products can be featured on Homepage Flash Deals
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              You already have <strong className="text-foreground">12 products</strong> featured on the homepage Flash Deals carousel. To feature{" "}
              <span className="font-bold text-amber-600 dark:text-amber-400">"{limitAlert.productName}"</span>, please unfeature an existing product first.
            </p>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-700 dark:text-amber-300">
              💡 <strong>Storefront Rule:</strong> The homepage flash deal card is optimized for exactly 12 high-converting items with direct BD express courier. Other items will still appear on the dedicated <Link href={ROUTES.FLASH_DEALS} target="_blank" className="underline font-bold">/flash-deals</Link> page.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLimitAlert({ isOpen: false, productName: "" })}
                className="rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/20">
              <Flame className="h-5 w-5 fill-zinc-950 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Flash Deals Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Control active discounts, toggle homepage highlights, and configure limited-time promotions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href={ROUTES.FLASH_DEALS}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border px-4 py-2 text-xs font-bold text-foreground transition-all shrink-0"
          >
            <span>Preview Storefront Deals</span>
            <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
          </Link>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total in Flash Deals */}
        <div className="rounded-3xl border border-amber-500/20 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Flash Deals
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {flashCount}
            </span>
            <span className="text-xs text-muted-foreground">active promotions</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            All active deals appear on <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">/flash-deals</code>
          </p>
        </div>

        {/* Featured on Homepage (12 Limit) */}
        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Featured on Homepage
            </span>
            <span className="rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 text-[10px] font-black">
              {homepageFeaturedCount} / {MAX_HOMEPAGE_FEATURED} Max
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {homepageFeaturedCount}
            </span>
            <span className="text-xs text-muted-foreground">
              / {MAX_HOMEPAGE_FEATURED} items allowed
            </span>
          </div>
          {/* Progress Bar for 12 items */}
          <div className="mt-2.5">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${(homepageFeaturedCount / MAX_HOMEPAGE_FEATURED) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Catalog Items */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Catalog Items
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground">
              {totalCount}
            </span>
            <span className="text-xs text-muted-foreground">eligible products</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Toggle switch in table to promote any item
          </p>
        </div>
      </div>

      {/* ── Toolbar: Search & Filter Tabs ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/80">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              filterMode === "all"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Products ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("flash")}
            className={cn(
              "flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              filterMode === "flash"
                ? "bg-amber-500 text-zinc-950 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="h-3 w-3" />
            <span>In Flash Deals ({flashCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("featured")}
            className={cn(
              "flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              filterMode === "featured"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Flame className="h-3 w-3" />
            <span>Featured on Homepage ({homepageFeaturedCount}/{MAX_HOMEPAGE_FEATURED})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("regular")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
              filterMode === "regular"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Regular Catalog ({totalCount - flashCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, SKU, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table Component ── */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <PageLoader />
        </div>
      ) : (
        <FlashDealDesktopTable
          products={filteredProducts}
          selectedIds={selectedIds}
          homepageFeaturedCount={homepageFeaturedCount}
          maxHomepageLimit={MAX_HOMEPAGE_FEATURED}
          updatingId={updatingId}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onToggleFlashDeal={handleToggleFlashDeal}
          onToggleHomepageFeatured={handleToggleHomepageFeatured}
        />
      )}
    </div>
  );
}
