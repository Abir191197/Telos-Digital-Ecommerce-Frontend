"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Order, OrderListItem } from "@/types/order.types";
import {
  useGetAllOrdersQuery,
  useLazyGetOrderByIdQuery,
} from "@/services/api/orders/orderApi";

export function useAdminOrdersManager() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [isPreparingInvoice, setIsPreparingInvoice] = useState(false);
  const { data: backendOrdersData, isLoading } = useGetAllOrdersQuery({
    searchTerm: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
    source: sourceFilter !== "all" ? (sourceFilter as any) : undefined,
  });
  const orders = backendOrdersData?.data ?? [];
  const [getOrderById] = useLazyGetOrderByIdQuery();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [fabPosition, setFabPosition] = useState({ x: 16, y: 90 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, posX: 16, posY: 90 });
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = { startX: e.clientX, startY: e.clientY, posX: fabPosition.x, posY: fabPosition.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = dragStartRef.current.startX - e.clientX;
    const deltaY = dragStartRef.current.startY - e.clientY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) hasMovedRef.current = true;
    setFabPosition({
      x: Math.max(10, Math.min(window.innerWidth - 65, dragStartRef.current.posX + deltaX)),
      y: Math.max(70, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY)),
    });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    if (!hasMovedRef.current) setShowMobileFilters(true);
  };

  useEffect(() => {
    const status = searchParams?.get("status");
    if (status) {
      setStatusFilter(status);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const metrics = useMemo(() => ({
    totalVolume: orders.reduce((sum, order) => sum + order.total, 0),
    pendingCount: orders.filter((order) => order.status === "pending" || order.status === "processing").length,
    inTransitCount: orders.filter((order) => order.status === "shipped").length,
    completedCount: orders.filter((order) => order.status === "delivered").length,
  }), [orders]);
  const orderCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    processing: orders.filter((order) => order.status === "processing").length,
    shipped: metrics.inTransitCount,
    delivered: metrics.completedCount,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
  }), [orders, metrics]);
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSource = sourceFilter === "all" || order.source === sourceFilter;
    return (statusFilter === "all" || order.status === statusFilter) && matchesSource && (!query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.shippingAddress.name.toLowerCase().includes(query) ||
      order.shippingAddress.phone.includes(query) ||
      order.shippingAddress.city.toLowerCase().includes(query) ||
      order.trackingNumber?.toLowerCase().includes(query));
  }), [orders, statusFilter, sourceFilter, searchQuery]);
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize), [filteredOrders, currentPage]);

  const handlePrintInvoice = async (order: OrderListItem) => {
    setIsPreparingInvoice(true);
    try {
      const response = await getOrderById(order.orderNumber).unwrap();
      setInvoiceModalOrder(response.data);
    } finally {
      setIsPreparingInvoice(false);
    }
  };

  return {
    orders, isLoading, viewMode, setViewMode, searchQuery, setSearchQuery,
    statusFilter, setStatusFilter, invoiceModalOrder, setInvoiceModalOrder,
    isPreparingInvoice, handlePrintInvoice, currentPage, setCurrentPage, pageSize,
    totalPages, metrics, orderCounts, filteredOrders, paginatedOrders,
    showMobileFilters, setShowMobileFilters, fabPosition, handlePointerDown,
    handlePointerMove, handlePointerUp,
  };
}
