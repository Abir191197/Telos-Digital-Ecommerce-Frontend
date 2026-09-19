"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  Sliders,
  Settings,
  ArrowLeft,
  Palette,
  ShieldCheck,
  Truck,
  Percent,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/common";
import { ROUTES } from "@/constants";

interface AdminComingSoonViewProps {
  title?: string;
  category?: string;
  description?: string;
}

export function AdminComingSoonView({
  title = "Store Administration",
  category = "Store Administration",
  description = "This administration module is currently under development. Core store operations, inventory, orders, and payments are active.",
}: AdminComingSoonViewProps) {
  const plannedModules = [
    {
      icon: Palette,
      title: "Theme & Homepage Customizer",
      desc: "Visual banner placement, hero slider configuration, and brand theme accents.",
      status: "Planned Later",
    },
    {
      icon: Truck,
      title: "Courier & Delivery Rules",
      desc: "Nationwide BD district/upazila courier shipping rules, Steadfast & Pathao API sync.",
      status: "Planned Later",
    },
    {
      icon: Percent,
      title: "Tax, VAT & Invoice Engine",
      desc: "Automated VAT computation, custom invoicing headers, and NBR compliant tax brackets.",
      status: "Planned Later",
    },
    {
      icon: ShieldCheck,
      title: "Staff Roles & Granular RBAC",
      desc: "Delegate permissions to warehouse dispatchers, customer support, and catalog managers.",
      status: "Planned Later",
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {category}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              Coming Soon
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Sliders className="h-6 w-6 text-amber-500" />
            <span>{title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>

        <Link href={ROUTES.DASHBOARD}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Hero Notice Card */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.06] via-card to-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-foreground">
                Store Administration Paused For Now
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950">
                Release 2.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              We are prioritizing core live features (Orders Dispatch, Customer Carts, Flash Deals, Catalog Management, and Payments). Store Administration and custom site controls will be implemented in an upcoming milestone.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Core Catalog & Products Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Order Dispatch & Tracking Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Payments Verification Active</span>
          </div>
        </div>
      </div>

      {/* Planned Capabilities Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
            Planned Store Administration Features
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-card p-5 space-y-2.5 transition-all hover:border-amber-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-muted text-foreground flex items-center justify-center">
                      <Icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-11">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
