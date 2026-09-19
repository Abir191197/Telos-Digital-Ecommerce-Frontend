"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Boxes,
  AlertTriangle,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  accent: string;
}

const REPORT_CARDS: ReportCardProps[] = [
  {
    title: "Profit & Margins",
    description: "Analyze gross and net profitability, cost of goods, and margin ratios by order.",
    href: "/dashboard/reports/profit",
    icon: TrendingUp,
    tag: "Financial",
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20",
  },
  {
    title: "Stock Valuation",
    description: "Complete warehouse asset accounting, cost valuation, and potential retail return.",
    href: "/dashboard/reports/stock",
    icon: Boxes,
    tag: "Warehouse Asset",
    accent: "from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20",
  },
  {
    title: "Low-Stock Alerts",
    description: "Identify exhausted inventory, forecast deficit units, and estimate reorder capital.",
    href: "/dashboard/reports/low-stock",
    icon: AlertTriangle,
    tag: "Supply Chain",
    accent: "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20",
  },
  {
    title: "Transaction Audit",
    description: "Audit customer payments, bKash/Nagad MFS numbers, transaction IDs, and verified volume.",
    href: "/dashboard/reports/transactions",
    icon: CreditCard,
    tag: "Payment Ledger",
    accent: "from-purple-500/20 to-purple-500/5 text-purple-500 border-purple-500/20",
  },
  {
    title: "Sales & Revenue",
    description: "Executive sales volume, discounts absorbed, courier charges collected, and demand breakdown.",
    href: "/dashboard/reports/sales",
    icon: ShoppingBag,
    tag: "Executive Sales",
    accent: "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20",
  },
];

export function ReportsOverviewView() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Analytics & Executive Reports
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Select a specialized report below to audit financials, warehouse stock, replenishment, and transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border/50 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Deterministic Audit Standard</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group admin-card rounded-2xl bg-card border border-border/50 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center border shrink-0`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mt-4 group-hover:text-amber-500 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs font-bold text-foreground group-hover:text-amber-500">
                <span>View Full Report</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
