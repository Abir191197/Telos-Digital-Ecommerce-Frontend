"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingCart,
  Heart,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  PauseCircle,
  Trash2,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackendCustomer, CustomerStatus } from "@/services/api/customers/customerApi";
import { CustomerAvatar, CustomerStatusBadge } from "./CustomerBadges";

interface CustomerDesktopTableProps {
  customers: BackendCustomer[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onViewProfile: (customer: BackendCustomer) => void;
  onStatusChange: (id: string, status: CustomerStatus) => void;
  onRequestDelete: (customer: BackendCustomer) => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

export function CustomerDesktopTable({
  customers,
  activeMenuId,
  setActiveMenuId,
  onViewProfile,
  onStatusChange,
  onRequestDelete,
}: CustomerDesktopTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="hidden md:block rounded-3xl border-none bg-card shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto min-h-[360px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4 text-center">Engagement</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground">
                  <p className="font-semibold text-sm">No customers found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search criteria or status filter.
                  </p>
                </td>
              </tr>
            ) : (
              customers.map((cust) => {
                const isMenuOpen = activeMenuId === cust.id;
                const defaultAddress = cust.addresses?.find((a) => a.isDefault) || cust.addresses?.[0];
                const reviewCount = cust._count?.reviews ?? 0;
                const cartCount = cust._count?.cartItems ?? 0;
                const wishlistCount = cust._count?.wishlistItems ?? 0;

                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Customer Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <CustomerAvatar name={cust.name} avatar={cust.avatar} size="md" />
                        <div>
                          <button
                            type="button"
                            onClick={() => onViewProfile(cust)}
                            className="font-bold text-foreground text-sm hover:text-amber-500 text-left transition-colors cursor-pointer"
                          >
                            {cust.name}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                              {cust.customerId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate max-w-[170px]" title={cust.email}>
                          {cust.email}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`email-${cust.id}`, cust.email)}
                          className="text-muted-foreground hover:text-amber-500 transition-colors p-0.5"
                          title="Copy Email"
                        >
                          {copiedKey === `email-${cust.id}` ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      {cust.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {cust.phone}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(`phone-${cust.id}`, cust.phone!)}
                            className="text-muted-foreground hover:text-amber-500 transition-colors p-0.5"
                            title="Copy Phone"
                          >
                            {copiedKey === `phone-${cust.id}` ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">No phone attached</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      {defaultAddress ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-foreground font-semibold">
                            <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                            <span>{defaultAddress.city}, {defaultAddress.country}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[160px]" title={defaultAddress.street}>
                            {defaultAddress.street}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">
                          No address stored
                        </span>
                      )}
                    </td>

                    {/* Engagement Counts */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-muted/40 border border-border/50">
                        <span
                          className="flex items-center gap-1 text-[11px] font-bold text-amber-500"
                          title="${reviewCount} Product Reviews"
                        >
                          <Star className="h-3 w-3 fill-amber-500" />
                          {reviewCount}
                        </span>
                        <span className="text-border">|</span>
                        <span
                          className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"
                          title="${cartCount} items in cart"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          {cartCount}
                        </span>
                        <span className="text-border">|</span>
                        <span
                          className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"
                          title="${wishlistCount} items in wishlist"
                        >
                          <Heart className="h-3 w-3" />
                          {wishlistCount}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <CustomerStatusBadge status={cust.status} />
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-medium">
                      {formatDate(cust.createdAt)}
                    </td>

                    {/* Action Dropdown Menu */}
                    <td className="py-3.5 px-4 text-right relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : cust.id)}
                        className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 top-12 z-50 w-48 rounded-2xl bg-popover p-1.5 border border-border shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95">
                            {/* View Profile */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewProfile(cust);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-amber-500" />
                              View Full Profile
                            </button>

                            <div className="h-px bg-border/60 my-1" />

                            {/* Status controls */}
                            {cust.status !== "ACTIVE" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onStatusChange(cust.id, "ACTIVE");
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Set as Active
                              </button>
                            )}

                            {cust.status !== "INACTIVE" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onStatusChange(cust.id, "INACTIVE");
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                              >
                                <PauseCircle className="h-3.5 w-3.5" />
                                Set as Inactive
                              </button>
                            )}

                            {cust.status !== "SUSPENDED" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onStatusChange(cust.id, "SUSPENDED");
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              >
                                <ShieldAlert className="h-3.5 w-3.5" />
                                Suspend Account
                              </button>
                            )}

                            <div className="h-px bg-border/60 my-1" />

                            {/* Soft Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onRequestDelete(cust);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete Customer
                            </button>
                          </div>
                        </>
                      )}
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
