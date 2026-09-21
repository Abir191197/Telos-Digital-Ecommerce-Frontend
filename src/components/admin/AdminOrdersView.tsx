"use client";

import React from "react";
import { Search, X, Box } from "lucide-react";
import { InvoiceModal } from "@/components/account";
import {
  OrderCardItem,
  OrderDesktopTable,
  OrderFilterDock,
  OrderQuickInspectModal,
  OrderMobileFilterModal,
  OrderFloatingFilterFab,
  AdminOrdersSkeleton,
  OrdersKpiGrid,
  OrdersHeader,
  OrdersPaginationBar,
  getOrderStatusBadge,
  useAdminOrdersManager,
} from "./orders";

export function AdminOrdersView() {
  const {
    orders,
    isLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedOrder,
    setSelectedOrder,
    invoiceModalOrder,
    setInvoiceModalOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    metrics,
    orderCounts,
    filteredOrders,
    paginatedOrders,
    showMobileFilters,
    setShowMobileFilters,
    fabPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    courierNameInput,
    setCourierNameInput,
    trackingNumberInput,
    setTrackingNumberInput,
    handleAssignTracking,
    updateOrderStatus,
  } = useAdminOrdersManager();

  if (isLoading && orders.length === 0) {
    return <AdminOrdersSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6 min-h-[calc(100dvh-4rem)]">
      {/* ── Mobile Dedicated Top Search Bar ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order #, customer, phone, city..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60 border border-border/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Header Strip ── */}
      <OrdersHeader
        statusFilter={statusFilter}
        totalFiltered={filteredOrders.length}
      />

      {/* ── 4 Essential Orders KPI Cards ── */}
      <OrdersKpiGrid metrics={metrics} />

      {/* ── Status Pills & Desktop Search Controls Dock ── */}
      <OrderFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        orderCounts={orderCounts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── View Mode: Cards or Table ── */}
      <div
        className={
          viewMode === "table"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[70vh] sm:min-h-[440px] sm:hidden"
            : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[70vh] sm:min-h-[440px]"
        }
      >
        {filteredOrders.length === 0 ? (
          <div className="col-span-full admin-card rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[380px]">
            <Box className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-bold text-foreground text-sm">No orders found</p>
            <p className="text-xs mt-0.5">Try clearing your filters or search query.</p>
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <OrderCardItem
              key={order.id}
              order={order}
              getStatusBadge={getOrderStatusBadge}
              onPrintInvoice={setInvoiceModalOrder}
              onQuickInspect={setSelectedOrder}
            />
          ))
        )}

        {/* Integrated Pagination Footer for Card View */}
        <OrdersPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          className="col-span-full admin-card border-none"
        />
      </div>

      {/* ── Table View: Full Desktop Table ── */}
      {viewMode === "table" && (
        <OrderDesktopTable
          orders={paginatedOrders}
          getStatusBadge={getOrderStatusBadge}
          onPrintInvoice={setInvoiceModalOrder}
        />
      )}

      {/* Desktop Table Integrated Pagination Footer */}
      {viewMode === "table" && (
        <OrdersPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          className="hidden sm:flex mt-auto border border-border/20"
        />
      )}

      {/* ── Order Detail Quick Drawer Modal ── */}
      <OrderQuickInspectModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status) => {
          updateOrderStatus(id, status);
          setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
        }}
        onAssignTracking={handleAssignTracking}
        courierNameInput={courierNameInput}
        setCourierNameInput={setCourierNameInput}
        trackingNumberInput={trackingNumberInput}
        setTrackingNumberInput={setTrackingNumberInput}
        getStatusBadge={getOrderStatusBadge}
      />

      {/* ── Mobile Floating Filter Button ── */}
      <OrderFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={statusFilter !== "all"}
      />

      {/* ── Mobile Fullscreen Filter Modal ── */}
      <OrderMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        orders={orders}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Invoice Modal ── */}
      {invoiceModalOrder && (
        <InvoiceModal
          isOpen={Boolean(invoiceModalOrder)}
          order={invoiceModalOrder}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
}
