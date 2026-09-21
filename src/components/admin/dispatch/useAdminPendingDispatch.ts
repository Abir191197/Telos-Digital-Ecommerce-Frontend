"use client";

import { useState, useMemo, useRef } from "react";
import { Order } from "@/types/order.types";
import { useAdminStore } from "@/stores";
import { useGetAllOrdersQuery } from "@/services/api/orders/orderApi";

export function useAdminPendingDispatch() {
  const { updateOrderStatus, assignCourierTracking } = useAdminStore();
  const { data: backendOrdersData, isLoading } = useGetAllOrdersQuery();

  const orders = backendOrdersData?.data ?? [];

  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [courierFilter, setCourierFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Courier Assign Modal State
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState("Steadfast Courier");
  const [trackingCode, setTrackingCode] = useState("");

  // Handover Warning Confirmation Modal State
  const [handoverWarningOrder, setHandoverWarningOrder] = useState<Order | null>(null);

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

  // All pending & processing orders
  const pendingQueue = useMemo(
    () => orders.filter((o) => o.status === "pending" || o.status === "processing"),
    [orders]
  );

  // Logistics KPI Computations
  const metrics = useMemo(() => {
    const awaitingPackingCount = pendingQueue.filter((o) => o.status === "pending").length;
    const qcReadyCount = pendingQueue.filter((o) => o.status === "processing").length;
    const unassignedCourierCount = pendingQueue.filter((o) => !o.courierName || !o.trackingNumber).length;
    const urgentCount = pendingQueue.filter((o) => {
      const ageHours = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60);
      return ageHours > 12;
    }).length;
    return {
      awaitingPackingCount,
      qcReadyCount,
      unassignedCourierCount,
      urgentCount,
    };
  }, [pendingQueue]);

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return pendingQueue.filter((order) => {
      if (zoneFilter === "inside-dhaka" && order.shippingAddress.zone !== "inside-dhaka") return false;
      if (zoneFilter === "outside-dhaka" && order.shippingAddress.zone !== "outside-dhaka") return false;

      if (courierFilter === "unassigned" && order.courierName) return false;
      if (courierFilter === "assigned" && !order.courierName) return false;
      if (courierFilter === "steadfast" && !order.courierName?.toLowerCase().includes("steadfast")) return false;
      if (courierFilter === "pathao" && !order.courierName?.toLowerCase().includes("pathao")) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.shippingAddress.name.toLowerCase().includes(q) ||
        order.shippingAddress.phone.includes(q) ||
        order.shippingAddress.city.toLowerCase().includes(q) ||
        order.trackingNumber?.toLowerCase().includes(q)
      );
    });
  }, [pendingQueue, zoneFilter, courierFilter, searchQuery]);

  const totalPages = Math.ceil(filteredQueue.length / pageSize) || 1;
  const paginatedQueue = useMemo(() => {
    return filteredQueue.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredQueue, currentPage, pageSize]);

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder || !courierName || !trackingCode) return;

    assignCourierTracking(dispatchingOrder.id, courierName, trackingCode);
    updateOrderStatus(dispatchingOrder.id, "shipped");

    setDispatchingOrder(null);
    setCourierName("Steadfast Courier");
    setTrackingCode("");
  };

  const handleOpenDispatchModal = (order: Order) => {
    setDispatchingOrder(order);
    setTrackingCode(`STE-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return {
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
  };
}
