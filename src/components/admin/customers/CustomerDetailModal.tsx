"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingCart,
  Heart,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  PauseCircle,
  Copy,
  Check,
  Building2,
  Home,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackendCustomer, CustomerStatus } from "@/services/api/customers/customerApi";
import { CustomerAvatar, CustomerStatusBadge, AddressTypeBadge } from "./CustomerBadges";

interface CustomerDetailModalProps {
  customer: BackendCustomer | null;
  onClose: () => void;
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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export function CustomerDetailModal({
  customer,
  onClose,
  onStatusChange,
  onRequestDelete,
}: CustomerDetailModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!customer) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const reviewCount = customer._count?.reviews ?? 0;
  const cartCount = customer._count?.cartItems ?? 0;
  const wishlistCount = customer._count?.wishlistItems ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl z-10 p-6 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-4">
            <CustomerAvatar name={customer.name} avatar={customer.avatar} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground tracking-tight">
                  {customer.name}
                </h2>
                <CustomerStatusBadge status={customer.status} size="sm" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border/60">
                  {customer.customerId}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {formatDate(customer.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </span>
              <p className="font-semibold text-xs text-foreground truncate" title={customer.email}>
                {customer.email}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard("modal-email", customer.email)}
              className="p-1.5 rounded-xl bg-card border border-border/60 hover:border-amber-500/80 text-muted-foreground hover:text-amber-500 transition-colors shrink-0"
              title="Copy Email"
            >
              {copiedKey === "modal-email" ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </span>
              <p className="font-mono font-semibold text-xs text-foreground">
                {customer.phone || "Not provided"}
              </p>
            </div>
            {customer.phone && (
              <button
                onClick={() => copyToClipboard("modal-phone", customer.phone!)}
                className="p-1.5 rounded-xl bg-card border border-border/60 hover:border-amber-500/80 text-muted-foreground hover:text-amber-500 transition-colors shrink-0"
                title="Copy Phone"
              >
                {copiedKey === "modal-phone" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Engagement Stats Strip */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Storefront Engagement
          </span>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black text-xl">
                <Star className="h-4 w-4 fill-amber-500" />
                {reviewCount}
              </div>
              <p className="text-[11px] font-bold text-muted-foreground">Reviews Written</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-sky-500 font-black text-xl">
                <ShoppingCart className="h-4 w-4" />
                {cartCount}
              </div>
              <p className="text-[11px] font-bold text-muted-foreground">Cart Items</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-rose-500 font-black text-xl">
                <Heart className="h-4 w-4" />
                {wishlistCount}
              </div>
              <p className="text-[11px] font-bold text-muted-foreground">Wishlist Saved</p>
            </div>
          </div>
        </div>

        {/* Stored Addresses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Address Book ({customer.addresses?.length || 0})
            </span>
          </div>

          {customer.addresses && customer.addresses.length > 0 ? (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {customer.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3 rounded-2xl bg-muted/30 border border-border/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AddressTypeBadge type={addr.type} />
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Default Shipping
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-foreground">{addr.street}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {addr.city}
                      {addr.state ? `, ${addr.state}` : ""}
                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}, {addr.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-center text-xs text-muted-foreground">
              No physical delivery addresses recorded in the database yet.
            </div>
          )}
        </div>

        {/* Admin Moderation Controls */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Account Management & Moderation
          </span>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Status Switcher Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStatusChange(customer.id, "ACTIVE")}
                disabled={customer.status === "ACTIVE"}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  customer.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground border border-border/60"
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(customer.id, "INACTIVE")}
                disabled={customer.status === "INACTIVE"}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  customer.status === "INACTIVE"
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground border border-border/60"
                )}
              >
                <PauseCircle className="h-3.5 w-3.5" />
                Inactive
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(customer.id, "SUSPENDED")}
                disabled={customer.status === "SUSPENDED"}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  customer.status === "SUSPENDED"
                    ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground border border-border/60"
                )}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Suspended
              </button>
            </div>

            {/* Soft Delete */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestDelete(customer);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
