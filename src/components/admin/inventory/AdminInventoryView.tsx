"use client";

import React from "react";
import { CheckCircle2, Package } from "lucide-react";
import {
  InventoryDesktopTable,
  InventoryCardItem,
  InventoryFilterDock,
  ManageStockModal,
  AdminInventorySkeleton,
} from "./";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryKpiGrid } from "./InventoryKpiGrid";
import { InventoryPagination } from "./InventoryPagination";
import { useAdminInventory } from "./useAdminInventory";

export function AdminInventoryView() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    stockFilter,
    setStockFilter,
    customThreshold,
    setCustomThreshold,
    sortBy,
    setSortBy,
    selectedIds,
    toastMessage,
    managingProduct,
    isManageModalOpen,
    setIsManageModalOpen,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isProductsLoading,
    isFetching,
    products,
    backendTotal,
    totalPages,
    totalCount,
    inStockCount,
    criticalLowCount,
    reserveLowCount,
    outOfStockCount,
    handleToggleSelect,
    handleSelectAll,
    handleOpenManageStock,
    handleRefresh,
    handleExportCSV,
    showToast,
    refetchProducts,
    refetchSummary,
  } = useAdminInventory();

  if (isProductsLoading && products.length === 0) {
    return <AdminInventorySkeleton />;
  }

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Top Header Banner */}
      <InventoryHeader
        isFetching={isFetching}
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
      />

      {/* Database-Wide KPI Metrics Cards */}
      <InventoryKpiGrid
        totalCount={totalCount}
        inStockCount={inStockCount}
        criticalLowCount={criticalLowCount}
        reserveLowCount={reserveLowCount}
        outOfStockCount={outOfStockCount}
      />

      {/* Filter Dock */}
      <InventoryFilterDock
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        stockFilter={stockFilter}
        setStockFilter={(val) => {
          setStockFilter(val);
          setCurrentPage(1);
        }}
        customThreshold={customThreshold}
        setCustomThreshold={(val) => {
          setCustomThreshold(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={(val) => {
          setSortBy(val);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalFilteredCount={backendTotal}
      />

      {/* Desktop Table View */}
      {viewMode === "table" ? (
        <div className="space-y-4">
          <InventoryDesktopTable
            products={products}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onManageStock={handleOpenManageStock}
          />

          {/* Mobile fallback when in table mode */}
          <div className="md:hidden space-y-3">
            {products.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="font-bold text-sm text-foreground">No stock records found</p>
              </div>
            ) : (
              products.map((p) => (
                <InventoryCardItem
                  key={p.id}
                  product={p}
                  isSelected={selectedIds.includes(p.id)}
                  onToggleSelect={handleToggleSelect}
                  onManageStock={handleOpenManageStock}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-bold text-sm text-foreground">No stock records found</p>
            </div>
          ) : (
            products.map((p) => (
              <InventoryCardItem
                key={p.id}
                product={p}
                isSelected={selectedIds.includes(p.id)}
                onToggleSelect={handleToggleSelect}
                onManageStock={handleOpenManageStock}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination Footer */}
      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={backendTotal}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Manage Stock Modal */}
      <ManageStockModal
        product={managingProduct}
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onStockUpdated={(msg) => {
          showToast(msg);
          refetchProducts();
          refetchSummary();
        }}
      />
    </div>
  );
}
