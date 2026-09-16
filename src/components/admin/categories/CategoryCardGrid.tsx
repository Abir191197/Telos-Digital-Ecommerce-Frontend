"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Layers,
  LayoutGrid,
} from "lucide-react";
import type { Category } from "@/types/ecommerce.types";
import { CATEGORY_ICON_MAP } from "@/components/categories/categoryConfig";

export interface CategoryCardGridProps {
  categories: Category[];
  getNumericId: (id: string, index: number) => string;
  formatDate: (dateStr?: string) => string;
  onEdit?: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCardGrid({
  categories,
  getNumericId,
  formatDate,
  onEdit,
  onDelete,
}: CategoryCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((category) => {
        const IconComponent =
          (category.icon && CATEGORY_ICON_MAP[category.icon]) || LayoutGrid;

        return (
          <div
            key={category.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border-none transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_-5px_rgba(245,158,11,0.12),0_25px_65px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-5px_rgba(245,158,11,0.18),0_25px_70px_-10px_rgba(0,0,0,0.6)]"
          >
            {/* Visual Hero Cover */}
            <div className="relative h-44 w-full bg-muted/30 overflow-hidden">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-muted/80 via-muted/40 to-muted/20">
                  <IconComponent className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}

              {/* Dynamic Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Top Floating Badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                {/* Icon badge with glassmorphism */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/90 backdrop-blur-md text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <IconComponent className="h-4.5 w-4.5 text-amber-500" />
                </div>

                {category.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                    <Sparkles className="h-2.5 w-2.5 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Bottom Cover Overlay Metadata */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-black font-mono tracking-tight bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  {category.itemCount || 0} items
                </span>
                <span className="text-xs font-mono font-bold bg-amber-500/90 text-zinc-950 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm">
                  #{getNumericId(category.id, 0)}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-black text-foreground tracking-tight leading-snug group-hover:text-amber-500 transition-colors line-clamp-1">
                    {category.name}
                  </h4>
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 shrink-0 mt-0.5">
                    <Calendar className="h-3 w-3 text-amber-500/70" />
                    {formatDate(category.createdAt)}
                  </span>
                </div>

                {category.description ? (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground/60 italic line-clamp-1">
                    No description provided
                  </p>
                )}
              </div>

              {/* Subcategories count pill */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/40 px-2.5 py-1 rounded-lg w-fit">
                  <Layers className="h-3.5 w-3.5 text-amber-500" />
                  <span>{category.subcategories.length} subcategories</span>
                </div>
              )}

              {/* Action Buttons: Prominent, Big, & Accessible */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                <Link
                  href={`/category/${category.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer"
                  title="View Storefront Preview"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Storefront</span>
                </Link>

                <div className="flex items-center gap-2">
                  {/* Large Edit Button */}
                  <Link
                    href={`/dashboard/categories?action=edit&id=${category.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    title="Edit Category Details"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Large Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
