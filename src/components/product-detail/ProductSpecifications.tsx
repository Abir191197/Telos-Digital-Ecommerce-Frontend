"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { m, type Variants } from "framer-motion";
import type { Product } from "@/types/ecommerce.types";

interface ProductSpecificationsProps {
  product: Product;
  sectionFadeUp: Variants;
}

export function ProductSpecifications({
  product,
  sectionFadeUp,
}: ProductSpecificationsProps) {
  return (
    <m.section
      variants={sectionFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mt-14 pt-10 border-t border-border/70 space-y-6"
    >
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Technical Details
        </span>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Specifications & Product Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Long Description (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            {product.description?.includes("<") ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="space-y-3"
              />
            ) : (
              <p className="whitespace-pre-line">{product.description}</p>
            )}
          </div>

          {/* Highlights Checklist */}
          <div className="mt-4 p-4 rounded-2xl border border-border/70 bg-card/50 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Included in This Box & Service:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Original Manufacturer Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{product.warranty || "Official Warranty Documentation"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-sky-500 shrink-0" />
                <span>Fast Nationwide Dispatch across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>Telos Cart Official Invoice & 7-Day Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Key-Value Table (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
            <div className="bg-muted/50 px-4 py-3 border-b border-border/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Verified Product Specs
              </h3>
            </div>
            <dl className="divide-y divide-border/60 text-xs">
              {Object.entries(product.specifications || {}).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 px-4 py-2.5">
                  <dt className="font-semibold text-muted-foreground col-span-1">
                    {key}
                  </dt>
                  <dd className="text-foreground font-medium col-span-2">
                    {String(val)}
                  </dd>
                </div>
              ))}
              {product.warranty && (
                <div className="grid grid-cols-3 px-4 py-2.5">
                  <dt className="font-semibold text-muted-foreground col-span-1">
                    Warranty
                  </dt>
                  <dd className="text-foreground font-medium col-span-2">
                    {product.warranty}
                  </dd>
                </div>
              )}
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-muted-foreground col-span-1">
                  Currency
                </dt>
                <dd className="text-foreground font-medium col-span-2">
                  BDT (Bangladeshi Taka)
                </dd>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-muted-foreground col-span-1">
                  Availability
                </dt>
                <dd className="text-emerald-600 dark:text-emerald-400 font-bold col-span-2">
                  {product.inStock ? `Ready for Instant Dispatch (${product.stock} units)` : "Temporarily Sold Out"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </m.section>
  );
}
