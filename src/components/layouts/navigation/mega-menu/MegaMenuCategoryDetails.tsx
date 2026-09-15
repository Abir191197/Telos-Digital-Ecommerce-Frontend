import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import type { Category, Product, Subcategory } from "@/types/ecommerce.types";

interface MegaMenuCategoryDetailsProps {
  activeCategory: Category;
  activeCategoryProducts: Product[];
  onClose: () => void;
}

export function MegaMenuCategoryDetails({
  activeCategory,
  activeCategoryProducts,
  onClose,
}: MegaMenuCategoryDetailsProps) {
  return (
    <div className="md:col-span-5 lg:col-span-5 p-5 flex flex-col justify-between bg-muted/10">
      <div>
        {/* Active Category Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {activeCategory?.name}
              </h3>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                {activeCategory?.itemCount}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {activeCategory?.description}
            </p>
          </div>

          <Link
            href={ROUTES.CATEGORY_DETAIL(activeCategory?.slug || "")}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-1.5 text-xs font-extrabold shadow-sm shadow-amber-500/25 hover:shadow-md hover:shadow-amber-500/35 transition-all duration-200 shrink-0 group active:scale-95"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Subcategories Pills */}
        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Popular Subcategories
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeCategory?.subcategories.slice(0, 6).map((sub: Subcategory) => (
              <Link
                key={sub.id}
                href={ROUTES.CATEGORY_DETAIL(activeCategory?.slug || "")}
                onClick={onClose}
                className="rounded-lg bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Products Quick Grid */}
        <div className="mt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Featured in {activeCategory?.name}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {activeCategoryProducts.slice(0, 4).map((prod) => (
              <Link
                key={prod.id}
                href={ROUTES.PRODUCT_DETAIL(prod.slug)}
                onClick={onClose}
                className="group flex flex-col rounded-2xl bg-card p-2 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40">
                  <Image
                    src={prod.thumbnail}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {prod.discountPercentage && prod.discountPercentage > 0 ? (
                    <span className="absolute top-1 left-1 rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-xs">
                      -{prod.discountPercentage}%
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-1.5 text-xs font-semibold text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors">
                  {prod.name}
                </h4>
                <div className="mt-0.5 text-xs font-extrabold text-foreground">
                  ৳{prod.price.toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle status indicator */}
      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground/70">
        <span className="text-[11px]">
          Click any product to view specs & discounts
        </span>
        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
          Direct BD Stock
        </span>
      </div>
    </div>
  );
}
