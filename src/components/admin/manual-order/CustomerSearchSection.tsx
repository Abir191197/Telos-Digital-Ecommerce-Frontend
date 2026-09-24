"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, User, Phone, Mail, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLazySearchCustomersForAdminQuery } from "@/services/api/customers/customerApi";
import type { BackendCustomer, CustomerAddress } from "@/services/api/customers/customerApi";

export interface SelectedCustomerInfo {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  area?: string;
  union?: string;
  city: string;
  zone: "inside-dhaka" | "outside-dhaka";
  label?: "Home" | "Office" | "Other";
  addresses: CustomerAddress[];
}

interface CustomerSearchSectionProps {
  onCustomerSelect: (customer: SelectedCustomerInfo | null) => void;
  selectedCustomer: SelectedCustomerInfo | null;
}

export function CustomerSearchSection({ onCustomerSelect, selectedCustomer }: CustomerSearchSectionProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [triggerSearch, { data: results, isFetching }] = useLazySearchCustomersForAdminQuery();

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        triggerSearch(value.trim());
        setIsOpen(true);
      }, 300);
    } else {
      setIsOpen(false);
    }
  }, [triggerSearch]);

  const handleSelect = (customer: BackendCustomer) => {
    const primaryAddress =
      customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
    const cityLower = (primaryAddress?.city || "").toLowerCase();
    const zone: "inside-dhaka" | "outside-dhaka" =
      primaryAddress?.zone || (cityLower.includes("dhaka") ? "inside-dhaka" : "outside-dhaka");

    const label: "Home" | "Office" | "Other" =
      primaryAddress?.type === "OFFICE"
        ? "Office"
        : primaryAddress?.type === "OTHER"
          ? "Other"
          : "Home";

    onCustomerSelect({
      customerId: customer.id,
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      street: primaryAddress?.street || "",
      area: primaryAddress?.area || "",
      union: primaryAddress?.union || "",
      city: primaryAddress?.city || "",
      zone,
      label,
      addresses: customer.addresses || [],
    });
    setQuery(`${customer.name} (${customer.phone || customer.email})`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    onCustomerSelect(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10">
          <User className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Customer Lookup</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="customer-search-input"
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search customer by name, phone (017...), or email..."
          autoComplete="off"
          className={cn(
            "h-10 w-full rounded-xl bg-muted/40 border border-border/50 pl-10 pr-9 text-sm font-medium text-foreground",
            "focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all",
            "placeholder:text-muted-foreground/60"
          )}
        />
        {(query || selectedCustomer) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Clear customer selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-40 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden">
            {isFetching ? (
              <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching registered customers...
              </div>
            ) : !results || results.length === 0 ? (
              <div className="p-4 text-xs text-muted-foreground">
                No matching customer found for "{query}". You can type customer details directly below to auto-create an account.
              </div>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-border/30">
                {results.map((customer) => {
                  const addr = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
                  return (
                    <li key={customer.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(customer)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-foreground truncate">{customer.name}</p>
                            {customer.customerId && (
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.2 rounded font-semibold">
                                #{customer.customerId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {customer.phone && (
                              <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{customer.email}</span>
                            </span>
                          </div>
                          {addr && (
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground/80 truncate">
                              <MapPin className="h-3 w-3 shrink-0 text-amber-500/70" />
                              <span className="truncate">
                                {addr.street}, {addr.city} {addr.postalCode ? `(${addr.postalCode})` : ""}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                          customer.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {customer.status}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Customer selected & all fields populated automatically.
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
          >
            Switch Customer
          </button>
        </div>
      )}

      {!selectedCustomer && (
        <p className="text-[11px] text-muted-foreground">
          Lookup finds customer by phone, email, or name and auto-fills their address. Or simply type new customer info below.
        </p>
      )}
    </div>
  );
}
