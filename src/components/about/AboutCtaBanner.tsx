"use client";

import React from "react";
import Link from "next/link";
import { HeartHandshake, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";

export function AboutCtaBanner() {
  return (
    <section className="container px-4 sm:px-6 pt-12 sm:pt-16">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="group relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-12 text-center text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]"
      >
        {/* Ambient Background Accents */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none group-hover:bg-amber-500/30 transition-all duration-500"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-amber-400 border border-white/10">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Join Over 50,000+ Happy Creators & Tech Enthusiasts</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to Experience True Authentic Retail?
          </h2>

          <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto">
            Explore our flagship smartphone selections, creator computing rigs, studio headphones, and genuine accessories with guaranteed Bangladesh official warranty.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/25 transition-all duration-200"
            >
              <span>Shop Catalog Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all duration-200"
            >
              <span>Contact Care Team</span>
            </Link>
          </div>
        </div>
      </m.div>
    </section>
  );
}
