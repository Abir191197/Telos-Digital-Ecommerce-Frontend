"use client";

import React from "react";
import { CheckCircle2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProductConfirmDialog,
  ProductManageModal,
  ProductMobileFilterModal,
  ProductFloatingFilterFab,
  ProductFloatingActionPill,
  ProductDesktopTable,
  ProductCardItem,
  ProductFilterDock,
  AdminProductsSkeleton,
  ProductsKpiGrid,
  ProductsHeaderBanner,
  ProductsMobileSearchBar,
  ProductsPagination,
  useAdminProductsManager,
} from "./products";

export function AdminProductsView() {
  const {
    products,
    isProductsLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockStatusFilter,
    setStockStatusFilter,
    sortBy,
    setSortBy,
    selectedIds,
    setSelectedIds,
    activeMenuId,
    setActiveMenuId,
    openDropdown,
    setOpenDropdown,
    confirmDialog,
    setConfirmDialog,
    toastMessage,
    currentPage,
    setCurrentPage,
    totalPages,
    metrics,
    categories,
    filteredProducts,
    paginatedProducts,
    managingProduct,
    setManagingProduct,
    showMobileFilters,
    setShowMobileFilters,
    fabPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleToggleSelect,
    handleSelectAll,
    requestDeleteProduct,
    requestBulkDelete,
    handleOpenEdit,
  } = useAdminProductsManager();

  if (isProductsLoading && products.length === 0) {
    return <AdminProductsSkeleton />;
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

      {/* Mobile Dedicated Search Bar & Add Action */}
      <ProductsMobileSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* Top Header Banner */}
      <ProductsHeaderBanner />

      {/* 4 Essential KPI Cards */}
      <ProductsKpiGrid metrics={metrics} />

      {/* Desktop Filter, Search & View Toggle Dock */}
      <ProductFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        stockStatusFilter={stockStatusFilter}
        setStockStatusFilter={setStockStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* Products Content: Grid View */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4",
          viewMode === "table" && "md:hidden"
        )}
      >
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-bold text-sm text-foreground">No products found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          paginatedProducts.map((prod) => (
            <ProductCardItem
              key={prod.id}
              product={prod}
              isSelected={selectedIds.includes(prod.id)}
              isMenuOpen={activeMenuId === prod.id}
              onToggleSelect={handleToggleSelect}
              onToggleMenu={(id) => setActiveMenuId(activeMenuId === id ? null : id)}
              onOpenEdit={handleOpenEdit}
              onRequestDelete={requestDeleteProduct}
              onManageMobile={setManagingProduct}
            />
          ))
        )}
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <ProductDesktopTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onOpenEdit={handleOpenEdit}
          onRequestDelete={requestDeleteProduct}
        />
      )}

      {/* Pagination */}
      <ProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalFiltered={filteredProducts.length}
        paginatedCount={paginatedProducts.length}
        viewMode={viewMode}
        onPageChange={setCurrentPage}
      />

      {/* Confirmation Modal */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev: any) => ({ ...prev, isOpen: false }))}
      />

      {/* Mobile Product Management Sheet/Modal */}
      <ProductManageModal
        product={managingProduct}
        onClose={() => setManagingProduct(null)}
        onEdit={handleOpenEdit}
        onDelete={requestDeleteProduct}
      />

      {/* Mobile Floating Bulk Action Pill */}
      <ProductFloatingActionPill
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
        onDelete={requestBulkDelete}
      />

      {/* Mobile Draggable Floating Filter Button */}
      <ProductFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={categoryFilter !== "all" || stockStatusFilter !== "all" || sortBy !== "name"}
      />

      {/* Mobile Fullscreen Filters Modal */}
      <ProductMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={(cat) => {
          setCategoryFilter(cat);
          setCurrentPage(1);
        }}
        stockStatusFilter={stockStatusFilter}
        setStockStatusFilter={(status) => {
          setStockStatusFilter(status);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={filteredProducts.length}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onReset={() => {
          setCategoryFilter("all");
          setStockStatusFilter("all");
          setSortBy("name");
        }}
      />
    </div>
  );
}
