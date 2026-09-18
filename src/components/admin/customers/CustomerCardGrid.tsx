"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingCart,
  Heart,
  MoreVertical,
  CheckCircle2,
  PauseCircle,
  ShieldAlert,
  Trash2,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackendCustomer, CustomerStatus } from "@/services/api/customers/customerApi";
import { CustomerAvatar, CustomerStatusBadge } from "./CustomerBadges";

interface CustomerCardGridProps {
  customers: BackendCustomer[];
  onViewProfile: (customer: BackendCustomer) => void;
  onStatusChange: (id: string, status: CustomerStatus) => void;
  onRequestDelete: (customer: BackendCustomer) => void;
}

export function CustomerCardGrid({
  customers,
  onViewProfile,
  onStatusChange,
  onRequestDelete,
}: CustomerCardGridProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  if (customers.length === 0) {
    return (
      <div className="rounded-3xl bg-card p-12 text-center text-muted-foreground shadow-xs">
        <p className="font-bold text-sm">No customers match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {customers.map((cust) => {
        const isMenuOpen = activeMenuId === cust.id;
        const defaultAddress = cust.addresses?.find((a) => a.isDefault) || cust.addresses?.[0];
        const reviewCount = cust._count?.reviews ?? 0;
        const cartCount = cust._count?.cartItems ?? 0;
        const wishlistCount = cust._count?.wishlistItems ?? 0;

        return (
          <div
            key={cust.id}
            className="group relative rounded-3xl bg-card p-5 border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] space-y-4 hover:scale-[1.01] transition-all"
          >
            {/* Top Identity Row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <CustomerAvatar name={cust.name} avatar={cust.avatar} size="md" />
                <div>
                  <button
                    type="button"
                    onClick={() => onViewProfile(cust)}
                    className="font-bold text-sm text-foreground hover:text-amber-500 text-left transition-colors cursor-pointer"
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

              <div className="flex items-center gap-1">
                <CustomerStatusBadge status={cust.status} size="sm" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(isMenuOpen ? null : cust.id)}
                    className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-0 top-9 z-50 w-44 rounded-2xl bg-popover p-1.5 border border-border shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewProfile(cust);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-500" />
                          View Profile
                        </button>
                        <div className="h-px bg-border/60 my-1" />
                        {cust.status !== "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onStatusChange(cust.id, "ACTIVE");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Activate
                          </button>
                        )}
                        {cust.status !== "SUSPENDED" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onStatusChange(cust.id, "SUSPENDED");
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Suspend
                          </button>
                        )}
                        <div className="h-px bg-border/60 my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onRequestDelete(cust);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Email:
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground truncate max-w-[150px]">
                    {cust.email}
                  </span>
                  <button
                    onClick={() => copyToClipboard(`card-email-${cust.id}`, cust.email)}
                    className="text-muted-foreground hover:text-amber-500"
                  >
                    {copiedKey === `card-email-${cust.id}` ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {cust.phone && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3" /> Phone:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-foreground font-semibold">
                      {cust.phone}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`card-phone-${cust.id}`, cust.phone!)}
                      className="text-muted-foreground hover:text-amber-500"
                    >
                      {copiedKey === `card-phone-${cust.id}` ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {defaultAddress && (
                <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-amber-500" /> Location:
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {defaultAddress.city}, {defaultAddress.country}
                  </span>
                </div>
              )}
            </div>

            {/* Engagement Metrics & Button */}
            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-bold text-amber-500" title="Reviews">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {reviewCount}
                </span>
                <span className="text-border">?</span>
                <span className="flex items-center gap-1 text-muted-foreground font-medium" title="Cart Items">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {cartCount}
                </span>
                <span className="text-border">?</span>
                <span className="flex items-center gap-1 text-muted-foreground font-medium" title="Wishlist">
                  <Heart className="h-3.5 w-3.5" />
                  {wishlistCount}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onViewProfile(cust)}
                className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
              >
                View Profile &rarr;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
