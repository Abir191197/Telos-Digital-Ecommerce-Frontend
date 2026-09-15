import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Printer } from "lucide-react";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderDesktopTableProps {
  orders: Order[];
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
  onPrintInvoice: (order: Order) => void;
}

export function OrderDesktopTable({
  orders,
  getStatusBadge,
  onPrintInvoice,
}: OrderDesktopTableProps) {
  return (
    <div className="hidden sm:flex admin-card rounded-2xl bg-card border-none overflow-hidden flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
              <th className="py-3 px-4">Order ID &amp; Date</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  No orders found matching the filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  {/* Order ID & Date */}
                  <td className="py-3.5 px-4 font-medium">
                    <Link
                      href={`/dashboard/orders/${order.orderNumber}`}
                      className="font-mono font-black text-foreground hover:underline block"
                    >
                      #{order.orderNumber}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Customer Details */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-foreground">{order.shippingAddress.name}</p>
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {order.shippingAddress.phone}
                    </a>
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-foreground">{order.shippingAddress.city}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[130px]" title={order.shippingAddress.street}>
                      {order.shippingAddress.street}
                    </p>
                  </td>

                  {/* Items Summary with thumbnails */}
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
                      {order.items.length > 2 && (
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          +{order.items.length - 2}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground ml-1">
                        ({order.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                      </span>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4 text-right font-mono font-black text-foreground">
                    ৳{order.total.toLocaleString()}
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold uppercase text-[10px] text-foreground">
                        {order.paymentMethod}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/dashboard/orders/${order.orderNumber}`}
                        className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="View order details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPrintInvoice(order);
                        }}
                        className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                        title="Print invoice"
                      >
                        <Printer className="h-4 w-4" />
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
  );
}
