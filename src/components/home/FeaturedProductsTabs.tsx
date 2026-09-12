"use client";

import React from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation, type Variants } from "framer-motion";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 260,
    },
  },
};

export function FeaturedProductsTabs() {
  const featuredProducts = React.useMemo(() => {
    return products.filter((p) => p.isFeatured).slice(0, 10);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Curated Products" className="w-full">
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-500">
                <Sparkles className="h-3 w-3" />
                Hand-Picked Selection
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Curated Products For You
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Hand-picked selections guaranteed authentic with official Bangladesh warranty
            </p>
          </div>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
          </Link>
        </div>

        {/* Product Grid: 2 cols on mobile, 3 on md, 5 on xl desktop */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {featuredProducts.map((product) => (
            <m.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </m.div>
          ))}
        </m.div>
      </section>
    </LazyMotion>
  );
}


