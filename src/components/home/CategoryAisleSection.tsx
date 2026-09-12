"use client";

import React from "react";
import Link from "next/link";
import { products, categories } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

const aisleGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const aisleItemVariants: Variants = {
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

interface CategoryAisleSectionProps {
  categorySlug: string;
  badge?: string;
  badgeColor?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function CategoryAisleSection({
  categorySlug,
  badge = "Featured Aisle",
  badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20",
  title,
  subtitle,
  limit = 5,
}: CategoryAisleSectionProps) {
  const category = categories.find((c) => c.slug === categorySlug);

  const aisleProducts = React.useMemo(() => {
    return products
      .filter((p) => p.categorySlug === categorySlug)
      .slice(0, limit);
  }, [categorySlug, limit]);

  if (!category || aisleProducts.length === 0) return null;

  const displayTitle = title || category.name;
  const displaySubtitle = subtitle || category.description;

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label={`${displayTitle} Aisle`} className="w-full">
        {/* Header with Title, Subcategory Quick Pills, and View All Link */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                  badgeColor
                )}
              >
                <Sparkles className="h-3 w-3" />
                {badge}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {displayTitle}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1 max-w-2xl">
              {displaySubtitle}
            </p>
          </div>

          {/* Right view all button linking to dedicated category page */}
          <Link
            href={ROUTES.CATEGORY_DETAIL(category.slug)}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
          </Link>
        </m.div>

        {/* Product Cards Grid: 2 cols on mobile, 3 on md, 5 cols on xl desktop */}
        <m.div
          variants={aisleGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {aisleProducts.map((product) => (
            <m.div key={product.id} variants={aisleItemVariants}>
              <ProductCard product={product} />
            </m.div>
          ))}
        </m.div>
      </section>
    </LazyMotion>
  );
}
