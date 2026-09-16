"use client";

import React from "react";
import Image from "next/image";
import { AdminCustomerCart } from "@/data/customer-carts";
import { CartStatusBadge } from "./CartStatusBadge";
import { Eye, Clock, Mail, Phone, ShoppingBag, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartDesktopTableProps {
  carts: AdminCustomerCart[];
  onInspect: (cart: AdminCustomerCart) => void;
}

export function CartDesktopTable({ carts, onInspect }: CartDesktopTableProps) {
  if (carts.length === 0) {
    return (
      <div className="hidden md:block p-12 text-center text-muted-foreground text-xs rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
        No customer shopping carts match the selected criteria.
      </div>
    );
  }

  return (
    <div className="hidden md:block rounded-3xl bg-card border-none overflow-hidden shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3.5 px-4 w-52">Customer &amp; Contact</th>
              <th className="py-3.5 px-4 w-44">Cart Items Stack</th>
              <th className="py-3.5 px-4 w-28 text-center">Items Qty</th>
              <th className="py-3.5 px-4 w-36">Subtotal</th>
              <th className="py-3.5 px-4 w-36">Stage / Status</th>
              <th className="py-3.5 px-4 w-40">Last Updated</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {carts.map((cart) => {
              const updatedDate = new Date(cart.updatedAt);
              const dateFormatted = updatedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              const timeFormatted = updatedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <tr
                  key={cart.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-2xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center shrink-0 border border-amber-500/20 text-xs">
                        {cart.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs truncate">
                          {cart.customerName}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          {cart.customerEmail}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{cart.city}, BD</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Thumbnail Image Stack */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center -space-x-2 overflow-hidden py-1">
                      {cart.items.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="relative h-9 w-9 rounded-xl overflow-hidden bg-background ring-2 ring-card shrink-0 border border-border/60"
                          title={item.productName}
                        >
                          <Image
                            src={item.productThumbnail}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {cart.items.length > 4 && (
                        <div className="relative h-9 w-9 rounded-xl bg-muted font-bold text-[10px] text-foreground flex items-center justify-center ring-2 ring-card shrink-0 border border-border/60">
                          +{cart.items.length - 4}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Item count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono text-xs font-bold bg-muted/50 px-2 py-0.5 rounded-lg text-foreground">
                      {cart.itemsCount}
                    </span>
                  </td>

                  {/* Subtotal */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-black text-sm text-foreground">
                      ৳{cart.subtotal.toLocaleString()}
                    </div>
                    {cart.appliedCoupon && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                        <Tag className="h-2.5 w-2.5" />
                        <span>Code: {cart.appliedCoupon}</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <CartStatusBadge status={cart.status} />
                  </td>

                  {/* Last updated */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>{dateFormatted}</span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground pl-4 mt-0.5">
                      {timeFormatted}
                    </div>
                  </td>

                  {/* Action: Inspect */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onInspect(cart)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
