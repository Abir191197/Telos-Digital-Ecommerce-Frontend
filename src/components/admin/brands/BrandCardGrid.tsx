"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Edit3, Trash2 } from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

interface BrandCardGridProps {
  brands: Brand[];
  onEdit?: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function BrandCardGrid({
  brands,
  onEdit,
  onDelete,
}: BrandCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {brands.map((brand) => {
        return (
          <div
            key={brand.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border-none p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_-5px_rgba(245,158,11,0.12),0_25px_65px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-5px_rgba(245,158,11,0.18),0_25px_70px_-10px_rgba(0,0,0,0.6)]"
          >
            <div>
              {/* Header: Logo / Default Icon + Badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted/30 border border-border/40 p-2.5 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {brand.image ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-amber-500">
                      <Award className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {brand.tagline || "—"}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-foreground text-base tracking-tight truncate">
                  {brand.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {brand.description || "Authentic official warranty products and verified direct imports."}
                </p>
              </div>

              {/* Meta stats */}
              <div className="mt-3.5 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>{brand.isActive ? "Active" : "Inactive"}</span>
                {brand.isFeaturedMarquee && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ★ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Direct Action Buttons: Edit, Delete, Store Link */}
            <div className="flex items-center gap-2 pt-3 mt-4 border-t border-border/30">
              <Link
                href={`/dashboard/brands/${brand.slug}/edit`}
                className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-amber-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-500 group-hover:text-inherit" />
                <span>Edit</span>
              </Link>

              <button
                type="button"
                onClick={() => onDelete(brand)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>

              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                target="_blank"
                className="p-2 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                title="View in store catalog"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
