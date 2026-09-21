"use client";

import React from "react";
import { Search, X, Box } from "lucide-react";
import { InvoiceModal } from "@/components/account";
import { AdminOrdersSkeleton, OrdersPaginationBar } from "./orders";
import {
  DispatchCardItem,
  DispatchDesktopTable,
  DispatchCourierModal,
  DispatchHandoverModal,
  DispatchDetailsDrawer,
  DispatchMobileFilterModal,
  DispatchFloatingFilterFab,
  DispatchFilterDock,
  DispatchKpiGrid,
  DispatchHeader,
  useAdminPendingDispatch,
} from "./dispatch";

export function AdminPendingDispatchView() {
  const {
    orders,
    isLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    courierFilter,
    setCourierFilter,
    zoneFilter,
    setZoneFilter,
    selectedOrder,
    setSelectedOrder,
    invoiceModalOrder,
    setInvoiceModalOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    dispatchingOrder,
    setDispatchingOrder,
    courierName,
    setCourierName,
    trackingCode,
    setTrackingCode,
    handoverWarningOrder,
    setHandoverWarningOrder,
    showMobileFilters,
    setShowMobileFilters,
    fabPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    pendingQueue,
    metrics,
    filteredQueue,
    totalPages,
    paginatedQueue,
    handleDispatchSubmit,
    handleOpenDispatchModal,
    updateOrderStatus,
  } = useAdminPendingDispatch();

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
            placeholder="Search order #, customer name, phone, city..."
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
      <DispatchHeader queueCount={pendingQueue.length} />

      {/* ── 4 Dedicated Logistics & Dispatch KPIs ── */}
      <DispatchKpiGrid metrics={metrics} />

      {/* ── Sticky Dispatch Filter & Search Dock ── */}
      <DispatchFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        courierFilter={courierFilter}
        setCourierFilter={setCourierFilter}
        zoneFilter={zoneFilter}
        setZoneFilter={setZoneFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Queue Content: Cards View (Default Mobile, Optional Desktop) ── */}
      <div
        className={
          viewMode === "table"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[60vh] sm:hidden"
            : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[60vh]"
        }
      >
        {filteredQueue.length === 0 ? (
          <div className="col-span-full admin-card rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[40vh]">
            <Box className="h-10 w-10 mx-auto mb-2 opacity-40 text-amber-500" />
            <p className="font-bold text-foreground text-sm">No pending dispatches found</p>
            <p className="text-xs mt-0.5">All customer orders have been handed over to riders or match no active filter.</p>
          </div>
        ) : (
          paginatedQueue.map((order) => (
            <DispatchCardItem
              key={order.id}
              order={order}
              onInspect={setSelectedOrder}
              onDispatchCourier={handleOpenDispatchModal}
              onHandoverRider={setHandoverWarningOrder}
              onPrintInvoice={setInvoiceModalOrder}
            />
          ))
        )}

        {/* Integrated Pagination Footer for Card View */}
        <OrdersPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredQueue.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          className="col-span-full admin-card border-none"
        />
      </div>

      {/* ── Queue Content: Desktop Table View ── */}
      {viewMode === "table" && (
        <DispatchDesktopTable
          orders={paginatedQueue}
          onInspect={setSelectedOrder}
          onDispatchCourier={handleOpenDispatchModal}
          onHandoverRider={setHandoverWarningOrder}
          onPrintInvoice={setInvoiceModalOrder}
        />
      )}

      {/* Desktop Table Pagination Footer */}
      {viewMode === "table" && (
        <OrdersPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredQueue.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          className="hidden sm:flex mt-auto border border-border/20"
        />
      )}

      {/* ── Courier Tracking Assignment Modal ── */}
      <DispatchCourierModal
        order={dispatchingOrder}
        courierName={courierName}
        setCourierName={setCourierName}
        trackingCode={trackingCode}
        setTrackingCode={setTrackingCode}
        onSubmit={handleDispatchSubmit}
        onClose={() => setDispatchingOrder(null)}
      />

      {/* ── Handover Confirmation Alert Modal ── */}
      <DispatchHandoverModal
        order={handoverWarningOrder}
        onConfirm={() => {
          if (!handoverWarningOrder) return;
          updateOrderStatus(handoverWarningOrder.id, "shipped");
          setHandoverWarningOrder(null);
        }}
        onClose={() => setHandoverWarningOrder(null)}
      />

      {/* ── Order Inspection & Manifest Quick Drawer ── */}
      <DispatchDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* ── Mobile Floating Filter Button ── */}
      <DispatchFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={courierFilter !== "all" || zoneFilter !== "all"}
      />

      {/* ── Mobile Fullscreen Dispatch Filters Modal ── */}
      <DispatchMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        courierFilter={courierFilter}
        setCourierFilter={setCourierFilter}
        zoneFilter={zoneFilter}
        setZoneFilter={setZoneFilter}
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
