"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, LazyMotion, domAnimation, type Variants } from "framer-motion";
import { categories } from "@/data";
import { ROUTES } from "@/constants";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Tv,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera,
  Cpu,
  Footprints,
  Gem,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Tv,
  Home: HomeIcon,
  Shirt,
  Accessories: Sparkles,
  Sparkles,
  Camera,
  Cpu,
  Footprints,
  Gem,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
};

// Subtle ambient accent themes per category slot
const THEME_ACCENTS = [
  {
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    glow: "group-hover:bg-amber-500/20",
    pill: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-500 group-hover:text-amber-400",
  },
  {
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
    glow: "group-hover:bg-sky-500/20",
    pill: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    iconColor: "text-sky-500 group-hover:text-sky-400",
  },
  {
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    glow: "group-hover:bg-rose-500/20",
    pill: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-500 group-hover:text-rose-400",
  },
  {
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    glow: "group-hover:bg-purple-500/20",
    pill: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    iconColor: "text-purple-500 group-hover:text-purple-400",
  },
  {
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    glow: "group-hover:bg-emerald-500/20",
    pill: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-500 group-hover:text-emerald-400",
  },
  {
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    glow: "group-hover:bg-cyan-500/20",
    pill: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    iconColor: "text-cyan-500 group-hover:text-cyan-400",
  },
  {
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    glow: "group-hover:bg-violet-500/20",
    pill: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    iconColor: "text-violet-500 group-hover:text-violet-400",
  },
  {
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    glow: "group-hover:bg-orange-500/20",
    pill: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    iconColor: "text-orange-500 group-hover:text-orange-400",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
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

export function QuickCategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const topCategories = categories.slice(0, 8);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Quick Categories" className="w-full relative">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-500">
                <Sparkles className="h-3 w-3" />
                Departments
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Browse handpicked gear, electronics, and lifestyle essentials
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll navigation arrows for mobile/tablet horizontal scroll */}
            <div className="hidden sm:flex items-center gap-1.5 mr-1 lg:hidden">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              href={ROUTES.CATEGORIES}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group"
            >
              <span>All Categories</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
            </Link>
          </div>
        </div>

        {/* Categories Rail / Grid with framer-motion scroll in-view */}
        <m.div
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex lg:grid lg:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {topCategories.map((cat, idx) => {
            const Icon = (cat.icon && ICON_MAP[cat.icon]) || LayoutGrid;
            const theme = THEME_ACCENTS[idx % THEME_ACCENTS.length];

            return (
              <m.div
                key={cat.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 w-[130px] sm:w-[145px] lg:w-auto snap-start"
              >
                <Link
                  href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                  className="group relative flex flex-col items-center justify-between p-4 h-[160px] sm:h-[175px] rounded-3xl bg-secondary/40 hover:bg-secondary/70 transition-all duration-300 overflow-hidden text-center select-none"
                >
                  {/* Subtle organic ambient backlight on hover - borderless design */}
                  <div
                    aria-hidden="true"
                    className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${theme.glow} pointer-events-none`}
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Icon or Image thumbnail capsule */}
                  <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-background/85 group-hover:bg-background/95 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 shadow-none">
                    {cat.image ? (
                      <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-xl">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="44px"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <Icon className={`h-7 w-7 transition-transform duration-300 ${theme.iconColor}`} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="relative z-10 w-full flex flex-col items-center gap-1 mt-auto">
                    <span className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-foreground line-clamp-1 w-full tracking-tight">
                      {cat.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/80">
                      {cat.itemCount} items
                    </span>
                  </div>
                </Link>
              </m.div>
            );
          })}
        </m.div>
      </section>
    </LazyMotion>
  );
}

