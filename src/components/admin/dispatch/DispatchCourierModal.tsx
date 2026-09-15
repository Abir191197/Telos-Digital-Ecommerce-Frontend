import React from "react";
import { Truck, Send, X } from "lucide-react";
import { Order } from "@/types/order.types";

interface DispatchCourierModalProps {
  order: Order | null;
  courierName: string;
  setCourierName: (name: string) => void;
  trackingCode: string;
  setTrackingCode: (code: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DispatchCourierModal({
  order,
  courierName,
  setCourierName,
  trackingCode,
  setTrackingCode,
  onClose,
  onSubmit,
}: DispatchCourierModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 shadow-2xl border-none space-y-4 relative animate-in slide-in-from-bottom-6 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">
              Dispatch #{order.orderNumber}
            </h3>
            <p className="text-xs text-muted-foreground">
              Assign Bangladesh courier tracking code
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Courier Partner
            </label>
            <select
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="h-10 w-full rounded-xl bg-muted/40 px-3 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="Steadfast Courier">Steadfast Courier (API Integrated)</option>
              <option value="Pathao Courier">Pathao Courier (Express)</option>
              <option value="RedX Logistics">RedX Logistics</option>
              <option value="eCourier">eCourier Bangladesh</option>
              <option value="Paperfly">Paperfly Home Delivery</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Tracking Code / Consignment ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. STE-94821"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="h-10 w-full rounded-xl bg-muted/40 px-3 text-xs font-mono font-bold text-foreground focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-muted/30 text-xs space-y-1">
            <p className="text-muted-foreground font-medium">
              Destination: <strong className="text-foreground">{order.shippingAddress.street}, {order.shippingAddress.city}</strong>
            </p>
            <p className="text-muted-foreground font-medium">
              Customer Phone: <strong className="text-foreground font-mono">{order.shippingAddress.phone}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-muted/60 text-foreground text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Confirm Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
