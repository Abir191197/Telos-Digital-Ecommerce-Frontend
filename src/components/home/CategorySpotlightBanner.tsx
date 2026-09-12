"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

const rightGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItemVariants: Variants = {
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

export function CategorySpotlightBanner() {
  // Focus on Flagship Smartphones & Tablets or Gaming
  const spotlightProducts = React.useMemo(() => {
    return products
      .filter((p) => p.categorySlug === "smartphones-tablets")
      .slice(0, 4);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Category Spotlight" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Promo Card */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group lg:col-span-4 relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(245,158,11,0.12)] hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.24)] transition-all duration-300"
          >
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="h-3 w-3" />
                Flagship Zone
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                Smartphones & Laptops
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Official warranty from Apple, Samsung, Asus and Lenovo. Fast same-day dispatch in Dhaka city.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href={ROUTES.CATEGORY_DETAIL("smartphones-tablets")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-sm transition-all hover:bg-amber-400 active:scale-95"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Background decorative artwork */}
            <div
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 pointer-events-none"
            >
              <Image
                src="/images/hero/electronics.png"
                alt=""
                fill
                sizes="200px"
                className="object-contain"
              />
            </div>
          </m.div>

          {/* Right 4 Featured Products */}
          <m.div
            variants={rightGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {spotlightProducts.map((product) => (
              <m.div key={product.id} variants={cardItemVariants}>
                <ProductCard product={product} />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
