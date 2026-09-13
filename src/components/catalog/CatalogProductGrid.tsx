"use client";

import React from "react";
import { Product } from "@/types/ecommerce.types";
import { GridViewMode } from "@/types/catalog.types";
import { ProductCard } from "@/components/common";
import { EmptyCatalogState } from "./CatalogStateViews";
import { cn } from "@/lib/utils";
import { m, type Variants } from "framer-motion";

interface CatalogProductGridProps {
  products: Product[];
  totalFilteredCount: number;
  viewMode: GridViewMode;
  cacheKey: string;
  onResetFilters: () => void;
}

// Stable Framer Motion variants defined outside component for zero re-render overhead
const catalogGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const catalogCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 280,
    },
  },
};

export function CatalogProductGrid({
  products,
  totalFilteredCount,
  viewMode,
  cacheKey,
  onResetFilters,
}: CatalogProductGridProps) {
  if (totalFilteredCount === 0) {
    return <EmptyCatalogState onResetFilters={onResetFilters} />;
  }

  return (
    <m.div
      key={cacheKey}
      variants={catalogGridVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid gap-3 sm:gap-5",
        viewMode === "grid-3"
          ? "grid-cols-2 md:grid-cols-3"
          : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
      )}
    >
      {products.map((product) => (
        <m.div key={product.id} variants={catalogCardVariants}>
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  );
}
