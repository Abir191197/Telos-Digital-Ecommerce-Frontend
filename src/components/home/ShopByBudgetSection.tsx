"use client";

import React from "react";
import Link from "next/link";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { Wallet, ArrowRight } from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

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
  const budgetProducts = React.useMemo(() => {
    return products.filter((p) => p.price <= 15000).slice(0, 10);
  }, []);

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
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {budgetProducts.map((product) => (
            <m.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </m.div>
          ))}
        </m.div>
      </section>
    </LazyMotion>
  );
}

