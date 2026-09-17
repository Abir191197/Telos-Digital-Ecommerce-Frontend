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
  LayoutGrid,
} from "lucide-react";
import type { Category } from "@/types/ecommerce.types";
import { getCategoryIcon } from "@/components/categories/categoryConfig";

export interface CategoryMobileListProps {
  categories: Category[];
  getNumericId: (id: string, index: number) => string;
  formatDate: (dateStr?: string) => string;
  onEdit?: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryMobileList({
  categories,
  getNumericId,
  formatDate,
  onEdit,
  onDelete,
}: CategoryMobileListProps) {
  return (
    <div className="block md:hidden space-y-3.5">
      {categories.map((category) => {
        const IconComponent = getCategoryIcon(category.icon);

        return (
          <div
            key={category.id}
            className="p-4 rounded-3xl bg-card border-none space-y-3.5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5),0_18px_50px_-8px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 shrink-0 rounded-2xl overflow-hidden bg-muted/40 flex items-center justify-center shadow-xs">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <IconComponent className="h-6 w-6 text-amber-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-black text-foreground text-sm truncate">
                      {category.name}
                    </h4>
                    {category.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-zinc-950 font-bold bg-amber-500/90 px-1.5 py-0.5 rounded">
                      #{getNumericId(category.id, 0)}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5 opacity-60" />
                      {formatDate(category.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-foreground px-2.5 py-1 rounded-xl bg-muted/50 shrink-0">
                {category.itemCount || 0} items
              </span>
            </div>

            {category.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            )}

            {/* Actions: Big, accessible buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40 gap-2">
              <Link
                href={`/category/${category.slug}`}
                target="_blank"
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-1.5 px-2 rounded-lg"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Store</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/categories/${category.slug}/edit`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Link>
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
        );
      })}
    </div>
  );
}
