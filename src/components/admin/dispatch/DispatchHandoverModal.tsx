import React from "react";
import { Truck, CheckSquare } from "lucide-react";
import { Order } from "@/types/order.types";

interface DispatchHandoverModalProps {
  order: Order | null;
  onClose: () => void;
  onConfirm: (order: Order) => void;
}

export function DispatchHandoverModal({
  order,
  onClose,
  onConfirm,
}: DispatchHandoverModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 shadow-2xl border-none space-y-4 relative text-center animate-in slide-in-from-bottom-6 duration-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
          <Truck className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-foreground">
            Confirm Handover to Rider?
          </h3>
          <p className="text-xs text-muted-foreground">
            Order <strong className="font-mono text-foreground">#{order.orderNumber}</strong> will move from Pending to <strong className="text-blue-500">In Transit</strong>. Customer will receive shipment notification.
          </p>
        </div>

        <div className="rounded-2xl bg-muted/40 p-3 text-left text-xs space-y-1">
          <p className="text-muted-foreground">
            Courier: <strong className="text-foreground">{order.courierName || "Standard"}</strong>
          </p>
          <p className="text-muted-foreground font-mono">
            Tracking: <strong className="text-foreground">{order.trackingNumber || "Assigned"}</strong>
          </p>
          <p className="text-muted-foreground">
            Customer: <strong className="text-foreground">{order.shippingAddress.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(order)}
            className="flex-1 py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 text-xs font-bold shadow-xs transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Yes, Hand Over</span>
          </button>
        </div>
      </div>
    </div>
  );
}
