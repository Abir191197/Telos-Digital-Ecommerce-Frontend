"use client";

import React from "react";
import Link from "next/link";
import { BadgeCheck, ShieldAlert, ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";
import { containerVariants, itemVariants } from "./aboutAnimations";

interface BrandPartner {
  name: string;
  category: string;
  warrantyType: string;
  authorization: string;
}

const PARTNERS: BrandPartner[] = [
  {
    name: "Apple",
    category: "Smartphones & Computing",
    warrantyType: "1-Year Official International & Regional",
    authorization: "Direct Authorized Regional Supply",
  },
  {
    name: "Samsung",
    category: "Smartphones & Displays",
    warrantyType: "1-Year National Official Service Center",
    authorization: "Samsung Bangladesh Authorized Distribution",
  },
  {
    name: "Sony",
    category: "Imaging & Audio",
    warrantyType: "2-Year Official Distributor Warranty",
    authorization: "Sony Smart Technologies BD Sourced",
  },
  {
    name: "Google",
    category: "Pixel Devices & Nest",
    warrantyType: "1-Year Official Hardware Coverage",
    authorization: "Global Certified Direct Channel",
  },
  {
    name: "Asus ROG",
    category: "Gaming & Enterprise Laptops",
    warrantyType: "2-Year Global Perfect Warranty",
    authorization: "Asus Bangladesh Authorized Distr.",
  },
  {
    name: "Xiaomi",
    category: "Smart Living & Mobile",
    warrantyType: "1-Year Official Brand Warranty",
    authorization: "Xiaomi Bangladesh Official Partner",
  },
];

export function AboutAuthorizedBrands() {
  return (
    <section className="container px-4 sm:px-6 py-14 sm:py-20 border-b border-border/60">
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
              <BadgeCheck className="h-4 w-4" />
              <span>Direct Sourcing Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Official Authorized Brand Networks
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every device on Telos Cart originates from documented manufacturer supply channels with verifiable regional serial entries and direct brand service center validity.
            </p>
          </div>

          <Link
            href={ROUTES.BRANDS}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline transition-colors shrink-0"
          >
            <span>View All Partner Portfolios</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Corporate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARTNERS.map((partner) => (
            <m.div
              key={partner.name}
              variants={itemVariants}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-base font-extrabold tracking-tight text-foreground">
                    {partner.name}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                    {partner.category}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="font-semibold text-foreground shrink-0">Channel:</span>
                    <span>{partner.authorization}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="font-semibold text-foreground shrink-0">Warranty:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {partner.warrantyType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified Serial Validated
                </span>
                <span>Tier-1 Partner</span>
              </div>
            </m.div>
          ))}
        </div>

        {/* Notice of Anti-Counterfeit Policy */}
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Anti-Grey-Market Guarantee: </span>
            Telos Cart maintains zero tolerance for refurbished units sold as new, unauthorized open-box products, or parallel imports without manufacturer warranty validation.
          </div>
        </div>
      </m.div>
    </section>
  );
}
