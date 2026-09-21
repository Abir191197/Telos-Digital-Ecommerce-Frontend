"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types/order.types";
import { useAdminStore } from "@/stores";
import {
  useGetAllOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useAssignCourierTrackingMutation,
} from "@/services/api/orders/orderApi";

export function useAdminOrdersManager() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  const { updateOrderStatus, assignCourierTracking } = useAdminStore();
  const { data: backendOrdersData, isLoading } = useGetAllOrdersQuery({
    searchTerm: searchQuery || undefined,
    status: statusFilter !== "all" ? (statusFilter.toUpperCase() as any) : undefined,
  });
  const { data: statsData } = useGetOrderStatsQuery();
  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();
  const [assignCourierTrackingMutation] = useAssignCourierTrackingMutation();

  const orders = backendOrdersData?.data ?? [];

  // Mobile Draggable Floating Filter State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [fabPosition, setFabPosition] = useState<{ x: number; y: number }>({
    x: 16,
    y: 90,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 16,
    posY: 90,
  });
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: fabPosition.x,
      posY: fabPosition.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = dragStartRef.current.startX - e.clientX;
    const deltaY = dragStartRef.current.startY - e.clientY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }
    const newX = Math.max(10, Math.min(window.innerWidth - 65, dragStartRef.current.posX + deltaX));
    const newY = Math.max(70, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY));
    setFabPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (!hasMovedRef.current) {
      setShowMobileFilters(true);
    }
  };

  useEffect(() => {
    const st = searchParams?.get("status");
    if (st) {
      setStatusFilter(st);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [courierNameInput, setCourierNameInput] = useState("");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");

  // KPI Calculations
  const metrics = useMemo(() => {
    const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
    const inTransitCount = orders.filter((o) => o.status === "shipped").length;
    const completedCount = orders.filter((o) => o.status === "delivered").length;
    return { totalVolume, pendingCount, inTransitCount, completedCount };
  }, [orders]);

  const orderCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: metrics.inTransitCount,
    delivered: metrics.completedCount,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }), [orders, metrics]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.shippingAddress.name.toLowerCase().includes(query) ||
        order.shippingAddress.phone.includes(query) ||
        order.shippingAddress.city.toLowerCase().includes(query) ||
        order.trackingNumber?.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredOrders, currentPage, pageSize]);

  const handleAssignTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !courierNameInput || !trackingNumberInput) return;
    assignCourierTracking(
      selectedOrder.id,
      courierNameInput,
      trackingNumberInput
    );
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            status: "shipped",
            courierName: courierNameInput,
            trackingNumber: trackingNumberInput,
          }
        : null
    );
    setCourierNameInput("");
    setTrackingNumberInput("");
  };

  return {
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
  };
}
