"use client";

import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { Wallet, ArrowRight } from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { useGetProductsQuery } from "@/services/api/products/productApi";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
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

export function ShopByBudgetSection() {
  const { data: serverProducts, isLoading } = useGetProductsQuery({ limit: 40 });
  const allProducts = serverProducts?.data || [];

  const budgetProducts = React.useMemo(() => {
    const under15k = allProducts.filter((p) => Number(p.price) <= 15000);
    if (under15k.length >= 5) {
      return under15k.slice(0, 10);
    }
    // If few products are under 15k, sort by lowest price to offer best budget choices
    return [...allProducts].sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 10);
  }, [allProducts]);

  if (budgetProducts.length === 0 && !isLoading) return null;

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Shop By Budget" className="w-full">
        <m.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-5 sm:mb-6"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                <Wallet className="h-3 w-3" />
                Best Value Deals
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Shop By Budget
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Discover verified tech, audio, and gadgets tailored to your budget
            </p>
          </div>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
          </Link>
        </m.div>

        {/* Products Grid: 2-col on mobile, 3 on md, 5-col on xl desktop */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`budget-skeleton-${i}`}
                className="rounded-3xl border border-border/50 bg-card p-2.5 flex flex-col h-[340px] justify-between"
              >
                <div className="aspect-square w-full rounded-2xl bg-muted/60" />
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-muted/60 rounded w-1/3" />
                  <div className="h-4 bg-muted/70 rounded w-4/5" />
                  <div className="h-3 bg-muted/50 rounded w-1/2" />
                </div>
                <div className="h-8 bg-muted/60 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {budgetProducts.map((product) => (
              <div key={product.id} className="transition-all duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </LazyMotion>
  );
}

