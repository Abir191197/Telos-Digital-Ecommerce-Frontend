"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";
import { CustomerKpiStrip } from "./CustomerKpiStrip";
import { CustomerFilterDock } from "./CustomerFilterDock";
import { CustomerDesktopTable } from "./CustomerDesktopTable";
import { CustomerCardGrid } from "./CustomerCardGrid";
import { CustomerDetailModal } from "./CustomerDetailModal";
import { AdminCustomersSkeleton } from "./AdminCustomersSkeleton";
import {
  ProductConfirmDialog,
  type ConfirmationDialogState,
} from "@/components/admin/products/ProductConfirmDialog";
import {
  useGetAdminCustomersQuery,
  useGetAdminCustomersSummaryQuery,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
  type BackendCustomer,
  type CustomerStatus,
  type AdminCustomersQueryParams,
} from "@/services/api/customers/customerApi";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function AdminCustomersView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Active menu and active detail modal
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<BackendCustomer | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Build query params for backend API
  const queryParams: AdminCustomersQueryParams = useMemo(() => {
    const params: AdminCustomersQueryParams = {
      page: currentPage,
      limit: PAGE_SIZE,
      searchTerm: debouncedSearch.trim() || undefined,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter.toUpperCase();
    }

    const [field, order] = sortBy.split("-");
    if (field) params.sortBy = field;
    if (order === "asc" || order === "desc") params.sortOrder = order;

    return params;
  }, [currentPage, debouncedSearch, statusFilter, sortBy]);

  // RTK Query hooks
  const {
    data: customersData,
    isLoading: isCustomersLoading,
    isFetching: isCustomersFetching,
  } = useGetAdminCustomersQuery(queryParams);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
  } = useGetAdminCustomersSummaryQuery();

  const [updateCustomerStatus] = useUpdateCustomerStatusMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "danger",
    onConfirm: () => {},
  });

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: CustomerStatus) => {
    try {
      await updateCustomerStatus({ id, status: newStatus }).unwrap();
      showToast(`Customer status updated to ${newStatus} successfully.`, "success");
      if (viewingCustomer && viewingCustomer.id === id) {
        setViewingCustomer((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update customer status.", "error");
    }
  };

  // Handle delete request with confirmation
  const handleRequestDelete = (customer: BackendCustomer) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Customer Account?",
      message: `Are you sure you want to deactivate and remove account "${customer.name}" (${customer.customerId})? This will softly delete the account while maintaining order history.`,
      confirmLabel: "Yes, Delete Customer",
      cancelLabel: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteCustomer(customer.id).unwrap();
          showToast(`Account ${customer.name} was successfully removed.`, "success");
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to delete customer.", "error");
        }
      },
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSortBy("createdAt-desc");
    setCurrentPage(1);
  };

  const customersList = customersData?.data || [];
  const meta = customersData?.meta || { page: 1, limit: PAGE_SIZE, total: 0, totalPage: 1 };

  if (isCustomersLoading && customersList.length === 0) {
    return <AdminCustomersSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl text-xs font-bold animate-in slide-in-from-top-3 backdrop-blur-md",
            toastMessage.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300"
          )}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-500" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Customer Directory & Accounts
            </h1>
            {isCustomersFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit registered accounts, customer addresses, storefront activity, and account status controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-3.5 py-1.5 rounded-2xl border border-border/60">
            {meta.total} Registered Accounts
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <CustomerKpiStrip summary={summaryData} isLoading={isSummaryLoading} />

      {/* Search & Filter Dock */}
      <CustomerFilterDock
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={(s: string) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={meta.total}
        onReset={handleResetFilters}
      />

      {/* Customers Data: Desktop Table or Card Grid */}
      {isCustomersLoading ? (
        <div className="rounded-3xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs font-semibold">Loading registered customers from database...</p>
        </div>
      ) : viewMode === "table" ? (
        <CustomerDesktopTable
          customers={customersList}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onViewProfile={(c: BackendCustomer) => setViewingCustomer(c)}
          onStatusChange={handleStatusChange}
          onRequestDelete={handleRequestDelete}
        />
      ) : (
        <CustomerCardGrid
          customers={customersList}
          onViewProfile={(c: BackendCustomer) => setViewingCustomer(c)}
          onStatusChange={handleStatusChange}
          onRequestDelete={handleRequestDelete}
        />
      )}

      {/* Mobile Card Fallback when in table mode on small screens */}
      {viewMode === "table" && !isCustomersLoading && (
        <div className="block md:hidden">
          <CustomerCardGrid
            customers={customersList}
            onViewProfile={(c: BackendCustomer) => setViewingCustomer(c)}
            onStatusChange={handleStatusChange}
            onRequestDelete={handleRequestDelete}
          />
        </div>
      )}

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <CategoryPagination
          currentPage={meta.page}
          totalPages={meta.totalPage}
          pageSize={meta.limit}
          totalItems={meta.total}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Customer Profile Detail Modal */}
      <CustomerDetailModal
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        onStatusChange={handleStatusChange}
        onRequestDelete={handleRequestDelete}
      />

      {/* Deletion / Confirmation Dialog */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
