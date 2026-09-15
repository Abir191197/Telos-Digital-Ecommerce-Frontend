import React from "react";
import Image from "next/image";
import { X, MapPin } from "lucide-react";
import { Order } from "@/types/order.types";

interface DispatchDetailsDrawerProps {
  order: Order | null;
  onClose: () => void;
}

export function DispatchDetailsDrawer({
  order,
  onClose,
}: DispatchDetailsDrawerProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.5)] border-none space-y-5 relative">
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
        </div>

        {/* Items */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Packing List Items ({order.items.length})
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

        {/* Destination */}
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
            {order.shippingAddress.city}
          </p>
        </div>
      </div>
    </div>
  );
}
