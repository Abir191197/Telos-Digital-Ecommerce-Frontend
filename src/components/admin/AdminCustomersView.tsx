"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/stores";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminCustomersView() {
  const { customers } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Customer Directory & LTV
          </h1>
          <p className="text-xs text-muted-foreground">
            View registered Bangladeshi buyers, purchase frequencies, and lifetime values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-foreground bg-muted/60 px-3 py-1 rounded-xl">
            {customers.length} Registered Accounts
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customer by name, email, phone number, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/70 bg-background pl-9 pr-4 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="rounded-3xl border border-border/80 bg-card p-5 space-y-4 shadow-xs hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-amber-500/15 text-amber-600 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                  {cust.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-foreground">
                      {cust.name}
                    </h3>
                    {cust.status === "vip" && (
                      <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-500/20 px-1.5 py-0.2 rounded-md">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{cust.city}, BD</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone:
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {cust.phone}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email:
                </span>
                <span className="font-medium text-foreground truncate max-w-[150px]">
                  {cust.email}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Total Orders
                </span>
                <p className="font-bold text-foreground">{cust.ordersCount} Completed</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Lifetime Spend
                </span>
                <p className="font-mono font-black text-amber-600 dark:text-amber-400">
                  ৳{cust.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
