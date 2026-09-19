import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Send, CheckSquare, Printer, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";

interface DispatchDesktopTableProps {
  orders: Order[];
  onDispatchCourier: (order: Order) => void;
  onHandoverRider: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onInspect: (order: Order) => void;
}

export function DispatchDesktopTable({
  orders,
  onDispatchCourier,
  onHandoverRider,
  onPrintInvoice,
  onInspect,
}: DispatchDesktopTableProps) {
  return (
    <div className="hidden sm:flex admin-card rounded-2xl bg-card border-none overflow-hidden flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-4">Order &amp; Time</th>
              <th className="py-3 px-4">Customer &amp; Phone</th>
              <th className="py-3 px-4">Zone &amp; Destination</th>
              <th className="py-3 px-4">Packing Items</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Logistics Status</th>
              <th className="py-3 px-4 text-right">Dispatch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No pending dispatch orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isUnassigned = !order.trackingNumber || !order.courierName;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Order & Time */}
                    <td className="py-3.5 px-4 font-medium">
                      <span className="font-mono font-black text-foreground">
                        #{order.orderNumber}
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>

                    {/* Customer & Phone */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground">{order.shippingAddress.name}</p>
                      <a
                        href={`tel:${order.shippingAddress.phone}`}
                        className="font-mono text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        {order.shippingAddress.phone}
                      </a>
                    </td>

                    {/* Zone & Destination */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase mb-0.5",
                          order.shippingAddress.zone === "inside-dhaka"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {order.shippingAddress.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                      </span>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[140px]" title={order.shippingAddress.street}>
                        {order.shippingAddress.city} • {order.shippingAddress.street}
                      </p>
                    </td>

                    {/* Packing Items with Thumbnails */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="relative h-7 w-7 rounded-md overflow-hidden bg-muted shrink-0"
                            title={`${item.productName} (x${item.quantity})`}
                          >
                            <Image
                              src={item.productThumbnail}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        <span className="text-[11px] font-bold text-foreground">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-foreground">
                        ৳{order.total.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">
                        {order.paymentMethod}
                      </p>
                    </td>

                    {/* Logistics Status */}
                    <td className="py-3.5 px-4">
                      {order.courierName ? (
                        <div>
                          <span className="font-bold text-foreground text-[11px]">{order.courierName}</span>
                          <p className="font-mono text-[10px] text-muted-foreground">{order.trackingNumber}</p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                          <AlertCircle className="h-3 w-3" />
                          Needs Courier
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isUnassigned ? (
                          <button
                            type="button"
                            onClick={() => onDispatchCourier(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>Dispatch</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onHandoverRider(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-foreground text-background font-bold text-xs shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                          >
                            <CheckSquare className="h-3.5 w-3.5" />
                            <span>Hand Over</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onPrintInvoice(order)}
                          className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                          title="Print Dispatch Label"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onInspect(order)}
                          className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
