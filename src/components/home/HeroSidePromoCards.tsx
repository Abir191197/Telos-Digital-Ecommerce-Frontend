"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Truck } from "lucide-react";
import { ROUTES } from "@/constants";
import { m, type Variants } from "framer-motion";

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sideCardVariants: Variants = {
  hidden: { opacity: 0, x: 20, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.55,
      delay: 0.3 + i * 0.12,
      ease: easeCurve,
    },
  }),
};

export function HeroSidePromoCards() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <div className="w-full lg:w-auto grid grid-cols-2 lg:flex lg:flex-col gap-3 sm:gap-4 shrink-0">
      {/* Top Pink/Rose Soft Tinted Card: 100% Cash on Delivery */}
      <m.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sideCardVariants}
        className="lg:w-[235px] lg:aspect-square"
      >
        <m.div
          animate={
            isDesktop
              ? {
                  y: [0, -5, 0],
                }
              : undefined
          }
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-full w-full flex flex-col justify-between overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-[#fef0f2] to-[#fde2e6] dark:from-[#2e181d] dark:to-[#221014] p-3.5 sm:p-5 lg:p-6 border-0 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
        >
          {/* Subtle background glow blob on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-rose-500/15 blur-xl group-hover:scale-125 transition-transform duration-500"
          />

          <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-2">
            <div className="space-y-0.5 sm:space-y-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                Zero Risk
              </span>
              <h2 className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-100 leading-tight">
                Cash on <br className="hidden xs:inline" /> Delivery
              </h2>
              <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight sm:leading-snug font-medium line-clamp-2">
                Inspect first, pay at door
              </p>
            </div>

            <m.div
              animate={
                isDesktop
                  ? {
                      y: [0, -3, 0],
                      rotate: [0, 2, -1, 0],
                    }
                  : undefined
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30 group-hover:scale-110 transition-all duration-300"
            >
              <Banknote className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.4]" />
            </m.div>
          </div>

          <div className="relative z-10 pt-2.5 sm:pt-2">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white dark:bg-zinc-900 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 border-0 transition-all duration-200 active:scale-95 group/btn"
            >
              <span>Order Now</span>
              <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </m.div>
      </m.div>

      {/* Bottom Sky/Blue Soft Tinted Card: Nationwide Delivery */}
      <m.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sideCardVariants}
        className="lg:w-[235px] lg:aspect-square"
      >
        <m.div
          animate={
            isDesktop
              ? {
                  y: [0, 5, 0],
                }
              : undefined
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="relative h-full w-full flex flex-col justify-between overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-[#eff6ff] to-[#e1effe] dark:from-[#132338] dark:to-[#0d1827] p-3.5 sm:p-5 lg:p-6 border-0 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
        >
          {/* Subtle background glow blob on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-blue-500/15 blur-xl group-hover:scale-125 transition-transform duration-500"
          />

          <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-2">
            <div className="space-y-0.5 sm:space-y-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                64 Districts
              </span>
              <h2 className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-100 leading-tight">
                Express <br className="hidden xs:inline" /> Delivery
              </h2>
              <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight sm:leading-snug font-medium line-clamp-2">
                Fast 24-72h door transit
              </p>
            </div>

            <m.div
              animate={
                isDesktop
                  ? {
                      y: [0, -3, 0],
                      rotate: [0, -2, 1, 0],
                    }
                  : undefined
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 group-hover:scale-110 transition-all duration-300"
            >
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.4]" />
            </m.div>
          </div>

          <div className="relative z-10 pt-2.5 sm:pt-2">
            <Link
              href={ROUTES.TRACKING}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white dark:bg-zinc-900 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 border-0 transition-all duration-200 active:scale-95 group/btn"
            >
              <span>Track Area</span>
              <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </m.div>
      </m.div>
    </div>
  );
}
