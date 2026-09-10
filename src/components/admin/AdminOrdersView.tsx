"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdminStore } from "@/stores";
import {
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  ChevronDown,
  X,
  CreditCard,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";

export function AdminOrdersView() {
  const { orders, updateOrderStatus, assignCourierTracking } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  // Tracking assignment form state in drawer
  const [courierNameInput, setCourierNameInput] = useState("");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.shippingAddress.name.toLowerCase().includes(query) ||
      order.shippingAddress.phone.includes(query) ||
      order.trackingNumber?.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 text-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
            Cancelled
          </span>
        );
      case "pending":
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
            <Clock className="h-3 w-3" />
            {status}
          </span>
        );
    }
  };

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

  return (
    <div className="space-y-6">
      {/* ── Header Strip ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Order Fulfillment & Shipping
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage customer deliveries, update courier tracking numbers, and process invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            Total Orders: <strong className="text-foreground">{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Order #, customer name, phone, or courier tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/70 bg-background pl-9 pr-4 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "processing", label: "Processing" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setStatusFilter(pill.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                statusFilter === pill.id
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total & Payment</th>
                <th className="py-3 px-4">Logistics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-black text-foreground">
                      #{order.orderNumber}
                      <p className="text-[10px] text-muted-foreground font-sans font-normal mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-foreground">
                        {order.shippingAddress.name}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {order.shippingAddress.phone}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-foreground">
                        {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                      </span>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {order.items[0]?.productName}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-foreground text-sm">
                        ৳{order.total.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                        {order.paymentMethod} •{" "}
                        <span
                          className={cn(
                            order.paymentStatus === "paid"
                              ? "text-emerald-600 font-bold"
                              : "text-amber-600 font-bold"
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground">
                        {order.courierName || "Not assigned"}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {order.trackingNumber || "Pending"}
                      </p>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInvoiceModalOrder(order)}
                          className="p-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                          title="Print invoice"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Detail Drawer Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-background p-6 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-between border-b border-border/60 pb-3 pr-8">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Change Status Stepper */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Update Order Status:
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newSt = e.target.value as OrderStatus;
                  updateOrderStatus(selectedOrder.id, newSt);
                  setSelectedOrder({ ...selectedOrder, status: newSt });
                }}
                className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-bold text-foreground focus:border-amber-500 focus:outline-none"
              >
                <option value="pending">Pending Verification</option>
                <option value="processing">Processing & QC Inspection</option>
                <option value="shipped">Handed to Courier (In Transit)</option>
                <option value="delivered">Delivered Successfully</option>
                <option value="cancelled">Cancelled & Refunded</option>
              </select>
            </div>

            {/* Courier Dispatch Assignment */}
            <form
              onSubmit={handleAssignTracking}
              className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-2.5"
            >
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-amber-500" />
                <span>Assign Bangladesh Courier Shipment</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Steadfast Courier / Pathao"
                  value={courierNameInput}
                  onChange={(e) => setCourierNameInput(e.target.value)}
                  className="h-9 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Tracking code (e.g. STE-99420)"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="h-9 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Save Courier & Dispatch Parcel
              </button>
            </form>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-border/60 rounded-2xl border border-border/60 p-3 bg-muted/10">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border/60 shrink-0">
                        <Image
                          src={item.productThumbnail}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className="text-[10px] text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      ৳{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Address */}
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                Shipping Destination:
              </span>
              <p className="font-semibold text-foreground">
                {selectedOrder.shippingAddress.name} ({selectedOrder.shippingAddress.phone})
              </p>
              <p className="text-muted-foreground">
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.area},{" "}
                {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          isOpen={Boolean(invoiceModalOrder)}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
}
