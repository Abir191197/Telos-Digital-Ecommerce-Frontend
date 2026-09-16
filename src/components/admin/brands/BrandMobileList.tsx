"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Edit3, Trash2 } from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

interface BrandMobileListProps {
  brands: Brand[];
  getProductCount: (brandName: string) => number;
  onEdit?: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function BrandMobileList({
  brands,
  getProductCount,
  onEdit,
  onDelete,
}: BrandMobileListProps) {
  return (
    <div className="block md:hidden space-y-3.5">
      {brands.map((brand) => {
        const count = getProductCount(brand.name);

        return (
          <div
            key={brand.id}
            className="p-4 rounded-3xl bg-card border-none space-y-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5),0_18px_50px_-8px_rgba(0,0,0,0.35)]"
          >
            {/* Top row: Brand Emblem + Name/Tag + Product count pill */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative h-10 w-10 shrink-0 rounded-2xl bg-muted/50 p-1 flex items-center justify-center overflow-hidden border border-border/40">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  ) : (
                    <Award className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground">{brand.name}</h4>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {brand.tag}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-xl">
                {count} {count === 1 ? "Product" : "Products"}
              </span>
            </div>

            {brand.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {brand.description}
              </p>
            )}

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              <Link
                href={`/dashboard/brands?action=edit&id=${brand.id}`}
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
                title="View in store"
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
