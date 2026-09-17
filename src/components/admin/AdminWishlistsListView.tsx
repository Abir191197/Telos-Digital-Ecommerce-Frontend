"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Search,
  X,
  Trash2,
  CheckSquare,
  Square,
  Users,
  CircleDollarSign,
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/common";
import { KpiCard } from "./dashboard/KpiCard";
import { ProductFloatingActionPill } from "./products/ProductFloatingActionPill";
import { ConfirmationModal, type ConfirmationDialogState } from "@/components/common/ConfirmationModal";
import {
  useGetAllWishlistsQuery,
  useDeleteAdminWishlistItemMutation,
  useBulkDeleteAdminWishlistItemsMutation,
  type BackendWishlistItem,
} from "@/services/api/wishlist/wishlistApi";

const ITEMS_PER_PAGE = 12;

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function AdminWishlistsListView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    variant: "primary",
    onConfirm: () => {},
  });

  const { data: wishlistResponse, isLoading, refetch } = useGetAllWishlistsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: searchQuery || undefined,
  });

  const [deleteWishlistMutation] = useDeleteAdminWishlistItemMutation();
  const [bulkDeleteMutation] = useBulkDeleteAdminWishlistItemsMutation();

  const wishlistItems: BackendWishlistItem[] = wishlistResponse?.data || [];
  const meta = wishlistResponse?.meta || { page: 1, limit: ITEMS_PER_PAGE, total: wishlistItems.length, totalPage: 1 };

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalItemsCount = wishlistItems.length;
    const uniqueCustomers = new Set(wishlistItems.map((it) => it.customerId)).size;
    const totalPotentialValue = wishlistItems.reduce((acc, it) => acc + (it.product?.price || 0), 0);
    const inStockItems = wishlistItems.filter((it) => (it.product?.stock || 0) > 0).length;
    const inStockRate = totalItemsCount > 0 ? Math.round((inStockItems / totalItemsCount) * 100) : 100;

    return {
      totalItemsCount,
      uniqueCustomers,
      totalPotentialValue,
      inStockRate,
    };
  }, [wishlistItems]);

  // Selection Logic
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === wishlistItems.length && wishlistItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(wishlistItems.map((it) => it.id));
    }
  };

  // Single Delete
  const requestDeleteItem = (item: BackendWishlistItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove from Customer Wishlist?",
      message: `Are you sure you want to delete "${item.product?.name || 'this item'}" from ${item.customer?.name || 'the customer'}'s wishlist?`,
      confirmLabel: "Delete Item",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteWishlistMutation(item.id).unwrap();
          showToast("Wishlist item removed successfully.");
          setSelectedIds((prev) => prev.filter((id) => id !== item.id));
          refetch();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to remove wishlist item.");
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Bulk Delete
  const requestBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Selected Wishlist Items?`,
      message: `Are you sure you want to remove ${selectedIds.length} items from customer wishlists?`,
      confirmLabel: `Delete ${selectedIds.length} Items`,
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await bulkDeleteMutation({ ids: selectedIds }).unwrap();
          showToast(`${res.data?.deletedCount ?? selectedIds.length} wishlist items deleted successfully.`);
          setSelectedIds([]);
          refetch();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to complete bulk deletion.");
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (isLoading && wishlistItems.length === 0) {
    return (
      <PageLoader
        title="Loading Customer Wishlists..."
        description="Fetching saved customer items, demand indicators, and interest signals."
        badgeText="Wishlist Catalog"
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500/20" />
            Customer Wishlists
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Monitor consumer purchase intent, saved products, and high-interest catalog items.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Wishlisted Items"
          rawValue={metrics.totalItemsCount}
          change="Demand entries"
          isPositive={true}
          icon={Heart}
        />
        <KpiCard
          title="Interested Shoppers"
          rawValue={metrics.uniqueCustomers}
          change="Unique customers"
          isPositive={true}
          icon={Users}
        />
        <KpiCard
          title="Potential Value"
          rawValue={metrics.totalPotentialValue}
          prefix="৳"
          change="Wishlist gross value"
          isPositive={true}
          icon={CircleDollarSign}
        />
        <KpiCard
          title="In-Stock Availability"
          rawValue={metrics.inStockRate}
          suffix="%"
          change="Ready to convert"
          isPositive={metrics.inStockRate >= 70}
          icon={Package}
        />
      </div>

      {/* Search & Filter Dock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customer, email, product, or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full pl-9 pr-9 text-xs rounded-xl bg-muted/40 border border-border/40 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-muted/50 p-1 border border-border/40">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "card"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table or Card Grid */}
      {viewMode === "table" ? (
        <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Select all"
                    >
                      {selectedIds.length > 0 && selectedIds.length === wishlistItems.length ? (
                        <CheckSquare className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Stock Status</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4">Date Saved</th>
                  <th className="py-3 px-4 text-right w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {wishlistItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-muted-foreground">
                      <Heart className="h-10 w-10 mx-auto mb-2 opacity-30 text-rose-500" />
                      <p className="font-semibold text-sm">No wishlist items found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {searchQuery ? "Try adjusting your search query" : "No products currently saved to wishlists"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  wishlistItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const stock = item.product?.stock ?? 0;
                    const inStock = stock > 0;

                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "transition-colors hover:bg-muted/40",
                          isSelected && "bg-amber-500/5"
                        )}
                      >
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(item.id)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-amber-500" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-500 font-bold flex items-center justify-center shrink-0 text-xs">
                              {item.customer?.name ? item.customer.name.slice(0, 2).toUpperCase() : "CU"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground truncate">{item.customer?.name || "Guest / Unnamed"}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{item.customer?.email || "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Product Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                              {item.product?.thumbnail ? (
                                <Image
                                  src={item.product.thumbnail}
                                  alt={item.product.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                  <Package className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground line-clamp-1">{item.product?.name || "Deleted Product"}</p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>SKU: {item.product?.sku || "—"}</span>
                                {item.product?.category && (
                                  <>
                                    <span>·</span>
                                    <span>{item.product.category.name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 text-right font-black text-foreground">
                          ৳{(item.product?.price || 0).toLocaleString()}
                        </td>

                        {/* Stock Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                              inStock
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {inStock ? `In Stock (${stock})` : "Out of Stock"}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{(item.product?.rating || 5).toFixed(1)}</span>
                          </div>
                        </td>

                        {/* Date Added */}
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => requestDeleteItem(item)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete this wishlist item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-3xl border border-border/60">
              <Heart className="h-10 w-10 mx-auto mb-2 opacity-30 text-rose-500" />
              <p className="font-semibold text-sm">No wishlist items found</p>
            </div>
          ) : (
            wishlistItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative p-4 rounded-3xl bg-card border border-border/60 shadow-xs flex flex-col justify-between gap-3 transition-all",
                    isSelected && "border-amber-500 ring-1 ring-amber-500/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(item.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mt-1"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
                        {item.product?.thumbnail ? (
                          <Image
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-foreground line-clamp-1">{item.product?.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">SKU: {item.product?.sku || "—"}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => requestDeleteItem(item)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Customer info */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/30 text-xs">
                    <p className="font-bold text-foreground text-[11px]">{item.customer?.name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.customer?.email || "—"}</p>
                  </div>

                  {/* Pricing and stock footer */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/30">
                    <span className="text-[10px] text-muted-foreground">
                      Stock: <span className="font-bold text-foreground">{item.product?.stock ?? 0}</span>
                    </span>
                    <div className="font-black text-foreground">
                      ৳{(item.product?.price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination Strip */}
      <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
        <p>
          Showing {wishlistItems.length} of {meta.total} wishlist items
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-border/60 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 font-semibold">
            {currentPage} / {meta.totalPage || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= (meta.totalPage || 1)}
            onClick={() => setCurrentPage((p) => Math.min(meta.totalPage || 1, p + 1))}
            className="p-2 rounded-xl border border-border/60 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Pill */}
      <ProductFloatingActionPill
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
        onDelete={requestBulkDelete}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
