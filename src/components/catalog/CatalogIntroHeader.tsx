"use client";

import React from "react";
import { Category } from "@/types/ecommerce.types";
import { m } from "framer-motion";

interface CatalogIntroHeaderProps {
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  category?: Category;
}

export function CatalogIntroHeader({
  showHeader = true,
  title,
  subtitle,
  category,
}: CatalogIntroHeaderProps) {
  if (!showHeader) return null;

  return (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-1.5 pb-2"
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
        {title || (category ? category.name : "All Products")}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
        {subtitle ||
          (category
            ? category.description
            : "Discover official Bangladesh warranty devices, smartphones, computing workstations, audio, and authentic lifestyle tech.")}
      </p>
    </m.div>
  );
}
