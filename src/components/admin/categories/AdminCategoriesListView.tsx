"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  FolderTree,
  X,
} from "lucide-react";
import { useAdminStore } from "@/stores";
import type { Category } from "@/types/ecommerce.types";
import { CategoryEditModal } from "./CategoryEditModal";
import { CategoryDesktopTable } from "./CategoryDesktopTable";
import { CategoryMobileList } from "./CategoryMobileList";
import { CategoryCardGrid } from "./CategoryCardGrid";
import { CategoryPagination } from "./CategoryPagination";
import {
  ProductConfirmDialog,
  type ConfirmationDialogState,
} from "@/components/admin/products/ProductConfirmDialog";

export interface AdminCategoriesListViewProps {
  onSwitchToCreate?: () => void;
}

export function AdminCategoriesListView({ onSwitchToCreate }: AdminCategoriesListViewProps = {}) {
  const { categories, deleteCategory, updateCategory } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured">("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Close three-dot action menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-action-menu]")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Edit Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    variant: "danger",
    onConfirm: () => {},
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const filteredCategories = categories.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFeatured = filterFeatured === "all" || c.featured;
    return matchSearch && matchFeatured;
  });

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterFeatured]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getNumericCategoryId = (id: string, index: number) => {
    // If id already has numbers (e.g. cat-172644..., cat-001, etc.)
    const matches = id.match(/\d+/g);
    if (matches && matches.length > 0) {
      const numStr = matches.join("");
      // If reasonable length, return numeric id, or last 4-6 digits
      return numStr.length > 6 ? numStr.slice(-5) : numStr;
    }
    // For string seed IDs like "cat-smartphones", create consistent deterministic 4-digit number
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return String(1000 + (hash % 9000));
  };

  const formatCategoryDate = (dateStr?: string) => {
    if (!dateStr) return "Sep 12, 2026"; // Consistent default for seed categories
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Sep 12, 2026";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Sep 12, 2026";
    }
  };

  const handleDeleteRequest = (category: Category) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Category?",
      message: `Are you sure you want to permanently delete "${category.name}" (/category/${category.slug})? Associated catalog hierarchies will be removed.`,
      confirmLabel: "Delete Category",
      variant: "danger",
      onConfirm: () => {
        deleteCategory(category.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast(`Category "${category.name}" removed successfully.`);
      },
    });
  };

  const handleSaveEdit = (id: string, updates: Partial<Category>) => {
    updateCategory(id, updates);
    showToast(`Category "${updates.name || "item"}" updated.`);
  };

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
              Catalog Management
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-medium">
              {categories.length} Categories Total
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
            Manage Categories
          </h1>
        </div>

        <Link
          href="/dashboard/create-category"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Category</span>
        </Link>
      </div>

      {/* Search Bar: Sticky Sub-Nav Layer under Header on Mobile, Toolbar on Tablet/Desktop */}
      <div className="sticky top-16 sm:static z-20 -mx-4 sm:mx-0 px-4 sm:px-0 -mt-6 sm:mt-0 py-3 sm:py-0 bg-background/95 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none border-b sm:border-0 border-border/80 shadow-xs sm:shadow-none transition-all">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input (Sub-Nav search bar on mobile) */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
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
                All ({categories.length})
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
                Featured ({categories.filter((c) => c.featured).length})
              </button>
            </div>

            {/* Table / Card View Toggle */}
            <div className="flex rounded-xl bg-muted/40 p-1 border border-border/60 text-xs">
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
                <span className="hidden sm:inline">Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-3xl border-none bg-card p-12 text-center space-y-3 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FolderTree className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-foreground">No categories found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or create a new category entry.
          </p>
          <Link
            href="/dashboard/create-category"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Category</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile view: Always Card View */}
          <div className="block sm:hidden">
            <CategoryCardGrid
              categories={paginatedCategories}
              getNumericId={getNumericCategoryId}
              formatDate={formatCategoryDate}
              onEdit={setEditingCategory}
              onDelete={handleDeleteRequest}
            />
          </div>

          {/* Desktop & Tablet view: Respects Table / Card toggle */}
          <div className="hidden sm:block">
            {viewMode === "table" ? (
              <CategoryDesktopTable
                categories={paginatedCategories}
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                getNumericId={getNumericCategoryId}
                formatDate={formatCategoryDate}
                onEdit={setEditingCategory}
                onDelete={handleDeleteRequest}
              />
            ) : (
              <CategoryCardGrid
                categories={paginatedCategories}
                getNumericId={getNumericCategoryId}
                formatDate={formatCategoryDate}
                onEdit={setEditingCategory}
                onDelete={handleDeleteRequest}
              />
            )}
          </div>

          {/* Shared Pagination Footer */}
          {filteredCategories.length > 0 && (
            <CategoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredCategories.length}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* Edit Category Modal */}
      <CategoryEditModal
        isOpen={Boolean(editingCategory)}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveEdit}
      />

      {/* Confirmation Dialog */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
