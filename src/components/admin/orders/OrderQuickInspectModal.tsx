import React from "react";
import Image from "next/image";
import { X, Truck, MapPin } from "lucide-react";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderQuickInspectModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onAssignTracking: (e: React.FormEvent) => void;
  courierNameInput: string;
  setCourierNameInput: (name: string) => void;
  trackingNumberInput: string;
  setTrackingNumberInput: (code: string) => void;
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
}

export function OrderQuickInspectModal({
  order,
  onClose,
  onUpdateStatus,
  onAssignTracking,
  courierNameInput,
  setCourierNameInput,
  trackingNumberInput,
  setTrackingNumberInput,
  getStatusBadge,
}: OrderQuickInspectModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 shadow-2xl border-none space-y-5 relative animate-in slide-in-from-bottom-6 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-between border-b border-border/40 pb-3 pr-8">
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              Order #{order.orderNumber}
            </h3>
            <p className="text-xs text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Change Status Stepper */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Update Order Status:
          </label>
          <select
            value={order.status}
            onChange={(e) => {
              const newSt = e.target.value as OrderStatus;
              onUpdateStatus(order.id, newSt);
            }}
            className="h-10 w-full rounded-xl bg-muted/50 px-3 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="pending">Pending Verification</option>
            <option value="processing">Processing &amp; QC Inspection</option>
            <option value="shipped">Handed to Courier (In Transit)</option>
            <option value="delivered">Delivered Successfully</option>
            <option value="cancelled">Cancelled &amp; Refunded</option>
          </select>
        </div>

        {/* Courier Dispatch Assignment */}
        <form
          onSubmit={onAssignTracking}
          className="p-4 rounded-2xl bg-muted/30 space-y-2.5"
        >
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-amber-500" />
            <span>Assign Courier Shipment</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="e.g. Steadfast Courier / Pathao"
              value={courierNameInput}
              onChange={(e) => setCourierNameInput(e.target.value)}
              className="h-9 rounded-xl bg-background px-3 text-xs font-medium text-foreground focus:outline-none"
            />
            <input
              type="text"
              required
              placeholder="Tracking code (e.g. STE-99420)"
              value={trackingNumberInput}
              onChange={(e) => setTrackingNumberInput(e.target.value)}
              className="h-9 rounded-xl bg-background px-3 text-xs font-medium text-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-foreground text-background text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
          >
            Save Courier &amp; Dispatch Parcel
          </button>
        </form>

        {/* Items List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Order Items ({order.items.length})
          </h4>
          <div className="divide-y divide-border/40 rounded-2xl p-3 bg-muted/20">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
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
        <div className="p-3.5 rounded-2xl bg-muted/20 text-xs space-y-1">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            Shipping Destination:
          </span>
          <p className="font-semibold text-foreground">
            {order.shippingAddress.name} ({order.shippingAddress.phone})
          </p>
          <p className="text-muted-foreground">
            {order.shippingAddress.street}, {order.shippingAddress.area},{" "}
            {order.shippingAddress.city} - {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>
    </div>
  );
}
