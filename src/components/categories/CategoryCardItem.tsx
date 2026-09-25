"use client";

import React from "react";
import Link from "next/link";
import { AppImage } from "@/components/shared";
import { m } from "framer-motion";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import type { Category } from "@/types/ecommerce.types";
import { getCategoryIcon } from "./categoryConfig";

interface CategoryCardItemProps {
  category: Category;
  index: number;
}

export function CategoryCardItem({ category, index }: CategoryCardItemProps) {
  const IconComponent = getCategoryIcon(category.icon);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min((index % 10) * 0.03, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.55),0_2px_10px_-2px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_18px_38px_-8px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Visual Category Cover Image / Banner */}
      <Link
        href={ROUTES.CATEGORY_DETAIL(category.slug)}
        className="relative block h-32 sm:h-38 w-full overflow-hidden bg-muted/20"
      >
        <AppImage
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          fallbackIconSize={32}
        />

        {/* Minimal Floating Category Icon */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-background/85 backdrop-blur-md text-foreground shadow-xs">
          <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
        </div>
      </Link>

      {/* Card Body: Title + Stock Count + Action Button */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div className="mb-3">
          <Link
            href={ROUTES.CATEGORY_DETAIL(category.slug)}
            className="block group/title"
          >
            <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight transition-colors group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400 line-clamp-1">
              {category.name}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground font-medium">
            {category.itemCount} products
          </p>
        </div>

        <Link
          href={ROUTES.CATEGORY_DETAIL(category.slug)}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:bg-amber-500 hover:text-zinc-950 py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md hover:shadow-amber-500/25"
        >
          <span>Explore</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover/btn:translate-x-1 text-amber-400 group-hover:text-zinc-950 group-hover/btn:text-zinc-950" />
        </Link>
      </div>
    </m.div>
  );
}
