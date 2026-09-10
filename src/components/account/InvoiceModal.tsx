"use client";

import React from "react";
import Image from "next/image";
import { X, Printer, Download, CheckCircle2, ShieldCheck } from "lucide-react";
import { Order } from "@/types/order.types";

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border/80 bg-background p-6 sm:p-8 shadow-2xl space-y-6 relative print:p-0 print:border-none print:shadow-none print:max-h-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              Invoice #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="invoice-sheet" className="space-y-6 text-foreground text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-amber-500">
                  TELOS CART
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  BD Official
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Telos Digital Commerce Ltd. • Dhaka, Bangladesh
              </p>
              <p className="text-[10px] text-muted-foreground">
                BIN: 004819201-0101 • Helpline: +880 9612-888999
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
                TAX INVOICE / CASH MEMO
              </h2>
              <p className="font-mono text-xs font-bold">
                Order: #{order.orderNumber}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Date: {new Date(order.createdAt).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Billed / Shipped To:
              </span>
              <p className="font-bold text-foreground">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.area},{" "}
                {order.shippingAddress.city} - {order.shippingAddress.postalCode}
              </p>
              <p className="font-mono text-muted-foreground">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                Logistics & Payment:
              </span>
              <p className="font-bold text-foreground">
                Courier: {order.courierName || "Telos Express"}
              </p>
              <p className="font-mono text-muted-foreground">
                Tracking: {order.trackingNumber || "Assigned at Dispatch"}
              </p>
              <p className="text-muted-foreground">
                Method:{" "}
                <strong className="uppercase text-foreground">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                </strong>{" "}
                ({order.paymentStatus.toUpperCase()})
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase text-muted-foreground">
                  <th className="py-2.5 px-2">Item Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {order.items.map((it) => (
                  <tr key={it.id} className="text-xs">
                    <td className="py-3 px-2">
                      <p className="font-bold text-foreground">{it.productName}</p>
                      {it.variantName && (
                        <span className="text-[10px] text-muted-foreground">
                          Variant: {it.variantName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-bold">{it.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono">
                      ৳{it.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-bold font-mono">
                      ৳{it.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-1.5 border-t border-border/80 pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-foreground">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charge:</span>
                <span className="font-mono font-bold text-foreground">
                  ৳{order.deliveryFee.toLocaleString()}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span className="font-mono">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-border/80 pt-2 text-foreground">
                <span>Total Payable:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Guarantee Footer */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-muted-foreground">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-semibold text-foreground">
                Thank you for shopping with Telos Cart Bangladesh!
              </p>
              <p>
                7-day replacement warranty for manufacturing defects. Retain invoice for official service center claims.
              </p>
            </div>

            {/* Visual Barcode simulation */}
            <div className="text-center sm:text-right font-mono tracking-widest text-[9px]">
              <div className="h-6 flex items-center justify-center gap-0.5">
                {[4, 2, 6, 1, 5, 2, 8, 3, 2, 7, 2, 4, 1, 8, 3, 6, 2, 5].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-foreground"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
              <span>*{order.orderNumber}*</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
