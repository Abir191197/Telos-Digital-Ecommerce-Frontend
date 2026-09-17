"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Award,
  X,
} from "lucide-react";
import { useGetBrandsQuery, useDeleteBrandMutation } from "@/services/api/brands/brandApi";
import type { Brand } from "@/types/ecommerce.types";
import {
  ProductConfirmDialog,
  type ConfirmationDialogState,
} from "@/components/admin/products/ProductConfirmDialog";
import { PageLoader } from "@/components/common";
import { BrandCardGrid } from "./BrandCardGrid";
import { BrandDesktopTable } from "./BrandDesktopTable";
import { BrandMobileList } from "./BrandMobileList";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";

export function AdminBrandsListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured">("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const { data, isLoading } = useGetBrandsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    searchTerm: searchTerm || undefined,
    isFeaturedMarquee: filterFeatured === "featured" ? true : undefined,
  });

  const [deleteBrand] = useDeleteBrandMutation();

  const brands = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPage || 1;


  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    variant: "danger",
    onConfirm: () => {},
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterFeatured]);

  const handleDeleteRequest = (brand: Brand) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Brand?",
      message: `Are you sure you want to permanently delete "${brand.name}"? Linked products will remain in store.`,
      confirmLabel: "Delete Brand",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteBrand(brand.id).unwrap();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          showToast(`Brand "${brand.name}" removed successfully.`);
        } catch (error) {
          console.error("Failed to delete brand:", error);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <PageLoader
        title="Loading Brands..."
        description="Fetching brand partnerships, logos, and marquee showcase settings."
        badgeText="Brand Catalog"
      />
    );
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header (Hidden on mobile) */}
      <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              Brand Partnerships
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-medium">
              {totalItems} Brands Total
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
            Manage Brands
          </h1>
        </div>

        <Link
          href="/dashboard/brands/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Brand</span>
        </Link>
      </div>

      {/* Search Bar: Sticky Sub-Nav Layer under Header on Mobile, Toolbar on Tablet/Desktop */}
      <div className="sticky top-16 sm:static z-20 -mx-4 sm:mx-0 px-4 sm:px-0 -mt-6 sm:mt-0 py-3 sm:py-0 bg-background/95 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none border-b sm:border-0 border-border/80 shadow-xs sm:shadow-none transition-all">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search brands or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills + View Switcher (Hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2.5 flex-wrap justify-end">
            {/* Featured / All filter */}
            <div className="flex rounded-xl bg-muted/40 p-1 border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setFilterFeatured("all")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterFeatured === "all"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({totalItems})
              </button>
              <button
                type="button"
                onClick={() => setFilterFeatured("featured")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterFeatured === "featured"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Featured
              </button>
            </div>

            {/* Card / Table View Toggle */}
            <div className="flex rounded-xl bg-muted/40 p-1 border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                title="Card View"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === "card"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table View"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {brands.length === 0 ? (
        <div className="rounded-3xl border-none bg-card p-12 text-center space-y-3 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Award className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-foreground">No brands found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or register a new brand partner.
          </p>
          <Link
            href="/dashboard/brands/create"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Brand</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile view: Mobile List */}
          <div className="block md:hidden">
            <BrandMobileList
              brands={brands}
              onDelete={handleDeleteRequest}
            />
          </div>

          {/* Desktop & Tablet view: Respects Card / Table toggle */}
          <div className="hidden md:block">
            {viewMode === "card" ? (
              <BrandCardGrid
                brands={brands}
                onDelete={handleDeleteRequest}
              />
            ) : (
              <BrandDesktopTable
                brands={brands}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                onDelete={handleDeleteRequest}
              />
            )}
          </div>

          {/* Pagination */}
          {brands.length > 0 && (
            <CategoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
